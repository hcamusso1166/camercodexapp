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
