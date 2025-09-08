// manoPokerNew.js
console.log("Camer Codex - manoPokerNew.js cargado");

let pila = [];
let finDada = false;
let ultimoTag = null;
let mapaCartas = {};
let cartasPoker = {};
let reinicioTimeout = null;
const audioElement = document.getElementById("tagAudio");
audioElement.addEventListener('play', () => clearTimeout(reinicioTimeout));
audioElement.addEventListener('ended', () => {
  if (finDada) {
    reinicioTimeout = setTimeout(reiniciarManoPokerNew, 10000);
  }
});


fetch('../audios/cartas.json')//Mapa de cartas poker Archivos Audios
  .then(res => res.json())
  .then(data => mapaCartas = data);

fetch('../audios/cartasPoker.json')//Mapa de cartas poker Textos
  .then(res => res.json())
  .then(data => cartasPoker = data);

function guardarTagMano(tag) {
  if (finDada) return;

  if ((tag === ultimoTag || pila.includes(tag)) || (tag === 'RE')|| (tag === '53')|| (tag === '54')) {reproducirAudio("next");return};// Evita repetir lectura del mismo tag o el tag RE (repetido)
  // Se agrega el tag a la pila, que funciona como cola, primero en entrar, primero en salir
  reproducirAudio("next");
  pila.push(tag);
  ultimoTag = tag;
  const carta = cartasPoker[tag];
  console.log("Carta:", carta);
  if(pila.length===5){
    actualizarAccion("Mano completa. ");
    finDada = true;
    setTimeout(() => {
        reproducirAudio("stop");
    }, 1000);
    
        setTimeout(() => {
      mostrarResumenMano();
    }, 3000);
    return;
  }
}

function mostrarResumenMano() {
  const audio = document.getElementById("tagAudio");
  let resultadoHTML = "<h2>Resumen:</h2>";
  document.getElementById("resultado").innerHTML = resultadoHTML;

  let cartasEvaluadas = [];

  pila.forEach(tag => {
    const carta = cartasPoker[tag];
    cartasEvaluadas.push(carta);
  });

  const resultado = evaluarMejorManoDePoker(cartasEvaluadas);
  const mostrarDescripcion =
    (resultado.descripcion && resultado.descripcion.toLowerCase() === "carta alta" && resultado.cartaAltaEtiqueta)
      ? `Carta Alta: ${resultado.cartaAltaEtiqueta}`
       : resultado.descripcion;
  // Construir resultado HTML
  resultadoHTML += `<p>Mejor jugada de póker: ${mostrarDescripcion}</p>`;
  resultadoHTML += `<p>${resultado.cartas.join(', ')}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;

  // Planificar audios con timings controlados
  let delay = 0;

  const reproducirSecuencial = (fn, tiempo = 1000) => {
    setTimeout(fn, delay);
    delay += tiempo;
  };

  reproducirSecuencial(() => {
  if (resultado.descripcion) {
    const nombre = resultado.descripcion.replace(/\s+/g, '').toLowerCase();
    reproducirAudioEnPoker(nombre);
  } else {
    console.warn("⚠️ No hay descripción de jugada para reproducir.");
  }
}, 1500);
  reproducirSecuencial(() => anunciarDetalleJugada(resultado), 500);
}

function reiniciarManoPokerNew() {
  pila = [];
  finDada = false;
  ultimoTag = null;
  document.getElementById("resultado").innerHTML = "";
  if (typeof limpiarDatos === 'function') {
    limpiarDatos();
  }
  actualizarAccion("Leer carta");
  clearTimeout(reinicioTimeout);
  reinicioTimeout = null;
}


