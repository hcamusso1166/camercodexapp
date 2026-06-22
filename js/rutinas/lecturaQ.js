let cartasPokerLecturaQ = {};
const LECTURA_Q_SLOT_COUNT = 5;
const LECTURA_Q_ANTENNA_SLOT_MAP = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};
const LECTURA_Q_INACTIVITY_MS = 30000;
const CAMER_EVENT_READ_NEW = 0;
const CAMER_EVENT_READ_REPEAT = 1;
const CAMER_EVENT_REMOVED = 2;
const CAMER_FLAG_FULL_SNAPSHOT = 0x80;

const lecturaQState = Array.from({ length: LECTURA_Q_SLOT_COUNT }, () => ({
  mvalor: null,
  code: null,
  description: null,
  lastUpdated: null,
  lastSeq: null,
  lastEventType: null,
  lastFlags: 0,
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

function limpiarSlotLecturaQ(slotIndex, metadata = {}) {
  const estado = lecturaQState[slotIndex - 1];

  estado.mvalor = null;
  estado.code = null;
  estado.description = null;
  estado.lastUpdated = new Date();
  estado.lastSeq = metadata.seq ?? null;
  estado.lastEventType = metadata.eventType ?? null;
  estado.lastFlags = metadata.flags ?? 0;

  actualizarVistaSlotLecturaQ(slotIndex);
}

function registrarLecturaQ({
  mvalor,
  valor,
  antennaId,
  eventType = CAMER_EVENT_READ_NEW,
  flags = 0,
  seq = null,
}) {
  if (!antennaId || !LECTURA_Q_ANTENNA_SLOT_MAP[antennaId]) {
    console.warn("LecturaQ: antennaId fuera de rango", antennaId);
    return;
  }

  const slotIndex = LECTURA_Q_ANTENNA_SLOT_MAP[antennaId];
  const estado = lecturaQState[slotIndex - 1];
  
  const isSnapshot = (flags & CAMER_FLAG_FULL_SNAPSHOT) !== 0;
  const isRepeat = eventType === CAMER_EVENT_READ_REPEAT;
  const isRemoved = eventType === CAMER_EVENT_REMOVED;

  if (isRemoved) {
    limpiarSlotLecturaQ(slotIndex, { eventType, flags, seq });
    programarRecordatorioLecturaQ();
    return;
  }

  if (!mvalor || typeof mvalor !== "string" || !mvalor.trim()) {
    if (isSnapshot) {
      limpiarSlotLecturaQ(slotIndex, { eventType, flags, seq });
    }
    return;
  }

  const sameCardInSameSlot = estado.mvalor === mvalor;
  const { code, description } = obtenerDescripcionCartaLecturaQ(mvalor);

  estado.mvalor = mvalor;
  estado.code = code;
  estado.description = description;
  estado.lastUpdated = new Date();
  estado.lastSeq = seq;
  estado.lastEventType = eventType;
  estado.lastFlags = flags;

  actualizarVistaSlotLecturaQ(slotIndex);
  
   /*
    Regla show-time:
    - READ_NEW debe anunciar.
    - READ_REPEAT igual a la carta ya conocida no debe anunciar.
    - FULL_SNAPSHOT no debe anunciar, porque es reconciliación silenciosa.
    - Si un READ_REPEAT recupera un slot que estaba vacío, actualiza UI pero no repite audio.
  */
  const shouldAnnounce =
    eventType === CAMER_EVENT_READ_NEW &&
    !isSnapshot &&
    !sameCardInSameSlot;

  if (shouldAnnounce) {
    anunciarSlotsLecturaQ();
  }

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
      lastSeq: null,
      lastEventType: null,
      lastFlags: 0,
    };
    actualizarVistaSlotLecturaQ(i + 1);
  }
}

window.registrarLecturaQ = registrarLecturaQ;
window.resetLecturaQSlots = resetLecturaQSlots;