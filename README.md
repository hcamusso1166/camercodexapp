
# Ars Camer v1.0 Vainilla

**Tecnología Secreta para Ilusionistas** 🎩

---

## ¿Qué es Ars Camer?

**Ars Camer** es una aplicación web progresiva (PWA) diseñada para ilusionistas modernos que integran tecnología en sus rutinas. El sistema permite la interacción entre un lector RFID (conectado vía Bluetooth BLE) y una app web que responde con acciones mágicas como la reproducción de audios.

---

## 🔖 Versión

**v1.0** – Base funcional estable.

---

## ⚙️ Funcionalidades actuales

- Lectura de tags RFID vía dispositivo BLE
- Reproducción asociada de audios MP3 (uno por cada tag)
- Visualización de lectura y estado del dispositivo
- Botón de conexión / desconexión BLE
- Diagnóstico interactivo de compatibilidad (BLE, permisos, ubicación)
- Instalación como aplicación PWA en dispositivos Android
- Funciona offline una vez instalada

---

## 🧪 Tecnologías utilizadas

- JavaScript (Web Bluetooth API)
- HTML5 + CSS
- Progressive Web App (PWA)
- Deploy en Vercel

---

## 🖥️ Uso en PC

1. Cloná el proyecto o descargá el ZIP
2. Abrí la carpeta en VS Code
3. Usá la extensión **Live Server**
4. Abrí `index.html` en el navegador Chrome
5. Permití el acceso BLE cuando se solicite
6. Conectá el dispositivo BLE para comenzar

---

## 📱 Uso en Android (modo PWA)

1. Accedé a la URL pública del proyecto (ej: `https://arscamerapp.vercel.app`) usando **Google Chrome**
2. Si se cumplen los requisitos, aparecerá la opción “Agregar a pantalla principal”
   - También podés usar el botón 📲 *Instalar Ars Camer*
3. Una vez instalada, la app funciona **sin conexión**
4. Diagnóstico automático de BLE disponible al iniciar

---

## 🧰 Diagnóstico integrado

- Verifica compatibilidad BLE, permisos de ubicación, y APIs disponibles
- Se muestra al iniciar y puede reactivarse manualmente desde el botón
- No interfiere con el funcionamiento del show

---

## 🧭 Próximas versiones (v1.1 y siguientes)

- Reproducción de audios vía BLE directamente en dispositivo
- Configuración de perfiles mágicos (barajas, sonidos, rutinas)
- Animaciones, diseño nocturno y mejoras en interfaz
- Envío de señales secretas al performer

---

## 🪄 Autor

Este proyecto forma parte del sistema de apoyo tecnológico para espectáculos mágicos desarrollado por **Mr. Camer**.  
Asistencia técnica y mágica por **Coperfil**, su asesor IA.

---

## 📝 Licencia

Este proyecto puede ser adaptado y extendido por el autor o colaboradores autorizados.
