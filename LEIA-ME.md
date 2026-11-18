# Catálogo Alento Das Torcidas

Site público do catálogo de camisas. É só leitura: o cliente vê as camisas, os tamanhos e os preços, e pede pelo WhatsApp.

## Onde se mexe no estoque e nos preços
No **ALENTO PEDIDOS**, menu **Produtos** (tela "Produtos · Catálogo"), com o seu login. Só ADMIN e GERENTE têm acesso.
- Digite a quantidade em cada tamanho. Cada camisa é salva sozinha, cerca de 1 segundo depois da última alteração.
- **Margem %** soma em cima do preço do fornecedor. "Preço próprio" vale só para aquela camisa.
- O site mostra apenas as camisas com pelo menos 1 peça e atualiza em até 5 minutos.
- Os dados ficam na aba **CATALOGO_ESTOQUE** da planilha do ALENTO PEDIDOS.

## Arquivos
- `config.js`: endereço do ALENTO PEDIDOS (Apps Script) de onde o site lê o estoque.
- `produtos-base.js`: as 2.319 camisas do fornecedor (nome, preço base, foto, categorias).
- `imagens/`: fotos comprimidas. Os originais estão em Downloads/SITE TESTE.
- `comum.js`: tamanhos e a lista de times por seção. Para incluir um time, acrescente uma linha na seção certa.
- `styles.css`: cores no topo (`--azul`).
- `estoque.js`: reserva usada só se a planilha estiver fora do ar (hoje vazia).
