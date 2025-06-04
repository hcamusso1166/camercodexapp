let mapaOjosVendados = {};

fetch('../audios/ojosVendados.json')
  .then(res => res.json())
  .then(data => {
    mapaOjosVendados = data;
    console.log("Mapa de colores cargado correctamente");
  })
  .catch(err => console.error("Error cargando colores.json", err));



  function reproducirOjosVendados(tag) {
    const audio = document.getElementById("tagAudio");
    const archivo = mapaOjosVendados[tag];
  
    if (archivo && archivo.trim() !== "") {
      console.log("Tag:", tag, "→ Archivo:", archivo);
      audio.src = `../audios/${archivo}`;
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