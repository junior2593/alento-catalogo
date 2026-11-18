# Catálogo Alento Das Torcidas

Abra com dois cliques. Não precisa instalar nada.

- **index.html**: o catálogo que o cliente vê. Tem as abas Por Times, Por Tamanho, Todos os Modelos e Medidas, além da busca e do botão "Pedir pelo WhatsApp".
- **admin.html**: onde você marca o estoque e os preços.

## Como atualizar o estoque
1. Abra o `admin.html`.
2. Preencha WhatsApp, Instagram e a **margem %**, que é somada ao preço base do fornecedor.
3. Procure a camisa e digite a quantidade em cada tamanho. Se quiser um preço diferente para uma camisa, preencha "Preço de venda".
   - "+1 em tudo" coloca 1 peça em cada tamanho; "Zerar" tira a camisa do catálogo.
   - O filtro "Só o que tenho" mostra o que já está marcado.
4. Tudo fica salvo como **rascunho neste navegador**. O `index.html` deste computador já mostra o rascunho.
5. Para publicar ou levar para outro computador, clique em **Baixar estoque.js** e substitua o `estoque.js` desta pasta.

Só aparecem no catálogo as camisas com pelo menos 1 peça em algum tamanho.

## Arquivos
- `produtos-base.js`: 2.319 produtos do fornecedor (nome, preço base, foto, categorias).
- `imagens/`: fotos das camisas.
- `estoque.js`: o que você tem, quantidades e preços (gerado pelo admin).
- `comum.js`: tamanhos e a lista de times por seção (Mundo FIFA, Brasileirão…). Para incluir um time, acrescente uma linha na seção certa.
- `styles.css`: cores no topo (`--azul` é o azul do PDF).
- `logo.jpg`: escudo tirado do PDF da loja.
