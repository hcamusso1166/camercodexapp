let pila = [];
let finDada = false;
let faseFinal = false; // Variable para indicar si se ha llegado a la fase final de la rutina
let contador = 0;
let totalGaleones = 0;
let totalGlobos = 0;
let totalCañones = 0;
let totalComodines = 0;
let i = 0; 
let cadencia =  2500;  // Cadencia de audio en ms (puedes configurarlo)
let lectura = null;
let mapaTEGAudios = {};//para cartas TEG audios
let mapaTEGTexto = {};//para cartas TEG texto
let mapaCartas = {};//para cartas de poker audios
let mapaCartasTexto = {};//para cartas de poker texto
let mapaSimbolosTexto = {};//para simbolos de cartas TEG texto

fetch('../audios/cartas.json')//Mapa de cartas poker Archivos Audios
  .then(res => res.json())
  .then(data => {
    mapaCartas = data;
  })
fetch('../audios/cartasPoker.json')//Mapa de cartas poker Textos
  .then(res => res.json())
  .then(data => {
    mapaCartasTexto = data;
  })
fetch('../audios/teg/tegAudios.json')// Mapa de cartas TEG Archivos Audios
  .then(res => res.json())
  .then(data => {
    mapaTEGAudios = data;
  })
  .catch(err => console.error("Error cargando tegAudios.json", err));
fetch('../audios/teg/tegTextos.json')// Mapa de cartas TEG Textos
  .then(res => res.json())
  .then(data => {
    mapaTEGTexto = data;
  })
  .catch(err => console.error("Error cargando tegTexto.json", err));
fetch('../audios/teg/tegSimbolosTexto.json')// Mapa de simbolos TEG Textos
  .then(res => res.json())
  .then(data => {
    mapaSimbolosTexto = data;
  })
  .catch(err => console.error("Error cargando tegTexto.json", err));


// Esta función será llamada desde main.js para almacenar el TAG y realizar la lógica de la dada
function guardarTagTeg(tag) {
  if (faseFinal) {
    console.warn("La rutina ha finalizado, no se pueden guardar más tags.");
    reproducirAudioFaseFinal(tag); // Reproducir el audio de la carta
    return; 
  };
  if (!finDada) {
    if (tag === lectura || pila.includes(tag)) {// Si el tag es igual a la lectura actual, o ya está en la pila de cartas, no hacer nada
        console.warn("Tag repetido, ignorado.");
        return; // Evita repetir lectura del mismo tag
      }
      // Se agrega el tag a la pila, que funciona como cola, primero en entrar, primero en salir
      pila.push(tag); // Agregar al inicio de la pila
      reproducirAudioParaTag(tag); // Reproducir el audio de la carta
      contador++;
      lectura = tag; // Actualizar la lectura actual
      if (contador === 5) {// Si se han guardado 5 tags, finalizar la dada
      finDada = true;
      setTimeout(function() {
        reproducirAudio("stop"); // Reproducir el audio de "STOP"
        actualizarAccion("Nombrar las cartas en orden!");
      },2000);

      // Mostrar posiciones y luego los audios de la pila de cartas
      // Espera de 5 segundos (5000 ms)
      setTimeout(function() {
        // Mostrar posiciones y luego los audios de la pila de cartas
        mostrarPosiciones();
      }, 8000);
    }
  }
}

// Mostrar la posición y carta dictada
function mostrarPosiciones() {
  let resultadoHTML = "<h2>Posiciones de las cartas:</h2>";
  pila.forEach((tag, index) => {
      const textCarta = mapaTEGTexto[tag]; 
      const simbolo = mapaSimbolosTexto[tag] || "Simbolo no encontrado";
    resultadoHTML += `<p>Pais ${index + 1}: ${textCarta}: ${simbolo}</p>`;
    switch (simbolo ) {
      case "Galeón":
        totalGaleones++;
        break;
      case "Globo":
        totalGlobos++;
        break;
      case "Cañón":
        totalCañones++;
        break;
      case "Comodín":
        totalComodines++;
        break;
      default:
        break;
    }
  });
  resultadoHTML += `<p>Total Galeones: ${totalGaleones}</p>`;
  resultadoHTML += `<p>Total Globos: ${totalGlobos}</p>`;
  resultadoHTML += `<p>Total Cañones: ${totalCañones}</p>`;
  resultadoHTML += `<p>Total Comodines: ${totalComodines}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;
  reproducirAudioPosiciones();
}

function mostrarCartaOculta(tag) {
  let resultadoHTML = "<h2>Carta Oculta:</h2>";
  const textCarta = mapaCartasTexto[tag]; 
  resultadoHTML += `<p>${textCarta}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;
}
//Segundo efecto, se declaran los simbolos que tocó o se resaltan de que simbolo obtuvimos 3 iguales.
function mostrarSimbolos() {
  let resultadoHTML = "<h2>Carta Oculta:</h2>";
  const textCarta = mapaCartasTexto[tag]; 
  resultadoHTML += `<p>${textCarta}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;
}
// Reproducir el audio con las posiciones
function reproducirAudioPosiciones() {
  pila.forEach((tag, index) => {
    setTimeout(() => {
      reproducirAudioParaTag(tag);
    }, cadencia * index);
  });
  // Luego de reproducir todos los audios, reiniciar la rutina
  setTimeout(() => {
    continuarFaseFinal();
  }, 10000); // Pequeña espera extra 10 seg. para finalizar el último audio
}

function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaTEGAudios[tag];

  if (archivo && archivo.trim() !== "") {
    audio.src = `../audios/teg/${archivo}`;
    audio.play().then(() => {
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    audio.removeAttribute('src');
    audio.load();
  }
}
function reproducirAudioFaseFinal(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaTEGAudios[tag];

  if (archivo && archivo.trim() !== "") {
    audio.src = `../audios/teg/${archivo}`;
    audio.play().then(() => {
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    audio.removeAttribute('src');
    audio.load();
  }
  setTimeout(() => {
      const audio2 = document.getElementById("tagAudio");
      const archivo2 = mapaCartas[tag];
      if (archivo2 && archivo2.trim() !== "") {
    audio2.src = `../audios/${archivo2}`;
    audio2.play().then(() => {
      mostrarCartaOculta(tag)
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    audio.removeAttribute('src');
    audio.load();
  }
  }, 6000); // Espera la cadencia antes de reproducir el audio de la carta


  
    
}
// Limpia variables y deja todo listo para la Fase Final
function continuarFaseFinal() {
  pila = [];
  finDada = false;
  faseFinal = true;
  contador = 0;
  i = 0;
  lectura = null;
  
  /*document.getElementById("resultado").innerHTML = "";
  
  if (typeof limpiarDatos === 'function') {
    limpiarDatos();
  }
    */
  actualizarAccion("Leer carta para fase final");
}
// Limpia variables y deja todo listo para una nueva carta
function reiniciarColeccionista() {
  pila = [];
  finDada = false;
  faseFinal = true;
  contador = 0;
  i = 0;
  lectura = null;
  document.getElementById("resultado").innerHTML = "";
  if (typeof limpiarDatos === 'function') {
    limpiarDatos();
  }
  actualizarAccion("Leer carta para fase final");
}



