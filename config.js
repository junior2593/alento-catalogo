/* Endereço do ALENTO PEDIDOS (Apps Script) de onde o site lê estoque e preços. */
window.CATALOGO_API = "https://script.google.com/macros/s/AKfycbwlVKVaDPE1JIthCmSdaa1ilCfTDbU0x7uj6CkYzTya6Y_AgmpndwzyfbHcUfME9tmfoA/exec";

/* CatálogoPro (catalogopro.app): o site também mostra, ao vivo, as camisas ativas de lá.
   Camisa arquivada lá some daqui sozinha. Os tamanhos são os marcados lá (sem quantidade).
   O CatálogoPro não tem preço: defina abaixo o preço por tipo. Deixe null para mostrar "Consulte".
   Para desligar, troque app por "". */
window.CATALOGOPRO = {
  app: "69386f6ce9fe29121d66f65f",
  precos: { "Camisas": null, "Kits": null, "Todos": null }
};
