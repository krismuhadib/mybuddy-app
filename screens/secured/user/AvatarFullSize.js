import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, ScrollView, Dimensions, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import SwitchComponent from '../../../components/elements/SwitchComponent';
import { SaveUser } from '../../../redux/slices/userSlice';
import { Post, ApiRoutes } from '../../../services/api'
import { ShowToast } from '../../../services/notification';
import { CheckBackendErrors } from '../../../utils/helpers';
import { useDispatch } from "react-redux";
import BDButton from '../../../components/elements/BDButton';
import { myLocalisation } from '../../../utils/helpers';
import { SaveAnimal } from '../../../redux/slices/animalSlice';

var config = require('../../../config.js');

var noImg = require('../../../assets/images/logo_avatar.png');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const AvatarFullSize = (route) => {
  
  const storeDispatch = useDispatch();
  const params = route.params ? route.params : "";

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  useEffect(() => {

  }, []);

  return (
    <View style={[BDiaryStyles.container, { flex: 1, backgroundColor: Colors.black }]}>
      <ScrollView>
        <View style={{ height: ScreenHeight / 1.3, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
          {(animalData && animalData.avatars && animalData.avatars.length === 0) &&
            <Image
              source={noImg}
              style={styles.noAvatar}
            />
          }
          {(animalData && animalData.avatars && animalData.avatars.length > 0) &&
            <Image
              source={{ uri: config.linkserver + route.route.params.animal_id + '/images/avatar/' + route.route.params.animal_avatars[0] + '.jpg' }}
              style={styles.avatar}
            />
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  avatarPlaceholder: {
    borderWidth: 0,
    width: 350,
    height: 350,
    borderRadius: 175,
    //backgroundColor: '#CCC',
    borderColor: Colors.greyL,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 290,
    height: 290,
    borderRadius: 165,
  },
  noAvatar: {
    width: 150,
    height: 150,
    borderRadius: 125,
  },

});


export default AvatarFullSize;


