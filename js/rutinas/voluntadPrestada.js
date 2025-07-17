// theboss.js
let cartasPoker = {};
fetch('../audios/cartasPoker.json')
  .then(res => res.json())
  .then(data => {
    cartasPoker = data;
    console.log("Mapa de cartas Poker para texto  cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartasPoker.json", err));
let pilaDerecha = [];//Contendrà 8 cartas Negras (Picas o Treboles).
let pilaIzquierdaR = [];//Contendrà 5 cartas Rojas (Diamantes o Corazones).
let pilaIzquierdaN = [];//Contendrà  3 Negras (Picas o Treboles).
let cartasLeidas = 0;
let ultimoTag = null; // Nuevo: para evitar repeticiones consecutivas

function tagVoluntadPrestada(valor) {
  console.log("Tag recibido en Voluntad Prestada:", valor);
  if (!valor || valor.length < 3) return;
    // Nuevo control para evitar doble lectura consecutiva
  if (valor === ultimoTag) {
    console.warn("Tag repetido consecutivo detectado. Ignorado:", valor);
    return;
  }
  ultimoTag = valor;
  let color = valor[2];
  // Decidir a qué pila debe ir
  let destino = null;
  // hacemos console.log de las pilas
    console.log("Pila Derecha:", pilaDerecha);
    console.log("Pila Izquierda:", pilaIzquierdaR, pilaIzquierdaN);
  if (pilaDerecha.length < 8 && color === "N")  {
    pilaDerecha.push(color);
    destino = "derecha";
  } else if (pilaIzquierdaR.length < 5 && color === "R") {
    pilaIzquierdaR.push(color);
    destino = "izquierda";
  } else if (pilaIzquierdaN.length < 3 && color === "N"){
    pilaIzquierdaN.push(color);
    destino = "izquierda";
  } else {
    // 
      console.log("No Distribuir la carta");
      destino = "mezclar";
      color = "mezclar";
      ultimoTag = null;
    }
  reproducirAudio(destino);
  console.log(`Carta clasificada como ${color} → pila ${destino}`);
  

  cartasLeidas++;
  if (cartasLeidas === 1 && typeof actualizarAccion === 'function') {
    actualizarAccion("Leer cartas de a una y Repartir según indique Camer Codex");
  }
    // Si ambas pilas están completas, reiniciar en 5 segundos
  if (pilaDerecha.length === 8 && pilaIzquierdaR.length === 5 && pilaIzquierdaN.length === 3) {
    actualizarAccion("✅ Todas pilas completas. Reiniciando en 5 segundos...");
      setTimeout(() => {
      reproducirAudio("stop");
    }, 1000);
    setTimeout(() => {
      reiniciarVoluntadPrestada();
    }, 5000);
  }
}

function reiniciarVoluntadPrestada() {
  pilaDerecha = [];
  pilaIzquierdaR = [];
  pilaIzquierdaN = [];
  cartasLeidas = 0;
  ultimoTag = null;
  if(limpiarDatos) {
    limpiarDatos();
  }
  actualizarAccion("Reinicio: Leer cartas de a una y Repartir según indique Camer Codex");
  console.log("Rutina The Boss reiniciada");
  
 
      reproducirAudio("inicio");

}
