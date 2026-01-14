let mapaCartas = {};
let cartasPoker = {};

console.log("Camer Codex - controlFrecuencia.js cargado");

fetch("../audios/cartas.json")
  .then((res) => res.json())
  .then((data) => {
    mapaCartas = data;
    console.log("Mapa de cartas Archivos Audios cargado correctamente");
  })
  .catch((err) => console.error("Error cargando cartas.json", err));

fetch("../audios/cartasPoker.json")
  .then((res) => res.json())
  .then((data) => {
    cartasPoker = data;
    console.log("Mapa de cartas Poker para texto cargado correctamente");
  })
  .catch((err) => console.error("Error cargando cartasPoker.json", err));

const estadoSecuenciaEl = document.getElementById("estadoSecuencia");
const tagInicialEl = document.getElementById("tagInicial");
const cantidadTagsEl = document.getElementById("cantidadTags");
const tiempoTotalEl = document.getElementById("tiempoTotal");
const tiempoPromedioEl = document.getElementById("tiempoPromedio");
const tiempoMinimoEl = document.getElementById("tiempoMinimo");
const tiempoMaximoEl = document.getElementById("tiempoMaximo");
const tiempoMinimoTagEl = document.getElementById("tiempoMinimoTag");
const tiempoMaximoTagEl = document.getElementById("tiempoMaximoTag");
const tiempoMinimoPosEl = document.getElementById("tiempoMinimoPos");
const tiempoMaximoPosEl = document.getElementById("tiempoMaximoPos");
const tiempoMedianaEl = document.getElementById("tiempoMediana");
const logContainer = document.getElementById("frecuenciaLog");
const resetBtn = document.getElementById("resetControlBtn");
const frecuenciaTimestampEl = document.getElementById("timestamp");
const frecuenciaValueEl = document.getElementById("valueContainer");
const accionMagoMensajeEl = document.getElementById("accionMagoMensaje");

const frecuenciaState = {
  firstTag: null,
  startTimeMs: null,
  endTimeMs: null,
  lastTimestampMs: null,
  intervalsMs: [],
  minEntry: null,
  maxEntry: null,
  tags: [],
  completed: false,
};

function formatearMs(ms) {
  return `${ms.toFixed(2)} ms`;
}

function formatearHora(fecha) {
  return fecha.toLocaleTimeString("es-AR", { hour12: false }) +
    `.${fecha.getMilliseconds().toString().padStart(3, "0")}`;
}

function descripcionTag(tag) {
  return cartasPoker[tag] || tag || "—";
}

function limpiarLog() {
  if (logContainer) {
    logContainer.innerHTML = '<p class="gray-label">Aún no hay lecturas.</p>';
  }
}

function agregarLog(mensaje) {
  if (!logContainer) return;
  if (logContainer.querySelector("p")) {
    logContainer.innerHTML = "";
  }
  const entry = document.createElement("p");
  entry.classList.add("gray-label");
  entry.textContent = mensaje;
  logContainer.prepend(entry);
}

function actualizarResumen() {
  const cantidadTags = frecuenciaState.tags.length;
  const totalMs =
    frecuenciaState.endTimeMs && frecuenciaState.startTimeMs
      ? frecuenciaState.endTimeMs - frecuenciaState.startTimeMs
      : null;

  const promedio =
    frecuenciaState.intervalsMs.length > 0
      ? frecuenciaState.intervalsMs.reduce((a, b) => a + b, 0) /
        frecuenciaState.intervalsMs.length
      : null;

  const minimo =
    frecuenciaState.minEntry ? frecuenciaState.minEntry.intervalMs : null;

  const maximo =
    frecuenciaState.maxEntry ? frecuenciaState.maxEntry.intervalMs : null;

  const mediana =
    frecuenciaState.intervalsMs.length > 0
      ? calcularMediana(frecuenciaState.intervalsMs)
      : null;

  if (estadoSecuenciaEl) {
    estadoSecuenciaEl.textContent = frecuenciaState.completed
      ? "Secuencia completada"
      : frecuenciaState.firstTag
      ? "Midiendo..."
      : "Esperando primer tag";
  }

  if (tagInicialEl) tagInicialEl.textContent = descripcionTag(frecuenciaState.firstTag);
  if (cantidadTagsEl) cantidadTagsEl.textContent = cantidadTags;
  if (tiempoTotalEl) tiempoTotalEl.textContent = totalMs !== null ? formatearMs(totalMs) : "—";
  if (tiempoPromedioEl) tiempoPromedioEl.textContent = promedio !== null ? formatearMs(promedio) : "—";
  if (tiempoMinimoEl) tiempoMinimoEl.textContent = minimo !== null ? formatearMs(minimo) : "—";
  if (tiempoMaximoEl) tiempoMaximoEl.textContent = maximo !== null ? formatearMs(maximo) : "—";
  if (tiempoMinimoTagEl) tiempoMinimoTagEl.textContent = frecuenciaState.minEntry ? descripcionTag(frecuenciaState.minEntry.tag) : "—";
  if (tiempoMaximoTagEl) tiempoMaximoTagEl.textContent = frecuenciaState.maxEntry ? descripcionTag(frecuenciaState.maxEntry.tag) : "—";
  if (tiempoMinimoPosEl) tiempoMinimoPosEl.textContent = frecuenciaState.minEntry ? frecuenciaState.minEntry.position : "—";
  if (tiempoMaximoPosEl) tiempoMaximoPosEl.textContent = frecuenciaState.maxEntry ? frecuenciaState.maxEntry.position : "—";
  if (tiempoMedianaEl) tiempoMedianaEl.textContent = mediana !== null ? formatearMs(mediana) : "—";
}

