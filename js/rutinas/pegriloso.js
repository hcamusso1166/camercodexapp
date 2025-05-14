// pegriloso.js

let balaDePlata = null;
let etapaRegistro = true;

// Esta función será llamada desde main.js para procesar los tags
function guardarTag(tag) {
  console.log("Tag leído:", tag);

  if (etapaRegistro) {
    // Registrar la Bala de Plata
    balaDePlata = tag;
    etapaRegistro = false;
    reproducirAudio("plata");
    //alert("¡Bala de Plata registrada! Ahora mezcle las 6 cartas y forme una fila");
    retrievedValue.innerHTML = "¡Registrada!";
    return;
  }

  // Comparación en fase de descarte
  if (tag === balaDePlata) {
    reproducirAudio("bala");
    //alert("¡PELIGRO! ¡Esa es la Bala de Plata!");
    retrievedValue.innerHTML = "¡Bala de Plata!";
  } else {
    reproducirAudio("no");
  }
}

// Reproducir audios especiales
function reproducirAudio(nombreArchivo) {
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
}

// Función auxiliar para reiniciar la rutina si se desea
function reiniciarPegriloso() {
  balaDePlata = null;
  etapaRegistro = true;
  console.log("Rutina 'Pegriloso' reiniciada");
  reproducirAudio("audios_especiales/rutina_reiniciada");
}

