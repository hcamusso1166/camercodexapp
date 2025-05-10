console.log("Camer Codex - main.js cargado");
// main.js
window.addEventListener('DOMContentLoaded', (event) => {
  // Asignar la versión al footer
  document.getElementById('appVersion').textContent = appVersion;
});

// Registro del Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.js')
    .then(reg => console.log("✅ Service Worker registrado:", reg))
    .catch(err => console.error("❌ Error al registrar SW:", err));
}

// Instalación de la PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

function esAppInstalada() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

function esDispositivoMovil() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (esAppInstalada()) {
  console.log("La PWA ya está instalada. No se muestra el botón.");
  if (installBtn) installBtn.style.display = 'none'; // Ocultar el botón si la PWA ya está instalada
} else {
  window.addEventListener('beforeinstallprompt', (e) => {
    try {
      if (!esDispositivoMovil()) {
        console.warn('🖥️ Entorno de escritorio detectado: el botón de instalación no se mostrará.');
        return;
      }

      e.preventDefault();
      deferredPrompt = e;

      if (installBtn) {
        installBtn.style.display = 'inline-block';
        installBtn.disabled = false;
        console.log("Botón de instalación visible");

        installBtn.addEventListener('click', () => {
          console.log("Botón de instalación presionado");
          installBtn.style.display = 'none';
          deferredPrompt.prompt();

          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('👍 Instalación aceptada');
              installBtn.style.display = 'none';
            } else {
              console.log('👎 Instalación cancelada');
            }
            deferredPrompt = null;
          });
        });
      }
    } catch (error) {
      console.error("Error en la instalación o configuración de PWA:", error);
    }
  });
}

// Manejo de Bluetooth y geolocalización
document.addEventListener("DOMContentLoaded", function () {
  // Estado de Bluetooth
  const bleStatus = document.getElementById("ble-status");
  if (bleStatus) {
    if (!navigator.bluetooth) {
      bleStatus.innerText = "❌ Web Bluetooth NO disponible en este navegador.";
      bleStatus.style.color = "red";
    } else {
      bleStatus.innerText = "✅ Web Bluetooth disponible.";
      bleStatus.style.color = "green";
    }

    // Verificación de permisos de geolocalización
    if (!navigator.geolocation) {
      const locStatus = document.createElement("p");
      locStatus.innerText = "⚠️ API de geolocalización no disponible. Activá ubicación.";
      locStatus.style.color = "orange";
      bleStatus.parentElement.appendChild(locStatus);
    }

    navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
      const locPerm = document.createElement("p");
      if (result.state === 'granted') {
        locPerm.innerText = "✅ Permiso de ubicación otorgado.";
        locPerm.style.color = "green";
      } else if (result.state === 'prompt') {
        locPerm.innerText = "⚠️ Se pedirá permiso de ubicación al usar BLE.";
        locPerm.style.color = "orange";
      } else {
        locPerm.innerText = "❌ Permiso de ubicación denegado. Activalo en Configuración.";
        locPerm.style.color = "red";
      }
      bleStatus.parentElement.appendChild(locPerm);
    }).catch(err => {
      console.log("No se pudo verificar permisos de ubicación:", err);
    });
  }

  // Manejo de eventos del Bluetooth
  const checkBtn = document.getElementById("checkBluetoothBtn");
  const bleMessages = document.getElementById("ble-messages");

  if (bleMessages) {
    bleMessages.classList.add("visible");
    setTimeout(() => {
      bleMessages.classList.remove("visible");
    }, 5000);
  }

  if (checkBtn && bleMessages) {
    checkBtn.addEventListener("click", () => {
      bleMessages.classList.add("visible");
      checkBtn.disabled = true;
      checkBtn.style.cursor = "not-allowed";
  
      setTimeout(() => {
        bleMessages.classList.remove("visible");
        checkBtn.disabled = false;
        checkBtn.style.cursor = "pointer";
      }, 5000);
    });
  }
});

