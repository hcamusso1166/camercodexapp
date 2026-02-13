const BOOK_TEST_SLOT_COUNT = 5;
const BOOK_TEST_ANTENNA_SLOT_MAP = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};
const BOOK_TEST_INACTIVITY_MS = 30000;

const bookTestState = {
  titulo: {
    raw: null,
    value: null,
    lastUpdated: null,
  },
  slots: Array.from({ length: BOOK_TEST_SLOT_COUNT }, () => ({
    raw: null,
    value: null,
    lastUpdated: null,
  })),
};

let bookTestInactivityTimer = null;

const bookTestElements = {
  tituloValue: null,
  tituloTime: null,
  slotCard: [],
  slotTime: [],
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarBookTestImposible);
} else {
  inicializarBookTestImposible();
}

function inicializarBookTestImposible() {
  bookTestElements.tituloValue = document.getElementById("tituloValue");
  bookTestElements.tituloTime = document.getElementById("tituloTime");

  for (let i = 1; i <= BOOK_TEST_SLOT_COUNT; i += 1) {
    bookTestElements.slotCard[i] = document.getElementById(`slotCard${i}`);
    bookTestElements.slotTime[i] = document.getElementById(`slotTime${i}`);
  }

  refrescarBookTestImposible();
}

function normalizarMvalorBookTest(mvalor) {
  const numero = Number.parseInt(mvalor, 10);
  if (Number.isNaN(numero)) {
    return null;
  }
  return Math.max(0, Math.min(99, numero));
}

function formatearTituloBookTest(numero) {
  if (numero === null) {
    return null;
  }
  return numero.toString().padStart(2, "0");
}

function formatearSlotBookTest(numero) {
  if (numero === null) {
    return null;
  }
  return String(numero % 10);
}

function formatearHoraBookTest(fecha) {
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function actualizarVistaTituloBookTest() {
  const { tituloValue, tituloTime } = bookTestElements;
  const { value, lastUpdated } = bookTestState.titulo;

  if (!tituloValue || !tituloTime) {
    return;
  }

  if (value !== null) {
    tituloValue.textContent = value;
    tituloValue.classList.add("slot-card--filled");
    tituloTime.textContent = lastUpdated ? formatearHoraBookTest(lastUpdated) : "";
  } else {
    tituloValue.textContent = "—";
    tituloValue.classList.remove("slot-card--filled");
    tituloTime.textContent = "";
  }
}

function actualizarVistaSlotBookTest(slot) {
  const slotState = bookTestState.slots[slot - 1];
  const slotCard = bookTestElements.slotCard[slot];
  const slotTime = bookTestElements.slotTime[slot];

  if (!slotCard || !slotTime || !slotState) {
    return;
  }

  if (slotState.value !== null) {
    slotCard.textContent = slotState.value;
    slotCard.classList.add("slot-card--filled");
    slotTime.textContent = slotState.lastUpdated ? formatearHoraBookTest(slotState.lastUpdated) : "";
  } else {
    slotCard.textContent = "—";
    slotCard.classList.remove("slot-card--filled");
    slotTime.textContent = "";
  }
}

function refrescarBookTestImposible() {
  actualizarVistaTituloBookTest();
  for (let slot = 1; slot <= BOOK_TEST_SLOT_COUNT; slot += 1) {
    actualizarVistaSlotBookTest(slot);
  }
}

function hayDatosBookTestImposible() {
  return bookTestState.titulo.value !== null || bookTestState.slots.some(slot => slot.value !== null);
}

function anunciarBookTestImposible() {
  if (!hayDatosBookTestImposible()) {
    return;
  }

  const mensajes = [];

  if (bookTestState.titulo.value !== null) {
    mensajes.push(`Título ${bookTestState.titulo.value}`);
  }

  bookTestState.slots.forEach((slot, index) => {
    if (slot.value !== null) {
      mensajes.push(`Slot ${index + 1}: ${slot.value}`);
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
    console.log("Book Test Imposible (sin TTS):", mensajes.join(" | "));
  }
}

function programarRecordatorioBookTestImposible() {
  if (bookTestInactivityTimer) {
    clearTimeout(bookTestInactivityTimer);
  }

  bookTestInactivityTimer = setTimeout(() => {
    bookTestInactivityTimer = null;
    if (hayDatosBookTestImposible()) {
      anunciarBookTestImposible();
      programarRecordatorioBookTestImposible();
    }
  }, BOOK_TEST_INACTIVITY_MS);
}

function registrarBookTestImposible({ mvalor, antennaId }) {
  const normalizado = normalizarMvalorBookTest(mvalor);

  if (normalizado === null) {
    console.warn("Book Test Imposible: mvalor inválido", mvalor);
    return;
  }

  if (antennaId === 1 || antennaId === 9) {
    bookTestState.titulo.raw = mvalor;
    bookTestState.titulo.value = formatearTituloBookTest(normalizado);
    bookTestState.titulo.lastUpdated = new Date();
    actualizarVistaTituloBookTest();
    anunciarBookTestImposible();
    programarRecordatorioBookTestImposible();
    return;
  }

  const slot = BOOK_TEST_ANTENNA_SLOT_MAP[antennaId];
  if (!slot) {
    console.warn("Book Test Imposible: antennaId fuera de rango", antennaId);
    return;
  }

  const slotState = bookTestState.slots[slot - 1];
  slotState.raw = mvalor;
  slotState.value = formatearSlotBookTest(normalizado);
  slotState.lastUpdated = new Date();

  actualizarVistaSlotBookTest(slot);
  anunciarBookTestImposible();
  programarRecordatorioBookTestImposible();
}

function resetBookTestImposible() {
  if (bookTestInactivityTimer) {
    clearTimeout(bookTestInactivityTimer);
    bookTestInactivityTimer = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  bookTestState.titulo = {
    raw: null,
    value: null,
    lastUpdated: null,
  };

  bookTestState.slots = Array.from({ length: BOOK_TEST_SLOT_COUNT }, () => ({
    raw: null,
    value: null,
    lastUpdated: null,
  }));

  refrescarBookTestImposible();
}

window.registrarBookTestImposible = registrarBookTestImposible;
window.resetBookTestImposible = resetBookTestImposible;