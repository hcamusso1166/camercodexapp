console.log("Camer Codex - main.js cargado");
  // definir una variable global para controlar esto
  var primeraVez = true;
function actualizarIconoConexionBLE(estado) {
  const icon = document.getElementById('estadoConexionBLE');
  
  if (!icon) {
    console.info("[BLE] Ícono de conexión no presente en esta vista; se omite actualización visual.");
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
  //emitir audio de Dispositivo conectado o no conectado
  //la primera vez que se carga la pagina no se debe emitir el desconectado, luego si

  if (estado === "conectado") {
    reproducirAudio("conectado");
    reproducirVibracion([200, 100, 200]); // Vibrar dos veces con una pausa
    primeraVez = false;
  } else if (estado === "desconectado" && !primeraVez ) {
    reproducirAudio("desconectado");
    reproducirVibracion([500]); // Vibrar una vez
  }
}

function actualizarIconoBateria(voltaje) {
  const icon = document.getElementById('batteryIcon');
  if (!icon) return;

  let src = "../icons/battery_unknown_16_D9D9D9.svg"; // por defecto

  if (voltaje >= 4.5) {
    src = "../icons/battery_full_16_D9D9D9.svg";
  } else if (voltaje >= 4.0) {
    src = "../icons/battery_4_bar_16_D9D9D9.svg";
  } else if (voltaje >= 3.7) {
    src = "../icons/battery_2_bar_16_D9D9D9.svg";
  } else {
    src = "../icons/battery_alert_16_D9D9D9.svg";
  }

  icon.src = src;
  icon.alt = `Batería: ${voltaje.toFixed(2)} V`;
  icon.title = icon.alt;
}


window.addEventListener("DOMContentLoaded", function () {
document.getElementById('appVersion').textContent = appVersion;
actualizarIconoConexionBLE("desconectado");
actualizarAnimacionBotonConexion(true);

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
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(async reg => {
      console.log("✅ Service Worker registrado:", reg);
      await registerSyncWhenReady(reg);
    })
        .catch(err => console.warn("❌ Error al registrar SW:", err));
} else {
  console.warn('Service Worker no disponible en este contexto');
}

async function registerSyncWhenReady(registration) {
  if (!registration || !('sync' in registration)) {
    return;
  }

  try {
    const activeRegistration = registration.active
      ? registration
      : await navigator.serviceWorker.ready;
    await activeRegistration.sync.register('sync-cache');
  } catch (err) {
    console.warn('No se pudo registrar sync:', err);
  }
}

async function ensurePersistence() {
  try {
    if (!navigator.storage || !navigator.storage.persisted || !navigator.storage.persist) {
      return;
    }

    const alreadyPersistent = await navigator.storage.persisted();
    if (alreadyPersistent) {
      console.log('[Storage] Persistencia garantizada');
      return;
    }

    const granted = await navigator.storage.persist();
    if (granted) {
      console.log('[Storage] Persistencia garantizada');
    } else {
      console.warn('[Storage] Persistencia no concedida; el navegador puede limpiar la caché si necesita espacio');
    }
  } catch (err) {
    console.warn('[Storage] Error solicitando persistencia:', err);
  }
}

ensurePersistence();

window.addEventListener('online', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => registerSyncWhenReady(reg));
  }
});

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
const APP_VERSION_CACHE_KEY = 'cc_cached_app_version';
const UPDATE_FEEDBACK_KEY = 'cc_update_feedback';

function getCachedAppVersion() {
  const stored = localStorage.getItem(APP_VERSION_CACHE_KEY);
  if (stored && typeof stored === 'string') {
    return stored.trim();
  }

  const localVersion = typeof appVersion === 'string' ? appVersion.trim() : '';
  if (localVersion) {
    localStorage.setItem(APP_VERSION_CACHE_KEY, localVersion);
  }
  return localVersion;
}

function setCachedAppVersion(version) {
  if (version && typeof version === 'string') {
    localStorage.setItem(APP_VERSION_CACHE_KEY, version.trim());
  }
}

