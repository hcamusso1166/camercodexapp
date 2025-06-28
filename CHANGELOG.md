
# 📜 CHANGELOG - Camer Codex

Registro de versiones del sistema mágico-tecnológico desarrollado por Mr. Camer.

---
## 📦 Versión Actual

**v1.0 - Vainilla**
## [1.4.0] - 2025-06-27

### Añadido
- Visualización del estado de batería con íconos adaptativos.
- Integración completa de la característica BLE `batteryCharacteristic`.
- Soporte de lectura de batería en PC y móviles (Android).
- Diagnóstico `BLE-troubleshooting.md` agregado para documentación técnica.

### Mejorado
- Compatibilidad BLE móvil mejorada con retardo de 150ms antes de `startNotifications()` para características con descriptor CCCD.
- Mejor manejo de errores al conectar características opcionales.

### Corregido
- Problema donde el valor de batería no se mostraba en móviles por falta de sincronización BLE.
- Eliminación de dobles `then()` en `connectToDevice()` para evitar errores en la conexión BLE.

---
## [1.3.0] - 2025-05-14

### Añadido
- Rutina "Un juego 'Pegriloso'" (Ver rutina en README.md)
- Tarjeta de acciones para el Mago. Le indican al mago las acciones que debe ejecutar.

### Correcciones
- Estilos inline eliminados y trasladados a `style.css`.
- Organización del código modular y escalable para futuras 25 rutinas.
- `index.html` reducido a menú puro de selección de rutinas.


## [1.3.0] - 2025-05-10

### Añadido
- Rutina **"Memoria de Elefante"** añadida:
  - Adivinación de cartas basada en memoria y dispositivos BLE.
  - Interacción con microcontroladores para rastrear el orden de las cartas.

- Integración BLE completa para las rutinas **"Fuera de Este Mundo"** y **"Memoria de Elefante"**.

- **Funcionalidad PWA**: La app ahora se puede instalar como PWA en dispositivos móviles.

### Mejorado
- Estilo y funcionalidad de botones para que tengan tamaños consistentes.
- Mensajes BLE ahora no desacomodan el layout.
- Añadido borde gris tenue al mensaje BLE, sin sombra.
- Optimización de la interacción con el dispositivo BLE para mayor fluidez.

### Corregido
- **`installBtn`** ahora aparece solo en móviles, y se muestra y habilita correctamente para la instalación de la PWA.
- **Consola de depuración** mejorada para el manejo de BLE y la instalación PWA.

## [1.2.0] - 2025-05-05

### Añadido
- Rutina **"Fuera de Este Mundo"** implementada, usando tecnología BLE para predecir cartas seleccionadas por el espectador.
- Introducción de **versionado dinámico** en el footer, para actualizar la versión automáticamente en todos los archivos HTML.

### Mejorado
- Mejoras en la interfaz gráfica: transición suave de mensajes BLE, ajustes en la visibilidad de los botones.
- Implementación de **`service-worker.js`** para mejorar la performance y la instalación de la PWA.

## [1.1.0] - 2025-04-25

### Añadido
- Primer lanzamiento con la estructura básica de las rutinas mágicas y su integración BLE.
