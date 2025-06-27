let mapaCartas = {};let cartasPoker = {};
console.log("Camer Codex - dadaSimple.js cargado");

fetch('../audios/cartasPoker.json')
  .then(res => res.json())
  .then(data => {
    cartasPoker = data;
    console.log("Mapa de cartas Poker para texto  cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartasPoker.json", err));
//Reproducir audios especiales

function reproducirAudioColor(nombreArchivo) {

  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();


}