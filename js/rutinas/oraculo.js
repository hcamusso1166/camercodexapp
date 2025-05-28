let mapaColores = {};

fetch('../audios/audios_especiales/colores.json')
  .then(res => res.json())
  .then(data => {
    mapaColores = data;
    console.log("Mapa de colores cargado correctamente");
  })
  .catch(err => console.error("Error cargando colores.json", err));



  function reproducirColor(tag) {
    const audio = document.getElementById("tagAudio");
    const archivo = mapaColores[tag];
  
    if (archivo && archivo.trim() !== "") {
      console.log("Tag:", tag, "→ Archivo:", archivo);
      audio.src = `../audios/audios_especiales/${archivo}`;
      audio.play().then(() => {
        console.log(`Reproduciendo: ${archivo}`);
      }).catch(err => {
        console.error("No se pudo reproducir el audio:", err);
        console.log("Tag:", tag, "→ Archivo:", archivo);
      });
    } else {
      console.warn(`No se encontró archivo de audio para: ${tag}`);
      console.log("Tag:", tag, "→ Archivo:", archivo);
      audio.removeAttribute('src');
      audio.load();
    };
}