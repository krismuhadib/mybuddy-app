import React from 'react';
import { Image, TouchableOpacity, Platform, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import { AntDesign, FontAwesome, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import DetailsBarSmall from './DetailsBarSmall';

const logo_small = require('../../assets/images/logo_page.png');

const config = require('../../config');
var noImg = require('../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const HeaderBuddyLeft = ({ roomName, animal_destinary, avatar, goBack, navigationFromR, navigationNameR, navigationFrom, navigationName, logo, label, openModal, iconFamilyL, iconFamilyR, iconNameR, iconNameL }) => {

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const navigation = useNavigation();


  return (
    <View style={{ borderBottomWidth: 1, borderColor: Colors.borderHeader, backgroundColor: '#000', height: 90, backgroundColor: Colors.background, }}>
      <View style={{ flex: 1, top: 25, flexDirection: "row", alignItems: "center", alignContent: "flex-start", justifyContent: "flex-start" }}>

        {/* Left */}
        {(goBack === true && iconFamilyL) &&
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{ width: 40, height: 30, borderWidth: 0 }}>
            {(iconFamilyL === "Ionicons") &&
              <Ionicons name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "FontAwesome") &&
              <FontAwesome name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "Feather") &&
              <Feather name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "AntDesign") &&
              <AntDesign name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
          </TouchableOpacity>
        }
        {(goBack !== true && iconFamilyL) &&
          <TouchableOpacity onPress={() => navigation.navigate(navigationName, { params: navigationFrom, reload:true })}
            style={{ width: 40, height: 30, borderWidth: 0 }}
          >
            {(iconFamilyL === "Ionicons") &&
              <Ionicons name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "FontAwesome") &&
              <FontAwesome name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "Feather") &&
              <Feather name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "AntDesign") &&
              <AntDesign name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
          </TouchableOpacity>
        }
        {(!iconFamilyL) &&
          <View
            style={{ width: 40, height: 30, borderWidth: 0 }}
          >
            {(iconFamilyL === "Ionicons") &&
              <Ionicons name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "FontAwesome") &&
              <FontAwesome name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
            {(iconFamilyL === "Feather") &&
              <Feather name={iconNameL} style={{ marginLeft: 10, marginLeft: 10, }} size={22} color={Colors.greyH} />
            }
          </View>
        }
        {/* End Left */}


        {/* Middle */}
        
        <View style={{ marginTop:-5, flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
          {(avatar) &&
            <Image
              source={{ uri: config.linkserver + animal_destinary + '/images/avatar/small/' + animal_destinary + '.jpg' }}
              size='small'
              style={styles.avatarHeader}
            />
          }
          {(label) &&
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: Colors.greyH,marginLeft: 0 }}>{label}</Text>
          }
          {(roomName) &&
          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, fontWeight: 'bold', color: Colors.greyH, marginLeft: 10, }}>{roomName}</Text>
          }       
          </View>



        {/*End Middle */}


        {/* Right */}
        {(openModal) &&
          <TouchableOpacity
            onPress={() => openModal()}
            style={{ width: 30, height: 30, borderWidth: 0 }}
          >
            {(iconFamilyR === "Ionicons") &&
              <Ionicons name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }
            {(iconFamilyR === "FontAwesome") &&
              <FontAwesome name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }
            {(iconFamilyR === "Feather") &&
              <Feather name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }

          </TouchableOpacity>
        }
        {(!openModal && navigationNameR) &&
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationNameR, { params: navigationFromR })}
            style={{ width: 30, height: 30, borderWidth: 0 }}
          >
            {(iconFamilyR === "Ionicons") &&
              <>
                <Ionicons name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
              </>}
            {(iconFamilyR === "FontAwesome") &&
              <FontAwesome name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }
            {(iconFamilyR === "Feather") &&
              <Feather name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }

          </TouchableOpacity>
        }
        {(!openModal && !navigationNameR) &&
          <View
            style={{ width: 30, height: 30, borderWidth: 0 }}
          >
            {(iconFamilyR === "Ionicons") &&
              <Ionicons name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }
            {(iconFamilyR === "FontAwesome") &&
              <FontAwesome name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }
            {(iconFamilyR === "Feather") &&
              <Feather name={iconNameR} size={20} style={{ marginRight: 10, }} color={Colors.greyH} />
            }

          </View>
        }


        {/* End Right */}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  bloc_Row: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ccc',
    //borderWidth: 1,
    borderColor: '#000',
    // height: 40,
    //borderRadius: 26
  },

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: Colors.greyH,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarHeader: {
    width: 30,
    height: 30,
    borderRadius: 15,
  }
});


export default HeaderBuddyLeft