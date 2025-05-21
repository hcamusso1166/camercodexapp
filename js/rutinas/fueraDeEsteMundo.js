//Reproducir audios especiales
function reproducirAudioColor(nombreArchivo) {
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
}