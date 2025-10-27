import React, { useEffect, useState, useReducer } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';

import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import ButtonModal from '../elements/ButtonModal';

import myBuddyStyles from "../../assets/styles/styles";
import { GenerateGradientColors } from '../../utils/GenerateGradientColors';


// Window Device
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Colortext = Colors.greyH;

const ModalMenuSettings = ({ onClose, _onClose}) => {

  const navigation = useNavigation();
  const storeDispatch = useDispatch();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [iconcolor, setIconcolor] = useState(Colors.greyM);

  const gradientColors = GenerateGradientColors(Colors.greenGradient, Colors.redGradient, 9);

  console.log(gradientColors)


  const goToProfiles = () => {
    onClose();
    navigation.navigate('UserProfileScreen')
  };

  const goToAnimalProfile = () => {
    onClose();
    navigation.navigate('ChangeProfile', {
      from: "change"
    });
  };

  const goToNewProfile = () => {
    onClose();
    navigation.navigate('WelcomeUser', {
      navigateTo: "Newprofile",
      screen: 'User'
    });
  };

  const GoToBlokersScreen = () => {
    onClose();
    navigation.navigate('BlokerList', {
      from: "Home"
    });
  };

  const goToLegalScreen = () => {
    onClose();
    navigation.navigate('LegalScreen', {
      navigateTo: "Newprofile"
    });
  };
   const goToAlertScreen = () => {
    onClose();
    navigation.navigate('AlertScreen', {
      navigateTo: "Newprofile"
    });
  };


  const goToUserSettingScreen = () => {
    onClose();
    navigation.navigate('UserSettingScreen', {
      navigateTo: "Newprofile"
    });
  };


  const goToNotifications = () => {
    onClose();
    navigation.navigate('Notification', {
      navigateTo: "Newprofile"
    });
  };

  const goToGeolocalisation = () => {
    onClose();
    navigation.navigate('Geolocalisation', {
      navigateTo: "Newprofile"
    });
  };

  const goToLogOut= () => {
    onClose();
    navigation.navigate('LogOut', {
      navigateTo: "Newprofile"
    });
  };


  const GoToFriendsScreen = () => {
    onClose();
    navigation.navigate('FriendList', {
      from: "User"
    });
  };

  const GoToFavoriteScreen = () => {
    onClose();
    navigation.navigate('FavoriteList', {
      postnumerselected: 0,
    });
  };


  const GoToUserProfile = () => {
    setModalVisible(false)

    navigation.navigate('UserProfile');
  };

  const GoToSettingScreen = () => {
    setModalVisible(false)

    navigation.navigate('SettingScreen');
  };

  const GoToLogOutScreen = () => {
    setModalVisible(false)

    navigation.navigate('LogOutScreen');
  };


  return (

    <View>

      <ScrollView>

        <ButtonModal
          label={i18n.t('modalSettings.switchProfile')}
          icon="account-switch"
          library="MaterialCommunityIcons"
          onPress={() => goToProfiles()}
          display = "flex"
          iconColor= {gradientColors[0]}
        />

        {/* {(animalData.breed !== "visitor") &&
        <ButtonModal
          label={i18n.t('modalSettings.profile')}
          icon="profile"
          library="AntDesign"
          onPress={() => goToAnimalProfile()}
           display = "flex"
        />
        }
        
        <ButtonModal
          label={i18n.t('modalSettings.addProfile')}
          icon="person-add"
          library="MaterialIcons"
          onPress={() => goToNewProfile()}
        /> */}
        
        <ButtonModal
          label={i18n.t('modalSettings.buddies')}
          icon="group"
          library="MaterialIcons"
          onPress={() => GoToFriendsScreen()}
           iconColor= {gradientColors[1]}
          
        />
        
        <ButtonModal
          label={i18n.t('modalSettings.favorite')}
          icon="heart"
          library="Ionicons"
          onPress={() => GoToFavoriteScreen()}
           iconColor= {gradientColors[2]}
        />

         <ButtonModal
          label={i18n.t('modalSettings.blockedMembers')}
          icon="eye-off"
          library="Ionicons"
          onPress={() => GoToBlokersScreen()}
          iconColor= {gradientColors[3]}
        />

{/* <View style={{ flex: 1, flexDirection: "row" }}>
      {gradientColors.map((c, i) => (
        <View key={i} style={{ flex: 1,height:20, backgroundColor: c }} />
      ))}
    </View> */}

        <ButtonModal
          label={i18n.t('modalSettings.geolocalisation')}
          icon="location-pin"
          library="MaterialIcons"
          onPress={() => goToGeolocalisation()}
          iconColor= {gradientColors[4]}
        />
        
        <ButtonModal
          label={i18n.t('notifications.title')}
          icon="notifications"
          library="MaterialIcons"
          onPress={() => goToNotifications()}
          iconColor= {gradientColors[5]}
        />
        
        <ButtonModal
          label={i18n.t('modalSettings.legals')}
          icon="privacy-tip"
          library="MaterialIcons"
          onPress={() => goToLegalScreen()}
          iconColor= {gradientColors[6]}
        />
         {/* <ButtonModal
          label={i18n.t('modalSettings.alert')}
          icon="alert-circle-outline"
          library="Ionicons"
          onPress={() => goToAlertScreen()}
        /> */}

        <ButtonModal
          label={i18n.t('modalSettings.userSettings')}
          icon="account-settings"
          library="MaterialCommunityIcons"
          onPress={() => goToUserSettingScreen()}
          iconColor= {gradientColors[7]}
        />
        
        
        <ButtonModal
          label={i18n.t('modalSettings.logOut')}
          icon="logout"
          library="MaterialIcons"
          onPress={() => goToLogOut()}
          iconColor= {gradientColors[8]}
        //  iconColor= {GradientColor}
        />

       
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => goToProfiles()}>
            <View style={styles.buttontouchicon}>
              <MaterialCommunityIcons name='account-switch' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.Switch_Profile')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}


       
        {/* {(animalData.breed !== "visitor") &&
          <View style={{ height: 50 }}>
            <TouchableOpacity style={styles.buttontouch} onPress={() => goToAnimalProfile()}>
              <View style={styles.buttontouchicon}>
                <AntDesign name='profile' size={25} color={iconcolor} />
              </View>
              <View style={styles.buttontouchcontent}>
                <Text style={styles.buttontouchtext}>{i18n.t('Page.Profile')}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                  <AntDesign name="right" size={20} color={iconcolor} />
                </View>
              </View>
            </TouchableOpacity>
          </View>} */}




        {/* Change Profile */}
        {/* {(animalData.breed !== "visitor") &&
          <View style={{ height: 50 }}>
            <TouchableOpacity style={styles.buttontouch} onPress={() => this.goToNewProfile()}>
              <View style={styles.buttontouchicon}>
                <MaterialIcons name='person-add' size={25} color={iconcolor} />
              </View>
              <View style={styles.buttontouchcontent}>
                <Text style={styles.buttontouchtext}>{i18n.t('Page.Add_Profile')}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                  <AntDesign name="right" size={20} color={iconcolor} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        } */}


        {/* Friends Settings */}
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToFriendsScreen()}>
            <View style={styles.buttontouchicon}>
              <MaterialIcons name='group' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.Subscriptions')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* Friends Settings */}
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToFavoriteScreen()}>
            <View style={styles.buttontouchicon}>
              <Ionicons name='heart' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.My_Likes')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* Blokers */}
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToBlokersScreen()}>
            <View style={styles.buttontouchicon}>
              <Ionicons name='eye-off' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.My_Blokers')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}







        {/* User Settings */}
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToSettingScreen()}>
            <View style={styles.buttontouchicon}>
              <MaterialIcons name='settings' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.Settings')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}


        {/* User Settings */}
        {/* <View style={{ height: 50 }}>
          <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToLogOutScreen()}>
            <View style={styles.buttontouchicon}>
              <MaterialIcons name='logout' size={25} color={iconcolor} />
            </View>
            <View style={styles.buttontouchcontent}>
              <Text style={styles.buttontouchtext}>{i18n.t('Page.Log_Out')}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                <AntDesign name="right" size={20} color={iconcolor} />
              </View>
            </View>
          </TouchableOpacity>
        </View> */}



        {/* LogOut Settings */}
        {/* <View style={{ height: 50 }}>
              <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToLogOutScreen()}>
                <View style={styles.buttontouchicon}>
                  <MaterialIcons name='logout' size={25} color={iconcolor} />
                </View>
                <View style={styles.buttontouchcontent}>
                  <Text style={styles.buttontouchtext}>{i18n.t('Page.Log_Out')}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                    <AntDesign name="right" size={20} color={iconcolor} />
                  </View>
                </View>
              </TouchableOpacity>
            </View> */}

<TouchableOpacity
                style={{ marginTop: 20 }}

                onPress={() => _onClose()}>
                <View style={[myBuddyStyles.buttonCloseModal,{marginLeft:70, marginRight:70}]}>
                  <Text style={[myBuddyStyles.legalBold, { fontWeight: 'normal', color: Colors.greyH }]}>{i18n.t('fullScreenVideo.close')}</Text>
                </View>

              </TouchableOpacity>


      </ScrollView>
    </View>


  )

};

const styles = StyleSheet.create({



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

  icon: {
    width: 80,
    height: 80
  }

})


export default ModalMenuSettings;