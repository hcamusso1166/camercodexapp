(function () {
  const BLE = {
    deviceName: 'MrCamerDev1.0',
    serviceUuid: '19b10000-e8f2-537e-4f6c-d104768a1214',
    sensorCharacteristicUuid: '19b10001-e8f2-537e-4f6c-d104768a1214',
    ledCharacteristicUuid: '19b10002-e8f2-537e-4f6c-d104768a1214',
    batteryCharacteristicUuid: '9b04030c-2f33-42b2-9fc5-a97a44a1145d',
    storageKey: 'cc_ble_autoreconnect'
  };

  const state = {
    device: null,
    server: null,
    service: null,
    sensorCharacteristic: null,
    batteryCharacteristic: null,
    connected: false,
    lastPayload: null,
    payloadSubs: new Set(),
    statusSubs: new Set()
  };

  function emitStatus(type, extra = {}) {
    const msg = { type, connected: state.connected, ...extra };
    state.statusSubs.forEach((cb) => {
      try { cb(msg); } catch (_) {}
    });
  }

  function emitPayload(payload, meta = {}) {
    state.lastPayload = payload;
    state.payloadSubs.forEach((cb) => {
      try { cb(payload, meta); } catch (_) {}
    });
  }

  function rememberAutoReconnect(enabled) {
    try {
      if (enabled) {
        sessionStorage.setItem(BLE.storageKey, '1');
      } else {
        sessionStorage.removeItem(BLE.storageKey);
      }
    } catch (_) {}
  }

  function wantsAutoReconnect() {
    try {
      return sessionStorage.getItem(BLE.storageKey) === '1';
    } catch (_) {
      return false;
    }
  }

  function decodePayload(dataView) {
    const len = dataView?.byteLength || 0;
    if (len >= 10) {
      const version = dataView.getUint8(0);
      if (version === 1) {
        return String.fromCharCode(
          dataView.getUint8(3),
          dataView.getUint8(4),
          dataView.getUint8(5),
          dataView.getUint8(6)
        );
      }
    }

    try {
      return new TextDecoder('utf-8').decode(new Uint8Array(dataView.buffer)).trim();
    } catch (_) {
      return null;
    }
  }

  function handleSensorValueChanged(event) {
    const dataView = event.target?.value;
    if (!dataView) return;

    const payload = decodePayload(dataView);
    if (!payload) return;

    emitPayload(payload, { raw: dataView });
    window.dispatchEvent(new CustomEvent('blemanager:characteristicvaluechanged', {
      detail: { value: dataView, payload }
    }));
  }

  function handleBatteryValueChanged(event) {
    const text = new TextDecoder().decode(event.target.value).trim();
    const level = parseFloat(text);
    if (!Number.isNaN(level)) {
      emitStatus('battery', { level, raw: text });
    }
  }

  async function setupConnectionFromDevice(device, source = 'manual') {
    state.device = device;

    state.device.removeEventListener('gattserverdisconnected', onDisconnected);
    state.device.addEventListener('gattserverdisconnected', onDisconnected);

    state.server = await state.device.gatt.connect();
    state.service = await state.server.getPrimaryService(BLE.serviceUuid);
    state.sensorCharacteristic = await state.service.getCharacteristic(BLE.sensorCharacteristicUuid);

    try {
      state.batteryCharacteristic = await state.service.getCharacteristic(BLE.batteryCharacteristicUuid);
    } catch (_) {
      state.batteryCharacteristic = null;
    }

    await state.sensorCharacteristic.writeValue(new Uint8Array([0]));
    state.sensorCharacteristic.removeEventListener('characteristicvaluechanged', handleSensorValueChanged);
    state.sensorCharacteristic.addEventListener('characteristicvaluechanged', handleSensorValueChanged);
    await state.sensorCharacteristic.startNotifications();

    if (state.batteryCharacteristic) {
      state.batteryCharacteristic.removeEventListener('characteristicvaluechanged', handleBatteryValueChanged);
      state.batteryCharacteristic.addEventListener('characteristicvaluechanged', handleBatteryValueChanged);
      setTimeout(() => {
        state.batteryCharacteristic?.startNotifications().catch(() => {});
      }, 150);
    }

    state.connected = true;
    rememberAutoReconnect(true);
    emitStatus('connected', { name: state.device.name || '(sin nombre)', source });
  }

  async function connect() {
    emitStatus('connecting', { source: 'manual' });

    try {
      if (isConnected()) {
        emitStatus('connected', { name: state.device?.name || '(sin nombre)', source: 'manual' });
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: BLE.deviceName }],
        optionalServices: [BLE.serviceUuid]
      });

      await setupConnectionFromDevice(device, 'manual');
    } catch (error) {
      state.connected = false;
      emitStatus('error', { error: String(error?.message || error), source: 'manual' });
      throw error;
    }
  }

  async function ensureConnected() {
    if (isConnected()) {
      return true;
    }

    if (!wantsAutoReconnect() || typeof navigator.bluetooth?.getDevices !== 'function') {
      return false;
    }

    emitStatus('connecting', { source: 'auto' });

    try {
      const devices = await navigator.bluetooth.getDevices();
      const candidate = devices.find((device) => device?.name === BLE.deviceName);
      if (!candidate) {
        emitStatus('disconnected', { source: 'auto' });
        return false;
      }

      await setupConnectionFromDevice(candidate, 'auto');
      return true;
    } catch (error) {
      state.connected = false;
      emitStatus('error', { error: String(error?.message || error), source: 'auto' });
      return false;
    }
  }

  function onDisconnected() {
    state.connected = false;
    emitStatus('disconnected');
  }

  function disconnect() {
    try {
      if (state.sensorCharacteristic) {
        state.sensorCharacteristic.removeEventListener('characteristicvaluechanged', handleSensorValueChanged);
        state.sensorCharacteristic.stopNotifications().catch(() => {});
      }

      if (state.batteryCharacteristic) {
        state.batteryCharacteristic.removeEventListener('characteristicvaluechanged', handleBatteryValueChanged);
        state.batteryCharacteristic.stopNotifications().catch(() => {});
      }

      if (state.device) {
        state.device.removeEventListener('gattserverdisconnected', onDisconnected);
      }

      if (state.device?.gatt?.connected) {
        state.device.gatt.disconnect();
      }

      rememberAutoReconnect(false);
    } finally {
      state.connected = false;
      emitStatus('disconnected');
    }
  }

  function isConnected() {
    return !!(state.device?.gatt?.connected && state.connected);
  }

  function getLastPayload() {
    return state.lastPayload;
  }

  function onPayload(cb) {
    state.payloadSubs.add(cb);
    return () => state.payloadSubs.delete(cb);
  }

  function onStatus(cb) {
    state.statusSubs.add(cb);
    return () => state.statusSubs.delete(cb);
  }

  async function writeLed(value) {
    if (!state.service || !isConnected()) {
      throw new Error('Bluetooth is not connected.');
    }

    const characteristic = await state.service.getCharacteristic(BLE.ledCharacteristicUuid);
    await characteristic.writeValue(new Uint8Array([value]));
  }

  window.bleManager = {
    connect,
    ensureConnected,
    disconnect,
    isConnected,
    getLastPayload,
    onPayload,
    onStatus,
    writeLed
  };
})();