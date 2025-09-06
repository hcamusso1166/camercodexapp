// manoPokerNew.js
console.log("Camer Codex - manoPokerNew.js cargado");

let pila = [];
//let suma = 0;
let finDada = false;
let ultimoTag = null;
let mapaCartas = {};
let cartasPoker = {};
//let mapaSuma = {};
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
  if ((tag === pila[0] && pila.length > 5) || (tag === 'RE' && pila.length > 5)) { 
    finDada = true;
    reproducirAudio("stop");
    actualizarAccion("Analizar las cartas dadas...");

    setTimeout(() => {
      mostrarResumenMano();
    }, 3000);
    return;
  }

  if ((tag === ultimoTag || pila.includes(tag)) || (tag === 'RE')|| (tag === '53')|| (tag === '54')) {reproducirAudio("next");return};// Evita repetir lectura del mismo tag o el tag RE (repetido)
  // Se agrega el tag a la pila, que funciona como cola, primero en entrar, primero en salir
  pila.push(tag);
  reproducirAudioParaTag(tag); // Reproducir el audio de la carta
  ultimoTag = tag;
  const carta = cartasPoker[tag];
  //const valor = obtenerValorCarta(carta);
  //suma += valor;
  //console.log("Carta:", carta, "Valor:", valor, "Suma parcial:", suma);
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
/*
function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartas[tag];

  if (archivo && archivo.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/${archivo}`;
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

function obtenerValorCarta(nombreCarta) {
  const valorStr = nombreCarta.match(/\d+|[ADJQK]/)[0];
  switch (valorStr) {
    case 'A': return 1;
    case 'D': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    default: return parseInt(valorStr, 10) || 0;
  }
}
*/
function mostrarResumenMano() {
  const audio = document.getElementById("tagAudio");
  let resultadoHTML = "<h2>Resumen:</h2>";
  document.getElementById("resultado").innerHTML = resultadoHTML;
/*
  // Calcular valores
  let pares = 0, impares = 0;
  let cantidadPorPalos = { 'T': 0, 'C': 0, 'P': 0, 'D': 0 };*/
  let cartasEvaluadas = [];

  pila.forEach(tag => {
    const carta = cartasPoker[tag];
    cartasEvaluadas.push(carta);
    //const valor = obtenerValorCarta(carta);
    //const palo = carta.slice(-1);
//    if (valor % 2 === 0) pares++; else impares++;
//    cantidadPorPalos[palo]++;
  });

  const resultado = evaluarMejorManoDePoker(cartasEvaluadas);
  const mostrarDescripcion =
    (resultado.descripcion && resultado.descripcion.toLowerCase() === "carta alta" && resultado.cartaAltaEtiqueta)
      ? `Carta Alta: ${resultado.cartaAltaEtiqueta}`
       : resultado.descripcion;
  // Construir resultado HTML
  //resultadoHTML += `<p>La suma total es: ${suma}</p>`;
  //resultadoHTML += `<p>Pares: ${pares}, Impares: ${impares}</p>`;
  //resultadoHTML += `<p>Cantidad por palo:</p>`;
  //resultadoHTML += `<p>Tre: ${cantidadPorPalos.T}, Co: ${cantidadPorPalos.C}, Pi: ${cantidadPorPalos.P}, Dia: ${cantidadPorPalos.D}</p>`;
  resultadoHTML += `<p>Mejor jugada de póker: ${mostrarDescripcion}</p>`;
  resultadoHTML += `<p>${resultado.cartas.join(', ')}</p>`;
  document.getElementById("resultado").innerHTML = resultadoHTML;

  // Planificar audios con timings controlados
  let delay = 0;

  const reproducirSecuencial = (fn, tiempo = 1000) => {
    setTimeout(fn, delay);
    delay += tiempo;
  };

  //reproducirSecuencial(() => reproducirAudioCompuesto(suma), 4000);
  //reproducirSecuencial(() => reproducirAudioEnPoker("pares"));
  //reproducirSecuencial(() => reproducirAudioCompuesto(pares), 2000);
  //reproducirSecuencial(() => reproducirAudioEnPoker("impares"));
  //reproducirSecuencial(() => reproducirAudioCompuesto(impares), 2000);
  //reproducirSecuencial(() => reproducirAudioEnPoker("palos"), 3000);
  /*reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.T), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.C), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.P), 4000);
  reproducirSecuencial(() => reproducirAudioCompuesto(cantidadPorPalos.D), 4000);
  reproducirSecuencial(() => reproducirAudioEnPoker("mejorjugada"), 2000);*/
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
/*
function anunciarDetalleJugada(resultado) {
  const cartas = resultado.cartas.map(c => c.slice(0, -1));
  const palos = resultado.cartas.map(c => c.slice(-1));
  const cuenta = {};
  cartas.forEach(v => cuenta[v] = (cuenta[v] || 0) + 1);
  const valoresOrdenados = Object.entries(cuenta).sort((a, b) => b[1] - a[1]);

const convertirValor = v => {
  // Para audios de Poker por letra y SUMA para números
  const figuras = { "A": "A", "K": "K", "Q": "Q", "J": "J", "D": "10" };
  return figuras[v] || v; // números como "2","3"... siguen como string para SUMA
};


  const dominante = convertirValor(valoresOrdenados[0][0]);
  const secundario = valoresOrdenados[1] ? convertirValor(valoresOrdenados[1][0]) : null;

  const paloDominante = palos.sort((a,b) => palos.filter(p=>p===b).length - palos.filter(p=>p===a).length)[0];
  const paloAudio = {
    'T': 'T',
    'C': 'C',
    'P': 'P',
    'D': 'D'
  };

  const audio = document.getElementById("tagAudio");
  let i = 0;

  function play(nombre, intervalo = 1500) {
    setTimeout(() => {
      audio.src = `../audios/poker/${nombre}.mp3`;
      audio.play();
    }, i * intervalo);
    i++;
  }

  function playCompuesto(prefijo, nombre, intervalo = 1500) {
    play(prefijo, intervalo);
    setTimeout(() => {
      const path = isNaN(nombre) ? `../audios/poker/${nombre}.mp3` : `../audios/suma/${nombre}.mp3`;
      audio.src = path;
      audio.play();
    },  i * intervalo);
    i++;
  }

  switch (resultado.descripcion.toLowerCase()) {
    case 'pareja':
    case 'trio':
    case 'poker':
      playCompuesto("de", dominante);
      break;
    case 'doble pareja':
    case 'full':
      playCompuesto("de", dominante);
      if (secundario) playCompuesto("y", secundario);
      break;
    case 'escalera':
    case 'escalera de color':
    //case 'escalera real':
      const valores = cartas; // ya son letras como "D", "J", "Q", "K", "A"
      const orden = ["2","3","4","5","6","7","8","9","D","J","Q","K","A"];

      // Detectar rueda (A-2-3-4-5) tratando al As como 1 solo en ese caso
      const ordenAsc = valores.slice().sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
      const esRueda = ordenAsc.join("") === "2345A";
      const cartaMasAlta = esRueda
        ? "5"
        : valores.sort((a, b) => orden.indexOf(b) - orden.indexOf(a))[0];

      play("al",1000);
      play(cartaMasAlta.toUpperCase(),1000);  // usa audio ../audios/poker/A.mp3 por ejemplo
      play(paloAudio[paloDominante],1000);
      break;
    case 'escalera real':

      play(paloAudio[paloDominante],1000);
      break;
    case 'color':
      play(paloAudio[paloDominante],1000);
      break;
case 'carta alta': {
  // Decimos "de" + (A/K/Q/J/D por poker, o número por SUMA)
  const etiqueta = resultado.cartaAltaEtiqueta; // ← viene de main.js
  play("de");
  if (["A","K","Q","J","D"].includes(etiqueta)) {
    // figuras: usar carpeta poker
    play(etiqueta); // ../audios/poker/A.mp3, etc.
  } else {
    // números: reproducir por SUMA respetando el tempo general
    setTimeout(() => reproducirAudioCompuesto(parseInt(etiqueta, 10)), i * 1500);
    i++; // avanzamos el compás para mantener la cadencia
  }
  break;
}
  }
}

function reproducirAudioCompuesto(numero) {
  const audio = document.getElementById("tagAudio");
  const partes = [];

  if (numero === 100 || numero === 200 || numero === 300) {
    partes.push(numero.toString());
  } else if (numero > 100 && numero < 200) {
    partes.push("ciento");
    numero -= 100;
  } else if (numero > 200 && numero < 300) {
    partes.push("200");
    numero -= 200;
  }

  if (numero <= 15) {
    partes.push(numero.toString());
  } else {
    const decena = Math.floor(numero / 10) * 10;
    const unidad = numero % 10;
    partes.push(decena.toString());
    if (unidad !== 0) partes.push("y" + unidad.toString());
  }

  partes.forEach((clave, i) => {
    const archivo = mapaSuma[clave];
    if (archivo) {
      setTimeout(() => {
        audio.src = `../audios/suma/${archivo}`;
        audio.play();
      }, i * 1000);
    }
  });
}

function evaluarMejorManoDePoker(cartas) {
  const combinaciones = obtenerCombinaciones(cartas, 5);
  let mejor = { descripcion: "Sin jugada", ranking: 0 };

  combinaciones.forEach(combo => {
    const res = evaluarMano(combo);
    if (res.ranking > mejor.ranking) mejor = res;
  });
if (!mejor.descripcion) {
  mejor.descripcion = "Sin jugada";
  mejor.ranking = 0;
  mejor.cartas = [];
}

  return mejor;
}

function obtenerCombinaciones(array, size) {
  function backtrack(start = 0, path = []) {
    if (path.length === size) {
      resultado.push([...path]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      path.push(array[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  const resultado = [];
  backtrack();
  return resultado;
}
*/
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


