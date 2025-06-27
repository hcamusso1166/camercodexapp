// Este archivo contiene la lógica para la rutina "Prueba de Fuego"
console.log("Camer Codex - pruebaDeFuego.js cargado");
let eleccion = null;
let segundaEleccion = null;
let etapaRegistro = true;
let etapaFinalizada = false;
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


// Esta función será llamada desde main.js para procesar los tags
function guardarTagPruebaDeFuego(tag) {
  //preguntar si tag es igual a eleccion o tag es igual a segundaEleccion

  if (tag === eleccion || tag === segundaEleccion) {
    console.warn("Tag repetido, ignorado.");
  return; // Evita repetir lectura del mismo tag
  }
  if (etapaRegistro) {
    eleccion = tag;
    etapaRegistro = false;
    reproducirAudioParaTag(eleccion);
    retrievedValue.innerHTML = eleccion;
     if (accionMagoMensaje) {
      actualizarAccion("Pedir que repita su elección anterior");
    }
    return;
  } else { 
    reproducirAudioParaTag(tag);
    segundaEleccion = tag;
    retrievedValue.innerHTML = "Segunda elección:" + tag;
    actualizarAccion("Pase la cantidad de cartas necesarias a TOP");
    
    etapaFinalizada = true;
    //mostrar el boton de reinicio despues de 5 segundos
    setTimeout(function() {
      mostrarBotonReinicioGlobal("reiniciarPruebaDeFuego");
      actualizarAccion("Finalizado. Presionar botón para reiniciar o volver al menù");  
    }, 10000);    
  }

  // Si la rutina ya terminó, no hacer nada
  if (etapaFinalizada) {
    console.warn("La rutina finalizó. Lectura ignorada.");
    return;
  }
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
// Función que limpia estado y reinicia todo
function reiniciarPruebaDeFuego() {
  eleccion = null;
  segundaEleccion = null;
  etapaRegistro = true;
  etapaFinalizada = false;
  limpiarDatos();
  actualizarAccion("Leer cartas para reiniciar");

  const contenedor = document.getElementById("botonReinicioContainer");
  if (contenedor) {
    contenedor.innerHTML = ""; // Elimina cualquier botón dentro del contenedor
  }

}