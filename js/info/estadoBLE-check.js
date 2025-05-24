// js/info/estadoBLE-check.js
document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("checkBluetoothBtn");
  const bleMessages = document.getElementById("ble-messages");
  console.log("Botón checkBluetoothBtn:", checkBtn);
  console.log("Div ble-messages:", bleMessages);
  if (!checkBtn || !bleMessages) {
    console.warn("No se encontraron elementos requeridos en estadoBLE-check.js");
    return;
  };

  checkBtn.addEventListener("click", () => {
    bleMessages.classList.add("visible");
    checkBtn.disabled = true;
    checkBtn.style.cursor = "not-allowed";

    // Cambia ícono si fuera necesario
    const okVisible = bleMessages.querySelector(".ble-ok")?.offsetParent !== null;
    const estadoBLEIcon = document.getElementById("estadoBLEIcon");

    if (estadoBLEIcon) {
      const iconMap = {
        ok: "../icons/check_circle_16_D9D9D9.svg",
        warning: "../icons/block_16_D9D9D9.svg"
      };
      estadoBLEIcon.src = okVisible ? iconMap.ok : iconMap.warning;
      estadoBLEIcon.alt = okVisible ? "BLE disponible" : "BLE no disponible";
      estadoBLEIcon.title = estadoBLEIcon.alt;
    }

    setTimeout(() => {
      bleMessages.classList.remove("visible");
      checkBtn.disabled = false;
      checkBtn.style.cursor = "pointer";
    }, 5000);
  });

  // Activar mensajes automáticamente al cargar
  bleMessages.classList.add("visible");
  setTimeout(() => {
    bleMessages.classList.remove("visible");
  }, 5000);
});
function initEstadoBLE() {
  const checkBtn = document.getElementById("checkBluetoothBtn");
  const bleMessages = document.getElementById("ble-messages");
  if (!checkBtn || !bleMessages) {
    console.warn("No se encontraron elementos requeridos para Estado BLE");
    return;
  }

  // Mostrar mensaje automáticamente al cargar
  bleMessages.classList.add("visible");
  setTimeout(() => {
    bleMessages.classList.remove("visible");
  }, 5000);

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
