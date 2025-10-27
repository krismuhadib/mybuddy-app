import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BmgStyles from "../assets/styles/styles"

const WelcomeButton = ({ bgBorderColor, onPress, text, bgColor, txtColor, bdWidth }) => {

  return (
    <TouchableOpacity style={{ marginTop: 30,  }} onPress={()=> onPress()}>
      <View style={[BmgStyles.welcomeButtonContainer,{ borderColor: bgBorderColor, backgroundColor: bgColor, borderWidth: bdWidth}]}>
        <Text style={[BmgStyles.welcomeButtonText, {color: txtColor}]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default WelcomeButton