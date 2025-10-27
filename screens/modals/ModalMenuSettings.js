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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import myFonctions from '../../components/MyFonctions';
// Language
import TextLocalized from '../../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
i18n.locale = myFonctions.CleanLocale(Localization.locale)
import Colors from '../../components/Colors';
import { GenerateGradientColors } from '../../utils/generateGradientColors';


// Window Device
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Colortext = Colors.greyH;

const Gradientcolors = GenerateGradientColors("#ff0000", "#0000ff", 5);



export default class ModalMenuSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animal_id: this.props.animal_id,
      animal_breed: this.props.animal_breed,
      iconcolor: Colors.greyH,
      modalVisible: false,
      navigation: this.props.navigation, // navigation go back for stack
    };
  };


  // Close Modal
  _onClose = () => {
    this.setState({
      modalVisible: false,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
      navigation: nextProps.navigation,
    });
  };

  GoToFriendsScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('AnimalFriendsScreen');
  };

  GoToBlokersScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('AnimalBlokersScreen', {
      navigateTo: "User"
    });
  };


  GoToFavoriteScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('Favorite')
  };


  GoToPetProfile() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('Petprofile', {
      navigateTo: "User"
    });
  };


  GoToUserProfile() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('UserProfile');
  };

  GoToProfileScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('ProfileScreen');
  };

  GoToNewProfileScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('NewPetProfile', {
      navigateTo: "Newprofile",
      screen: 'User',
      // sendPostData : item,
      // item_message : this.state.item_message
    });

  };


  GoToSettingScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('SettingScreen');
  };

  GoToLogOutScreen() {
    this.setState({
      modalVisible: false
    });
    this.props.navigation.navigate('LogOutScreen');
  };




  render() {




    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    };

    return (
      <View style={styles.container}>
        <Modal

          animationType="fade"
          transparent={true}
          //presentationStyle="formSheet"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>

          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainerTransparentStyle]}>
              {/* CLOSE PAN */}
              <TouchableOpacity onPress={() => this._onClose()}>
                <View style={[styles.line_spacer]}>

                </View>
                {/* <View style={[styles.bloc_Row]}>
                <View style={[styles.bloc_]}>
                <Text style={{textAlign: 'center',fontSize: 20,fontWeight:'bold'}}>Modal title</Text>
                </View>
                <View style={[styles.bloc_right]}>
                  <Ionicons style={{textAlign: 'right', paddingLeft: 10}} name="md-close" size={20} color="black" /> 
               </View>
               </View>
               */}
              </TouchableOpacity>
              {/* END CLOSE PAN */}


              {/* Appel class component ItemRow */}
              {/* Bloc container List items  */}


              {/* ROW icones */}
              {/* User Profile */}
              {/*  <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToUserProfile()}>
                    <View style={styles.buttontouchicon}>
                        <AntDesign name='user' size={25} color={this.state.iconcolor} />
                    </View>
                    <View style={styles.buttontouchcontent}>
                        <Text style={styles.buttontouchtext}>User Profile</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color={this.state.iconcolor} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View> */}

              {/* Change Profile */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToProfileScreen()}>
                  <View style={styles.buttontouchicon}>
                    <MaterialCommunityIcons name='account-switch' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.Switch_Profile')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>


              {/* User Profile */}
              {(this.props.animal_breed !== "visitor") &&
                <View style={{ height: 50 }}>
                  <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToPetProfile()}>
                    <View style={styles.buttontouchicon}>
                      <AntDesign name='profile' size={25} color={this.state.iconcolor} />
                    </View>
                    <View style={styles.buttontouchcontent}>
                      <Text style={styles.buttontouchtext}>{i18n.t('Page.Profile')}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                        <AntDesign name="right" size={20} color={this.state.iconcolor} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>}




              {/* Change Profile */}
              {(this.props.animal_breed !== "visitor") &&
                <View style={{ height: 50 }}>
                  <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToNewProfileScreen()}>
                    <View style={styles.buttontouchicon}>
                      <MaterialIcons name='person-add' size={25} color={this.state.iconcolor} />
                    </View>
                    <View style={styles.buttontouchcontent}>
                      <Text style={styles.buttontouchtext}>{i18n.t('Page.Add_Profile')}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                        <AntDesign name="right" size={20} color={this.state.iconcolor} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              }

              <View style={{ flex: 1, flexDirection: "row" }}>
      {Gradientcolors.map((c, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: c }} />
      ))}
    </View>


              {/* Friends Settings */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToFriendsScreen()}>
                  <View style={styles.buttontouchicon}>
                    <MaterialIcons name='group' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.Subscriptions')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Friends Settings */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToFavoriteScreen()}>
                  <View style={styles.buttontouchicon}>
                    <Ionicons name='heart' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.My_Likes')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Blokers */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToBlokersScreen()}>
                  <View style={styles.buttontouchicon}>
                    <Ionicons name='eye-off' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.My_Blokers')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>







              {/* User Settings */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToSettingScreen()}>
                  <View style={styles.buttontouchicon}>
                    <MaterialIcons name='settings' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.Settings')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {/* User Settings */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToLogOutScreen()}>
                  <View style={styles.buttontouchicon}>
                    <MaterialIcons name='logout' size={25} color={this.state.iconcolor} />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.Log_ssOut')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={this.state.iconcolor} />
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
    width: windowWidth,
    top: windowHeight / 4,
    backgroundColor: 'white',
    height: 600,
    borderRadius: 22,

  },

  buttontouchicon: {
    marginLeft: 0,
  },


  buttontouchtext: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',
    color: Colortext,
    // fontWeight:'bold',
    fontSize: 15,
    //textAlign:'left',
    //justifyContent: 'center',
  },

  buttontouch: {
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
    alignItems: 'center',
  },


  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
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
    paddingLeft: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'red',
    //borderRadius: 26,


  },
  line_spacer: {
    padding: 10,
    justifyContent: 'flex-start',
    height: 10,

    marginLeft: 180,
    marginRight: 180,
    borderBottomColor: '#c0c0c0',
    opacity: 0.9,
    borderBottomWidth: 5,
    marginBottom: 20,

  },

  bloc_right: {
    flexDirection: 'row',
    paddingLeft: 230,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'green',
    height: 20,
    //borderRadius: 26,


  },








  label_detail: {
    paddingLeft: 10,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',


  },



  icon: {
    width: 80,
    height: 80
  },


  icon_first: {
    width: 120,
    height: 120,
    bottom: 10,


  },

})
