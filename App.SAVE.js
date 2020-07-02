import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Nfc from './services_nfc';

const g_nfc = new Nfc();
g_nfc.start();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {uuid: ' '};
    this.onNfcScan = this.onNfcScan.bind(this);
  }

  async componentDidMount() {
    //  register nfc event
    g_nfc.register(this.onNfcScan);
  }

  componentWillUnmount() {
    g_nfc.unregister(this.onNfcScan);
  }

  async onNfcScan(uuid) {
    console.log('In onNfcScan. uuid: ', uuid);
    this.setState({uuid});
  }

  render() {
    return (
      <View>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>uuid:</Text>
            <Text style={styles.sectionDescription}>{this.state.uuid}</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>---</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
