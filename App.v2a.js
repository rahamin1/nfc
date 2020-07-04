import React from 'react'
import {
  View, Text, TouchableOpacity
} from 'react-native'
import NfcManager, {NfcEvents, NfcAdapter} from 'react-native-nfc-manager';

class App extends React.Component {
  componentDidMount() {
    console.log('NfcManager.start()')
    NfcManager.start();
    console.log('NfcManager.setEventListener()')
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.log('NfcEvents.DiscoverTag')
      console.warn('tag', tag);
      NfcManager.setAlertMessageIOS('I got your tag!');
      NfcManager.unregisterTagEvent().catch(() => 0);
    });
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  render() {
    return (
      <View style={{padding: 20}}>
        <Text>NFC Demo</Text>
        <TouchableOpacity
          style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
          onPress={this._test}
        >
          <Text>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
          onPress={this._cancel}
        >
          <Text>Cancel Test</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _cancel = () => {
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _test = async () => {
    try {
      //await NfcManager.registerTagEvent({alertMessage: 'my message', readerModeFlags: NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS});
      await NfcManager.registerTagEvent();
    } catch (ex) {
      console.warn('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  }
}

export default App
