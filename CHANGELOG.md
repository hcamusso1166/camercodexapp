
# 📜 CHANGELOG - Camer Codex

Registro de versiones del sistema mágico-tecnológico desarrollado por Mr. Camer.

---
## [1.2.0] - 2025-05-05

### Agregado
- Soporte modular para múltiples rutinas con estructura por archivo (`/rutinas/`).
- Nueva rutina: "Fuera de Este Mundo" completamente funcional con:
  - Conexión BLE autónoma
  - Control de LED (ON/OFF)
  - Lectura de tags RFID con reproducción de audio
  - Visualización de carta en pantalla
  - Consola de mensajes BLE con diagnóstico ocultable
- Panel de diagnóstico BLE reutilizable con estilos en CSS centralizado.
- Botón de "Revisar estado Bluetooth" en cada rutina.

### Cambios
- Se removieron los controles BLE del `index.html`.
- El `index.html` ahora solo funciona como menú de selección de rutinas.
- Se eliminó la dependencia de conexión BLE desde la pantalla principal.
- `main.js` centraliza toda la lógica BLE y es compartido entre rutinas.

### Correcciones
- Se corrigió el error de carga de `cartas.json` en rutas relativas desde rutinas.
- Se solucionó el fallo de ejecución temprana del DOM en `main.js` que impedía ocultar el panel BLE.

## [v1.0] - Línea base PWA funcional - 2025-05-03

### ✨ Añadido
- Conexión con dispositivos BLE (Bluetooth Low Energy)
- Lectura de tags RFID e interpretación por mapeo de audio
- Reproducción de archivos MP3 asociados a cada tag
- Diagnóstico de compatibilidad BLE y permisos del navegador
- Botón para reactivar chequeo manual de compatibilidad
- Soporte completo PWA:
  - `manifest.json` con íconos personalizados
  - `service-worker.js` registrado
  - Instalación en pantalla principal de Android

### ✅ Validado
- Compatible con Chrome Android y PC
- Funcionamiento offline luego de instalación
- Interfaz liviana, sin librerías externas

---

## 📛 Cambio de identidad

- El proyecto deja de llamarse **Ars Camer** y pasa a denominarse **Camer Codex**
- El nuevo nombre unifica el espíritu del ilusionismo con la tecnología
