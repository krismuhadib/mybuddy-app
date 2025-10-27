import React from 'react';
import { View, Text} from 'react-native';
import { i18n } from "../constants/Localization"
import BDStyles from "../assets/styles/forms";


const LoadingScreen = () => {
    return (
      <View style={[BDStyles.container, {alignItems: 'center',
      justifyContent: 'center', backgroundColor:"#000",
      alignContent:'center',}]}>
          <Text>{i18n.t('loading')}</Text>
        </View>
      );
};

export default LoadingScreen;