function actualizarLectura(tag, fecha) {
  if (frecuenciaValueEl) {
    frecuenciaValueEl.textContent = descripcionTag(tag);
  }
  if (frecuenciaTimestampEl && fecha instanceof Date) {
    frecuenciaTimestampEl.textContent = formatearHora(fecha);
  }
}

function setAccionMensaje(texto) {
  if (typeof actualizarAccion === "function") {
    actualizarAccion(texto);
  } else if (accionMagoMensajeEl) {
    accionMagoMensajeEl.textContent = texto;
  }
}

function iniciarNuevaSecuencia(tag, instanteMs, fechaActual) {
  frecuenciaState.firstTag = tag;
  frecuenciaState.startTimeMs = instanteMs;
  frecuenciaState.lastTimestampMs = instanteMs;
  frecuenciaState.endTimeMs = null;
  frecuenciaState.intervalsMs = [];
  frecuenciaState.tags = [{ tag, fecha: fechaActual }];
  frecuenciaState.completed = false;

  actualizarLectura(tag, fechaActual);
  limpiarLog();
  agregarLog(`Inicio con ${descripcionTag(tag)} a las ${formatearHora(fechaActual)}`);
  actualizarResumen();
  reproducirAudioParaTag(tag);
  setAccionMensaje("Leer carta");
}

function calcularMediana(numeros) {
  const ordenados = [...numeros].sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  if (ordenados.length % 2 === 0) {
    return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
  }
  return ordenados[mitad];
}

function cerrarSecuencia(instanteMs, fechaActual) {
  frecuenciaState.endTimeMs = instanteMs;
  frecuenciaState.completed = true;
  agregarLog(`Fin: se releyó ${descripcionTag(frecuenciaState.firstTag)} a las ${formatearHora(fechaActual)}`);
  actualizarResumen();
  setAccionMensaje("Reiniciar secuencia o Volver al Menú");
}

function registrarControlFrecuencia(tag) {
  if (frecuenciaState.completed) {
    return; // Secuencia ya finalizada; ignorar lecturas hasta que se reinicie manualmente
  }

  const ahoraMs = performance.now();
  const fechaActual = new Date();

  if (!frecuenciaState.firstTag) {
    iniciarNuevaSecuencia(tag, ahoraMs, fechaActual);
    return;
  }

  if (frecuenciaState.lastTimestampMs !== null) {
    const intervalo = ahoraMs - frecuenciaState.lastTimestampMs;
    const position = frecuenciaState.tags.length + 1; // posición del tag actual en la secuencia
    frecuenciaState.intervalsMs.push(intervalo);
    if (!frecuenciaState.minEntry || intervalo < frecuenciaState.minEntry.intervalMs) {
      frecuenciaState.minEntry = { intervalMs: intervalo, tag, position };
    }
    if (!frecuenciaState.maxEntry || intervalo > frecuenciaState.maxEntry.intervalMs) {
      frecuenciaState.maxEntry = { intervalMs: intervalo, tag, position };
    }
    agregarLog(`+${formatearMs(intervalo)} → ${descripcionTag(tag)} (${formatearHora(fechaActual)})`);
  }

  frecuenciaState.tags.push({ tag, fecha: fechaActual });
  frecuenciaState.lastTimestampMs = ahoraMs;
  actualizarLectura(tag, fechaActual);
  reproducirAudioParaTag(tag);

  if (tag === frecuenciaState.firstTag && frecuenciaState.tags.length > 1) {
    cerrarSecuencia(ahoraMs, fechaActual);
  } else {
    actualizarResumen();
  }
}

function reiniciarControlFrecuencia() {
  frecuenciaState.firstTag = null;
  frecuenciaState.startTimeMs = null;
  frecuenciaState.endTimeMs = null;
  frecuenciaState.lastTimestampMs = null;
  frecuenciaState.intervalsMs = [];
  frecuenciaState.minEntry = null;
  frecuenciaState.maxEntry = null;
  frecuenciaState.tags = [];
  frecuenciaState.completed = false;
  limpiarLog();
  actualizarResumen();
  if (frecuenciaValueEl) frecuenciaValueEl.textContent = "";
  if (frecuenciaTimestampEl) frecuenciaTimestampEl.textContent = "";
  setAccionMensaje("Leer carta");
}

function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartas[tag];

  if (archivo && archivo.trim() !== "") {
    audio.playbackRate = 4;
    audio.src = `../audios/${archivo}`;
    audio
      .play()
      .then(() => {})
      .catch((err) => {
        console.error("No se pudo reproducir el audio:", err);
      });
  } else {
    console.warn(`No se encontró archivo de audio para: ${tag}`);
    audio.removeAttribute("src");
    audio.load();
  }
}

if (resetBtn) {
  resetBtn.addEventListener("click", reiniciarControlFrecuencia);
}

window.registrarControlFrecuencia = registrarControlFrecuencia;
window.reiniciarControlFrecuencia = reiniciarControlFrecuencia;

actualizarResumen();