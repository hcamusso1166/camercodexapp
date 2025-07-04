
# Camer Codex

**Tecnología Secreta para Ilusionistas** 🪄

---

## ¿Qué es Camer Codex?

*Camer Codex* es un sistema mágico-tecnológico diseñado para ilusionistas modernos. Es una aplicación web progresiva (PWA) que permite conectar dispositivos Bluetooth BLE (como lectores RFID) para activar rutinas mágicas, reproducir audios secretos y gestionar acciones ocultas desde un dispositivo móvil o PC.

---

## 📦 Versión Actual

**v1.0 - Vainilla**
Sub versión: **v1.17.0 - Rápido y Numeroso**
---

## 🎭 Rutinas mágicas disponibles (17)

1. **Fuera de Este Mundo**
2. **Un Juego "Pegriloso"**
3. **Memoria de Elefante**
4. **Las Momias de Camer**
5. **The Boss**
6. **Prueba de Fuego**
7. **Imposible de Ver**
8. **El Oráculo de Ébano**
9. **La Mano del Destino**
10. **Hearts & Crafts**
11. **Truco, Carrera y Corazón**
12. **Con los Ojos Vendados**
13. **El Sospechoso de Siempre**
14. **El Coleccionista**
15. **Dado "R"**
16. **Rápido y Numeroso**
25. **Lectura Simple - Continua**

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
  - El espectador elije libremente una carta.
  - Se le plantea un desafìo, una Prueba de Fuego: que vuelva a elegir la misma carta!
  - No lo logra, pero logra llegar a su carta de una manera sorprendente!

  ** Rutina 7: Imposible de Ver**

  ** Rutina 8. El Oráculo de Ébano**
  ** Rutina 9. La Mano del Destino**
  ** Rutina 10. Hearts & Crafts**
  ** Rutina 11. Truco, Carrera y Corazón**
  ** Rutina 12. Con los Ojos Vendados**
  ** Rutina 13. El Sospechoso de Siempre**
  ** Rutina 14. El Coleccionista**
  ** Rutina 15. Dado "R"**
  
  ** Rutina 16. Rápido y Numeroso**
   - El espectador entrega cartas una a una mientras el mago no mira.
   - La app suma automáticamente los valores.
   - Se anuncia el total sin mirar las cartas.
   - El resultado se repite por audio, y todo se reinicia mágicamente.

  ** Rutina 25. Lectura Simple - Continua**

## 🌟 Características principales

- Conexión Bluetooth BLE con lectores externos.
- Lectura de tags RFID con disparo de efectos mágicos.
- Visualización de lecturas en pantalla.
- Reproducción de audios asociados (cartas, colores, acciones).
- Diagnóstico BLE y permisos integrados.
- Indicador gráfico de nivel de batería en tiempo real.
- Control de LED (ON/OFF) desde la interfaz.
- Funciona como PWA en Android y escritorio.
- Soporte offline completo una vez instalada.
- Diseño optimizado para móvil y PC.

---

## 🧪 Tecnologías utilizadas

- HTML5 + JavaScript (Web Bluetooth API)
- CSS puro
- BLE sobre ESP32 con GATT personalizado
- PWA: manifest.json + service worker
- Vercel (hosting)

---
## 🧩 Estructura del proyecto

/index.html              ← Menú principal
/rutinas/                ← 1 HTML por rutina
/js/                     ← main.js, config.js y lógica BLE
/js/rutinas/*.js         ← JS específico por rutina
/css/                    ← Estilos globales
/icons/                  ← SVGs de botones e íconos
/audios/                 ← MP3 por carta
/audios/audios_especiales/ ← Audios para colores, acciones, efectos especiales
/manifest.json           ← Metadata PWA
/service-worker.js       ← Cache y soporte offline
/README.md               ← Este archivo
/CHANGELOG.md            ← Registro de versiones
/BLE-troubleshooting.md  ← Guía técnica de compatibilidad BLE

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
