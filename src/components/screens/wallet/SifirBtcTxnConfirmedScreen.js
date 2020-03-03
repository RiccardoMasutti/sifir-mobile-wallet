// TODO rename this to txnDetails
import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {payBolt} from '@actions/lnWallet';

class SifirBtcTxnConfirmedScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (this.props.route.params.type === 'lnInvoice') {
      console.log('lnInvoice in CDM------');
      this.payBolt();
    }
  }

  payBolt = async () => {
    const {bolt11, route} = this.props.route.params;
    console.log('calling payBolt() with param', {bolt11, route});
    const info = await this.props.payBolt(bolt11, route);
    console.warn('payBolt() response----------', info);
  };

  done = () => {
    const {walletInfo} = this.props.route.params;
    this.props.navigation.navigate('Account', {walletInfo});
  };

  render() {
    // const {
    //   txnInfo: {amount, address, isSendTxn},
    // } = this.props.route.params;
    // TODO remove from here
    // const {loaded, loading, btcSendResult} = this.props.btcWallet;
    // const addrTxtFontSize = (C.vw * 250) / address.length;

    // FIXME uncomment and fix the below code once done with payBolt() action.

    return (
      <View />
      // <View style={styles.mainView}>
      //   {loading === true && (
      //     <View style={styles.loading}>
      //       <ActivityIndicator size="large" color={AppStyle.mainColor} />
      //     </View>
      //   )}
      //   {loaded === true && btcSendResult !== null && (
      //     <>
      //       <View style={{alignItems: 'center', flex: 3}}>
      //         <Image source={Images.icon_done} style={styles.checkImg} />
      //         <Text style={styles.paymentTxt}>{C.STR_PAYMENT}</Text>
      //         <Text style={styles.addressLblTxt}>
      //           {isSendTxn ? C.STR_SENT : C.STR_RECEIVED}
      //         </Text>
      //         <Text style={styles.payAddrTxt}>
      //           {C.STR_PAYMENT +
      //             ' ' +
      //             (isSendTxn ? C.STR_RECEIPIENT : C.STR_SENDER)}
      //         </Text>
      //         <Text style={[styles.addrTxt, {fontSize: addrTxtFontSize}]}>
      //           {address}
      //         </Text>
      //         <Text style={styles.amountLblTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
      //         <Text style={styles.amountTxt}>{amount + ' ' + C.STR_BTC}</Text>
      //       </View>
      //       <TouchableOpacity
      //         style={styles.doneTouch}
      //         onPressOut={() => this.done()}>
      //         <View
      //           shadowColor="black"
      //           shadowOffset="30"
      //           style={styles.doneView}>
      //           <Text style={styles.doneTxt}>{C.STR_DONE}</Text>
      //         </View>
      //       </TouchableOpacity>
      //     </>
      //   )}
      // </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
  };
};

const mapDispatchToProps = {payBolt};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcTxnConfirmedScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  doneView: {
    width: C.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  paymentTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: 10,
  },
  addressLblTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: -30,
  },
  payAddrTxt: {
    color: AppStyle.mainColor,
    marginTop: 20,
    fontFamily: AppStyle.mainFontBold,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  amountLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 25,
    fontFamily: AppStyle.mainFontBold,
  },
  amountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
  },
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  doneTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
