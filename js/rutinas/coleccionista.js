let pila = [];
let finDada = false;
let faseFinal = false; // Variable para indicar si se ha llegado a la fase final de la rutina
let contador = 0;
let i = 0; 
let cadencia =  2500;  // Cadencia de audio en ms (puedes configurarlo)
let lectura = null;
let mapaCartasAudios = {};
let cartasTexto = {};
let mapaCartas = {};

fetch('../audios/cartas.json')
  .then(res => res.json())
  .then(data => {
    mapaCartas = data;
    console.log("Mapa de cartas Archivos Audios cargado correctamente");
  })

fetch('../audios/coleccion/coleccionAudios.json')
  .then(res => res.json())
  .then(data => {
    mapaCartasAudios = data;
    console.log("Mapa de cartas Colecció Audios cargado correctamente");
  })
  .catch(err => console.error("Error cargando coleccionAudios.json", err));
fetch('../audios/coleccion/coleccionTexto.json')
  .then(res => res.json())
  .then(data => {
    cartasTexto = data;
    console.log("Mapa de cartas colección para texto  cargado correctamente");
  })
  .catch(err => console.error("Error cargando coleccionTexto.json", err));

// Esta función será llamada desde main.js para almacenar el TAG y realizar la lógica de la dada
function guardarTag(tag) {
  if (faseFinal) {
    console.warn("La rutina ha finalizado, no se pueden guardar más tags.");
    reproducirAudioFaseFinal(tag); // Reproducir el audio de la carta
    return; 
  };
  if (!finDada) {
    if ((tag === pila[0] && pila.length > 1) || (tag === 'RE' && pila.length > 1)){
      // Si el tag es igual a la primer carta dada y hay cartas en la pila, fin de la dada
      finDada = true;
      setTimeout(function() {
        reproducirAudio("stop"); // Reproducir el audio de "STOP"
        actualizarAccion("Nombrar las cartas en orden!");
      },100);
      
      //console.log("Se reprodujo audio Stop");
      // Mostrar posiciones y luego los audios de la pila de cartas
      // Espera de 5 segundos (5000 ms)
      setTimeout(function() {
        // Mostrar posiciones y luego los audios de la pila de cartas
        mostrarPosiciones();
      }, 5000);
    } else {
      if (tag === lectura || pila.includes(tag) || (tag === 'RE')|| (tag === '53')|| (tag === '54')) {
        // Si el tag es igual a la lectura actual, o ya está en la pila de cartas, no hacer nada
         reproducirAudio("next");
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
      const textCarta = cartasTexto[tag]; 

    resultadoHTML += `<p>Posición ${index + 1}: Carta ${textCarta}</p>`;
  });
  document.getElementById("resultado").innerHTML = resultadoHTML;
  reproducirAudioPosiciones();
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
    reiniciarColeccionista();
  }, cadencia * pila.length + 300); // Pequeña espera extra para finalizar el último audio
}

function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartasAudios[tag];

  if (archivo && archivo.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/coleccion/${archivo}`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.removeAttribute('src');
    audio.load();
  }
}
function reproducirAudioFaseFinal(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartasAudios[tag];

  if (archivo && archivo.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/coleccion/${archivo}`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.removeAttribute('src');
    audio.load();
  }
  setTimeout(() => {
      const audio2 = document.getElementById("tagAudio");
      const archivo2 = mapaCartas[tag];
      if (archivo2 && archivo2.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio2.src = `../audios/${archivo2}`;
    audio2.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.removeAttribute('src');
    audio.load();
  }
  }, cadencia); // Espera la cadencia antes de reproducir el audio de la carta


  
    
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



