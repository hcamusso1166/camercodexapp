let pila = [];
let finDada = false;
let contador = 0;
let cadencia = 2000;  // Cadencia de audio en ms (puedes configurarlo)
let lectura = null;

// Esta función será llamada desde main.js para almacenar el TAG y realizar la lógica de la dada
function guardarTag(tag) {
  if (!finDada) {
    if (tag === pila[0] && pila.length > 1) {
      // Si el tag es igual a la primer carta dada y hay cartas en la pila, fin de la dada
      finDada = true;
      setTimeout(function() {
        reproducirAudio("stop"); // Reproducir el audio de "STOP"
        actualizarAccion("Nombrar las cartas en orden!");
      },100);
      
      console.log("Se reprodujo audio Stop");
      // Mostrar posiciones y luego los audios de la pila de cartas
      // Espera de 5 segundos (5000 ms)
      setTimeout(function() {
        // Mostrar posiciones y luego los audios de la pila de cartas
        mostrarPosiciones();
      }, 5000);
    } else {
      if (tag === lectura || pila.includes(tag)) {
        // Si el tag es igual a la lectura actual, o ya está en la pila de cartas, no hacer nada
        console.warn("Tag repetido, ignorado.");
        return; // Evita repetir lectura del mismo tag
      }
      // Se agrega el tag a la pila, que funciona como cola, primero en entrar, primero en salir
      pila.push(tag); // Agregar al inicio de la pila
      reproducirAudioParaTag(tag); // Reproducir el audio de la carta
      contador++;
      lectura = tag; // Actualizar la lectura actual
      console.log("Tag guardado:", tag, "Contador:", contador);
      console.log("Pila actual:", pila);
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

// Reproducir el audio con las posiciones
function reproducirAudioPosiciones() {
  pila.forEach((tag, index) => {
    setTimeout(() => {
      let audio = new Audio(`../audios/${tag}.mp3`); // Asumiendo que los audios están nombrados con los TAGs
      audio.play();
    }, cadencia * index);
  });

}


