
# Camer Codex v1.0 Vainilla

**Tecnología Secreta para Ilusionistas** 🎩

---

## ¿Qué es Camer Codex?

** Camer Codex ® ** es una aplicación web progresiva (PWA) diseñada para ilusionistas modernos que integran tecnología en sus rutinas. 
La plataforma integra:
- Conexión Bluetooth BLE con hardware dedicado.
- Lectura de tags RFID para disparar acciones escénicas.
- Gestión de acceso por cuenta (Supabase Auth).
- Control de rutinas según nivel de membresía/licencia.

---

## 🔖 Versión

- **Versión base:** `v1.0` (estable)
- **Deployment:** Vercel
- **Modo de uso:** Web + instalación PWA (Android/Chrome)

---

## Funcionalidades principales

- Lectura de tags RFID vía dispositivo BLE.
- Reproducción asociada de audios MP3 por rutina/tag.
- Estado de conexión y diagnóstico BLE integrado.
- Funcionamiento offline una vez instalada como PWA.
- Control de acceso legal/licencia previo al uso.

---

## Autenticación con Supabase

El sistema utiliza **Supabase Auth** para proteger el acceso y administrar sesiones.

### Métodos de acceso

1. **Login con Email + contraseña**
2. **Login con Google (OAuth)**
3. Recuperación y actualización de contraseña (flujo de reset)

### Registro de cuenta

Durante el alta de un nuevo usuario, la plataforma permite:
- **Registro con Email**, o
- **Registro con Google**
En ambos casos, el flujo está vinculado con validaciones de licencia/dispositivo para habilitar correctamente el acceso a las funciones protegidas.

---

## Registro del dispositivo **MrCamerDev1.0 ®**
La cuenta se relaciona con el ecosistema físico del sistema mediante serial/licencia del dispositivo **MrCamerDev1.0 ®**.

Este proceso permite:
- Verificar autenticidad del hardware asociado.
- Vincular el dispositivo a la cuenta del licenciatario.
- Habilitar registro inicial de usuario bajo condiciones de licencia válidas.
---

## Sistema de membresías

La plataforma incorpora un esquema de **membresías** para gestionar el acceso a contenidos y rutinas.

### ¿Cómo funciona?

- Cada rutina puede requerir un nivel mínimo de membresía.
- El nivel activo de la cuenta determina qué módulos se desbloquean.
- El sistema puede informar cuando una rutina requiere una membresía superior.
> Importante: la membresía administra acceso a contenidos, pero **no reemplaza** los términos de la licencia legal del producto.
---

## Legal / Licencia
Antes de utilizar la plataforma, el usuario debe leer y aceptar la sección **Legal / Licencia**.

Puntos clave:
- Uso personal, no exclusivo, intransferible y revocable.
- Protección de propiedad intelectual, método, rutinas y contenidos.
- Restricciones explícitas para copia, ingeniería inversa, difusión no autorizada o cesión a terceros no licenciados.
- Condiciones de confidencialidad y sanciones por incumplimiento.

Documento legal disponible en:
- `legal/licencia.html`
---

## Uso rápido en desarrollo (PC)
1. Clonar o descargar el repositorio.
2. Abrir en VS Code.
3. Ejecutar con **Live Server** (u otro servidor estático).
4. Abrir en Chrome/Edge compatible con Web Bluetooth.
5. Conceder permisos solicitados (BLE/ubicación si aplica).
---

## Uso en Android (PWA)
1. Abrir la URL pública en **Google Chrome**.
2. Instalar desde “Agregar a pantalla principal” o botón de instalación.
3. Iniciar sesión con cuenta válida (Email o Google).
4. Vincular/usar el entorno con licencia y dispositivo registrado.
---

## Autoría

Proyecto creado para el ecosistema artístico-tecnológico de **Mr. Camer**.
Con soporte técnico y evolución funcional para shows profesionales.