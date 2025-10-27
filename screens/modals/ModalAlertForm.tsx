import React, {Component} from 'react';
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
import myFonctions  from '../../components/MyFonctions';

// Language
import TextLocalized from '../../utils/locales/langs';
import {I18n} from 'i18n-js';
const i18n = new I18n(TextLocalized);
 i18n.locale = myFonctions.CleanLocale(Localization.locale)


import { Ionicons } from '@expo/vector-icons';
//import { Constants } from 'expo';
import  ItemRow from '../../components/ItemRow';
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

export default class ModalAlertForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalPostActionVisible: false,
      navigation : this.props.navigation, // navigation go back for stack
      //postUpdate : this.props.postUpdate,
      postId: this.props.post_id,
      token: this.props.token,
      modalTitle: this.props.modalTitle,
      modalText: "this.props.modalText,",
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
    
    const {modalPostActionVisible, visible} = this.state;
    const { navigate } = this.props.navigation;
    const {postId} = this.state;
    //console.log("RENDER MODAL DELETE postUpdatepostUpdatepostUpdatepostUpdatepostUpdatepostUpdate", postId)
    
    var modalBackgroundStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          };

  





       
        return (
            <View style={styles.container}>
        <Modal
        
        animationType="fade"
        transparent={ true }
        //presentationStyle="formSheet"
        visible={ this.state.modalPostActionVisible }
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
            
            <View style={[styles.modalView]}>
              <View style={[styles.modalContent]}>
                
               

                <View style={{backgroundColor:"white", top:10, height:40, justifyContent: 'center',}}> 
        <Text style={{ justifyContent: 'center', textAlign: 'center', color:"red",fontSize: 20, fontWeight: 'bold' }}>{this.state.modalTitle}</Text>
       </View>

       <View style={{backgroundColor:"white", justifyContent: 'center', padding:10}}> 
        <Text style={{ justifyContent: 'center', textAlign: 'center', lineHeight: 22, color:"black",fontSize: 15, fontWeight: 'normal' }}>{this.state.modalText}</Text>
       </View>

      


       <View style={{flexDirection:'row'}}>


         <View style={{borderWidth:0,flex:1 }}>
         <TouchableOpacity onPress={() => this._onClose()}>
            <Text style={{padding:10, textAlign: 'center', color:'red', fontSize: 15, fontWeight: 'bold' ,  alignItems:'center',  justifyContent: "center", }}>{this.state.modalValid}</Text>
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
        flex:1,
       
      },


  // Modal

  modalView: {
    width:ScreenWidth,
    height:ScreenHeight,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        top:0,
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
    
    width:'80%',
      marginRight:'10%',
      marginLeft:'10%',
      borderRadius:12,
      
    
      //opacity: 1,
      ...Platform.select({
        ios: {
          //height: 300,
          //position: 'absolute',
          top: ScreenHeight /2.22 ,
         borderTopLeftRadius: 12,
         borderTopRightRadius: 12,
        },
        android: {
          elevation: 3,
          backgroundColor: '#FFFFFF',
          //opacity: 1,
          //position: 'absolute',
          top: ScreenHeight /2 ,
          height: 400,
        
        },
      }),
     
      backgroundColor: 'white',
     
  },

  modalCancel: {
    
    width:'96%',
    marginRight:'2%',
    marginLeft:'2%',
    borderRadius:22,
    
  
    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 60,
        //position: 'absolute',
        top: ScreenHeight- ScreenHeight / 1.9,
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

  bloc_: {
    justifyContent: 'center',
    paddingLeft: 5,
    alignItems: 'center',
    //backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'red',
    //borderRadius: 26,


  },
  line_spacer: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,

  },



  bloc_Row: {
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    borderColor: '#000',
    height: 40,
    borderRadius: 22,
  
    
  },
  bloc_: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft:5,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'red',
    //borderRadius: 26,
  
    
  },
  

  bloc_right: {
    flexDirection: 'row',
    paddingLeft:230,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'green',
    height: 20,
    //borderRadius: 26,
  
    
  },

  bloc_text_titre: {
    flexDirection: 'row',
    padding:30,
    alignItems: 'center',
    backgroundColor: '#fff',
    color:'#000',
    //borderWidth: 1,
    //borderColor: 'green',
   
    //borderRadius: 26,
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    
  },

  black: {
    color: '#000',

  },

  white: {
    color: '#FFF',
  },
  bold : {
    fontWeight: 'bold',


  },
  view: {
    //width:390,
    height:200,
    backgroundColor: '#394163',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',

  },

  viewClose: {
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,

    borderTopColor: '#ccc',
    height: 50,
    color: '#000',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },


  view_astro: {

    flexDirection: 'row',
    height:40,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    alignItems: 'center',
    //justifyContent: 'space-between',
  },

  label_astro: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',


  },

  label_detail: {
    paddingLeft: 10,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',


  },
  flex: {
    flex: 1,
    flexDirection: 'row',

    flexWrap: 'wrap',
    alignItems: 'center',

  },

  temp: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,
  },

  detail: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },

  first_temp: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,

  },
    maxTemp: {
    color: '#efd91c',
    fontSize: 30,


  },


  icon: {
    width: 80,
    height: 80
  },


  icon_first: {
    width: 120,
    height: 120,
    bottom:10,


  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  picture: { width: 50, height: 50, borderRadius: 25, marginRight: 18 },
  primaryText: {
  fontWeight: 'bold',
  fontSize: 18,
  color: 'black',
  marginBottom: 4,
  },
  secondaryText: { color: 'grey' },
})
