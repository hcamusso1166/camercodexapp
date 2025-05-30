console.log("Camer Codex - main.js cargado");
function actualizarIconoConexionBLE(estado) {
  const icon = document.getElementById('estadoConexionBLE');
  if (!icon) {
    console.warn("No se encontró el ícono de conexión BLE.");
    return;
  }

  const iconMap = {
    conectado: "../icons/bluetooth_connected_16_D9D9D9.svg",
    desconectado: "../icons/bluetooth_disabled_16_D9D9D9.svg"
  };

  const src = iconMap[estado] || iconMap.desconectado;
  icon.src = src;
  icon.alt = estado === "conectado" ? "Dispositivo conectado" : "Dispositivo no conectado";
  icon.title = icon.alt;
}

window.addEventListener("DOMContentLoaded", function () {
document.getElementById('appVersion').textContent = appVersion;
actualizarIconoConexionBLE("desconectado");

  const connectButton = document.getElementById('connectBleButton');
  const disconnectButton = document.getElementById('disconnectBleButton');
  const onButton = document.getElementById('onButton');
  const offButton = document.getElementById('offButton');
  const checkBtn = document.getElementById("checkBluetoothBtn");
  const bleMessages = document.getElementById("ble-messages");

  // ✅ Al iniciar la rutina, actualizar el icono del Estado BLE
  const estadoBLEIcon = document.getElementById('estadoBLEIcon');
  // 🔍 Si no está disponible Web Bluetooth, mostrar bloqueo directamente
if (estadoBLEIcon && !navigator.bluetooth) {
  console.log("Web Bluetooth NO disponible");
  actualizarIconoEstadoBLE("warning");
}
// si está disponible, verificar el estado de los mensajes
if (estadoBLEIcon && navigator.bluetooth) {
  console.log("Web Bluetooth disponible");
  actualizarIconoEstadoBLE("ok");
}
  if (estadoBLEIcon && bleMessages) {
    const okVisible = bleMessages.querySelector(".ble-ok")?.offsetParent !== null;
    const warningVisible = bleMessages.querySelector(".ble-warning")?.offsetParent !== null;
    if (okVisible) {
      console.log("okVisible");
    } else if (warningVisible) {
      console.log("warningVisible");
      actualizarIconoEstadoBLE("warning");
    } else {
      console.log("Ninguno visible");

    }
  }
 
  // Asegurate de que estas líneas estén aquí adentro también

  if (connectButton) {
    connectButton.addEventListener('click', () => {
      if (isWebBluetoothEnabled()) {
        connectToDevice();
      }
    });
  }
// Estado de Bluetooth
  const bleStatus = document.getElementById("ble-status");
  if (bleStatus) {
    if (!navigator.bluetooth) {
      bleStatus.innerText = "❌ Web Bluetooth NO disponible en este navegador.";
      bleStatus.style.color = "red";
    } else {
      console.log("Web Bluetooth API soportada en este navegador.");
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

  if (disconnectButton) {
    disconnectButton.addEventListener('click', disconnectDevice);
  }

  if (onButton) {
    onButton.addEventListener('click', () => writeOnCharacteristic(1));
  }

  if (offButton) {
    offButton.addEventListener('click', () => writeOnCharacteristic(0));
  }

  if (checkBtn && bleMessages) {
    checkBtn.addEventListener("click", () => {
      bleMessages.classList.add("visible");
      checkBtn.disabled = true;
      checkBtn.style.cursor = "not-allowed";

      const okVisible = bleMessages.querySelector(".ble-ok")?.offsetParent !== null;
      

      if (okVisible) {
        actualizarIconoEstadoBLE("ok");
      } else {
        console.log("warningVisible");
        actualizarIconoEstadoBLE("warning");
      }

      setTimeout(() => {
        bleMessages.classList.remove("visible");
        checkBtn.disabled = false;
        checkBtn.style.cursor = "pointer";
      }, 5000);
    });
  }
  if (bleMessages) {
    bleMessages.classList.add("visible");
    setTimeout(() => {
      bleMessages.classList.remove("visible");
    }, 5000);
  }
  function actualizarIconoEstadoBLE(estado) {
  const icon = document.getElementById('estadoBLEIcon');
  if (!icon) return;

  const iconMap = {
    ok: "../icons/check_circle_16_D9D9D9.svg",
    warning: "../icons/block_16_D9D9D9.svg"
  };

  const src = iconMap[estado] || iconMap.warning;
  icon.src = src;
  icon.alt = estado === "ok" ? "BLE disponible" : "BLE no disponible";
  icon.title = icon.alt;
}


// Check if BLE is available
function isWebBluetoothEnabled() {
  if (!navigator.bluetooth) {
    //('Web Bluetooth API is not available in this browser!');
    bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser/device!";
    return false;
  }
  console.log('Web Bluetooth API supported in this browser.');
  return true;
}

  // ...todo lo demás que dependa del DOM...
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
  //console.log("La PWA ya está instalada. No se muestra el botón.");
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
        //console.log("Botón de instalación visible");

        installBtn.addEventListener('click', () => {
          //console.log("Botón de instalación presionado");
          installBtn.style.display = 'none';
          deferredPrompt.prompt();

          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              //console.log('👍 Instalación aceptada');
              installBtn.style.display = 'none';
            } else {
              //console.log('👎 Instalación cancelada');
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
const menuToggle = document.getElementById('menuToggle'); // icono 3 puntos
const menuDropdown = document.getElementById('menuDropdown');
const popupModal = document.getElementById('popupModal');
const popupBody = document.getElementById('popupBody');
const popupCloseBtn = document.getElementById('popupCloseBtn');
const estadoBLEbtn = document.getElementById("verEstadoBLE");
menuDropdown.addEventListener('click', (e) => {
  if (e.target.matches('a[data-popup]')) {
    e.preventDefault();
    const popupId = e.target.getAttribute('data-popup');
    abrirPopup(popupId);
  }
});


async function abrirPopup(popupId) {
  try {
    const response = await fetch(`../info/${popupId}.html`);
    if (!response.ok) throw new Error("No se pudo cargar el contenido");
    
    const text = await response.text();
    
    // Parsear el HTML para extraer solo el contenido dentro de <main>
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const mainElement = doc.querySelector("main");

    if (!mainElement) {
      throw new Error("No se encontró contenido principal <main> en el archivo.");
    }

    popupBody.innerHTML = mainElement.innerHTML;
    menuDropdown.classList.add('hidden');
    popupModal.classList.remove("hidden");

    // Cargar el script solo para estadoBLE y solo una vez
    // En abrirPopup, tras insertar el contenido y agregar el script:
if (popupId === "estadoBLE") {
  if (!document.getElementById("estadoBLE-check-script")) {
    const script = document.createElement("script");
    script.id = "estadoBLE-check-script";
    script.src = "../js/info/estadoBLE-check.js";
    script.onload = () => {
      if (typeof initEstadoBLE === "function") {
        initEstadoBLE();
      }
    };
    document.body.appendChild(script);
  } else {
    // Si ya está cargado, sólo llamar a initEstadoBLE
    if (typeof initEstadoBLE === "function") {
      initEstadoBLE();
    }
  }
}

  } catch (error) {
    popupBody.innerHTML = `<p>Error cargando contenido: ${error.message}</p>`;
    popupModal.classList.remove("hidden");
  }

}

popupCloseBtn.addEventListener('click', () => {
  popupModal.classList.add('hidden');
  popupBody.innerHTML = '';          // Limpiar contenido del popup
  menuDropdown.classList.add('hidden');  // Cerrar menú
});



// BLE Device Handling

const retrievedValue = document.getElementById('valueContainer');
const latestValueSent = document.getElementById('valueSent');
const bleStateContainer = document.getElementById('bleState');
const accionMagoMensaje = document.getElementById('accionMagoMensaje');

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

// Función que limpia los TAGs y valores anteriores
function limpiarDatos() {
  if (retrievedValue) retrievedValue.innerHTML = '';
  if (latestValueSent) latestValueSent.innerHTML = '';
  if (timestampContainer) timestampContainer.innerHTML = '';
  console.log("Datos limpiados");
}

// Manejo de las acciones que se deben realizar
function actualizarAccion(accion) {
  const accionMagoMensaje = document.getElementById('accionMagoMensaje');
  if (accionMagoMensaje) {
    accionMagoMensaje.textContent = accion;  // Actualiza el mensaje de la acción
  }
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
      //limpiarDatos();  // Limpiar TAGs y arrays previos
      device.addEventListener('gattserverdisconnected', onDisconnected);
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
      actualizarIconoConexionBLE("conectado");

      bleStateContainer.style.color = "#24af37";
      limpiarDatos();  // Limpiar TAGs y arrays previos
      // Actualizamos la acción a "Leer carta"
      actualizarAccion("Leer carta");

      if (window.location.pathname.includes("pegriloso.html")) {    
          actualizarAccion("Registrar Bala de Plata");
      }
      if (window.location.pathname.includes("elefantes.html")) {    
          actualizarAccion("Leer carta y REPETIR la lectura de la última carta");
      }
      if (window.location.pathname.includes("momias.html")) {    
          actualizarAccion("Acercar Sarcófago para descubrir el color");
      }
    });
    })

    .catch(error => {
      console.log('Error: ', error);
    });
}

function onDisconnected(event) {
  console.log('Device Disconnected.');
  bleStateContainer.innerHTML = "Device disconnected";
  bleStateContainer.style.color = "#d13a30";
  actualizarIconoConexionBLE("desconectado");
  actualizarAccion("Conectar el dispositivo BLE");
}

function handleCharacteristicChange(event) {
  const valor = new TextDecoder().decode(event.target.value).trim();
  const mvalor = valor[0] + valor[1];
  const color = valor[2];
  const path = window.location.pathname;

  const accionesPorRuta = [
    { match: "fueraDeEsteMundo.html",     accion: () => reproducirAudioColor(color) },
    { match: "elefantes.html",            accion: () => guardarTag(mvalor) },
    { match: "momias.html",               accion: () => reproducirColor(mvalor) },
    { match: "pegriloso.html",            accion: () => guardarTagPegriloso(mvalor) },
    { match: "theboss.html",              accion: () => guardarTagTheBoss(mvalor) },
    { match: "pruebaDeFuego.html",        accion: () => guardarTagPruebaDeFuego(mvalor) },
    { match: "imposibleDeVer.html",       accion: () => reproducirAudioParaTag(mvalor) },
    { match: "oraculo.html",              accion: () => reproducirAudioParaTag(mvalor) },
    { match: "manoPoker.html",            accion: () => evaluarManoPoker(mvalor) },
    { match: "heartsAndCrafts.html",      accion: () => reproducirAudioParaTag(mvalor) },   
    { match: "trucoCarreraCorazon.html",  accion: () => reproducirAudioParaTag(mvalor) },
    
  ];

  for (const entrada of accionesPorRuta) {
    if (path.includes(entrada.match)) {
      entrada.accion();
      break; // solo una acción por rutina
    }
  }

  retrievedValue.innerHTML = mvalor;
  timestampContainer.innerHTML = getDateTime();
}



function reproducirAudioParaTag(tag) {
  const audio = document.getElementById("tagAudio");
  const archivo = mapaCartas[tag];

  if (archivo && archivo.trim() !== "") {
    //console.log("Tag:", tag, "→ Archivo:", archivo);
    audio.src = `../audios/${archivo}`;
    audio.play().then(() => {
      //console.log(`Reproduciendo: ${archivo}`);
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
//Reproducir audios especiales
function reproducirAudio(nombreArchivo) {
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
}

// Función para escribir en la característica del LED. Esta función se llama desde los botones de encendido y apagado
function writeOnCharacteristic(value) {
  if (bleServer && bleServer.connected) {
    bleServiceFound.getCharacteristic(ledCharacteristic)
      .then(characteristic => {
        //console.log("Found the LED characteristic: ", characteristic.uuid);
        const data = new Uint8Array([value]);
        return characteristic.writeValue(data);
      })
      .then(() => {
        if (latestValueSent) latestValueSent.innerHTML = value;

        console.log("Value written to LEDcharacteristic:", value);
      })
      .catch(error => {
        console.error("Error writing to the LED characteristic: ", error);
      });
  } else {
    //console.error("Bluetooth is not connected. Cannot write to characteristic.");
    window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!");
  }
}

function disconnectDevice() {
  //console.log("Disconnect Device.");
  if (bleServer && bleServer.connected) {
    if (sensorCharacteristicFound) {
      sensorCharacteristicFound.stopNotifications()
        .then(() => {
          //console.log("Notifications Stopped");
          return bleServer.disconnect();
        })
        .then(() => {
          //console.log("Device Disconnected");
          bleStateContainer.innerHTML = "Device Disconnected";
          bleStateContainer.style.color = "#d13a30";
          if (accionMagoMensaje) {
            accionMagoMensaje.textContent = "Conectar el dispositivo BLE";
          }

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

    document.addEventListener("DOMContentLoaded", () => {


      if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation(); // evitar que el click burbujee y cierre el menú
          menuDropdown.classList.toggle('hidden');
        });
      }

      if (estadoBLEbtn) {
        estadoBLEbtn.addEventListener("click", () => {
          const bleMessages = document.getElementById("ble-messages");
          if (bleMessages) {
            bleMessages.classList.add("visible");
            setTimeout(() => {
              bleMessages.classList.remove("visible");
            }, 5000);
          }
          menuDropdown.classList.add("hidden");
        });
             
      }
    }
    
    
);
document.addEventListener('click', (e) => {
  const target = e.target;

  // Si el click NO es dentro del menú ni sobre el icono, cerrar menú
  if (!menuDropdown.contains(target) && target !== menuToggle) {
    menuDropdown.classList.add('hidden');
  }
});
// Paginación de rutinas

let currentPage = 1;
const routinesPerPage = 10; // Limitar a 10 rutinas por página
const totalRoutines = 20; // Aquí debes colocar el número total de rutinas

// Mostrar rutinas según la página actual
function displayRoutines() {
  // Aquí deberías implementar la lógica para cargar las rutinas correspondientes a la página actual.
  // Esta es solo una demostración de cómo podrías manejar la paginación.
  console.log(`Mostrando rutinas de la página ${currentPage}`);
}

// Navegar a la página anterior
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayRoutines();
  }
}

// Navegar a la siguiente página
function nextPage() {
  const totalPages = Math.ceil(totalRoutines / routinesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayRoutines();
  }
}

// Inicializar la vista
displayRoutines();

// Fin del script
