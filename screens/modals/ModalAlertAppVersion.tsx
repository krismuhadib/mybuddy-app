import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Platform,
  FlatList,
  AppRegistry,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
  TextInput,
  Modal,
  ScrollView,
  Icone
} from 'react-native';
// Langue
import * as Localization from 'expo-localization';
import myFonctions from '../../components/MyFonctions';

// Language
import TextLocalized from '../../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
i18n.locale = myFonctions.CleanLocale(Localization.locale)


import { Ionicons } from '@expo/vector-icons';
//import { Constants } from 'expo';
import ItemRow from '../../components/ItemRow';
import Icon from 'react-native-vector-icons/fontawesome';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Window Device
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

var config = require('../../config.tsx');

interface Props {
  navigation: NavigationScreenProps<NavigationState, NavigationParams>
}

export default class ModalAlertAppVersion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalPostActionVisible: false,
      navigation: this.props.navigation, // navigation go back for stack
      //postUpdate : this.props.postUpdate,
      postId: this.props.post_id,
      token: this.props.token,
      modalTitle: this.props.modalTitle,
      modalText: this.props.modalText,
      modalText2: this.props.modalText2,
      modalValid: this.props.modalValid,

    };
    //console.log("MODAL ACTION DELETE POSTUPDATE", this.state.postId, this.state.token)
  }

  // Modal
  _onClose = () => {
    this.setState({
      modalPostActionVisible: false,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      modalPostActionVisible: nextProps.modalPostActionVisible,
      modalText: nextProps.modalText,



    });
  };





  render() {

    const { modalPostActionVisible, visible } = this.state;
    const { navigate } = this.props.navigation;
    const { postId } = this.state;
    //console.log("RENDER MODAL DELETE postUpdatepostUpdatepostUpdatepostUpdatepostUpdatepostUpdate", postId)

    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    };








    return (
      <View style={styles.container}>
        <Modal

          animationType="fade"
          transparent={true}
          //presentationStyle="formSheet"
          visible={this.state.modalPostActionVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>

          <View style={[styles.modalView]}>
            <View style={[styles.modalContent]}>



              <View style={{ backgroundColor: "white", top: 10, height: 40, justifyContent: 'center', paddingBottom:20, }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: "red", fontSize: 20, fontWeight: 'bold' }}>{this.state.modalTitle}</Text>
              </View>


              <View style={{ backgroundColor: "white", justifyContent: 'center', padding: 10 }}>
              <View style={{ top:5 }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', lineHeight: 22, color: "black", fontSize: 15, fontWeight: 'normal' }}>{this.state.modalText}</Text>
              </View>

              <View style={{top:10, paddingBottom:20 }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', lineHeight: 22, color: "black", fontSize: 15, fontWeight: 'normal' }}>{this.state.modalText2}</Text>
              </View>

              </View>



              





              <View style={{ flexDirection: 'row' }}>


                <View style={{ borderWidth: 0, flex: 1, padding:10 }}>
                  <TouchableOpacity onPress={() => this._onClose()}>
                    <Text style={{ padding: 10, textAlign: 'center', color: 'red', fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{this.state.modalValid}</Text>
                  </TouchableOpacity>
                </View>


              </View>





            </View>



          </View>

        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({




  container: {
    flex: 1,

  },


  // Modal

  modalView: {
    width: ScreenWidth,
    height: ScreenHeight,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        top: 0,
        backgroundColor: '#000000',
        //position: 'absolute',
        elevation: 1,
        opacity: 1,
        //top:140,

      },
    }),


    //top:ScreenHeight - 100,
  },
  modalContent: {

    width: '80%',
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,


    //opacity: 1,
    ...Platform.select({
      ios: {
        //height: 300,
        //position: 'absolute',
        top: ScreenHeight / 2.22,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: ScreenHeight / 2,
        height: 400,

      },
    }),

    backgroundColor: 'white',

  },

  modalCancel: {

    width: '96%',
    marginRight: '2%',
    marginLeft: '2%',
    borderRadius: 22,


    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 60,
        //position: 'absolute',
        top: ScreenHeight - ScreenHeight / 1.9,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,

      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: ScreenHeight - 330,
        height: 60,

      },
    }),

    backgroundColor: 'white',

  },


  line_spacer: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,

  },


})
