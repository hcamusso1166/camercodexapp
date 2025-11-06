# Camer Codex

**Tecnología Secreta para Ilusionistas** 🪄

---

## ¿Qué es Camer Codex?

*Camer Codex* es un sistema mágico-tecnológico diseñado para ilusionistas modernos.  
Combina microcontroladores ESP32 con comunicación **BLE** y **ESP-NOW**, lectores **RFID** y una **PWA** progresiva capaz de reproducir audios, registrar lecturas y orquestar rutinas mágicas en tiempo real.

---

## 📦 Versión Actual

**v1.0 – Vainilla**  
Subversión: **v1.20.0 – CamerPacket v1 Integration**

---

## ⚙️ Nuevo módulo de comunicación: *CamerPacket v1*

Desde esta versión, **todo el ecosistema (Sender + Receiver + PWA)** utiliza un formato de paquete unificado:  

### 🎫 Estructura del paquete (CamerPacket v1)

| Offset | Tamaño | Campo | Tipo | Descripción |
|:--:|:--:|:--:|:--:|:--|
| 0 | 1 | version | uint8 | Versión de protocolo (0x01) |
| 1 | 1 | eventType | uint8 | Evento (0x00=new, 0x01=repeat, 0x02=removed, 0x03=error) |
| 2 | 1 | antennaId | uint8 | ID de antena (1 .. 5) |
| 3 | 4 | card | char[4] | Código ASCII de la carta/tag |
| 7 | 1 | flags | uint8 | Bits de estado |
| 8 | 2 | seq | uint16 | Número de secuencia (big-endian) |

**Total:** 10 bytes  

### 🧩 Ventajas

- Protocolo único BLE + NOW.  
- Tamaño compacto (10 bytes).  
- Incluye versión, evento, antena, flags y secuencia.  
- Compatible con rutinas previas: `mvalor`, `color`, `dorso` siguen intactos.  

---

## 🔧 Componentes actualizados

### 🛰️ MrCamerDev_QSender_OLED_BLE v1.0-multi5
- Soporte para 5 antenas RFID independientes.  
- Envío simultáneo por **ESP-NOW** y **BLE**.  
- Banner de versión automático con macros de compilación.  
- LED integrado (GPIO 2 en NodeMCU ESP-32 S).  
- Transmite CamerPacket v1 (10 bytes).  

### 📡 MrCamerDev_QReceiver_CamerPacket_v1
- Interpreta CamerPacket v1 por ESP-NOW.  
- Muestra hasta 5 cartas en OLED 128×32 con render incremental.  
- Mantiene compatibilidad con rutinas existentes.  
- Log serial detallado (V, EVT, ANT, CARD, SEQ).  

### 📱 PWA / main.js
- Nueva función `handleCharacteristicChange()` compatible CamerPacket v1.  
- Extrae `carta[0..3]` → `valor`, `mvalor`, `color`, `dorso`.  
- Variables globales para metadatos:
  ```js
  camerVersion, camerEventType, camerAntennaId, camerFlags, camerSeq
  ```
- Rutinas sin modificaciones: todas continúan operativas.  
- Soporte de retro-compatibilidad con payload texto antiguo.  


## 🌟 Características principales

- Comunicación bidireccional ESP-NOW + BLE.  
- Lectura de tags RFID multiantena.  
- Reproducción de audios asociados a cartas o colores.  
- Visualización OLED y diagnóstico BLE.  
- Instalación PWA (Android / PC) y funcionamiento offline.  

---

## 🧪 Tecnologías utilizadas

- **ESP32 (NodeMCU ESP-32 S)** + ESP-IDF 3.3.2  
- **HTML5 + JavaScript (Web Bluetooth API)**  
- **CSS + PWA (manifest + service worker)**  
- **Vercel Hosting**

---

## 🧩 Estructura de proyecto (Camer Codex)

```
/index.html                 ← Menú principal
/js/main.js                 ← Lógica BLE y CamerPacket v1
/js/rutinas/*.js            ← Rutinas individuales
/stable/                    ← Firmware ESP32 validados
/dev/                       ← Versiones experimentales CamerPacket
/css/                       ← Estilos globales
/icons/                      ← Recursos visuales
/audios/                    ← MP3 por carta y efectos
/README.md                  ← Este archivo
```

---

## 🪄 Autor

*Camer Codex* es el sistema mágico-tecnológico creado por **Mr. Camer**.  
Asistencia conceptual y desarrollo técnico por **Coperfil** (IA mágica).

---

## 📝 Licencia

Uso exclusivo para espectáculos y desarrollo privado.  
Requiere autorización expresa del autor para ser modificado o distribuido.



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
17. **Voluntad Prestada**
18. **TEG Mágico**
19. **Me viste la Cara**
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


## 📝 Licencia

Uso exclusivo para espectáculos y desarrollo privado.  
Requiere autorización expresa del autor para ser modificado o distribuido.
