import React from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Image, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

import { i18n } from "../../constants/Localization";
var noImg = require('../../assets/images/logo_avatar_trsp.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
var config = require('../../config.js');

const AnimalNameDetails = ({ item }) => {

  const navigation = useNavigation();

  const GoToAvatarScreen = () => {
    navigation.navigate('AvatarFullSize',{
      animal_id: item._id,
      animal_avatars: item.avatars
     })
  };


  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", alignContent: "center", margin: 0, paddingLeft: 5, paddingTop: 10 }}>
    {(item && item.avatars && item.avatars.length === 0) &&
     <View style={styles.avatarPlaceholder}>
     <Image
       source={noImg}
       size='small'
       style={styles.avatar}
     />
   </View>
    }
     {(item && item.avatars && item.avatars.length > 0) &&
     <TouchableOpacity style={styles.avatarPlaceholder}
      onPress={() => GoToAvatarScreen()}>
     <Image
       source={{ uri: config.linkserver + item._id + '/images/avatar/' + item.avatars[0] + '.jpg' }}
       size='small'
       style={styles.avatar}
     />
   </TouchableOpacity>
    }

    <Text style={{ paddingLeft: 10, fontWeight: "bold", fontSize: 22,
     // textTransform: "capitalize",
      }}>{item.name} </Text>

  </View>
  );
};

const styles = StyleSheet.create({

  avatarPlaceholder: {
    borderWidth: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    //backgroundColor: '#CCC',
    borderColor: Colors.greyL,
    justifyContent: 'center',
    alignItems: 'center',
  },


  avatar: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default AnimalNameDetails