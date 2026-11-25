(function () {
  var C = window.Catalogo;
  var main = document.getElementById("conteudo");
  main.innerHTML = '<div class="vazio">Carregando camisas…</div>';

  // Estoque e preços vêm da planilha (ALENTO PEDIDOS). Sem internet/planilha: usa o estoque.js da pasta.
  var url = window.CATALOGO_API;
  var pedido = url ? fetch(url + (url.indexOf("?") < 0 ? "?" : "&") + "catalogo=1", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { if (d.erro) throw new Error(d.erro); return d; }) : Promise.reject(new Error("sem API"));
  var estoque = pedido.catch(function (e) {
    console.warn("Catálogo: usando estoque.js local", e);
    return window.ESTOQUE;
  });
  // Camisas do CatálogoPro (ao vivo). Se ele estiver fora do ar, o site abre só com as do fornecedor.
  var pro = C.carregarCatalogoPro().catch(function (e) { console.warn("Catálogo: CatálogoPro indisponível", e); });
  Promise.all([estoque, pro]).then(function (r) { iniciar(r[0]); });

function iniciar(dados) {
  var est = C.normalizar(dados);
  var POR_PAGINA = 48;
  var MARCA = { fifa: "FIFA", brasileirao: "BRA", premier: "PL", laliga: "LIGA", seriea: "A", bundesliga: "BUN", ligue1: "L1", mls: "MLS", outros: "OUT", retro: "RET", nba: "NBA" };

  // Só entra no catálogo o que tem pelo menos 1 peça em algum tamanho
  var lista = C.produtos.filter(function (p) { return C.tamanhosEmEstoque(p, est).length > 0; });

  var estado = { aba: "times", publico: "adulto", tams: [], time: null, cat: null, busca: "", limite: POR_PAGINA };
  var $ = function (id) { return document.getElementById(id); };
  $("ano").textContent = new Date().getFullYear();

  // Links de contato (configurados no admin)
  var numero = est.whatsapp.replace(/\D/g, "");
  if (numero) $("link-zap").href = "https://wa.me/" + numero; else $("link-zap").hidden = true;
  var insta = est.instagram.trim();
  if (insta) $("link-insta").href = /^https?:/.test(insta) ? insta : "https://instagram.com/" + insta.replace(/^@/, ""); else $("link-insta").hidden = true;
  if (!numero && !insta) $("link-zap").parentNode.hidden = true;
  else if (!numero || !insta) $("link-zap").parentNode.style.gridTemplateColumns = "1fr";

  function buscar(itens) {
    var q = C.norm(estado.busca);
    if (!q) return itens;
    return itens.filter(function (p) { return C.norm(p.nome + " " + (p.time || "")).indexOf(q) >= 0; });
  }

  function precoHtml(p, cls) {
    var v = C.precoFinal(p, est);
    return '<span class="' + cls + (v == null ? " consulte" : "") + '">' + C.brl(v) + '</span>';
  }
  function card(p) {
    var tams = C.tamanhosEmEstoque(p, est).map(function (t) { return "<span>" + C.esc(t) + "</span>"; }).join("");
    return '<button class="card" data-id="' + p.id + '">' +
      '<div class="foto"><img loading="lazy" src="' + C.esc(p.img) + '" alt="">' +
      (p.fotos.length > 1 ? '<span class="n-fotos">' + p.fotos.length + ' fotos</span>' : "") + '</div>' +
      '<div class="info">' + (p.time && p.time !== "Outros" ? '<small class="card-time it">' + C.esc(p.time) + '</small>' : "") +
      '<div class="nome">' + C.esc(p.nome) + '</div><div class="mini">' + tams + '</div>' +
      '<div class="rodape">' + precoHtml(p, "preco") + '<span class="ver it" aria-hidden="true">Ver ›</span></div></div></button>';
  }
  function grade(itens, titulo) {
    var html = '<div class="lista-tit"><h2 class="it">' + C.esc(titulo) + '</h2><span>' + itens.length + ' modelo' + (itens.length === 1 ? "" : "s") + '</span></div>';
    if (!itens.length) return html + '<div class="vazio">Nenhuma camisa encontrada.</div>';
    html += '<div class="grade">' + itens.slice(0, estado.limite).map(card).join("") + '</div>';
    if (itens.length > estado.limite) html += '<button class="mais it" data-mais>Ver mais</button>';
    return html;
  }
  function contato() {
    if (!numero) return "";
    return '<p class="contato it">Se não encontrou o time ou camisa que gostaria, <a href="https://wa.me/' + numero + '" target="_blank" rel="noopener">entre em contato conosco!</a></p>';
  }

  function vistaTimes() {
    var voltar = '<button class="voltar it" data-voltar>◂ Voltar</button>';
    if (estado.time) {
      var doTime = buscar(lista.filter(function (p) { return p.timeId === estado.time; }));
      var nome = doTime.length ? doTime[0].time : (lista.find(function (p) { return p.timeId === estado.time; }) || {}).time || "";
      if (estado.time.indexOf("retro:") === 0) nome += " · Retrô";
      return voltar + grade(doTime, nome);
    }
    if (estado.cat) {
      var cat = C.CATEGORIAS_LOJA.find(function (c) { return c[0] === estado.cat; });
      return voltar + grade(buscar(lista.filter(function (p) { return p.categorias.indexOf(estado.cat) >= 0; })), cat ? cat[1] : "");
    }
    var itens = buscar(lista);
    // Botões de categoria (só os que têm camisa em estoque)
    var cats = C.CATEGORIAS_LOJA.filter(function (c) { return itens.some(function (p) { return p.categorias.indexOf(c[0]) >= 0; }); });
    var html = "";
    if (cats.length) html += '<section class="painel cats">' + cats.map(function (c) {
      return '<button class="btn-escuro it" data-cat="' + c[0] + '">' + C.esc(c[1]) + '</button>';
    }).join("") + '</section>';
    html += '<div class="dica it"><span class="bola"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11V5a2 2 0 0 1 4 0v5m0-1a2 2 0 0 1 4 0v2m0-1a2 2 0 0 1 3 1.5V15a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.6 1.6 0 0 1 2.6-1.8L9 15"/></svg></span>' +
      '<span><b>Clique sobre o time</b> favorito para<br>visualizar as fotos das camisas.</span></div>';
    var algum = false;
    C.SECOES.forEach(function (sec) {
      var times = {}, ordem = [];
      itens.forEach(function (p) {
        if (p.secao !== sec[0]) return;
        if (!times[p.timeId]) { times[p.timeId] = { nome: p.time, img: p.img, n: 0 }; ordem.push(p.timeId); }
        times[p.timeId].n++;
      });
      if (!ordem.length) return;
      algum = true;
      // Ordem dos times igual à do PDF; "Outros" sempre por último
      var pos = {};
      sec[2].forEach(function (t, i) { pos[t[0]] = i; });
      ordem.sort(function (a, b) {
        var ta = times[a].nome, tb = times[b].nome;
        if (ta === "Outros") return 1; if (tb === "Outros") return -1;
        return (pos[ta] != null ? pos[ta] : 999) - (pos[tb] != null ? pos[tb] : 999) || ta.localeCompare(tb, "pt-BR");
      });
      html += '<h2 class="secao-tit it" data-marca="' + (MARCA[sec[0]] || "") + '"><span>' + C.esc(sec[1]) + '</span></h2>';
      html += '<div class="painel times">' + ordem.map(function (id) {
        var t = times[id];
        return '<button class="time" data-time="' + C.esc(id) + '"><div class="quad"><img loading="lazy" src="' + C.esc(t.img) + '" alt=""><span class="n">' + t.n + '</span></div>' +
          '<span class="nome it">' + C.esc(t.nome) + '</span></button>';
      }).join("") + '</div>';
    });
    if (!algum && !cats.length) return '<div class="vazio">Nenhuma camisa encontrada.</div>';
    return html + contato();
  }

  function vistaTamanho() {
    var tamanhos = estado.publico === "adulto" ? C.TAM_ADULTO : C.TAM_INFANTIL;
    var html = '<section class="painel"><div class="seg">' +
      '<button class="btn-escuro it" data-publico="adulto" aria-pressed="' + (estado.publico === "adulto") + '">Adulto</button>' +
      '<button class="btn-escuro it" data-publico="infantil" aria-pressed="' + (estado.publico === "infantil") + '">Infantil</button></div>' +
      '<p class="rotulo it">Escolha um ou mais tamanhos</p><div class="chips">' + tamanhos.map(function (t) {
        return '<button class="chip" data-tam="' + t + '" aria-pressed="' + (estado.tams.indexOf(t) >= 0) + '">' + t + '</button>';
      }).join("") + '</div></section>';
    if (!estado.tams.length) return html + '<div class="vazio">Selecione pelo menos um tamanho para ver as camisas disponíveis.</div>';
    var itens = buscar(lista.filter(function (p) {
      return p.publico === estado.publico && estado.tams.some(function (t) { return C.qtd(p, est, t) > 0; });
    }));
    return html + grade(itens, "Tamanho " + estado.tams.join(", "));
  }

  function tabela(titulo, cab, linhas) {
    return '<h3 class="tabela-tit it">' + titulo + '</h3><div class="tabela-wrap"><table><thead><tr>' +
      cab.map(function (c) { return "<th>" + c + "</th>"; }).join("") + '</tr></thead><tbody>' +
      linhas.map(function (l) { return "<tr>" + l.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div>';
  }
  function vistaMedidas() {
    var s = function (t) { return t.split(" "); };
    return '<p class="aviso-medidas it"><b>Aviso:</b> as informações abaixo são valores aproximados médios, já que podem variar para mais ou para menos, devido ao molde utilizado.</p>' +
      tabela("Camisa Fan - Torcedor", s("Tam Compr. Largura Altura Peso"), ["P 69-71 53-55 162-170 50-62", "M 71-73 55-57 170-176 62-78", "G 73-75 57-58 176-182 78-83", "GG 75-78 58-60 182-190 83-90", "2XL 78-81 60-62 190-195 90-97", "3XL 81-83 62-64 192-197 97-104"].map(s)) +
      tabela("Camisa Player - Jogador", s("Tam Compr. Largura Altura Peso"), ["P 67-69 49-51 162-170 50-62", "M 69-71 51-53 170-175 62-75", "G 71-73 53-55 175-180 75-80", "GG 73-76 55-57 180-185 80-85", "2XL 76-78 57-60 185-190 85-90", "3XL 78-79 60-63 190-195 90-95"].map(s)) +
      tabela("Camisa Feminina", s("Tam Compr. Largura Altura Peso"), ["P 61-63 40-41 150-160 -", "M 63-66 41-44 160-165 -", "G 66-69 44-47 165-170 -", "GG 69-71 47-50 170-175 -"].map(s)) +
      tabela("Kit Infantil", s("Tam Idade Larg. Altura Compr. Cintu."), ["16 3-4 35-37 95-105 44-47 20-37", "18 4-5 37-39 105-115 47-50 21-39", "20 5-8 39-41 115-125 50-53 22-41", "22 6-7 41-43 125-135 53-56 23-42", "24 8-9 43-45 135-145 56-59 24-44", "26 10-11 45-47 145-155 59-62 25-47", "28 12-13 47-49 155-165 62-65 26-50"].map(s)) +
      tabela("Regatas de Basquete - Silkada", s("Tam. Compr. Busto Ombros Altura Peso"), ["P 70 98 35 160-170 90-115", "M 72 106 37 168-175 115-135", "G 75 112 39 172-180 145-165", "GG 77 120 41 178-185 165-185", "2XL 80 130 44 183-200 180-210"].map(s));
  }

  function render() {
    document.querySelectorAll("[data-aba]").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.aba === estado.aba); });
    $("busca").parentNode.hidden = estado.aba === "medidas";
    var html = "";
    if (estado.aba === "medidas") html += vistaMedidas();
    else if (!lista.length) html += '<div class="vazio">Nenhuma camisa em estoque ainda. Volte em breve!</div>';
    else if (estado.aba === "tamanho") html += vistaTamanho();
    else if (estado.aba === "todos") html += grade(buscar(lista), "Todos os modelos");
    else html += vistaTimes();
    main.innerHTML = html;
  }

  // Detalhe da camisa: galeria (setas, miniaturas, deslizar) e escolha do tamanho para o WhatsApp
  var aberto = null;
  var ICONE_ZAP = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-13.4 7.9L3 21l1.2-4.4A9 9 0 1 1 21 12z"/><path d="M8.5 8.5c.3 2.9 2.6 5.6 6 7l1.3-1.5-2-1-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1-2z" fill="currentColor" stroke="none"/></svg>';
  function abrir(id) {
    var p = C.produtos.find(function (x) { return x.id === id; });
    if (!p) return;
    aberto = { p: p, foto: 0, tam: null };
    var n = p.fotos.length;
    var tams = C.tamanhosEmEstoque(p, est).map(function (t) {
      return '<button class="tam" data-pedido-tam="' + C.esc(t) + '" aria-pressed="false"><b>' + C.esc(t) + '</b>' +
        (p.disp ? "" : '<small>' + C.qtd(p, est, t) + ' un.</small>') + '</button>';
    }).join("");
    var zap = numero ? '<a class="zap it" id="zap" target="_blank" rel="noopener" href="#">' + ICONE_ZAP + 'Pedir pelo WhatsApp</a>' : "";
    $("modal-box").innerHTML = '<button class="fechar" data-fechar aria-label="Fechar">×</button>' +
      '<div class="galeria"><div class="palco"><img id="foto-grande" src="' + C.esc(p.fotos[0]) + '" alt="' + C.esc(p.nome) + '">' +
      (n > 1 ? '<button class="seta ant" data-seta="-1" aria-label="Foto anterior">‹</button>' +
        '<button class="seta prox" data-seta="1" aria-label="Próxima foto">›</button>' +
        '<span class="contador" id="contador">1 / ' + n + '</span>' : "") + '</div>' +
      (n > 1 ? '<div class="miniaturas">' + p.fotos.map(function (f, i) {
        return '<button data-foto="' + i + '" aria-label="Foto ' + (i + 1) + '" aria-pressed="' + (i === 0) + '"><img loading="lazy" src="' + C.esc(f) + '" alt=""></button>';
      }).join("") + '</div>' : "") + '</div>' +
      '<div class="det">' + (p.time && p.time !== "Outros" ? '<small class="det-time it">' + C.esc(p.time) + '</small>' : "") +
      '<h3>' + C.esc(p.nome) + '</h3>' + precoHtml(p, "preco") +
      '<div class="det-tit it">Escolha o tamanho</div><div class="tams">' + tams + '</div>' +
      '<a class="link-medidas" href="?tab=medidas" data-ir-medidas>Ver tabela de medidas</a>' + zap + '</div>';
    atualizarZap();
    $("modal").classList.add("aberto");
    document.body.classList.add("travado");
    $("modal-box").scrollTop = 0;
    $("modal-box").querySelector(".fechar").focus();
  }
  function irFoto(i) {
    var p = aberto.p, n = p.fotos.length;
    aberto.foto = (i + n) % n;
    $("foto-grande").src = p.fotos[aberto.foto];
    if ($("contador")) $("contador").textContent = (aberto.foto + 1) + " / " + n;
    $("modal-box").querySelectorAll("[data-foto]").forEach(function (b) {
      var sel = Number(b.dataset.foto) === aberto.foto;
      b.setAttribute("aria-pressed", sel);
      if (sel) b.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }
  function atualizarZap() {
    var a = $("zap");
    if (!a) return;
    var p = aberto.p, preco = C.precoFinal(p, est);
    var msg = "Olá! Tenho interesse na camisa " + p.nome + (preco == null ? "" : " (" + C.brl(preco) + ")") + ". Tamanho: " + (aberto.tam || "");
    a.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(msg);
  }
  function fechar() { $("modal").classList.remove("aberto"); document.body.classList.remove("travado"); aberto = null; }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button, .modal");
    if (!t) return;
    var d = t.dataset;
    if (d.aba) { estado.aba = d.aba; estado.time = estado.cat = null; estado.limite = POR_PAGINA; history.replaceState(null, "", "?tab=" + d.aba); }
    else if (d.publico) { estado.publico = d.publico; estado.tams = []; }
    else if (d.tam) { var i = estado.tams.indexOf(d.tam); if (i >= 0) estado.tams.splice(i, 1); else estado.tams.push(d.tam); estado.limite = POR_PAGINA; }
    else if (d.time) { estado.time = d.time; estado.limite = POR_PAGINA; }
    else if (d.cat) { estado.cat = d.cat; estado.limite = POR_PAGINA; }
    else if (t.hasAttribute("data-voltar")) { estado.time = estado.cat = null; }
    else if (t.hasAttribute("data-mais")) { estado.limite += POR_PAGINA; render(); return; }
    else if (d.id) { abrir(d.id); return; }
    else if (d.foto && aberto) { irFoto(Number(d.foto)); return; }
    else if (d.seta && aberto) { irFoto(aberto.foto + Number(d.seta)); return; }
    else if (d.pedidoTam && aberto) {
      aberto.tam = aberto.tam === d.pedidoTam ? null : d.pedidoTam;
      $("modal-box").querySelectorAll("[data-pedido-tam]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.pedidoTam === aberto.tam); });
      atualizarZap();
      return;
    }
    else if (t.hasAttribute("data-fechar") || (t.id === "modal" && e.target === t)) { fechar(); return; }
    else return;
    render();
    if (d.time || d.cat || t.hasAttribute("data-voltar")) main.scrollIntoView({ block: "start" });
  });
  document.addEventListener("keydown", function (e) {
    if (!aberto) return;
    if (e.key === "Escape") fechar();
    else if (e.key === "ArrowLeft" && aberto.p.fotos.length > 1) irFoto(aberto.foto - 1);
    else if (e.key === "ArrowRight" && aberto.p.fotos.length > 1) irFoto(aberto.foto + 1);
  });
  // "Ver tabela de medidas" dentro do detalhe: fecha e vai para a aba Medidas
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-ir-medidas]")) return;
    e.preventDefault();
    fechar();
    estado.aba = "medidas"; estado.time = estado.cat = null;
    history.replaceState(null, "", "?tab=medidas");
    render();
    main.scrollIntoView({ block: "start" });
  });
  // Deslizar o dedo na foto troca de foto
  var toqueX = null;
  document.addEventListener("touchstart", function (e) { toqueX = e.target.closest(".palco") ? e.touches[0].clientX : null; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (toqueX == null || !aberto || aberto.p.fotos.length < 2) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 40) irFoto(aberto.foto + (dx < 0 ? 1 : -1));
  }, { passive: true });
  $("busca").addEventListener("input", function (e) { estado.busca = e.target.value; estado.limite = POR_PAGINA; render(); });

  var aba = new URLSearchParams(location.search).get("tab");
  if (aba === "models") aba = "todos";
  if (["times", "tamanho", "todos", "medidas"].indexOf(aba) >= 0) estado.aba = aba;
  render();
}
})();
