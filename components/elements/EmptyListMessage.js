import React from 'react';
import { Dimensions,Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import BDStyles from "../../assets/styles/styles";

const ScreenHeight = Math.round(Dimensions.get('window').height);

const EmptyListMessage = ({text}) => {

  return (
    <View style={{padding: 20, textAlign: 'center', justifyContent:'center'}}>
         <Text style={[BDStyles.h4, { lineHeight:25, textAlign: 'center', color: Colors.greyM}]}>{text}</Text>
      </View>
  );
};

export default EmptyListMessage