function extractLicenseLevel(versionText) {
  if (!versionText || typeof versionText !== 'string') return null;
  const levelMatch = versionText.match(/membres(?:i|í)a\s*(\d+)/i);
  if (!levelMatch) return null;
  const parsed = Number(levelMatch[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function renderUpdateStatus(messageHtml) {
  if (!popupBody || !popupModal) {
    window.alert(messageHtml.replace(/<[^>]*>/g, ' '));
    return;
  }

  popupBody.classList.add('update-flow');
  popupBody.innerHTML = messageHtml;
  popupModal.classList.remove('hidden');
}

function sanitizarHtml(texto) {
  if (typeof texto !== 'string') return '';
  const temporal = document.createElement('div');
  temporal.textContent = texto;
  return temporal.innerHTML;
}

function mostrarConfirmacionActualizacion({ titulo, mensaje, confirmar = 'Aceptar', cancelar = 'Cancelar' }) {
  if (!popupBody || !popupModal) {
    const fallback = [titulo, mensaje].filter(Boolean).join('\n');
    return Promise.resolve(window.confirm(fallback));
  }

  const tituloHtml = titulo ? `<p><strong>${sanitizarHtml(titulo)}</strong></p>` : '';
  const mensajeHtml = mensaje ? `<p>${sanitizarHtml(mensaje)}</p>` : '';

  popupBody.classList.add('update-flow');
  popupBody.innerHTML = `
    ${tituloHtml}
    ${mensajeHtml}
    <div class="update-confirm-actions">
      <button type="button" class="update-confirm-btn update-confirm-btn--secondary" data-update-confirm="cancel">${sanitizarHtml(cancelar)}</button>
      <button type="button" class="update-confirm-btn update-confirm-btn--primary" data-update-confirm="ok">${sanitizarHtml(confirmar)}</button>
    </div>
  `;
  popupModal.classList.remove('hidden');

  return new Promise((resolve) => {
    const resolver = (value) => {
      popupBody.removeEventListener('click', onBodyClick);
      if (popupCloseBtn) {
        popupCloseBtn.removeEventListener('click', onCloseClick);
      }
      resolve(value);
    };

    const onBodyClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.getAttribute('data-update-confirm');
      if (action === 'ok') {
        resolver(true);
      }
      if (action === 'cancel') {
        resolver(false);
      }
    };

    const onCloseClick = () => resolver(false);

    popupBody.addEventListener('click', onBodyClick);
    if (popupCloseBtn) {
      popupCloseBtn.addEventListener('click', onCloseClick, { once: true });
    }
  });
}

function consumeUpdateFeedback() {
  const feedback = localStorage.getItem(UPDATE_FEEDBACK_KEY);
  if (!feedback) return;
  localStorage.removeItem(UPDATE_FEEDBACK_KEY);
  renderUpdateStatus(`<p>${feedback}</p>`);
}

if (menuDropdown) {
  menuDropdown.addEventListener('click', (e) => {
        if (e.target.matches('a[data-action="check-updates"]')) {
      e.preventDefault();
      verificarActualizaciones();
      return;
    }

    if (e.target.matches('a[data-popup]')) {
      e.preventDefault();
      const popupId = e.target.getAttribute('data-popup');
      abrirPopup(popupId);
    }
  });
}

async function obtenerVersionRemota() {
  const configUrl = new URL('/js/config.js', window.location.origin);
  configUrl.searchParams.set('t', Date.now().toString());

  const response = await fetch(configUrl.toString(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar la versión publicada.');
  }

  const configJs = await response.text();
  const appVersionMatch = configJs.match(/const\s+appVersion\s*=\s*["']([^"']+)["']/);

  if (!appVersionMatch) {
    throw new Error('No se encontró appVersion en config remoto.');
  }

  return appVersionMatch[1].trim();
}

async function limpiarCacheYRecargar(versionRemota) {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

    if (versionRemota) {
    setCachedAppVersion(versionRemota);
  }

  localStorage.setItem(UPDATE_FEEDBACK_KEY, '✅ La app se actualizó correctamente.');
  window.location.replace(`${window.location.pathname}?cache_bust=${Date.now()}`);
}

async function verificarActualizaciones() {
  if (!menuDropdown) return;

  menuDropdown.classList.add('hidden');

  if (!navigator.onLine) {
    renderUpdateStatus('<p>Sin conexión a internet. Conéctate y vuelve a intentar.</p>');
    return;
  }

  const confirmCheck = await mostrarConfirmacionActualizacion({
    titulo: 'Actualizaciones',
    mensaje: '¿Deseas revisar si hay una actualización disponible?',
    confirmar: 'Revisar',
    cancelar: 'Cancelar',
  });
  if (!confirmCheck) {
    renderUpdateStatus('<p>Verificación cancelada por el mago.</p>');
    return;
  }

  renderUpdateStatus('<p>Revisando actualizaciones...</p>');

  try {
    const versionCacheada = getCachedAppVersion();
    const versionRemota = await obtenerVersionRemota();
    const localLicense = extractLicenseLevel(versionCacheada);
    const remoteLicense = extractLicenseLevel(versionRemota);

    if (versionCacheada && versionCacheada !== versionRemota) {
      if (localLicense !== null && remoteLicense !== null && localLicense !== remoteLicense) {
        const confirmLicenseUpdate = await mostrarConfirmacionActualizacion({
          titulo: 'Nueva licencia detectada',
          mensaje: `Se detectó un cambio en el nivel de licencia (${localLicense} → ${remoteLicense}). ¿Deseas actualizar la app ahora?`,
          confirmar: 'Actualizar',
          cancelar: 'Ahora no',
        });

        if (!confirmLicenseUpdate) {
          renderUpdateStatus(
            `<p>Actualización cancelada por el mago.</p><p>Versión actual: <strong>${versionCacheada}</strong></p><p>Versión disponible: <strong>${versionRemota}</strong></p>`
          );
          return;
        }
      } else {
        const confirmUpdate = await mostrarConfirmacionActualizacion({
          titulo: 'Nueva versión disponible',
          mensaje: `Hay una nueva versión disponible (${versionCacheada} → ${versionRemota}). ¿Deseas actualizar ahora?`,
          confirmar: 'Actualizar',
          cancelar: 'Ahora no',
        });
        if (!confirmUpdate) {
          renderUpdateStatus(
            `<p>Actualización cancelada por el mago.</p><p>Versión actual: <strong>${versionCacheada}</strong></p><p>Versión disponible: <strong>${versionRemota}</strong></p>`
          );
          return;
        }
      }

      renderUpdateStatus(
        `<p>Actualización aprobada.</p><p>Versión actual: <strong>${versionCacheada}</strong></p><p>Versión nueva: <strong>${versionRemota}</strong></p><p>Instalando actualización...</p>`
      );
      await limpiarCacheYRecargar(versionRemota);
      return;
    }

    setCachedAppVersion(versionRemota);
    renderUpdateStatus(`<p>La app se encuentra actualizada a su última versión.</p><p>Versión actual: <strong>${versionRemota}</strong></p>`);
  } catch (error) {
    renderUpdateStatus(`<p>No fue posible verificar actualizaciones.</p><p>Detalle: ${error.message}</p>`);
  }
}


async function abrirPopup(popupId) {
  if (!popupBody || !menuDropdown || !popupModal) return;
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

    popupBody.classList.remove('update-flow');
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
    popupBody.classList.remove('update-flow');
    popupBody.innerHTML = `<p>Error cargando contenido: ${error.message}</p>`;
    popupModal.classList.remove("hidden");
  }

}

consumeUpdateFeedback();

if (popupCloseBtn && popupModal && popupBody && menuDropdown) {
  popupCloseBtn.addEventListener('click', () => {
    popupModal.classList.add('hidden');
    popupBody.classList.remove('update-flow');
    popupBody.innerHTML = '';          // Limpiar contenido del popup
    menuDropdown.classList.add('hidden');  // Cerrar menú
  });
}



// BLE Device Handling

const retrievedValue = document.getElementById('valueContainer');
const latestValueSent = document.getElementById('valueSent');
const bleStateContainer = document.getElementById('bleState');
const bleStateSecondaryContainer = document.getElementById('bleStateSecondary');
const blePrimaryRefContainer = document.getElementById('blePrimaryRef');
const bleSecondaryRefContainer = document.getElementById('bleSecondaryRef');
const accionMagoMensaje = document.getElementById('accionMagoMensaje');

const timestampContainer = document.getElementById('timestamp');
// Determinar la vista actual una sola vez para evitar cálculos repetidos
const currentView = window.location.pathname.split('/').pop() || "";
const ANTENNA_ID_MIN = 1;
const ANTENNA_ID_MAX = 9;

const ROUTINE_ANTENNA_TYPES = Object.freeze({
  PRIMARY_ONLY: "primaryOnly",      // Solo procesa antennaId principal (1 o 9)
  SECONDARY_ONLY: "secondaryOnly",  // Solo procesa antennaId = 2..6
  ALL: "all"                         // Procesa antennaId principal (1/9) + 2..6
});

const ROUTINE_ANTENNA_POLICIES = Object.freeze({
  "lecturaQ.html": ROUTINE_ANTENNA_TYPES.SECONDARY_ONLY,
  "bookTestImposible.html": ROUTINE_ANTENNA_TYPES.ALL,
  // Agregar aquí rutinas adicionales cuando necesiten soportar otras antenas
});

function getAntennaPolicyForView(viewName) {
  return ROUTINE_ANTENNA_POLICIES[viewName] || ROUTINE_ANTENNA_TYPES.PRIMARY_ONLY;
}

function isAntennaIdInRange(antennaId) {
  return antennaId >= ANTENNA_ID_MIN && antennaId <= ANTENNA_ID_MAX;
}

function isPrimaryAntennaId(antennaId) {
  return antennaId === 1 || antennaId === 9;
}

function shouldProcessAntennaForPolicy(antennaId, policy) {
  switch (policy) {
    case ROUTINE_ANTENNA_TYPES.PRIMARY_ONLY:
      return isPrimaryAntennaId(antennaId); // incluye 9 como caso especial si es necesario para algunas rutinas, estuche azul
    case ROUTINE_ANTENNA_TYPES.SECONDARY_ONLY:
      return antennaId >= 2 && antennaId <= 6;
    case ROUTINE_ANTENNA_TYPES.ALL:
      return isPrimaryAntennaId(antennaId) || (antennaId >= 2 && antennaId <= 6);// Procesa antennaId principal (1/9) + 2..6
    default:
      return isPrimaryAntennaId(antennaId); //(1/9)
  }
}

const deviceName = 'MrCamerDev1.0';
const bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
const ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';
const sensorCharacteristic = '19b10001-e8f2-537e-4f6c-d104768a1214';
const batteryCharacteristic = '9b04030c-2f33-42b2-9fc5-a97a44a1145d';

let bleServer, bleServiceFound, sensorCharacteristicFound, batteryCharacteristicFound;
// Estado extraído de CamerPacket v1 (último paquete recibido)
let camerVersion    = 0;
let camerEventType  = 0;
let camerAntennaId  = 0;
let camerFlags      = 0;
let camerSeq        = 0;

const isBookTestImposibleView = currentView === "bookTestImposible.html";
const characteristicDeviceMap = new WeakMap();
const bookTestConnections = [];

function formatBleReference(device) {
  if (!device) return "";
  if (device.id) return `(ref: ${device.id})`;
  if (device.name) return `(ref: ${device.name})`;
  return "";
}

function setBookTestLineState(role, statusText, color, refText = "") {
  const isPrimary = role === "primary";
  const statusNode = isPrimary ? bleStateContainer : bleStateSecondaryContainer;
  const refNode = isPrimary ? blePrimaryRefContainer : bleSecondaryRefContainer;

  if (statusNode) {
    statusNode.textContent = statusText;
    statusNode.style.color = color;
  }
  if (refNode) {
    refNode.textContent = refText;
  }
}

function getRoleByAntennaId(antennaId) {
  if (isPrimaryAntennaId(antennaId)) return "primary";
  if (antennaId >= 2 && antennaId <= 6) return "secondary";
  return "unknown";
}

function ensureBookTestConnectionRole(connectionInfo, antennaId) {
  if (!isBookTestImposibleView || !connectionInfo) return;

  const detectedRole = getRoleByAntennaId(antennaId);
  if (detectedRole === "unknown" || connectionInfo.role === detectedRole) return;

  connectionInfo.role = detectedRole;
  const roleLabel = detectedRole === "primary" ? "Conectado" : "Conectado";
  setBookTestLineState(detectedRole, roleLabel, "#24af37", formatBleReference(connectionInfo.device));
}

function getNextPendingRole() {
  const hasPrimary = bookTestConnections.some(conn => conn.role === "primary");
  if (!hasPrimary) return "primary";
  const hasSecondary = bookTestConnections.some(conn => conn.role === "secondary");
  if (!hasSecondary) return "secondary";
  return "unknown";
}

function setPendingBookTestState(connectionInfo) {
  const pendingRole = getNextPendingRole();
  connectionInfo.role = pendingRole;

  if (pendingRole === "unknown") return;

  setBookTestLineState(
    pendingRole,
    "Conectado (esperando lectura)",
    "#f3b13f",
    formatBleReference(connectionInfo.device)
  );
}

function onBookTestDisconnected(connectionInfo) {
  const role = connectionInfo?.role === "secondary" ? "secondary" : "primary";
  setBookTestLineState(role, "Desconectado", "#d13a30", "");
}

// Función que limpia los TAGs y valores anteriores
function limpiarDatos() {
  if (retrievedValue) retrievedValue.innerHTML = '';
  if (latestValueSent) latestValueSent.innerHTML = '';
  if (timestampContainer) timestampContainer.innerHTML = '';
  if (typeof resetLecturaQSlots === 'function') {
    resetLecturaQSlots();
  }
  if (typeof resetBookTestImposible === 'function') {
    resetBookTestImposible();
  }
  console.log("Datos limpiados");
}

// Manejo de las acciones que se deben realizar
function actualizarAnimacionBotonConexion(activo) {
  const connectButton = document.getElementById('connectBleButton');
  if (!connectButton) return;

  connectButton.classList.toggle('connectButton--pulse', Boolean(activo));
}

function actualizarAccion(accion) {
  const accionMagoMensaje = document.getElementById('accionMagoMensaje');
  if (accionMagoMensaje) {
    accionMagoMensaje.textContent = accion;  // Actualiza el mensaje de la acción
  }
}
// Connect to BLE Device
function connectToDevice() {
  console.log('Initializing Bluetooth...');

    if (isBookTestImposibleView && bookTestConnections.length >= 2) {
    console.warn("Ya hay dos dispositivos conectados para Book Test Imposible.");
    return;
  }

  navigator.bluetooth.requestDevice({
    filters: [{ name: deviceName }],
    optionalServices: [bleService]
  })
    .then(device => {
      console.log('Device Selected:', device.name);

      const connectionInfo = { device, role: isBookTestImposibleView ? getNextPendingRole() : "primary" };
      if (isBookTestImposibleView) {
        bookTestConnections.push(connectionInfo);
        setPendingBookTestState(connectionInfo);
      } else if (bleStateContainer) {
        bleStateContainer.innerHTML = device.name;
      }

      device.addEventListener('gattserverdisconnected', () => {
        if (isBookTestImposibleView) {
          const index = bookTestConnections.indexOf(connectionInfo);
          if (index >= 0) bookTestConnections.splice(index, 1);
          onBookTestDisconnected(connectionInfo);
          if (bookTestConnections.length === 0) {
            actualizarIconoConexionBLE("desconectado");
            actualizarAccion("Conectar el dispositivo BLE");
          }
        } else {
          onDisconnected();
        }
      });

      return device.gatt.connect().then(gattServer => ({ gattServer, connectionInfo }));
    })
    .then(({ gattServer, connectionInfo }) => {
      bleServer = gattServer;
      connectionInfo.server = gattServer;
      console.log("Connected to GATT Server");
      return gattServer.getPrimaryService(bleService).then(service => ({ service, connectionInfo }));
    })
    .then(({ service, connectionInfo }) => {
      bleServiceFound = service;
      connectionInfo.service = service;
      console.log("Service discovered:", service.uuid);

      return service.getCharacteristic(sensorCharacteristic)
        .then(sensorChar => {
          return Promise.all([
            sensorChar,
            service.getCharacteristic(batteryCharacteristic).catch(err => {
              console.warn("⚠️ No se pudo obtener la característica de batería:", err);
              return null;
            })
          ]).then(([sensor, battery]) => ({ sensor, battery, connectionInfo }));
        });
    })
      .then(({ sensor, battery, connectionInfo }) => {
      console.log("Característica sensor descubierta:", sensor.uuid);
      if (battery) {
        console.log("Característica batería descubierta:", battery.uuid);
      } else {
        console.warn("Característica de batería no disponible.");
      }

      sensorCharacteristicFound = sensor;
      connectionInfo.sensor = sensor;
      characteristicDeviceMap.set(sensor, connectionInfo);

      sensor.writeValue(new Uint8Array([0])).then(() => {
        console.log("Característica BLE reiniciada.");
        sensor.addEventListener('characteristicvaluechanged', handleCharacteristicChange);
        sensor.startNotifications();
        console.log("Notificaciones de sensor iniciadas.");

actualizarIconoConexionBLE("conectado");
        actualizarAnimacionBotonConexion(false);
        if (!isBookTestImposibleView && bleStateContainer) {
          bleStateContainer.style.color = "#24af37";
        }
        limpiarDatos();
        actualizarAccion("Leer carta");

        const path = window.location.pathname;
        if (path.includes("pegriloso.html")) actualizarAccion("Registrar Bala de Plata");
        if (path.includes("elefantes.html")) actualizarAccion("Leer carta y REPETIR la lectura de la PRIMERA carta para finalizar la dada");
        if (path.includes("momias.html")) actualizarAccion("Acercar Sarcófago para descubrir el color");
        if (path.includes("dadoR.html")) actualizarAccion("Leer dado");
      });
      
      if (battery) {
        battery.addEventListener('characteristicvaluechanged', handleBatteryChange);
        setTimeout(() => {
          battery.startNotifications().then(() => {
            console.log("🔔 Notificaciones de batería iniciadas (con delay)");
          }).catch(err => {
            console.warn("❌ Error al iniciar notificaciones de batería:", err);
          });
        }, 150);
      }
    })
    .catch(error => {
      console.log('Error: ', error);
    });
}

function onDisconnected(event) {
  console.log('Device Disconnected.');
  if (bleStateContainer) {
    bleStateContainer.innerHTML = "Desconectado";
    bleStateContainer.style.color = "#d13a30";
  }
  actualizarIconoConexionBLE("desconectado");
  actualizarAccion("Conectar el dispositivo BLE");
  actualizarAnimacionBotonConexion(true);

}

// al recibir la informacion desde el MrCamerDev1.0, se ejecuta esta función
function handleCharacteristicChange(event) {
  //const dataView = event.target.value;        // DataView de Web Bluetooth
  //const len = dataView.byteLength;
  const dataView = event.target.value;
  if (!dataView) {
    return;
  }
  //let valor  = "";
  //let mvalor = "";
  //let color  = "";
  //let dorso  = "";
const len = dataView.byteLength;
  // Reset/actualización de metadatos CamerPacket
  camerVersion   = 0;
  camerEventType = 0;
  camerAntennaId = 0;
  camerFlags     = 0;
  camerSeq       = 0;

  if (len < 10) {
    console.warn("Payload CamerPacketv1.0 incompleto o inválido (len=", len, ")");
    return; // Ignoramos payloads que no cumplen con CamerPacketv1.0
  }

// ===== CamerPacket v1 =====
  camerVersion   = dataView.getUint8(0);         // version
  camerEventType = dataView.getUint8(1);         // eventType
  camerAntennaId = dataView.getUint8(2);         // antennaId

  if (camerVersion !== 1 ) {
    console.warn("Versión CamerPacket no soportada:", camerVersion);
    return; // Solo aceptamos CamerPacketv1.0
  }

  const sourceConnection = characteristicDeviceMap.get(event.target);
  if (sourceConnection) {
    ensureBookTestConnectionRole(sourceConnection, camerAntennaId);
  }

  if (!isAntennaIdInRange(camerAntennaId)) {
    console.warn("antennaId fuera de rango:", camerAntennaId);
    return;
  }

  const antennaPolicy = getAntennaPolicyForView(currentView);
  if (!shouldProcessAntennaForPolicy(camerAntennaId, antennaPolicy)) {
    console.log(`Ignorando antennaId ${camerAntennaId} según política ${antennaPolicy} para la vista ${currentView}`);
    return;
  }
  //const c0 = dataView.getUint8(3);
  //const c1 = dataView.getUint8(4);
  //const c2 = dataView.getUint8(5);
  //const c3 = dataView.getUint8(6);
  const payloadChars = String.fromCharCode(
    dataView.getUint8(3),
    dataView.getUint8(4),
    dataView.getUint8(5),
    dataView.getUint8(6)
  );
  camerFlags = dataView.getUint8(7);             // flags
  camerSeq   = dataView.getUint16(8, false);     // seq (big-endian)

  /*const carta0 = String.fromCharCode(c0);
  const carta1 = String.fromCharCode(c1);
  const carta2 = String.fromCharCode(c2);
  const carta3 = String.fromCharCode(c3);

  // Mantener compatibilidad con las rutinas:
  valor  = carta0 + carta1 + carta2 + carta3;    // "mvalor+color+dorso"
  mvalor = carta0 + carta1;                      // código de carta
  color  = carta2;                               // color/categoría
  dorso  = carta3;                               // dorso/variante*/
  const mvalor = payloadChars.slice(0, 2);
  const color  = payloadChars[2];
  const dorso  = payloadChars[3];
  const valor  = payloadChars;

  console.log("BLE RX:",
    { valor, mvalor, color, dorso, len,
      camerVersion, camerEventType, camerAntennaId, camerFlags, camerSeq }
  );
/*
  const path = window.location.pathname;

  // === Acciones por rutina  ===
  const accionesPorRuta = [
    { match: "fueraDeEsteMundo.html",     accion: () => reproducirAudioColor(color) },
    { match: "elefantes.html",            accion: () => guardarTag(mvalor) },
    { match: "momias.html",               accion: () => reproducirColor(mvalor) },
    { match: "pegriloso.html",            accion: () => guardarTagPegriloso(mvalor) },
    { match: "theboss.html",              accion: () => guardarTagTheBoss(mvalor) },
    { match: "pruebaDeFuego.html",        accion: () => guardarTagPruebaDeFuego(mvalor) },
    { match: "oraculo.html",              accion: () => reproducirAudioParaTag(mvalor) },
    { match: "manoPoker.html",            accion: () => guardarTagMano(mvalor) },
    { match: "ojosVendados.html",         accion: () => reproducirOjosVendados(mvalor) },
    { match: "dadaSimple.html",           accion: () => reproducirAudioParaTag(mvalor) },
    { match: "dadoR.html",                accion: () => reproducirAudioParaTag(mvalor) },
    { match: "coleccionista.html",        accion: () => guardarTag(mvalor) },
    { match: "rapidoNumeroso.html",       accion: () => sumarTag(mvalor) },
    { match: "voluntadPrestada.html",     accion: () => tagVoluntadPrestada(valor) },
    { match: "tegMagico.html",            accion: () => guardarTagTeg(mvalor) },
    { match: "perdonenMiInmodestia.html", accion: () => guardarTag(mvalor) },
    { match: "lecturaQ.html",             accion: () => registrarLecturaQ({ mvalor, antennaId: camerAntennaId }) },
  ];

  for (const entrada of accionesPorRuta) {
    if (path.includes(entrada.match)) {
      entrada.accion();
      break; // solo una acción por rutina
    }
  }
*/
// === Acciones por rutina (ordenadas para ejecución inmediata) ===
  switch (currentView) {
    case "fueraDeEsteMundo.html":
      reproducirAudioColor(color);
      break;
    case "elefantes.html":
    case "coleccionista.html":
    case "perdonenMiInmodestia.html":
      guardarTag(mvalor);
      break;
    case "momias.html":
      reproducirColor(mvalor);
      break;
    case "pegriloso.html":
      guardarTagPegriloso(mvalor);
      break;
    case "theboss.html":
      guardarTagTheBoss(mvalor);
      break;
    case "pruebaDeFuego.html":
      guardarTagPruebaDeFuego(mvalor);
      break;
    case "oraculo.html":
    case "dadoR.html":
      reproducirAudioParaTag(mvalor);
      break;
    case "manoPoker.html":
      guardarTagMano(mvalor);
      break;
    case "ojosVendados.html":
      reproducirOjosVendados(mvalor);
      break;
    case "dadaSimple.html":
      reproducirAudioParaTag(mvalor, color, dorso);
      break;
    case "controlFrecuencia.html":
      registrarControlFrecuencia(mvalor);
      break;
    case "rapidoNumeroso.html":
      sumarTag(mvalor);
      break;
    case "voluntadPrestada.html":
      tagVoluntadPrestada(valor);
      break;
    case "tegMagico.html":
      guardarTagTeg(mvalor);
      break;
    case "lecturaQ.html":
      registrarLecturaQ({ mvalor, antennaId: camerAntennaId });
      break;
    case "bookTestImposible.html":
      registrarBookTestImposible({ mvalor, antennaId: camerAntennaId });
      break;
    default:
      break;
  }
  /*
  // === Bloque de UI / texto en pantalla (SIN CAMBIOS, pero usando mvalor) ===
  if (path.includes("momias.html")) {
    retrievedValue.innerHTML = 'Color: ' + mvalor;
  } else if (path.includes("coleccionista.html")) {
    const textCarta = cartasTexto[mvalor];
    retrievedValue.innerHTML = textCarta;
  } else if (path.includes("dadoR.html")) {
    const textCarta = mapaTexto[mvalor];
    retrievedValue.innerHTML = textCarta;
  } else if (path.includes("tegMagico.html")) {
    const textCarta = mapaTEGTexto[mvalor];
    retrievedValue.innerHTML = textCarta;
  } else if (path.includes("lecturaQ.html")) {
    // La vista específica de LecturaQ se gestiona desde su rutina dedicada.
  } else {
    const textCarta = cartasPoker[mvalor];
    retrievedValue.innerHTML = textCarta;*/
    // === Bloque de UI / texto en pantalla (sin cambios funcionales) ===
  if (retrievedValue) {
    switch (currentView) {
      case "momias.html":
        retrievedValue.innerHTML = 'Color: ' + mvalor;
        break;
      case "coleccionista.html":
        retrievedValue.innerHTML = cartasTexto[mvalor];
        break;
      case "dadoR.html":
        retrievedValue.innerHTML = mapaTexto[mvalor];
        break;
      case "tegMagico.html":
        retrievedValue.innerHTML = mapaTEGTexto[mvalor];
        break;
      case "lecturaQ.html":
        // La vista específica de LecturaQ se gestiona desde su rutina dedicada.
        break;
      case "bookTestImposible.html":
        // La vista específica se gestiona desde su rutina dedicada.
        break;
      default:
        retrievedValue.innerHTML = cartasPoker[mvalor];
        break;
    }
  }

  if (timestampContainer) {
    timestampContainer.innerHTML = getDateTime();
  }
}
// Al recibir el nivel de batería desde el dispositivo BLE
function handleBatteryChange(event) {
  const texto = new TextDecoder().decode(event.target.value).trim();
  const nivel = parseFloat(texto);   // ⚡ usamos parseFloat

  if (!isNaN(nivel)) {
    console.log("🔋 Nivel de batería recibido:", nivel, "V (texto crudo:", texto + ")");
    actualizarIconoBateria(nivel);  // ⚡ ahora pasamos el número
  } else {
    console.warn("⚠️ Nivel de batería no reconocido:", texto);
  }
}



/* Se lleva a las rutinas correspondientes
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
  */
//Reproducir audios especiales
function reproducirAudio(nombreArchivo) {
  const audio = new Audio(`../audios/audios_especiales/${nombreArchivo}.mp3`);
  audio.play();
}
//Reproducir audios en Poker
function reproducirAudioEnPoker(nombreArchivo) {
  const audio = new Audio(`../audios/poker/${nombreArchivo}.mp3`);
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
if (isBookTestImposibleView) {
    if (!bookTestConnections.length) {
      console.error("Bluetooth is not connected.");
      window.alert("Bluetooth is not connected.");
      return;
    }

    const disconnections = bookTestConnections.map(conn => {
      const stopPromise = conn.sensor
        ? conn.sensor.stopNotifications().catch(() => undefined)
        : Promise.resolve();

      return stopPromise.then(() => {
        if (conn.server?.connected) {
          conn.server.disconnect();
        }
      });
    });

    Promise.all(disconnections)
      .then(() => {
        bookTestConnections.length = 0;
        setBookTestLineState("primary", "Desconectado", "#d13a30", "");
        setBookTestLineState("secondary", "Desconectado", "#d13a30", "");
        actualizarIconoConexionBLE("desconectado");
        actualizarAccion("Conectar el dispositivo BLE");
      })
      .catch(error => {
        console.log("An error occurred:", error);
      });

    return;
  }

  if (bleServer && bleServer.connected) {
    if (sensorCharacteristicFound) {
      sensorCharacteristicFound.stopNotifications()
        .then(() => bleServer.disconnect())
        .then(() => {
          if (bleStateContainer) {
            bleStateContainer.innerHTML = "Desconectado";
            bleStateContainer.style.color = "#d13a30";
          }
          if (accionMagoMensaje) {
            accionMagoMensaje.textContent = "Conectar el dispositivo BLE";
          }
          if (typeof resetLecturaQSlots === 'function') {
            resetLecturaQSlots();
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
      const batteryIcon = document.getElementById('batteryIcon');
      if (batteryIcon) {
        batteryIcon.src = "../icons/battery_unknown_16_D9D9D9.svg";
        batteryIcon.alt = "Estado batería desconocido";
        batteryIcon.title = batteryIcon.alt;
      }

    }
    );
document.addEventListener('click', (e) => {
  const target = e.target;

    // Hay páginas que no renderizan menú; evitar errores por null.
  if (!menuDropdown || !menuToggle) return;

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
function reproducirVibracion(patron = [300]) {
  if ("vibrate" in navigator) {
    const resultado = navigator.vibrate(patron);
    console.log("🔔 Vibración ejecutada:", patron, "Resultado:", resultado);
  } else {
    console.warn("🚫 Vibración no soportada en este navegador/dispositivo.");
  }
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
function obtenerValorCarta(nombreCarta) {
  const valorStr = nombreCarta.match(/\d+|[ADJQK]/)[0];
  switch (valorStr) {
    case 'A': return 1;
    case 'D': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    default: return parseInt(valorStr, 10) || 0;
  }
}
function anunciarDetalleJugada(resultado) {
  const cartas = resultado.cartas.map(c => c.slice(0, -1));
  const palos = resultado.cartas.map(c => c.slice(-1));
  const cuenta = {};
  cartas.forEach(v => cuenta[v] = (cuenta[v] || 0) + 1);
  const valoresOrdenados = Object.entries(cuenta).sort((a, b) => b[1] - a[1]);

const convertirValor = v => {
  // Para audios de Poker por letra y SUMA para números
  const figuras = { "A": "A", "K": "K", "Q": "Q", "J": "J", "D": "10" };
  return figuras[v] || v; // números como "2","3"... siguen como string para SUMA
};


  const dominante = convertirValor(valoresOrdenados[0][0]);
  const secundario = valoresOrdenados[1] ? convertirValor(valoresOrdenados[1][0]) : null;

  const paloDominante = palos.sort((a,b) => palos.filter(p=>p===b).length - palos.filter(p=>p===a).length)[0];
  const paloAudio = {
    'T': 'T',
    'C': 'C',
    'P': 'P',
    'D': 'D'
  };

  const audio = document.getElementById("tagAudio");
  let i = 0;

  function play(nombre, intervalo = 1500) {
    setTimeout(() => {
      const path = isNaN(nombre) ? `../audios/poker/${nombre}.mp3` : `../audios/suma/${nombre}.mp3`;
      audio.src = path;
      audio.play();
    }, i * intervalo);
    i++;
  }

  function playCompuesto(prefijo, nombre, intervalo = 1500) {
    play(prefijo, intervalo);
    setTimeout(() => {
      const path = isNaN(nombre) ? `../audios/poker/${nombre}.mp3` : `../audios/suma/${nombre}.mp3`;
      audio.src = path;
      audio.play();
    },  i * intervalo);
    i++;
  }

  switch (resultado.descripcion.toLowerCase()) {
    case 'pareja':
    case 'trio':
    case 'poker':
      play(dominante);
      break;
    case 'doble pareja':
    case 'full':
      play( dominante);
      if (secundario) playCompuesto("y", secundario);
      break;
    case 'escalera':
    case 'escalera de color':
    //case 'escalera real':
      const valores = cartas; // ya son letras como "D", "J", "Q", "K", "A"
      const orden = ["2","3","4","5","6","7","8","9","D","J","Q","K","A"];

      // Detectar rueda (A-2-3-4-5) tratando al As como 1 solo en ese caso
      const ordenAsc = valores.slice().sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
      const esRueda = ordenAsc.join("") === "2345A";
      var cartaMasAlta = esRueda
        ? "5"
        : valores.sort((a, b) => orden.indexOf(b) - orden.indexOf(a))[0];

      if (cartaMasAlta === "D") cartaMasAlta = "10"; // para que diga "de diez" en vez de "de D"
      console.log("Carta más alta de la escalera:", cartaMasAlta, "Es rueda:", esRueda);
      play(cartaMasAlta.toUpperCase(),1500);  // usa audio ../audios/poker/A.mp3 por ejemplo
      play(paloAudio[paloDominante],1000);
      break;
    case 'escalera real':
      play(paloAudio[paloDominante],1000);
      break;
    case 'color':
      play(paloAudio[paloDominante],1000);
      break;
case 'carta alta': {
  // Decimos "de" + (A/K/Q/J por poker, o número por SUMA)
  const etiqueta = resultado.cartaAltaEtiqueta; // ← viene de main.js
    // Reproducimos la etiqueta usando playCompuesto para soportar tanto
  // figuras como números con el mismo mecanismo
  play( etiqueta);
  break;
}
  }
}

function reproducirAudioCompuesto(numero) {
  const audio = document.getElementById("tagAudio");
  const partes = [];

  if (numero === 100 || numero === 200 || numero === 300) {
    partes.push(numero.toString());
  } else if (numero > 100 && numero < 200) {
    partes.push("ciento");
    numero -= 100;
  } else if (numero > 200 && numero < 300) {
    partes.push("200");
    numero -= 200;
  }

  if (numero <= 15) {
    partes.push(numero.toString());
  } else {
    const decena = Math.floor(numero / 10) * 10;
    const unidad = numero % 10;
    partes.push(decena.toString());
    if (unidad !== 0) partes.push("y" + unidad.toString());
  }

  partes.forEach((clave, i) => {
    const archivo = mapaSuma[clave];
    if (archivo) {
      setTimeout(() => {
        audio.src = `../audios/suma/${archivo}`;
        audio.play();
      }, i * 1000);
    }
  });
}

function evaluarMejorManoDePoker(cartas) {
  const combinaciones = obtenerCombinaciones(cartas, 5);
  let mejor = { descripcion: "Sin jugada", ranking: 0 };

  combinaciones.forEach(combo => {
    const res = evaluarMano(combo);
    if (res.ranking > mejor.ranking) mejor = res;
  });
if (!mejor.descripcion) {
  mejor.descripcion = "Sin jugada";
  mejor.ranking = 0;
  mejor.cartas = [];
}

  return mejor;
}

function obtenerCombinaciones(array, size) {
  function backtrack(start = 0, path = []) {
    if (path.length === size) {
      resultado.push([...path]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      path.push(array[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  const resultado = [];
  backtrack();
  return resultado;
}
function numeroAValorEtiqueta(n) {
  const mapa = { 14: 'A', 13: 'K', 12: 'Q', 11: 'J' };
  return mapa[n] || String(n);
}
function evaluarMano(cartas) {
  if (cartas.length !== 5) {
    return {
      descripcion: "Error: debe haber exactamente 5 cartas",
      cartas,
      ranking: 0
    };
  }

  const valores = cartas.map(c => c.slice(0, -1));
  const palos = cartas.map(c => c.slice(-1));

  const valorNumerico = v => {
    const mapa = { "A":14, "K":13, "Q":12, "J":11, "D":10 };
    return isNaN(v) ? mapa[v] : parseInt(v);
  };

  const valoresNum = valores.map(valorNumerico).sort((a,b) => a - b);
console.log("Valores numéricos ordenados:", valoresNum);
  const contarRepetidos = arr => {
    const cuenta = {};
    arr.forEach(v => cuenta[v] = (cuenta[v] || 0) + 1);
    return Object.values(cuenta).sort((a,b) => b - a); // eg. [3,2]
  };

  const todosIgualPalo = palos.every(p => p === palos[0]);

  const esEscalera = () => {
    let consecutiva = true;
    for (let i = 0; i < 4; i++) {
      if (valoresNum[i] + 1 !== valoresNum[i + 1]) {
        consecutiva = false;
        break;
      }
    }
    if (consecutiva) return true;

    if (valoresNum.includes(14)) {
      const conAsBajo = valoresNum
        .map(v => (v === 14 ? 1 : v))
        .sort((a, b) => a - b);
      return conAsBajo.toString() === "1,2,3,4,5";
    }
    return false;
  };

  const esEscaleraReal = () =>
    todosIgualPalo &&
    valoresNum.join(",") === "10,11,12,13,14";

  const escalera = esEscalera();
  const repeticiones = contarRepetidos(valores);

  let descripcion = "";
  let ranking = 1;

  if (esEscaleraReal()) {
    descripcion = "Escalera Real";
    ranking = 10;
  } else if (escalera && todosIgualPalo) {
    descripcion = "Escalera de Color";
    ranking = 9;
  } else if (repeticiones[0] === 4) {
    descripcion = "Poker";
    ranking = 8;
  } else if (repeticiones[0] === 3 && repeticiones[1] === 2) {
    descripcion = "Full";
    ranking = 7;
  } else if (todosIgualPalo) {
    descripcion = "Color";
    ranking = 6;
  } else if (escalera) {
    descripcion = "Escalera";
    ranking = 5;
  } else if (repeticiones[0] === 3) {
    descripcion = "Trio";
    ranking = 4;
  } else if (repeticiones[0] === 2 && repeticiones[1] === 2) {
    descripcion = "Doble Pareja";
    ranking = 3;
  } else if (repeticiones[0] === 2) {
    descripcion = "Pareja";
    ranking = 2;
  } else {
    const cartaAltaNum = Math.max(...valoresNum);
    const cartaAltaEtiqueta = numeroAValorEtiqueta(cartaAltaNum);
    return {
      descripcion: "Carta Alta",
      cartas,
      ranking: 1,
      cartaAltaNum,
      cartaAltaEtiqueta
    };
  }

  return { descripcion, cartas, ranking };
}

// Inicializar la vista
displayRoutines();

// Fin del script
