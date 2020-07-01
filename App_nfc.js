import Nfc from '../services/services_nfc';

const g_nfc = new Nfc;
g_nfc.start();

class App extends Component {
  constructor(props) {
    super(props);

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
  }

}

const mapDispatchToProps = dispatch => {
  return {
    setNfcInstance: (instance) =>
      dispatch({ type: 'SET_NFC_INSTANCE', payload: instance }),
}

const AppRedux = connect(mapStateToProps, mapDispatchToProps)(App);
