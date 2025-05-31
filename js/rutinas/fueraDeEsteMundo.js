//Reproducir audios especiales
let lectura = null;
let segundaLectura = null;
function reproducirAudioColor(nombreArchivo,mvalor) {
    if (mvalor === lectura || mvalor === segundaLectura) {
    console.warn("Tag repetido, ignorado.");
  return; // Evita repetir lectura del mismo tag
  }
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
  segundaLectura = lectura; // Guardar la lectura anterior
  lectura = mvalor; // Actualizar la lectura actual

}