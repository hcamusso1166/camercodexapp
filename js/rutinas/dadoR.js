let mapaAudio = {};
let mapaTexto = {};
console.log("Camer Codex - dadaSimple.js cargado");
fetch('../audios/audios_especiales/dadoAudio.json')
  .then(res => res.json())
  .then(data => {
    mapaAudio = data;
    console.log("Mapa Dado-Archivos Audios cargado correctamente");
  })
  .catch(err => console.error("Error cargando dadoAudio.json", err));
fetch('../audios/audios_especiales/dadoTexto.json')
  .then(res => res.json())
  .then(data => {
    mapaTexto = data;
    console.log("Mapa de dado para texto cargado correctamente");
  })
  .catch(err => console.error("Error cargando dadoTexto.json", err));

  function reproducirAudioParaTag(tag) {
    switch (tag) {
      case "01":
        reproducirVibracion(); // vibración estándar de 300ms
        break;
      case "02":
        reproducirVibracion([200, 100, 200]); // vibración de 300ms y luego 200ms
        break;
      case "03":
        reproducirVibracion([200, 100, 200, 100, 200]);
      case "04":
        reproducirVibracion([200, 100, 200, 50, 200, 100, 200]); // 
        break;
      case "05":
        reproducirVibracion([200, 100, 200, 100, 400, 100, 200, 100, 200]); // 
        break;
      case "06":  
        reproducirVibracion([200, 100, 200, 100, 200, 50, 200, 100, 200, 100, 300]); // 
        break;
      default:
        break;
    }
    

  const audio = document.getElementById("tagAudio");
  const archivo = mapaAudio[tag];

  if (archivo && archivo.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/audios_especiales/${archivo}`;
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
