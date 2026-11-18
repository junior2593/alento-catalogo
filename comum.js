/* Lógica compartilhada entre o catálogo (index.html) e o admin (admin.html). */
(function () {
  // Tamanhos iguais aos da tabela de medidas do PDF da loja
  var TAM_ADULTO = ["P", "M", "G", "GG", "2XL", "3XL", "4XL"];
  var TAM_INFANTIL = ["16", "18", "20", "22", "24", "26", "28"];
  var TAM_UNICO = ["Único"];

  /* Seções na mesma ordem do PDF. Cada time: [nome no botão, apelidos que aparecem no nome do produto...]
     Para incluir um time novo, acrescente uma linha na seção certa. */
  var SECOES = [
    ["fifa", "Mundo FIFA", [
      ["Brasil"], ["Argentina"], ["Uruguai"], ["Peru"], ["Equador"], ["Venezuela"], ["Bolívia", "bolivia"],
      ["Chile"], ["Paraguai"], ["Colômbia", "colombia"], ["Inglaterra", "inlgaterra"], ["Itália", "italia"], ["Espanha"],
      ["Portugal"], ["França", "franca"], ["Holanda"], ["Polônia", "polonia"], ["Croácia", "croacia"],
      ["Bélgica", "belgica"], ["Alemanha"], ["Áustria", "austria"], ["Escócia", "escocia"], ["Dinamarca"], ["Turquia"], ["Irlanda"],
      ["Sérvia", "servia"], ["Noruega"], ["Suécia", "suecia"], ["Gales", "pais de gales"], ["Albânia", "albania"],
      ["Japão", "japao"], ["Coreia", "korea", "coreia do sul"], ["E. Unidos", "estados unidos", "eua"],
      ["Canadá", "canada"], ["México", "mexico"], ["Jamaica"], ["Nigéria", "nigeria"], ["Egito"], ["Senegal"],
      ["Costa do M.", "costa do marfim"], ["Mali"], ["Marrocos"], ["Gana"], ["Cabo Verde"], ["Costa Rica"],
      ["Ucrânia", "ucrania"], ["Suíça", "suica"], ["África do Sul", "africa do sul"], ["Nova Zelândia", "nova zelandia"],
      ["Curaçao", "curacao"], ["Catar"], ["Arábia Saudita", "arabia saudita"], ["Camarões", "camaroes"],
      ["Austrália", "australia"], ["Rep. Tcheca", "republica tcheca"], ["Eslováquia", "eslovaquia"]]],
    ["brasileirao", "Brasileirão", [
      ["Flamengo"], ["São Paulo", "sao paulo"], ["Fortaleza"], ["Fluminense"], ["A. Mineiro", "atletico mineiro"],
      ["Vitória", "vitoria"], ["Vasco", "vasco da gama"], ["Botafogo"], ["Santos"], ["Corinthians", "corintians"], ["Palmeiras"],
      ["Bahia"], ["Cruzeiro"], ["Grêmio", "gremio"], ["Internacional"], ["Sport", "sport recife"], ["Ceará", "ceara"],
      ["Bragantino", "red bull bragantino", "bragantino"], ["Athletico", "athletico paranaense", "atletico paranaense"], ["Remo"],
      ["Paysandu"], ["Santa Cruz"], ["Cuiabá", "cuiaba"], ["Volta R.", "volta redonda"],
      ["Juventus Mooca", "juventus da mooca", "juventus da mocca"], ["Náutico", "nautico"], ["Juventude"],
      ["Criciúma", "criciuma"], ["Coritiba"], ["Chapecoense"], ["Mirassol"], ["Figueirense"], ["Goiás", "goias"]]],
    ["premier", "Premier League", [
      ["Arsenal"], ["Fulham"], ["A. Villa", "aston villa"], ["West Ham"], ["Liverpool"], ["M. United", "manchester united"],
      ["Everton"], ["M. City", "manchester city"], ["Chelsea"], ["Brighton"], ["Leicester"], ["Sheffield"],
      ["N. Forest", "nottingham forest", "nottingham"], ["Wolves", "wolverhampton", "wolfes"], ["Cardiff"], ["Leeds", "leeds united"],
      ["Southampton"], ["C. Palace", "crystal palace"], ["Newcastle"], ["Tottenham"], ["Norwich"], ["Brentford"],
      ["Bournemouth", "bornemouth"], ["Ipswich", "ipswich town"]]],
    ["laliga", "La Liga", [
      ["Barcelona"], ["R. Madrid", "real madrid"], ["Sociedad", "real sociedad"], ["Espanyol"], ["Villarreal"],
      ["Girona"], ["Alavés", "alaves"], ["Rayo V.", "rayo vallecano"], ["Bilbao", "athletic bilbao"],
      ["Atl. Madrid", "atletico de madrid", "atletico madrid"], ["Sevilla"], ["Valencia"], ["Osasuna"],
      ["R. Betis", "real betis", "betis"], ["C. de Vigo", "celta de vigo", "celta"], ["Cádiz", "cadiz"], ["Granada"],
      ["La Coruña", "la coruna", "deportivo"], ["Valladolid"], ["Málaga", "malaga"], ["Las Palmas"], ["Levante"]]],
    ["seriea", "Serie A", [
      ["Inter", "inter de milao", "inter milao", "internazionale"], ["Milan"], ["Juventus"], ["Roma"], ["Lazio"],
      ["Napoli"], ["Genoa"], ["Fiorentina"], ["Atalanta"], ["Udinese"], ["Cagliari"], ["Parma"], ["Lecce"],
      ["Venezia"], ["Bologna"], ["Torino"], ["Como"], ["Palermo"], ["Sampdoria"]]],
    ["bundesliga", "Bundesliga", [
      ["Bayern", "bayern de munique"], ["Dortmund", "borussia dortmund"], ["Leverkusen", "bayer leverkusen", "bayern leverkusen"],
      ["Leipzig", "rb leipzig"], ["Frankfurt", "eintracht frankfurt"], ["Köln", "koln", "colonia"], ["Freiburg"],
      ["Wolfsburg"], ["Schalke"], ["St. Pauli", "st pauli"], ["Mainz"], ["Stuttgart"], ["Bochum"], ["Hoffenheim"],
      ["Hertha"], ["Borussia M.", "monchengladbach", "gladbach"], ["Bremen", "werder bremen"], ["U. Berlin", "union berlin"],
      ["Hamburgo", "hamburg"]]],
    ["ligue1", "Ligue Un", [
      ["Paris", "psg", "paris saint germain"], ["Marseille", "olympique de marseille", "olympique marseille", "olympique de marselha", "marselha"],
      ["Nice"], ["Lille"], ["Lyon"], ["Monaco"], ["Rennes"], ["Lens"], ["Montpellier"], ["Nantes"], ["Brest"],
      ["Reims"], ["Paris FC"]]],
    ["mls", "MLS Soccer", [
      ["I. Miami", "inter miami"], ["Atlanta", "atlanta united"], ["New York", "new york city"],
      ["P. Union", "philadelphia union"], ["LA Galaxy", "los angeles galaxy", "la galaxy"], ["Orlando", "orlando city"],
      ["Los Angeles", "lafc", "los angeles fc"], ["Columbus"], ["Austin"]]],
    ["outros", "Outros Times", [
      ["Sporting"], ["Benfica"], ["Porto"], ["Braga"], ["Eindhoven", "psv"], ["Cruz Azul"], ["Ittihad", "al ittihad"],
      ["Al Hilal"], ["Al Nassr"], ["Peñarol", "penarol"], ["Colo Colo"], ["Celtic"], ["Rangers"], ["Olimpia"], ["Ajax"],
      ["River Plate"], ["Boca", "boca juniors"], ["U. de Chile", "universidad de chile", "universidad do chile"],
      ["Católica", "universidade catolica", "universidad catolica"], ["Galatasaray", "galataray", "galatarasay"], ["Besiktas"],
      ["Fenerbahce"], ["Tigres"], ["Pumas"], ["Racing"], ["Estudiantes"], ["San Lorenzo"], ["Atl. Nacional", "atletico nacional"], ["Shakhtar", "shakhtar donetsk"], ["Cerro Porteño", "cerro porteno"],
      ["Zenit"], ["Panathinaikos"], ["Estoril"], ["Copenhagen", "copenhagem", "copenhague"], ["Stoke", "stoke city"],
      ["Coventry", "coventry city"], ["AFC Richmond"]]],
    ["nba", "Liga de Basquete", [
      ["A. Hawks", "atlanta hawks", "hawks"], ["B. Celtics", "boston celtics", "celtics"], ["B. Nets", "brooklyn nets", "nets"],
      ["C. Hornets", "hornets", "buzz city"], ["C. Bulls", "chicago bulls", "bulls"], ["Cavaliers"], ["Dallas M.", "mavericks", "dallas"],
      ["Denver", "nuggets"], ["Detroit P.", "pistons"], ["Warriors", "golden state"], ["Rockets", "houston"],
      ["Indiana", "pacers"], ["Clippers"], ["Lakers"], ["Memphis G.", "grizzlies"], ["Miami H.", "miami heat", "heat"],
      ["M. Bucks", "bucks", "milwaukee"], ["Minnesota", "timberwolves"], ["Pelicans"], ["Knicks", "new york knicks"],
      ["Oklahoma", "thunder"], ["Orlando M.", "orlando magic", "magic"], ["76ers", "philadelphia"], ["P. Suns", "suns", "phoenix"],
      ["Blazers", "trail blazers"], ["S. Kings", "sacramento"], ["Spurs"], ["Toronto", "raptors"], ["Utah Jazz", "jazz"],
      ["Wizards"], ["All Star", "all star"]]]
  ];
  // Botões de categoria (como no PDF da loja)
  var CATEGORIAS_LOJA = [
    ["kids", "Conjuntos Infantis / Kids", function (p) { return p.temCat("kids"); }],
    ["shorts", "Shorts", function (p) { return p.temCat("shorts") || /^short/i.test(p.nome); }],
    ["treino", "Conjuntos de Treino / Kit", function (p) { return p.temCat("conjunto-de-treino") || p.temCat("conjunto-de-inverno") || p.temCat("conjunto-de-regata") || p.temCat("kits"); }],
    ["basquete", "Basquete", function (p) { return p.temCat("nba"); }],
    ["corta-vento", "Corta-Vento / Windbreaker", function (p) { return p.temCat("corta-vento") || p.temCat("jaquetas"); }],
    ["feminina", "Feminina", function (p) { return p.temCat("feminina"); }],
    ["retro", "Retrô", function (p) { return p.temCat("retro"); }],
    ["f1", "Fórmula 1", function (p) { return p.temCat("formula-1"); }],
    ["acessorios", "Acessórios", function (p) { return p.temCat("meias") || p.temCat("acessorios"); }]
  ];
  var UNICO = ["meias", "acessorios", "personalizacao-especial"];

  function norm(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function slug(s) { return norm(s).replace(/ /g, "-"); }

  // Índice de apelidos, do mais longo para o mais curto ("inter de milao" antes de "inter")
  var apelidos = [];
  SECOES.forEach(function (sec) {
    sec[2].forEach(function (t) {
      var lista = [t[0]].concat(t.slice(1));
      lista.forEach(function (a) {
        apelidos.push({ re: new RegExp("(^| )" + norm(a) + "( |$)"), tam: norm(a).length, secao: sec[0], time: t[0] });
      });
    });
  });
  apelidos.sort(function (a, b) { return b.tam - a.tam; });

  function acharTime(nome, ehNba) {
    var n = norm(nome);
    // Primeiro procura na liga certa (basquete ou futebol); depois em qualquer uma
    for (var passo = 0; passo < 2; passo++) {
      for (var i = 0; i < apelidos.length; i++) {
        var a = apelidos[i];
        if (passo === 0 && (a.secao === "nba") !== ehNba) continue;
        if (a.re.test(n)) return a;
      }
    }
    return null;
  }

  var vistos = {};
  var produtos = (window.PRODUTOS || []).map(function (p) {
    var id = slug(p.nome), n = 2;
    while (vistos[id]) id = slug(p.nome) + "-" + n++;
    vistos[id] = true;
    var cats = p.cats || [];
    var temCat = function (c) { return cats.indexOf(c) >= 0; };
    var achado = acharTime(p.nome, temCat("nba"));
    var retro = temCat("retro");
    var secao = retro ? "retro" : achado ? achado.secao : null;
    var time = achado ? achado.time : (retro ? "Outros" : null);
    var infantil = temCat("kids");
    var prod = {
      id: id, nome: p.nome, base: Number(p.preco) || 0,
      img: (p.img || "").replace("imagens/catalogo/", "imagens/"),
      cats: cats, temCat: temCat, secao: secao, time: time,
      timeId: secao && time ? secao + ":" + slug(time) : null,
      publico: infantil ? "infantil" : "adulto",
      tamanhos: UNICO.some(temCat) ? TAM_UNICO : infantil ? TAM_INFANTIL : TAM_ADULTO
    };
    prod.categorias = CATEGORIAS_LOJA.filter(function (c) { return c[2](prod); }).map(function (c) { return c[0]; });
    // Sem time e sem categoria: vai para o botão "Outros" em Outros Times
    if (!prod.secao && !prod.categorias.length) { prod.secao = "outros"; prod.time = "Outros"; prod.timeId = "outros:outros"; }
    return prod;
  });

  var SECOES_EXIBIR = SECOES.slice(0, 9).concat([["retro", "Sessão Retrô", []]]).concat(SECOES.slice(9));

  var CHAVE = "catalogo-loja:estoque";
  function vazio() { return { loja: "Alento Das Torcidas", whatsapp: "", instagram: "", margem: 0, itens: {} }; }
  function normalizar(e) {
    e = e || {};
    return { loja: e.loja || vazio().loja, whatsapp: e.whatsapp || "", instagram: e.instagram || "", margem: Number(e.margem) || 0, itens: e.itens || {} };
  }
  function lerRascunho() { try { var t = localStorage.getItem(CHAVE); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
  function salvarRascunho(est) { try { localStorage.setItem(CHAVE, JSON.stringify(est)); return true; } catch (e) { return false; } }
  function apagarRascunho() { try { localStorage.removeItem(CHAVE); } catch (e) {} }

  function precoFinal(p, est) {
    var it = est.itens[p.id];
    if (it && it.preco != null && it.preco !== "") return Number(it.preco);
    return Math.round(p.base * (1 + (Number(est.margem) || 0) / 100) * 100) / 100;
  }
  function qtd(p, est, tam) {
    var it = est.itens[p.id];
    return it && it.tam && Number(it.tam[tam]) > 0 ? Number(it.tam[tam]) : 0;
  }
  function tamanhosEmEstoque(p, est) { return p.tamanhos.filter(function (t) { return qtd(p, est, t) > 0; }); }
  function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  window.Catalogo = {
    produtos: produtos, SECOES: SECOES_EXIBIR, CATEGORIAS_LOJA: CATEGORIAS_LOJA,
    TAM_ADULTO: TAM_ADULTO, TAM_INFANTIL: TAM_INFANTIL,
    vazio: vazio, normalizar: normalizar, lerRascunho: lerRascunho, salvarRascunho: salvarRascunho, apagarRascunho: apagarRascunho,
    precoFinal: precoFinal, qtd: qtd, tamanhosEmEstoque: tamanhosEmEstoque, brl: brl, esc: esc, norm: norm
  };
})();
