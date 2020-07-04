import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supported: true,
            enabled: false,
            tag: {},
            skuUid: '----------------',
        };
    }

    componentDidMount() {
        NfcManager.isSupported()
            .then(supported => {
                this.setState({ supported });
                if (supported) {
                    this._startNfc();
                    this._startDetection();
                }
            })
            .catch(error => {
                    console.warn('device does not support nfc!');
                    this.setState({supported: false});
                });
    }

    componentWillUnmount() {
        NfcManager.stop();
    }

    render() {
        let { supported, enabled, skuUid } = this.state;
        return (
            <ScrollView style={{flex: 1}}>
                { Platform.OS === 'ios' && <View style={{ height: 60 }} /> }

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{`Is NFC supported ? ${supported}`}</Text>
                    <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._startDetection}>
                        <Text style={{ color: 'blue' }}>Start Tag Detection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._stopDetection}>
                        <Text style={{ color: 'red' }}>Stop Tag Detection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={this._clearMessages}>
                        <Text>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }}
                        onPress={() => console.warn('test test test')}>
                        <Text>Test</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 50 }}>
                      <Text>
                        {`skuUid: ${skuUid}`}
                      </Text>
                    </View>

                </View>
            </ScrollView>
        )
    }

    _startNfc() {
        NfcManager.start({
            onSessionClosedIOS: () => {
                console.log('ios session closed');
            },
        })
            .then(result => {
                console.log('start OK', result);
            })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            });

        if (Platform.OS === 'android') {
            NfcManager.isEnabled()
                .then(enabled => {
                    this.setState({ enabled });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    _onTagDiscovered = tag => {
        console.log('--Tag Discovered:', tag);
        console.log('tag.ndefMessage[0].payload:', tag.ndefMessage[0].payload);

        let bytesToStr = bytes => bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

        if (tag &&
          tag.ndefMessage &&
          tag.ndefMessage.length > 0 &&
          tag.ndefMessage[0].payload) {
          let uuid = bytesToStr(tag.ndefMessage[0].payload);
          this.setState({skuUid: uuid});
          console.log('uuid:', uuid);
        } else {
          console.log('uuid:', 'NONE');
          this.setState({skuUid: 'NONE'});
          return;
        }
    }

    _startDetection = () => {
console.warn('--- _startDetection')
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.log('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
console.warn('--- _stopDetection')
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }
}

export default App;
