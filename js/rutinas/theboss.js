// theboss.js

let pilaNegra = [];
let pilaRoja = [];
let cartasLeidas = 0;
let ultimoTag = null; // Nuevo: para evitar repeticiones consecutivas

const ordenNegro = ["N", "N", "N", "N", "N", "R", "R", "N", "N"];
const ordenRojo =  ["R", "R", "R", "R", "R", "N", "N", "R", "R"];

function guardarTagTheBoss(tag) {
  console.log("Tag recibido en TheBoss:", tag);
  if (!tag || tag.length < 2) return;
    // Nuevo control para evitar doble lectura consecutiva
  if (tag === ultimoTag) {
    console.warn("Tag repetido consecutivo detectado. Ignorado:", tag);
    return;
  }
  ultimoTag = tag;

  const palo = tag[1];
  let color = null;

  if (palo === "P" || palo === "T") {
    color = "N";
  } else if (palo === "C" || palo === "D") {
    color = "R";
  } else {
    console.warn("Palo no reconocido:", palo);
    return;
  }

  // Decidir a qué pila debe ir
  let destino = null;
  // hacemos console.log de las pilas
    console.log("Pila Negra:", pilaNegra);
    console.log("Pila Roja:", pilaRoja);
  if (pilaNegra.length < ordenNegro.length && color === ordenNegro[pilaNegra.length]) {
    pilaNegra.push(tag);
    destino = "NEGRO";
  } else if (pilaRoja.length < ordenRojo.length && color === ordenRojo[pilaRoja.length]) {
    pilaRoja.push(tag);
    destino = "ROJO";
  } else {
    // 
      console.log("No Distribuir la carta");
      destino = "mezclar";
      color = "mezclar";
      ultimoTag = null;
    }
  

  console.log(`Carta ${tag} clasificada como ${color} → pila ${destino}`);
  reproducirAudioColor(destino);

  cartasLeidas++;
  if (cartasLeidas === 1 && typeof actualizarAccion === 'function') {
    actualizarAccion("Leer cartas de a una y Repartir según indique Camer Codex");
  }
    // Si ambas pilas están completas, reiniciar en 5 segundos
  if (pilaNegra.length === ordenNegro.length && pilaRoja.length === ordenRojo.length) {
    console.log("✅ Ambas pilas completas. Reiniciando en 5 segundos...");
    setTimeout(() => {
      reiniciarTheBoss();
    }, 5000);
  }
}

function reproducirAudioColor(color) {
  const audio = new Audio(`../audios/audios_especiales/${color.toLowerCase()}.mp3`);
  audio.play().catch(e => console.error("Error reproduciendo audio:", e));
}

function reiniciarTheBoss() {
  pilaNegra = [];
  pilaRoja = [];
  cartasLeidas = 0;
  ultimoTag = null;
  actualizarAccion("Conectar el dispositivo BLE");
  console.log("Rutina The Boss reiniciada");
  reproducirAudioColor("inicio");
}
