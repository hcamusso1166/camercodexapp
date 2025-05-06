// main.js - lógica BLE y funciones compartidas
console.log("Camer Codex - main.js cargado");

function logOutput(message) {
    const output = document.getElementById("output");
    if (output) {
        output.innerText += message + "\n";
        output.scrollTop = output.scrollHeight;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const bleStatus = document.getElementById("ble-status");
    if (bleStatus) {
      if (!navigator.bluetooth) {
        bleStatus.innerText = "❌ Web Bluetooth NO disponible en este navegador.";
        bleStatus.style.color = "red";
      } else {
        bleStatus.innerText = "✅ Web Bluetooth disponible.";
        bleStatus.style.color = "green";
      }
    
      // Verificamos permisos si bleStatus existe
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
    
    // Verificamos si el servidor BLE está conectado

  if (!bleServer || !bleServer.connected) {
    console.warn("🔁 Bluetooth no conectado. Esperando que el usuario haga clic para conectar...");
    // Podés opcionalmente habilitar un botón aquí si querés forzar reconexión manual
  }
  
  const bleMessages = document.getElementById("ble-messages");
  const checkBtn = document.getElementById("checkBluetoothBtn");
  
  if (bleMessages && checkBtn) {
    // Ocultar automáticamente luego de 5 seg
    setTimeout(() => {
      bleMessages.style.display = "none";
      checkBtn.disabled = false;
      checkBtn.style.cursor = "pointer";
    }, 5000);
  
    // Si el usuario hace clic, mostrar por 5 seg
    checkBtn.addEventListener("click", () => {
      bleMessages.style.display = "block";
      checkBtn.disabled = true;
      checkBtn.style.cursor = "not-allowed";
      setTimeout(() => {
        bleMessages.style.display = "none";
        checkBtn.disabled = false;
        checkBtn.style.cursor = "pointer";
      }, 5000);
    });
  }
  
  
  
});


  // DOM Elements
  const connectButton = document.getElementById('connectBleButton');
  const disconnectButton = document.getElementById('disconnectBleButton');
  const onButton = document.getElementById('onButton');
  const offButton = document.getElementById('offButton');
  const retrievedValue = document.getElementById('valueContainer');
  const latestValueSent = document.getElementById('valueSent');
  const bleStateContainer = document.getElementById('bleState');
  const timestampContainer = document.getElementById('timestamp');
  const installButton = document.getElementById('install-btn'); 

  //Define BLE Device Specs
  var deviceName ='MrCamerDev1.0';
  var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
  var ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';
  var sensorCharacteristic= '19b10001-e8f2-537e-4f6c-d104768a1214';

  //Global Variables to Handle Bluetooth
  var bleServer;
  var bleServiceFound;
  var sensorCharacteristicFound;
  let mapaCartas = {};
  //Cargar el json con el mapa de las cartas
  fetch('../audios/cartas.json')
      .then(res => res.json())
      .then(data => {
              mapaCartas = data;
              console.log("Mapa de cartas cargado correctamente");
  })
      .catch(err => console.error("Error cargando cartas.json", err));

  // Connect Button (search for BLE Devices only if BLE is available)
  connectButton.addEventListener('click', (event) => {
      if (isWebBluetoothEnabled()){
          connectToDevice();
      }
  });

  // Disconnect Button
  disconnectButton.addEventListener('click', disconnectDevice);

  // Write to the ESP32 LED Characteristic
  onButton.addEventListener('click', () => writeOnCharacteristic(1));
  offButton.addEventListener('click', () => writeOnCharacteristic(0));

  // Check if BLE is available in your Browser
  function isWebBluetoothEnabled() {
      if (!navigator.bluetooth) {
          console.log('Web Bluetooth API is not available in this browser!');
          bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser/device!";
          return false
      }
      console.log('Web Bluetooth API supported in this browser.');
      return true
  }

  // Connect to BLE Device and Enable Notifications
  function connectToDevice(){
      console.log('Initializing Bluetooth...');
      navigator.bluetooth.requestDevice({
          filters: [{name: deviceName}],
          optionalServices: [bleService]
      })
      .then(device => {
          console.log('Device Selected:', device.name);
          bleStateContainer.innerHTML = 'Connected to device ' + device.name;
          bleStateContainer.style.color = "#24af37";
          device.addEventListener('gattservicedisconnected', onDisconnected);
          return device.gatt.connect();
      })
      .then(gattServer =>{
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
          characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicChange);
          characteristic.startNotifications();
          console.log("Notifications Started.");
          return characteristic.readValue();
      })
      .then(value => {
          console.log("Read value: ", value);
          const decodedValue = new TextDecoder().decode(value);
          console.log("Decoded value: ", decodedValue);
          retrievedValue.innerHTML = decodedValue;
      })
      .catch(error => {
          console.log('Error: ', error);
      })
  }

  function onDisconnected(event){
      console.log('Device Disconnected:', event.target.device.name);
      bleStateContainer.innerHTML = "Device disconnected";
      bleStateContainer.style.color = "#d13a30";
      connectToDevice();
  }

  function handleCharacteristicChange(event){
      const valor = new TextDecoder().decode(event.target.value).trim();
      console.log("Characteristic value changed: ", valor);
      //Mostrar el valor en pantalla
      retrievedValue.innerHTML = valor[0] + valor[1];
      timestampContainer.innerHTML = getDateTime();
      //Reproducir el audio correspondiente usando el mapa de cartas
      const mvalor = valor[0] + valor[1];
      reproducirAudioParaTag(mvalor);
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

      mostrarCartaVisual(tag); // 👈 muestra en pantalla la carta también
  } else {
      console.warn(`No se encontró archivo de audio para: ${tag}`);
      console.log("Tag:", tag, "→ Archivo:", archivo);
      audio.removeAttribute('src'); // 🔒 importante para evitar reproducción vacía
      audio.load(); // Resetea el elemento <audio>
  }
  }

  function mostrarCartaVisual(tag) {
      const display = document.getElementById('cartaDisplay');
      display.innerText = tag;
      display.style.display = 'block';
      display.style.opacity = 1;

      setTimeout(() => {
          display.style.opacity = 0;
          setTimeout(() => {
              display.style.display = 'none';
          }, 300);
      }, 2000);
  }


  function writeOnCharacteristic(value){
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
          console.error ("Bluetooth is not connected. Cannot write to characteristic.")
          window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!")
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
          // Throw an error if Bluetooth is not connected
          console.error("Bluetooth is not connected.");
          window.alert("Bluetooth is not connected.")
      }
  }

  function getDateTime() {
      var currentdate = new Date();
      var day = ("00" + currentdate.getDate()).slice(-2); // Convert day to string and slice
      var month = ("00" + (currentdate.getMonth() + 1)).slice(-2);
      var year = currentdate.getFullYear();
      var hours = ("00" + currentdate.getHours()).slice(-2);
      var minutes = ("00" + currentdate.getMinutes()).slice(-2);
      var seconds = ("00" + currentdate.getSeconds()).slice(-2);

      var datetime = day + "/" + month + "/" + year + " at " + hours + ":" + minutes + ":" + seconds;
      return datetime;
  }


