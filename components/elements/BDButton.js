import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import BDStyles from "../../assets/styles/forms"

const BDButton = ({ display, functionProp, label, bgcolor, color }) => {

  return (
  <TouchableOpacity
    activeOpacity={1}
    disabled={!display}
    style={display ? [BDStyles.buttonOn, {backgroundColor:bgcolor}] : [BDStyles.buttonOff]}
    onPress={functionProp}>
      <Text style={display ? [BDStyles.buttonLabelOff] : [BDStyles.buttonLabelOn]}>{label}</Text>
  </TouchableOpacity>
  );
};

export default BDButton