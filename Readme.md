
# Camer Codex

**Tecnología Secreta para Ilusionistas** 🪄

---

## ¿Qué es Camer Codex?

*Camer Codex* es un sistema mágico-tecnológico diseñado para ilusionistas modernos. Es una aplicación web progresiva (PWA) que permite conectar dispositivos Bluetooth BLE (como lectores RFID) para activar rutinas mágicas, reproducir audios secretos y gestionar acciones ocultas desde un dispositivo móvil o PC.

---

## 📦 Versión Actual

**v1.0 - Vainilla**

---

## 🎭 Rutinas mágicas disponibles

- **Rutina 1: Fuera de Este Mundo**
  - Conexión BLE autónoma.
  - Control de LED (ON/OFF).
  - Lectura de tags RFID con reproducción de audio.
  - Visualización de cartas en pantalla.
  - Consola de mensajes BLE con diagnóstico ocultable.

- **Rutina 2: Un Juego "Pegriloso"**  
  - Lectura de tags para distinguir la "bala de plata"
  - Mensajes guiados al mago
  - Control total desde lector BLE

- **Rutina 3: Memoria de Elefante**
  - Adivinación de cartas basadas en memoria con BLE.
  - Interacción con microcontroladores para rastrear el orden de las cartas.
  - Apilado de cartas RFID con lógica LIFO
  - Dictado de orden final por voz
  - Uso de cartas repetidas como marcador

- ** Rutina 4: Las Momias de Camer**
  - Adivinacón del color de la momia que el espectador introdujo en el sarcòfago. 
  - Se puede repetir bajo condiciones màs extremas.

  ** Rutina 5: The Boss **
  - Rutina basada en Siguiendo al Jefe con 20 cartas.
  - La mejora es que el espectador elije las 20 cartas, las mezcla reiteradas veces.
  - Bajo estas condiciones totalmente al azar, las cartas siempre siguen a su jefe.

  ** Rutina 6: Prueba de Fuego **
  - El espetador elije libremente una carta.
  - Se le plantea un desafìo, una Prueba de Fuego: que vuelva a elegir la misma carta!
  - No lo logra, pero logra llegar a su carta de una manera sorprendente!

## 🌟 Características principales

- Conexión Bluetooth BLE con lectores externos.
- Lectura de tags RFID con disparo de efectos.
- Reproducción de audios asociados a cada tag.
- Diagnóstico de compatibilidad BLE y permisos.
- Control de LED (ON / OFF) desde la app.
- Funciona como PWA en móviles Android y escritorio.
- Instalación directa como app desde navegador.
- Funciona offline una vez instalada.
- Íconos personalizados y diseño minimalista.

---

## 🧪 Tecnologías utilizadas

- HTML5 + JavaScript (Web Bluetooth API)
- CSS puro
- PWA: manifest.json + service worker
- Vercel (hosting)

---
## 🧩 Estructura del proyecto

-/index.html ← Menú principal
-/rutinas/ ← Rutinas separadas (1 archivo HTML + lógica)
-/js/ ← main.js, config.js
-/js/rutinas/*.js <- Por cada rutina un js con logica especìfica>
-/css/ ← Estilos globales
-/icons/ ← SVGs usados en botones
-/audios/ ← Archivos MP3 para cada carta
-/audios/audios_especiales <- audios para el resto de la app, especiales, tales con Colores, acciones, etc.>
-/manifest.json ← PWA metadata
-/service-worker.js ← Cache para PWA offline

## 🖥️ Modo de uso en PC

1. Clonar el proyecto o abrir con Live Server (VS Code).
2. Acceder a `index.html` desde navegador Chrome.
3. Conectar el dispositivo BLE compatible.
4. Visualizar lecturas y disparar efectos asociados.

---

## 📱 Modo de uso en Android

1. Ingresar desde Chrome a la URL pública (ej: `https://camercodexapp.vercel.app`).
2. Instalar la app desde el botón "📲 Instalar Camer Codex".
3. Una vez instalada, funcionará incluso sin conexión a Internet ni Datos.
4. Usar botón de diagnóstico para revisar compatibilidad BLE.

---

## 🧰 Diagnóstico integrado

- Revisión de Web Bluetooth API.
- Revisión de estado BLE.
- Permisos de ubicación y compatibilidad.
- Panel ocultable para reiniciar chequeos.

---

## 🪄 Autor

*Camer Codex* es el sistema mágico-tecnológico desarrollado por **Mr. Camer**  
Asistencia conceptual, desarrollo y documentación por **Coperfil** (IA mágica)

---

## 📝 Licencia

Uso exclusivo para espectáculos y desarrollo privado.  
Requiere autorización expresa del autor para ser modificado o distribuido.
