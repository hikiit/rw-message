// UUID
const SERVICE_UUID = "";
const CHARACTERISTIC_UUID = "";

// キャラクタリスティック
let bleCharacteristic;

let searchButton;
let readButton;

let loading;

function init() {
  searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", searchBLE);

  readButton = document.querySelector("#read-button");
  readButton.addEventListener("click", readValueBLE);
  
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
      return service.getCharacteristic(CHARACTERISTIC_UUID);
    })
    .then(characteristic => {
      console.log("success:characteristic");

      bleCharacteristic = characteristic;
      
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
  var ary_u8 = new Uint8Array( [] );
  bleCharacteristic.writeValue(ary_u8);
  console.log("testPrint")
}

window.addEventListener("load", init);
