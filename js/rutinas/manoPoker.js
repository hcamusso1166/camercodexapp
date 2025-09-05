// manoPoker.js
console.log("Camer Codex - manoPoker.js cargado");
let mapaCartas = {};
let cartasPoker = {};
console.log("Camer Codex - dadaSimple.js cargado");
fetch('../audios/cartas.json')
  .then(res => res.json())
  .then(data => {
    mapaCartas = data;
    console.log("Mapa de cartas Archivos Audios cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartas.json", err));
fetch('../audios/cartasPoker.json')
  .then(res => res.json())
  .then(data => {
    cartasPoker = data;
    console.log("Mapa de cartas Poker para texto  cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartasPoker.json", err));
  
function evaluarManoPoker(mvalor) {
// Inicializar arreglo global si no existe
    if (!window.manoActual) window.manoActual = [];

    // Evitar duplicados consecutivos
    if (window.manoActual[window.manoActual.length - 1] !== mvalor) {
      window.manoActual.push(mvalor);
      console.log(`Carta añadida a la mano: ${mvalor}`);
    }

    // Mostrar las 5 cartas y evaluar la mano
    if (window.manoActual.length === 5) {
        console.log("🃏 Mano completa:", window.manoActual) ;
          const resultado = evaluarMano(window.manoActual);
          console.log("🃏 Resultado de la Mano:", resultado);
          actualizarAccion(`Resultado: ${resultado.descripcion}`);
 
    }
  }


