// perdonenMiInmodestia.js
console.log("Camer Codex - perdonenMiInmodestia.js cargado");

let pila = [];
let suma = 0;
let finDada = false;
let ultimoTag = null;
let mapaCartas = {};
let cartasPoker = {};
let mapaSuma = {};

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
/*
function mostrarResumen() {
  const audio = document.getElementById("tagAudio");
  // 1. Mostrar suma
   let resultadoHTML = "<h2>Resumen:</h2>";
  console.log("🧮 Suma total:", suma);
  actualizarAccion(`La suma total es: ${suma}`);
  reproducirAudioCompuesto(suma);
 resultadoHTML += `<p>La suma total es: ${suma}</p>`;
 document.getElementById("resultado").innerHTML = resultadoHTML;
  // 2. Pares e impares
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

  console.log(`🔢 Pares: ${pares}, Impares: ${impares}`);
  console.log("🃒 Cantidad por palo:", cantidadPorPalos);
  resultadoHTML += `<p>Pares: ${pares}, Impares: ${impares}</p>`;
  resultadoHTML += `<p>Cantidad por palo:</p>`;
  resultadoHTML += `<p>Tre: ${cantidadPorPalos.T}, Co: ${cantidadPorPalos.C},</p>`;
  resultadoHTML += `<p>Pi: ${cantidadPorPalos.P}, Dia: ${cantidadPorPalos.D}</p>`;
  setTimeout(() => {
      reproducirAudioCompuesto(pares);
  }, 1000);

setTimeout(() => {
  audio.src = `../audios/poker/pares.mp3`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
}, 2000);
  setTimeout(() => {
    reproducirAudioCompuesto(impares);
  }, 3000);
  setTimeout(() => {
      audio.src = `../audios/poker/impares.mp3`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
  }, 4000);
setTimeout(() => {
    audio.src = `../audios/poker/palos.mp3`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
    }).catch(err => {
      console.error("No se pudo reproducir el audio:", err);
      console.log("Tag:", tag, "→ Archivo:", archivo);
    });
}, 5000);

setTimeout(() => {
  reproducirAudioCompuesto(cantidadPorPalos.T);
}, 6000);
setTimeout(() => {
  reproducirAudioCompuesto(cantidadPorPalos.C);
} , 7000);
setTimeout(() => {  
  reproducirAudioCompuesto(cantidadPorPalos.P);
}, 8000);
setTimeout(() => {  
  reproducirAudioCompuesto(cantidadPorPalos.D);
}, 9000);


 document.getElementById("resultado").innerHTML = resultadoHTML;
  // 3. Evaluar mejor jugada de poker
  const resultado = evaluarMejorManoDePoker(cartasEvaluadas);
  console.log("🃏 Mejor jugada de póker:", resultado.descripcion);
  resultadoHTML += `<p>Mejor jugada de póker: ${resultado.descripcion}</p>`;
  resultadoHTML += `<p> ${resultado.cartas}</p>`;
 document.getElementById("resultado").innerHTML = resultadoHTML;
}
*/
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

  // Construir resultado HTML
  resultadoHTML += `<p>La suma total es: ${suma}</p>`;
  resultadoHTML += `<p>Pares: ${pares}, Impares: ${impares}</p>`;
  resultadoHTML += `<p>Cantidad por palo:</p>`;
  resultadoHTML += `<p>Tre: ${cantidadPorPalos.T}, Co: ${cantidadPorPalos.C}, Pi: ${cantidadPorPalos.P}, Dia: ${cantidadPorPalos.D}</p>`;
  resultadoHTML += `<p>Mejor jugada de póker: ${resultado.descripcion}</p>`;
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
function anunciarDetalleJugada(resultado) {
  const cartas = resultado.cartas.map(c => c.slice(0, -1));
  const palos = resultado.cartas.map(c => c.slice(-1));
  const cuenta = {};
  cartas.forEach(v => cuenta[v] = (cuenta[v] || 0) + 1);
  const valoresOrdenados = Object.entries(cuenta).sort((a, b) => b[1] - a[1]);

  const convertirValor = v => {
    const mapaEspecial = { "A": "uno", "D": "diez", "J": "J", "Q": "Q", "K": "K" };
    return mapaEspecial[v] || mapaSuma[v]?.replace(".mp3", "");
  };

  const dominante = convertirValor(valoresOrdenados[0][0]);
  const secundario = valoresOrdenados[1] ? convertirValor(valoresOrdenados[1][0]) : null;

  const paloDominante = palos.sort((a,b) => palos.filter(p=>p===b).length - palos.filter(p=>p===a).length)[0];
  const paloAudio = {
    'T': 'treboles',
    'C': 'corazones',
    'P': 'picas',
    'D': 'diamantes'
  };

  const audio = document.getElementById("tagAudio");
  let i = 0;

  function play(nombre) {
    setTimeout(() => {
      audio.src = `../audios/poker/${nombre}.mp3`;
      audio.play();
    }, i * 1500);
    i++;
  }

  function playCompuesto(prefijo, nombre) {
    play(prefijo);
    setTimeout(() => {
      const path = isNaN(nombre) ? `../audios/poker/${nombre}.mp3` : `../audios/suma/${nombre}.mp3`;
      audio.src = path;
      audio.play();
    },  i * 1500);
    i++;
  }

  switch (resultado.descripcion.toLowerCase()) {
    case 'pareja':
    case 'trío':
    case 'póker':
      playCompuesto("de", dominante);
      break;
    case 'doble pareja':
    case 'full':
      playCompuesto("de", dominante);
      if (secundario) playCompuesto("y", secundario);
      break;
    case 'escalera':
    case 'escalera de color':
    case 'escalera real':
      const valores = cartas; // ya son letras como "D", "J", "Q", "K", "A"
      const orden = ["2","3","4","5","6","7","8","9","D","J","Q","K","A"];
      const cartaMasAlta = valores.sort((a,b) => orden.indexOf(b) - orden.indexOf(a))[0];

      play("al");
      play(cartaMasAlta.toUpperCase());  // usa audio ../audios/poker/A.mp3 por ejemplo
      play(paloAudio[paloDominante]);

    case 'color':
      play(paloAudio[paloDominante]);
      break;
    case 'carta alta':
      playCompuesto("de", dominante);
      break;
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
/*
  function evaluarMano(cartas) {
  if (cartas.length !== 5) {
    return {
      descripcion: "Error: debe haber exactamente 5 cartas",
      cartas,
      ranking: 0
    };
  }

  const valores = cartas.map(c => c.slice(0, -1));
  const palos = cartas.map(c => c.slice(-1));

  const valorNumerico = v => {
    const mapa = { "A":14, "K":13, "Q":12, "J":11, "T":10 };
    return isNaN(v) ? mapa[v] : parseInt(v);
  };

  const valoresNum = valores.map(valorNumerico).sort((a,b) => a-b);

  const contarRepetidos = arr => {
    const cuenta = {};
    arr.forEach(v => cuenta[v] = (cuenta[v] || 0) + 1);
    return Object.values(cuenta).sort((a,b) => b - a); // eg. [3,2]
  };

  const todosIgualPalo = palos.every(p => p === palos[0]);

  const esEscalera = () => {
    for (let i = 0; i < 4; i++) {
      if (valoresNum[i] + 1 !== valoresNum[i+1]) return false;
    }
    return true;
  };

  const escalera = esEscalera();
  const repeticiones = contarRepetidos(valores);

  // Determinar jugada
  let descripcion = "";
  let ranking = 1;

  if (escalera && todosIgualPalo && valoresNum[0] === 10) {
    descripcion = "Escalera Real";
    ranking = 10;
  } else if (escalera && todosIgualPalo) {
    descripcion = "Escalera de Color";
    ranking = 9;
  } else if (repeticiones[0] === 4) {
    descripcion = "Póker";
    ranking = 8;
  } else if (repeticiones[0] === 3 && repeticiones[1] === 2) {
    descripcion = "Full";
    ranking = 7;
  } else if (todosIgualPalo) {
    descripcion = "Color";
    ranking = 6;
  } else if (escalera) {
    descripcion = "Escalera";
    ranking = 5;
  } else if (repeticiones[0] === 3) {
    descripcion = "Trío";
    ranking = 4;
  } else if (repeticiones[0] === 2 && repeticiones[1] === 2) {
    descripcion = "Doble Pareja";
    ranking = 3;
  } else if (repeticiones[0] === 2) {
    descripcion = "Pareja";
    ranking = 2;
  } else {
    const cartaAlta = Math.max(...valoresNum);
    descripcion = `Carta Alta: ${cartaAlta}`;
    ranking = 1;
  }

  return {
    descripcion,
    cartas,
    ranking
  };
}
*/
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
