// UUID
const SERVICE_UUID = "713d0000-503e-4c75-ba94-3148f18d941e";
const TX_CHARACTERISTIC_UUID = "713d0003-503e-4c75-ba94-3148f18d941e";
const RX_CHARACTERISTIC_UUID = "713d0002-503e-4c75-ba94-3148f18d941e";

// キャラクタリスティック
let txCharacteristic;
let rxCharacteristic;

let searchButton;
let readButton;

let loading;

function init() {
  searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", searchBLE);

  readButton = document.querySelector("#read-button");
  readButton.addEventListener("click", readValueBLE);

  writeButton = document.querySelector("#write-button");
  writeButton.addEventListener("click", writeValueBLE);

  loading = document.querySelector("#loading");
}

// BLEデバイスに接続
function searchBLE() {
  // loading表示
  loading.className = "show";

  // acceptAllDevicesの場合optionalServicesが必要?
  navigator.bluetooth.requestDevice({
    optionalServices:[SERVICE_UUID],
    acceptAllDevices:true
  })
  
    .then(device => { 
      console.log("devicename:" + device.name);
      console.log("id:" + device.id);

      // 選択したデバイスに接続
      return device.gatt.connect();
    })

    .then(server => {
      console.log("success:connect to device");

      // UUIDに合致するサービス(機能)を取得
      return server.getPrimaryService(SERVICE_UUID);
    })

    .then(service => {
      console.log("success:service");
      // UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得
      return Promise.all([
        service.getCharacteristic(RX_CHARACTERISTIC_UUID),
        service.getCharacteristic(TX_CHARACTERISTIC_UUID)
      ]);
      
    })
    .then(characteristic => {
      console.log("success:txcharacteristic");

      txCharacteristic = characteristic[0];
      rxCharacteristic = characteristic[1];

      console.log("success:connect BLE");      
      loading.className = "hide";
    })

    .catch(error => {
      console.log("Error : " + error);

      // loading非表示
      loading.className = "hide";
    });
}

function readValueBLE() {
//  var ary_u8 = new Uint8Array( [] );
let message;

  try {
    rxCharacteristic.readValue()
      .then(value => {
        message = value.getUint8(0);
        console.log(message);
      });
  }
  catch (e) {
    console.log(e);
  }
}

function writeValueBLE() {
  var form_d = document.getElementById("data-form").value;
  var ary_u8 = new Uint8Array( new TextEncoder("utf-8").encode(form_d) );
  console.log(ary_u8);
  try {
    txCharacteristic.writeValue(ary_u8);
  }
  catch (e) {
    console.log(e);
  }
}

window.addEventListener("load", init);
