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
  const audio = document.getElementById("tagAudio");
  const archivo = mapaAudio[tag];

  // Mapear patrones de vibración por tag
  const patrones = {
    "01": [300],
    "02": [200, 100, 200],
    "03": [200, 100, 200, 100, 200],
    "04": [200, 100, 200, 200, 200, 100, 200],
    "05": [200, 100, 200, 100, 400, 100, 200, 100, 200],
    "06": [800]
  };

  const patron = patrones[tag] || [];
  const duracionVibracion = patron.reduce((acc, val) => acc + val, 0); // suma total en ms

  if (patron.length > 0) {
    reproducirVibracion(patron);
  }

  if (archivo && archivo.trim() !== "") {
    // Esperar a que termine la vibración antes de reproducir el audio
    setTimeout(() => {
      audio.src = `../audios/audios_especiales/${archivo}`;
      audio.play().then(() => {
        console.log(`🔊 Reproduciendo: ${archivo} después de vibrar ${duracionVibracion}ms`);
      }).catch(err => {
        console.error("❌ No se pudo reproducir el audio:", err);
      });
    }, duracionVibracion + 50); // +50 ms de colchón para evitar solapamiento
  } else {
    console.warn(`⚠️ No se encontró archivo de audio para: ${tag}`);
    audio.removeAttribute('src');
    audio.load();
  }
}
