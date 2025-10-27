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
  Icone,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//import { Constants } from 'expo';
import  ItemRow from '../../components/ItemRow';
import Icon from 'react-native-vector-icons/fontawesome';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import myFonctions  from '../../components/MyFonctions';

// Language
import TextLocalized from '../../utils/locales/langs';
import {I18n} from 'i18n-js';
const i18n = new I18n(TextLocalized);
 i18n.locale = myFonctions.CleanLocale(Localization.locale)


// Window Device
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class ModalMenuSettings extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalSearchVisible: false,
      navigation : this.props.navigation, // navigation go back for stack
    };
    //console.log('----> MODAL LEGEND', this.state);
  };


  // Close Modal
  _onClose = () => {
    this.setState({
      modalSearchVisible: false
    });
  };

  GoToMap() {
    this.setState({
      modalSearchVisible:false
    });
    console.log("Click navitation to Map")
    //this.props.navigation.navigate('Auth');
    this.props.navigation.navigate('SearchScreenMap');
  };

  GoToFriendsScreen() {
    this.setState({
      modalSearchVisible:false
    });
    console.log("Click navitation to Map")
    //this.props.navigation.navigate('Auth');
    this.props.navigation.navigate('FriendsScreen');
  };

  
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      modalSearchVisible: nextProps.modalSearchVisible,
     // navigation:  nextProps.navigation
    });
  };



  GoNotificationScreen() {
    this.setState({
      modalSearchVisible:false
    });
    console.log("Click to navitate to stack")
    //this.props.navigation.navigate('Auth');
    this.props.navigation.navigate('NotificationScreen');
  };

  
  GoToPetProfile() {
    this.setState({
      modalSearchVisible:false
    });
    console.log("Click to navitate to stack")
    //this.props.navigation.navigate('Auth');
    this.props.navigation.navigate('Petprofile');
  };
  
  
  render() {
    
    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    };
    
    return (
      <View style={styles.container}>
        <Modal
        animationType="slide"
        transparent={ true }
        //presentationStyle="formSheet"
        visible={this.state.modalSearchVisible}
        onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        }}>
            
            <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainerTransparentStyle]}>
              {/* CLOSE PAN */}
              <TouchableOpacity  onPress={() => this._onClose()}>
                <View style={[styles.line_spacer]}></View>
              </TouchableOpacity>
              {/* END CLOSE PAN */}



               

                   

                        {/* Appel class component ItemRow */}
                       {/* Bloc container List items  */}

    


            {/* ROW icones */}
            {/* User Profile */}
            <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToMap()}>
                    <View style={styles.buttontouchicon}>
                        <Feather name='map' size={25} color="red" />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Animals_Map')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color="red" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

             {/* User Profile */}
             <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToPetProfile()}>
                    <View style={styles.buttontouchicon}>
                        <AntDesign name='swap' size={25} color="red" />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Swap_Fiancy')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color="red" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* User Settings */}
            <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoNotificationScreen()}>
                    <View style={styles.buttontouchicon}>
                        <AntDesign name='warning' size={25} color="red" />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Alert_Lost')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color="red" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
             {/* User Settings */}
             <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToFriendsScreen()}>
                    <View style={styles.buttontouchicon}>
                        <MaterialIcons name='group' size={25} color="red" />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Seefriends')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color="red" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
             {/* User Settings */}
             <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.Navigatetostack2()}>
                    <View style={styles.buttontouchicon}>
                        <Feather name='settings' size={25} color="red" />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.Settings')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color="red" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

       
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
        backgroundColor: '#ecf0f1',
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
  line_spacer: {
      padding:10,
    justifyContent: 'flex-start',
      height:10,
   
       marginLeft:180,
       marginRight:180,
    borderBottomColor: '#c0c0c0',
    opacity: 0.9,
    borderBottomWidth: 5,
    marginBottom:20,

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
