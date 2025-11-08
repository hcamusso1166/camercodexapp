let cartasPokerLecturaQ = {};
const LECTURA_Q_SLOT_COUNT = 5;
const LECTURA_Q_INACTIVITY_MS = 30000;

const lecturaQState = Array.from({ length: LECTURA_Q_SLOT_COUNT }, () => ({
  mvalor: null,
  code: null,
  description: null,
  lastUpdated: null,
}));

let lecturaQInactivityTimer = null;

const slotElements = {
  card: [],
  time: [],
};

// Precargar referencias del DOM cuando el documento esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarLecturaQ);
} else {
  inicializarLecturaQ();
}

function inicializarLecturaQ() {
  for (let i = 1; i <= LECTURA_Q_SLOT_COUNT; i += 1) {
    slotElements.card[i] = document.getElementById(`slotCard${i}`);
    slotElements.time[i] = document.getElementById(`slotTime${i}`);
  }

  fetch("../audios/cartasPoker.json")
    .then(res => res.json())
    .then(data => {
      cartasPokerLecturaQ = data;
      refrescarSlotsLecturaQ();
    })
    .catch(err => console.error("Error cargando cartasPoker.json", err));
}

function refrescarSlotsLecturaQ() {
  for (let slot = 1; slot <= LECTURA_Q_SLOT_COUNT; slot += 1) {
    const estado = lecturaQState[slot - 1];
    if (estado.mvalor) {
      const { code, description } = obtenerDescripcionCartaLecturaQ(estado.mvalor);
      estado.code = code;
      estado.description = description;
    }
    actualizarVistaSlotLecturaQ(slot);
  }
}

function actualizarVistaSlotLecturaQ(slot) {
  const estado = lecturaQState[slot - 1];
  const cardEl = slotElements.card[slot];
  const timeEl = slotElements.time[slot];

  if (!cardEl || !timeEl) {
    return;
  }

  if (estado && estado.description) {
    cardEl.textContent = estado.code || "—";
    timeEl.textContent = estado.lastUpdated
      ? formatearHoraLecturaQ(estado.lastUpdated)
      : "";
    cardEl.classList.add("slot-card--filled");
  } else {
    cardEl.textContent = "—";
    timeEl.textContent = "";
    cardEl.classList.remove("slot-card--filled");
  }
}

function formatearHoraLecturaQ(fecha) {
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function describirCartaLecturaQ(codigo) {
  if (!codigo || typeof codigo !== "string") {
    return null;
  }

  const valorMap = {
    A: "As",
    K: "Rey",
    Q: "Reina",
    J: "Jota",
    D: "Diez",
    "9": "Nueve",
    "8": "Ocho",
    "7": "Siete",
    "6": "Seis",
    "5": "Cinco",
    "4": "Cuatro",
    "3": "Tres",
    "2": "Dos",
  };

  const paloMap = {
    T: "Tréboles",
    C: "Corazones",
    P: "Picas",
    D: "Diamantes",
  };

  const valor = valorMap[codigo[0]];
  const palo = paloMap[codigo[1]];

  if (valor && palo) {
    return `${valor} de ${palo}`;
  }
  if (valor) {
    return valor;
  }
  if (palo) {
    return `Carta de ${palo}`;
  }

  return null;
}

function obtenerDescripcionCartaLecturaQ(mvalor) {
  const codigo = cartasPokerLecturaQ[mvalor];
  const descripcion = describirCartaLecturaQ(codigo);

  return {
    code: codigo || null,
    description: descripcion || (mvalor ? `Código ${mvalor}` : null),
  };
}

function haySlotsConDatosLecturaQ() {
  return lecturaQState.some(slot => Boolean(slot.description));
}

function anunciarSlotsLecturaQ() {
  if (!haySlotsConDatosLecturaQ()) {
    return;
  }

  const mensajes = [];
  lecturaQState.forEach((slot, index) => {
    if (slot.description) {
      mensajes.push(`Slot ${index + 1}: ${slot.description}`);
    }
  });

  if (!mensajes.length) {
    return;
  }

  if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function") {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(mensajes.join(". "));
    utterance.lang = "es-AR";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  } else {
    console.log("LecturaQ (sin TTS):", mensajes.join(" | "));
  }
}

function programarRecordatorioLecturaQ() {
  if (lecturaQInactivityTimer) {
    clearTimeout(lecturaQInactivityTimer);
  }

  lecturaQInactivityTimer = setTimeout(() => {
    lecturaQInactivityTimer = null;
    if (haySlotsConDatosLecturaQ()) {
      anunciarSlotsLecturaQ();
      programarRecordatorioLecturaQ();
    }
  }, LECTURA_Q_INACTIVITY_MS);
}

function registrarLecturaQ({ mvalor, antennaId }) {
  if (!antennaId || antennaId < 1 || antennaId > LECTURA_Q_SLOT_COUNT) {
    console.warn("LecturaQ: antennaId fuera de rango", antennaId);
    return;
  }

  const estado = lecturaQState[antennaId - 1];
  const { code, description } = obtenerDescripcionCartaLecturaQ(mvalor);

  estado.mvalor = mvalor;
  estado.code = code;
  estado.description = description;
  estado.lastUpdated = new Date();

  actualizarVistaSlotLecturaQ(antennaId);
  anunciarSlotsLecturaQ();
  programarRecordatorioLecturaQ();
}

function resetLecturaQSlots() {
  if (lecturaQInactivityTimer) {
    clearTimeout(lecturaQInactivityTimer);
    lecturaQInactivityTimer = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  for (let i = 0; i < LECTURA_Q_SLOT_COUNT; i += 1) {
    lecturaQState[i] = {
      mvalor: null,
      code: null,
      description: null,
      lastUpdated: null,
    };
    actualizarVistaSlotLecturaQ(i + 1);
  }
}

window.registrarLecturaQ = registrarLecturaQ;
window.resetLecturaQSlots = resetLecturaQSlots;