import NfcManager, { NdefParser } from 'react-native-nfc-manager';

//  Instantiate at most once.
class Nfc {
  constructor() {
    this.d_onNfcScanCallback = null;
    this.register = this.register.bind(this);
  }

  register(onNfcScanCallback) {
    this.d_onNfcScanCallback = onNfcScanCallback;
  }

  unregister(onNfcScanCallback) {
    if (this.d_onNfcScanCallback === onNfcScanCallback) {
      this.d_onNfcScanCallback = null;
    }
  }

  start() {
    // new nfc module testing
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log('ios session closed');
      },
    })
    .then(result => {
      console.log('start OK', result);
      NfcManager.registerTagEvent(tag => {
        let bytesToStr = bytes => bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        if (tag &&
          tag.ndefMessage &&
          tag.ndefMessage.length > 0 &&
          tag.ndefMessage[0].payload) {
          skuUuid = bytesToStr(tag.ndefMessage[0].payload);
        } else {
          return;
        }

        // console.log('render modal sku: ', skuUuid);
        if (skuUuid === undefined) {
          throw Error("SKU not found in SKU Database");
        }
        if (this.d_onNfcScanCallback !== null) {
          this.d_onNfcScanCallback(skuUuid);
        }
      }, 'Hold your device over the tag', true)
    })
    .catch(error => {
      console.warn('device does not support nfc!');
    })
  }
};

export default Nfc;
