let cartas = [];
let pila = [];
let finDada = false;
let contador = 0;
let cadencia = 2000;  // Cadencia de audio en ms (puedes configurarlo)

// Esta función será llamada desde main.js para almacenar el TAG y realizar la lógica de la dada
function guardarTag(tag) {
  if (!finDada) {
    if (pila.includes(tag)) {
      // Se detectó que una carta fue pasada dos veces, fin de la dada
      finDada = true;
      // enviar audio 'STOP' despues de 2 segundos
      setTimeout(function() {
        reproducirAudio("STOP");
      },2000);
      
      console.log("Se reprodujo audio Stop");
      // Mostrar posiciones y luego los audios de la pila de cartas
      // Espera de 5 segundos (5000 ms)
      setTimeout(function() {
        // Mostrar posiciones y luego los audios de la pila de cartas
        mostrarPosiciones();
      }, 5000);
    } else {
      // Se agrega el tag a la pila, que funciona como pila, ultimo en entrar, primero en salir
      pila.unshift(tag); // Agregar al inicio de la pila
      cartas.unshift(tag); // Agregar al inicio de las cartas en la secuencia
      contador++;
      console.log("Tag guardado:", tag, "Contador:", contador);
      console.log("Pila actual:", pila);
      console.log("Cartas actuales:", cartas);
    }
  }
}

// Mostrar la posición y carta dictada
function mostrarPosiciones() {
  let resultadoHTML = "<h2>Posiciones de las cartas:</h2>";
  pila.forEach((tag, index) => {
    resultadoHTML += `<p>Posición ${index + 1}: Carta ${tag}</p>`;
  });
  document.getElementById("resultado").innerHTML = resultadoHTML;
  reproducirAudioPosiciones();
}
//Reproducir audios especiales
function reproducirAudio(nombreArchivo) {
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
}
// Reproducir el audio con las posiciones
function reproducirAudioPosiciones() {
  pila.forEach((tag, index) => {
    setTimeout(() => {
      let audio = new Audio(`../audios/${tag}.mp3`); // Asumiendo que los audios están nombrados con los TAGs
      audio.play();
    }, cadencia * index);
  });
}