// BLE Device Handling
const connectButton = document.getElementById('connectBleButton');
const disconnectButton = document.getElementById('disconnectBleButton');
const onButton = document.getElementById('onButton');
const offButton = document.getElementById('offButton');
const retrievedValue = document.getElementById('valueContainer');
const latestValueSent = document.getElementById('valueSent');
const bleStateContainer = document.getElementById('bleState');
const timestampContainer = document.getElementById('timestamp');

const deviceName = 'MrCamerDev1.0';
const bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
const ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';
const sensorCharacteristic = '19b10001-e8f2-537e-4f6c-d104768a1214';

let bleServer, bleServiceFound, sensorCharacteristicFound;
let mapaCartas = {};

fetch('../audios/cartas.json')
  .then(res => res.json())
  .then(data => {
    mapaCartas = data;
    console.log("Mapa de cartas cargado correctamente");
  })
  .catch(err => console.error("Error cargando cartas.json", err));

if (connectButton) {
  connectButton.addEventListener('click', (event) => {
    if (isWebBluetoothEnabled()) {
      connectToDevice();
    }
  });
}

if (disconnectButton) {
  disconnectButton.addEventListener('click', disconnectDevice);
}

if (onButton) {
  onButton.addEventListener('click', () => writeOnCharacteristic(1));
}

if (offButton) {
  offButton.addEventListener('click', () => writeOnCharacteristic(0));
}

// Check if BLE is available
function isWebBluetoothEnabled() {
  if (!navigator.bluetooth) {
    console.log('Web Bluetooth API is not available in this browser!');
    bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser/device!";
    return false;
  }
  console.log('Web Bluetooth API supported in this browser.');
  return true;
}
// Función que limpia los TAGs y valores anteriores
function limpiarDatos() {
  // Limpiar valores visuales
  retrievedValue.innerHTML = '';  // Limpia el valor visual del TAG
  latestValueSent.innerHTML = ''; // Limpia el valor enviado
  timestampContainer.innerHTML = ''; // Limpia la fecha y hora
 
  console.log("Datos limpiados");
}
// Connect to BLE Device
function connectToDevice() {
  console.log('Initializing Bluetooth...');
  navigator.bluetooth.requestDevice({
    filters: [{ name: deviceName }],
    optionalServices: [bleService]
  })
    .then(device => {
      console.log('Device Selected:', device.name);
      bleStateContainer.innerHTML = device.name;
      //bleStateContainer.style.color = "#24af37";
      // Limpiar datos antes de la nueva conexión
      limpiarDatos();  // Limpiar TAGs y arrays previos
      device.addEventListener('gattservicedisconnected', onDisconnected);
      return device.gatt.connect();
    })
    .then(gattServer => {
      bleServer = gattServer;
      console.log("Connected to GATT Server");
      return bleServer.getPrimaryService(bleService);
    })
    .then(service => {
      bleServiceFound = service;
      console.log("Service discovered:", service.uuid);
      return service.getCharacteristic(sensorCharacteristic);
    })
    .then(characteristic => {
      console.log("Characteristic discovered:", characteristic.uuid);
      sensorCharacteristicFound = characteristic;
      // Limpiar cualquier valor persistente en la característica antes de empezar
      characteristic.writeValue(new Uint8Array([0])).then(() => {
        console.log("Característica BLE reiniciada.");
      characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicChange);
      characteristic.startNotifications();
      console.log("Notifications Started.");
      bleStateContainer.style.color = "#24af37";
    });
    })

    .catch(error => {
      console.log('Error: ', error);
    });
}

function onDisconnected(event) {
  console.log('Device Disconnected:', event.target.device.name);
  bleStateContainer.innerHTML = "Device disconnected";
  bleStateContainer.style.color = "#d13a30";
  connectToDevice();
}

