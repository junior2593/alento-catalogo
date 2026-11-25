# Catálogo Alento Das Torcidas

Site público do catálogo de camisas. É só leitura: o cliente vê as camisas, os tamanhos e os preços, e pede pelo WhatsApp.

**Endereço:** https://catalogo.alentodastorcidas.com.br

## Onde o site está hospedado
- Os arquivos ficam no GitHub (`junior2593/alento-catalogo`), publicados pelo GitHub Pages. Tudo que for enviado para a branch `main` vai ao ar em 1 a 2 minutos.
- O domínio é configurado na **Cloudflare** (conta Alentodastorcidas), não no Registro.br. O registro é `CNAME catalogo → junior2593.github.io` e precisa ficar como **DNS only** (nuvem cinza, sem proxy). Com o proxy ligado, o GitHub não consegue renovar o certificado do cadeado.
- O arquivo `CNAME` desta pasta guarda o domínio para o GitHub. Não apague.
- O link antigo `junior2593.github.io/alento-catalogo` redireciona sozinho para o endereço novo.

## Onde se mexe no estoque e nos preços
No **ALENTO PEDIDOS**, menu **Produtos** (tela "Produtos · Catálogo"), com o seu login. Só ADMIN e GERENTE têm acesso.
- Digite a quantidade em cada tamanho. Cada camisa é salva sozinha, cerca de 1 segundo depois da última alteração.
- **Margem %** soma em cima do preço do fornecedor. "Preço próprio" vale só para aquela camisa.
- O site mostra apenas as camisas com pelo menos 1 peça e atualiza em até 5 minutos.
- Os dados ficam na aba **CATALOGO_ESTOQUE** da planilha do ALENTO PEDIDOS.
- O campo **Endereço do site** dessa tela já usa o endereço novo. A tela carrega a lista de camisas e as fotos a partir dele.

## Arquivos
- `config.js`: endereço do ALENTO PEDIDOS (Apps Script) de onde o site lê o estoque.
- `produtos-base.js`: as 2.319 camisas do fornecedor (nome, preço base, foto, categorias).
- `imagens/`: fotos comprimidas. Os originais estão em Downloads/SITE TESTE.
- `comum.js`: tamanhos e a lista de times por seção. Para incluir um time, acrescente uma linha na seção certa.
- `styles.css`: cores no topo (`--azul`).
- `estoque.js`: reserva usada só se a planilha estiver fora do ar (hoje vazia).

## Camisas do CatálogoPro (catalogopro.app)
- O site também mostra, ao vivo, as camisas ativas do CatálogoPro. Cadastrou lá, aparece aqui; arquivou lá, some daqui. Não precisa mexer em arquivo nem enviar ao GitHub.
- Os tamanhos são os marcados no CatálogoPro. Ele não tem quantidade, então o site mostra só "disponível".
- **Preço:** o site lê o campo `preco` de cada camisa no CatálogoPro (também aceita `price`, `valor` ou `preco_venda`). Camisa com o campo vazio usa o preço padrão do tipo (Camisas, Kits, Todos), que fica em `config.js`, em `CATALOGOPRO.precos`. Com `null` aparece "Consulte". Esse preço é o valor final: não soma a margem do ALENTO PEDIDOS.
- Se o CatálogoPro sair do ar, o site abre normalmente só com as camisas do fornecedor.
