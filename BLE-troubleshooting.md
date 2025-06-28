# 📶 BLE Troubleshooting - Camer Codex

Este documento resume las mejores prácticas y soluciones aplicadas en el proyecto *Camer Codex* para garantizar la compatibilidad completa de Bluetooth Low Energy (BLE) entre escritorio y dispositivos móviles (Android, PWA, etc).

---

## 🧩 Problema detectado

La característica BLE `batteryCharacteristic` funcionaba correctamente en PC (Chrome desktop), pero **fallaba en dispositivos móviles** (Chrome Android, WebView, PWA) al ejecutar:

```js
batteryChar.startNotifications()
```

Error recibido en consola móvil:

```
❌ NotSupportedError: GATT operation failed for unknown reason.
```

---

## ✅ Diagnóstico

El código del firmware definía correctamente la característica con:

```cpp
BLECharacteristic batteryCharacteristic(
  "9b04030c-2f33-42b2-9fc5-a97a44a1145d",
  BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ
);
batteryCharacteristic.addDescriptor(new BLE2902());
```

Pero en dispositivos móviles, **la suscripción (`startNotifications()`) a veces falla si se realiza demasiado rápido**, antes de que la pila BLE haya terminado de registrar los descriptores y propiedades.

---

## 🛠 Solución aplicada

### 1. Agregar valor inicial en el firmware

```cpp
uint8_t nivelInicial = 85;
batteryCharacteristic.setValue(&nivelInicial, 1);
```

### 2. Retardo en el cliente Web para suscribirse correctamente

```js
setTimeout(() => {
  batteryChar.startNotifications().then(() => {
    console.log("🔔 Notificaciones de batería iniciadas");
  }).catch(err => {
    console.warn("❌ Error al iniciar notificaciones de batería:", err);
  });
}, 150); // delay de 150 ms
```

Este retardo asegura que el sistema móvil haya registrado completamente la característica y el descriptor CCCD antes de permitir `startNotifications()`.

---

## 📌 Recomendaciones generales

- Siempre agregar `BLE2902` si se usa `NOTIFY`.
- Inicializar valores con `setValue()` en el firmware antes de publicar el servicio.
- En Web Bluetooth, usar `setTimeout(..., 100~200)` antes de `startNotifications()` cuando se detectan fallos intermitentes en móviles.
- Testear siempre en **PC y móvil**, ya que el comportamiento del stack GATT varía.

---

## 🧙‍♂️ Comentario final

Este comportamiento se observó específicamente al implementar la rutina de visualización de nivel de batería en **Camer Codex**, y puede aplicarse como solución genérica a futuras características BLE que requieran `startNotifications()`.

¡Seguimos optimizando magia y tecnología!

---