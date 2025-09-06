// perdonenMiInmodestia.js
console.log("Camer Codex - perdonenMiInmodestia.js cargado");

let pila = [];
let suma = 0;
let finDada = false;
let ultimoTag = null;
let mapaCartas = {};
let cartasPoker = {};
let mapaSuma = {};
let reinicioTimeout = null;
const audioElement = document.getElementById("tagAudio");
audioElement.addEventListener('play', () => clearTimeout(reinicioTimeout));
audioElement.addEventListener('ended', () => {
  if (finDada) {
    reinicioTimeout = setTimeout(reiniciarPerdonenMiInmodestia, 10000);
  }
});


fetch('../audios/cartas.json')//Mapa de cartas poker Archivos Audios
  .then(res => res.json())
  .then(data => mapaCartas = data);

fetch('../audios/cartasPoker.json')//Mapa de cartas poker Textos
  .then(res => res.json())
  .then(data => cartasPoker = data);

fetch('../audios/suma/sumaAudio.json')//Mapa de Archivos Audios para la suma
  .then(res => res.json())
  .then(data => mapaSuma = data);

function guardarTag(tag) {
  if (finDada) return;
  if ((tag === pila[0] && pila.length > 5) || (tag === 'RE' && pila.length > 5)) { 
    finDada = true;
    reproducirAudio("stop");
    actualizarAccion("Analizar las cartas dadas...");

    setTimeout(() => {
      mostrarResumen();
    }, 3000);
    return;
  }

  if ((tag === ultimoTag || pila.includes(tag)) || (tag === 'RE')|| (tag === '53')|| (tag === '54')) {reproducirAudio("next");return};// Evita repetir lectura del mismo tag o el tag RE (repetido)
  // Se agrega el tag a la pila, que funciona como cola, primero en entrar, primero en salir
  pila.push(tag);
  reproducirAudioParaTag(tag); // Reproducir el audio de la carta
  ultimoTag = tag;
  const carta = cartasPoker[tag];
  const valor = obtenerValorCarta(carta);
  suma += valor;
  console.log("Carta:", carta, "Valor:", valor, "Suma parcial:", suma);
}

function mostrarResumen() {
  const audio = document.getElementById("tagAudio");
  let resultadoHTML = "<h2>Resumen:</h2>";
  document.getElementById("resultado").innerHTML = resultadoHTML;

  // Calcular valores
  let pares = 0, impares = 0;
  let cantidadPorPalos = { 'T': 0, 'C': 0, 'P': 0, 'D': 0 };
  let cartasEvaluadas = [];

  pila.forEach(tag => {
    const carta = cartasPoker[tag];
    cartasEvaluadas.push(carta);
    const valor = obtenerValorCarta(carta);
    const palo = carta.slice(-1);
    if (valor % 2 === 0) pares++; else impares++;
    cantidadPorPalos[palo]++;
  });

  const resultado = evaluarMejorManoDePoker(cartasEvaluadas);
  const mostrarDescripcion =
    (resultado.descripcion && resultado.descripcion.toLowerCase() === "carta alta" && resultado.cartaAltaEtiqueta)
      ? `Carta Alta: ${resultado.cartaAltaEtiqueta}`
       : resultado.descripcion;
  // Construir resultado HTML
  resultadoHTML += `<p>La suma total es: ${suma}</p>`;
  resultadoHTML += `<p>Pares: ${pares}, Impares: ${impares}</p>`;
  resultadoHTML += `<p>Cantidad por palo:</p>`;
  resultadoHTML += `<p>Tre: ${cantidadPorPalos.T}, Co: ${cantidadPorPalos.C}, Pi: ${cantidadPorPalos.P}, Dia: ${cantidadPorPalos.D}</p>`;
  resultadoHTML += `<p>Mejor jugada de póker: ${mostrarDescripcion}</p>`;
  resultadoHTML += `<p>${resultado.cartas.join(', ')}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;

  // Planificar audios con timings controlados
  let delay = 0;

  const reproducirSecuencial = (fn, tiempo = 1000) => {
    setTimeout(fn, delay);
    delay += tiempo;
  };

  reproducirSecuencial(() => reproducirAudioCompuesto(suma), 4000);
  reproducirSecuencial(() => reproducirAudioEnPoker("pares"));
  reproducirSecuencial(() => reproducirAudioCompuesto(pares), 2000);
  reproducirSecuencial(() => reproducirAudioEnPoker("impares"));
  reproducirSecuencial(() => reproducirAudioCompuesto(impares), 2000);
  reproducirSecuencial(() => reproducirAudioEnPoker("palos"), 3000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.T), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.C), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.P), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.D), 4000);
  reproducirSecuencial(() => reproducirAudioEnPoker("mejorjugada"), 2000);
  reproducirSecuencial(() => {
  if (resultado.descripcion) {
    const nombre = resultado.descripcion.replace(/\s+/g, '').toLowerCase();
    console.log("Reproduciendo jugada de póker:", nombre);
    reproducirAudioEnPoker(nombre);
  } else {
    console.warn("⚠️ No hay descripción de jugada para reproducir.");
  }
}, 1000);

  reproducirSecuencial(() => anunciarDetalleJugada(resultado), 500);

}

function reiniciarPerdonenMiInmodestia() {
  pila = [];
  suma = 0;
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