// Handle characteristic value changes
function handleCharacteristicChange(event) {
  
  const valor = new TextDecoder().decode(event.target.value).trim();
  console.log("Characteristic value changed: ", valor);
  retrievedValue.innerHTML = valor[0] + valor[1];
  timestampContainer.innerHTML = getDateTime();
  const mvalor = valor[0] + valor[1];
  // reproducirAudioParaTag(mvalor);
  //Validar si estamos en fuera-de-este-mundo.html antes de llamar a la función de reproducir el TAG
  if (window.location.pathname.includes("fuera-de-este-mundo.html")) {
    console.log("Estamos en fuera-de-este-mundo.html");
    console.log("Tag:", mvalor);
    reproducirAudioParaTag(mvalor);
  }

  // Validar si estamos en elefantes.html antes de llamar a la función de guardar el TAG
  if (window.location.pathname.includes("elefantes.html")) {
    guardarTagEnRutinaElefante(mvalor);
  }
  // Validar si estamos en momias.html antes de llamar a la función de reproducir  el TAG
  if (window.location.pathname.includes("momias.html")) {
    console.log("Estamos en momias.html");
    console.log("Tag:", mvalor);
    reproducirAudioTagEnRutinaMomias(mvalor);
  }
}


function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartas[tag];

  if (archivo && archivo.trim() !== "") {
    console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/${archivo}`;
    audio.play().then(() => {
      console.log(`Reproduciendo: ${archivo}`);
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

// Función para comunicar el TAG a elefante.js
function guardarTagEnRutinaElefante(tag) {
  if (typeof guardarTag === 'function') {
    guardarTag(tag);  // Llamamos a la función definida en elefante.js
  }
}
// Función para comunicar el TAG a elefante.js
function reproducirAudioTagEnRutinaMomias(tag) {
  console.log("Tag recibido en momias.js:", tag);
  if (typeof reproducirColor === 'function') {
    console.log("Llamando a la función reproducircolores en momias.js");
    reproducirColor(tag);  // Llamamos a la función definida en momias.js
  }
}
// Función para escribir en la característica del LED
// Esta función se llama desde los botones de encendido y apagado
function writeOnCharacteristic(value) {
  if (bleServer && bleServer.connected) {
    bleServiceFound.getCharacteristic(ledCharacteristic)
      .then(characteristic => {
        console.log("Found the LED characteristic: ", characteristic.uuid);
        const data = new Uint8Array([value]);
        return characteristic.writeValue(data);
      })
      .then(() => {
        latestValueSent.innerHTML = value;
        console.log("Value written to LEDcharacteristic:", value);
      })
      .catch(error => {
        console.error("Error writing to the LED characteristic: ", error);
      });
  } else {
    console.error("Bluetooth is not connected. Cannot write to characteristic.");
    window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!");
  }
}

function disconnectDevice() {
  console.log("Disconnect Device.");
  if (bleServer && bleServer.connected) {
    if (sensorCharacteristicFound) {
      sensorCharacteristicFound.stopNotifications()
        .then(() => {
          console.log("Notifications Stopped");
          return bleServer.disconnect();
        })
        .then(() => {
          console.log("Device Disconnected");
          bleStateContainer.innerHTML = "Device Disconnected";
          bleStateContainer.style.color = "#d13a30";
        })
        .catch(error => {
          console.log("An error occurred:", error);
        });
    } else {
      console.log("No characteristic found to disconnect.");
    }
  } else {
    console.error("Bluetooth is not connected.");
    window.alert("Bluetooth is not connected.");
  }
}

function getDateTime() {
  const currentdate = new Date();
  const day = ("00" + currentdate.getDate()).slice(-2);
  const month = ("00" + (currentdate.getMonth() + 1)).slice(-2);
  const year = currentdate.getFullYear();
  const hours = ("00" + currentdate.getHours()).slice(-2);
  const minutes = ("00" + currentdate.getMinutes()).slice(-2);
  const seconds = ("00" + currentdate.getSeconds()).slice(-2);

  return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
}
// Fin del script
