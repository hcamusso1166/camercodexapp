let cartasLeidas = [];
let finDada = false;
let contador = 0;
let valorCarta = 0; // Variable para almacenar el valor de la carta
let suma = 0; // Variable para acumular la suma de las cartas
let carta; 
let cadencia = 1000;  // Cadencia de audio en ms (puedes configurarlo)
let ultimoTag = null;
let mapaCartas = {};//archivos de audio de las cartas.
let cartasPoker = {};//archivos de texto de las cartas Poker.
let mapaSuma = {}//archivos de audio para la suma.

fetch('../audios/suma/sumaAudio.json')
  .then(res => res.json())
  .then(data => {
    mapaSuma = data;
    console.log("Mapa de Archivos Audios para la suma cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartas.json", err));

fetch('../audios/cartasPoker.json')
  .then(res => res.json())
  .then(data => {
    cartasPoker = data;
    console.log("Mapa de Archivos Texto para las cartas Poker cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartas.json", err));
// Esta función será llamada desde main.js para sumar el valor de la carta y realizar la lógica de la dada
function sumarTag(tag) {
  if (!finDada) {
    if (tag === cartasLeidas[0] && cartasLeidas.length > 1) {
      finDada = true;
      // Paso 1: reproducir audio "stop"
      reproducirAudio("stop");
      actualizarAccion("Declarar la Suma Total al instante!");
      //console.log("🔴 Se reprodujo audio Stop");
      // Paso 2 y 3: reproducir la suma total dos veces con separación
      setTimeout(() => {
        reproducirAudioCompuesto(suma);
        //console.log("▶ Primera reproducción de la suma:", suma);
      }, 2000); // 2 segundos después del stop

      setTimeout(() => {
      reproducirAudioCompuesto(suma);
      //console.log("▶ Segunda reproducción de la suma:", suma);

      // 🔄 Reiniciar rutina luego de unos segundos extra
      setTimeout(() => {
        reiniciarRapidoNumeroso();
      }, 3000); // espera 3s después de segunda reproducción
    }, 5000); // 5 segundos después de la primera reproducción

    } else {
      if (tag === ultimoTag  || cartasLeidas.includes(tag)) {
        // Si el tag es igual a la ultimoTag  actual, o ya está en la cartasLeidas de cartas, no hacer nada
        //console.warn("Tag repetido, ignorado.");
        return; // Evita repetir lectura del mismo tag
      }
      // Se agrega el tag a la cartasLeidas, que funciona como cola, primero en entrar, primero en salir
      cartasLeidas.push(tag); // Agregar al inicio de la cartasLeidas
      // convertir el tag a la carta correspondiente
      carta = cartasPoker[tag];
      // Asumiendo que el tag trae la informaciòn de la carta, convertir el tag al valor para la suma, considerando que el A es 1, 2 es 2, 3 es 3...J=11, Q=12 y K=13
      valorCarta = obtenerValorCarta(carta);
      // Acumular el valor de la carta en suma 
      //console.log("Valor Carta:", valorCarta);
      //console.log("Suma Parcial:", suma);
      suma += valorCarta; // Acumular el valor de la carta en suma
      reproducirAudioCompuesto(suma); // Reproducir el audio de la suma parcial.
      document.getElementById("sumaTotal").textContent = suma;

      contador++;
      ultimoTag  = tag; // Actualizar la lectura actual
      //console.log("Tag guardado:", tag, "Contador:", contador);
      //console.log("cartasLeidas actual:", cartasLeidas);
      //console.log("Valor Carta:", valorCarta);
      console.log("Suma Parcial:", suma);

    }
  }
}

function reproducirAudioSuma(suma) {
  const audio = document.getElementById("tagAudio");
  // Por cada unidad de la suma reproducir el audio correspondiente
  const tag = suma.toString(); // Convertir la suma a string para buscar en el mapa
  // hacer un ciclo for para reproducir cada unidad de la suma; por ejemplo si la suma es 12, reproducir primero el audio de 1 y luego el de 2
  for (let i = 0; i < tag.length; i++) {
    const unidad = tag[i]; // Obtener cada dígito de la suma
    const archivo = mapaSuma[unidad]; // Obtener el archivo de audio correspondiente a la unidad
    //console.log(`Reproduciendo audio para unidad: ${unidad}, archivo: ${archivo}`);
    //console.log("ìndice: ",i);
    //este if se debe ejecutar despues de 1 segundo de la reproducciòn del audio anterior
    
    setTimeout(() => {
    if (archivo && archivo.trim() !== "") {
      audio.src = `../audios/suma/${archivo}`;
      audio.play()}},cadencia * i); // Reproducir el audio de la unidad

}}

function obtenerValorCarta(nombreCarta) {
  const valorStr = nombreCarta.match(/\d+|[AJQK]/)[0]; // extrae valor numérico o letra
  switch (valorStr) {
    case 'A': return 1;
    case 'D': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    default: return parseInt(valorStr, 10) || 0;
  }
}

function reproducirAudioCompuesto(numero) {
  const audio = document.getElementById("tagAudio");
  const partes = [];

  // Parte 1: Descomposición lógica
  if (numero === 100 || numero === 200 || numero === 300) {
    partes.push(numero.toString());
  } else if (numero > 100 && numero < 200) {
    partes.push("ciento");
    numero -= 100;
  } else if (numero > 200 && numero < 300) {
    partes.push("200");
    numero -= 200;
  } else if (numero > 300) {
    partes.push("300");
    numero -= 300;
  }

  if (numero <= 15) {
    partes.push(numero.toString());
  } else {
    const decena = Math.floor(numero / 10) * 10;
    const unidad = numero % 10;
    if (unidad === 0) {
      partes.push(decena.toString());
    } else {
      partes.push(decena.toString());
      partes.push("y" + unidad.toString());
    }
  }

  // Parte 2: Reproducir cada audio con cadencia
  partes.forEach((clave, i) => {
    const archivo = mapaSuma[clave];
    if (archivo && archivo.trim() !== "") {
      setTimeout(() => {
        audio.src = `../audios/suma/${archivo}`;
        audio.play().catch(err => {
          console.warn("No se pudo reproducir", archivo, err);
        });
      }, cadencia * i); // espera entre partes
    }
  });
}

function reiniciarRapidoNumeroso() {
  cartasLeidas = [];
  finDada = false;
  contador = 0;
  valorCarta = 0;
  suma = 0;
  carta = null;
  ultimoTag = null;
  document.getElementById("sumaTotal").textContent = "0";
  actualizarAccion("Listo para comenzar una nueva suma");
  //console.log("🔄 Estado reiniciado para nuevo milagro");
}





