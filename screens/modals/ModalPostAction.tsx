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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);



interface Props {
  navigation: NavigationScreenProps<NavigationState, NavigationParams>
}

export default class ModalPostAction extends Component {
  
  constructor(props) {
    super(props);
    this.state = {

      modalPostActionVisible: false,
      navigation : this.props.navigation, // navigation go back for stack
      postUpdate : this.props.postUpdate,
      //postId: this.props.route.navigate.post_id,
    };
    //console.log("MODAL ACTIONpostUpdatepostUpdatepostUpdate", this.state.postUpdate)
  }
  // Close Modal
  _onClose = () => {
      this.setState({
        modalPostActionVisible: false,
       });
      }

        // Close CAMERA MODAL CHOICE
    onCloseModalCamera () {
      this.setState({
        modalPostActionVisible: false,
       });
    };
      
      UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
          modalPostActionVisible: nextProps.modalPostActionVisible,
          //navigation:  nextProps.navigation,
        });
      }

     
      
      GoToUpdatePost() {
        this.setState({
          modalPostActionVisible:false,
           
          })
          console.log("Click to navitate to stack")
          //this.props.navigation.navigate('Auth');
          this.props.navigation.navigate('UpdatePost', {
            screen: 'UpdatePost',
            postUpdate: this.state.postUpdate,
            visible:false
            })
    
    
  }
        GoToUserProfile = () => {
            this.setState({
              modalPostActionVisible:false
               
              })
          
          }


    
      render() {


        const {modalPostActionVisible, visible} = this.state;

        const { navigate } = this.props.navigation;

        const {postUpdate} = this.state;

        //console.log("modalPostActionVisiblemodalPostActionVisiblemodalPostActionVisible", this.state.modalPostActionVisible)

        
       

        
        var modalBackgroundStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          };

          function GoToUpdatePost ({ navigation, visible }) {
           visible= false;
          return (
            <TouchableOpacity  onPress={() =>  navigate('UpdatePost', {
            screen: 'UpdatePost',
            postUpdate: postUpdate,
            visible:false
            }) }> 
            <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: 'normal', alignItems:'center',  justifyContent: 'center', }}>{i18n.t('Modal.Modify')}</Text>
            </TouchableOpacity> 
            );
          
            
          }





       
        return (
            <View style={styles.container}>
        <Modal
        
        animationType="slide"
        transparent={ true }
        //presentationStyle="formSheet"
        visible={ this.state.modalPostActionVisible }
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
            
            <View style={[styles.viewModalCamera]}>
              <View style={[styles.modalSecurityStyle]}>
                <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{i18n.t('Modal.Modify_Post')}</Text>
                
                <View style={[styles.line_spacer]}></View>

                <TouchableOpacity  onPress={() => this.GoToUpdatePost()}>
            <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: 'normal', alignItems:'center',  justifyContent: 'center', }}>{i18n.t('Modal.Modify')}</Text>
            </TouchableOpacity> 



            <TouchableOpacity onPress={this.takePictureAndCreateAlbum}>
                    <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: 'normal',  alignItems:'center',  justifyContent: 'center', }}>{i18n.t('Modal.Share')}</Text>
                  </TouchableOpacity>



                  



                  <View style={[styles.line_spacer]}></View>

                  <View style={[styles.line_spacer]}></View>

                  <TouchableOpacity  onPress={() => this.GoToUpdatePost()}>
                    <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 15, fontWeight: 'normal', alignItems:'center',  justifyContent: 'center', }}>{i18n.t('Modal.Delete')}</Text>
                  </TouchableOpacity>







                   </View>

                <View style={[styles.modalSecurityStyleAbort]}>
                    <TouchableOpacity onPress={() => this.onCloseModalCamera()}>
                    <Text style={{marginVertical:20, textAlign: 'center', color:'red', fontSize: 15, fontWeight: 'bold' ,  alignItems:'center',  justifyContent: 'center', }}>{i18n.t('Modal.Cancel')}</Text>
                  </TouchableOpacity>
                  </View>

                </View>
                 
                  </Modal>
                  </View>
                  )
                }
              }

const styles = StyleSheet.create({

    innerContainerTransparentStyle: {
        width:windowWidth,
        top:windowHeight/4,
        backgroundColor: 'white',
        height:400,
        borderRadius:22,

    },

    buttontouchicon: {
        marginLeft: 0,
      },


    buttontouchtext: {
        marginLeft: 20,
        fontFamily: 'Roboto-Regular',
    
        fontSize: 15,
        //textAlign:'left',
        //justifyContent: 'center',
      },
      
    buttontouch: {
        marginRight:20,
        marginLeft:20,
        flex:1,
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        opacity: 0.9,
        borderBottomWidth: 1,
        alignItems: 'center',
      },


    container: {
        flex:1,
       
      },

  modalStyle: {
      width:400,
    top:160,
    backgroundColor: '#ccc',
    height:700,
    borderRadius: 30,
    borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,

  },
  // Modal

  viewModalCamera: {
     
     
     
    width:'100%',
    height:'100%',
    ...Platform.select({
      ios: {
       
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        top:-100,
        backgroundColor: '#000000',
        //position: 'absolute',
        elevation: 1,
        opacity: 1,
        //top:140,

      },
    }),


    //top:ScreenHeight - 100,
  },
  modalSecurityStyle: {
    
    width:'96%',
    marginRight:'2%',
    marginLeft:'2%',
    borderRadius:22,
    
  
    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 220,
        //position: 'absolute',
        top: ScreenHeight -320,
       borderTopLeftRadius: 22,
       borderTopRightRadius: 22,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top:ScreenHeight -350,
        height: 300,
      
      },
    }),
   
    backgroundColor: 'white',
   
  },

  modalSecurityStyleAbort: {
    
    width:'96%',
    marginRight:'2%',
    marginLeft:'2%',
    borderRadius:22,
    
  
    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 60,
        //position: 'absolute',
        top: ScreenHeight -305,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
     
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: 40,
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
