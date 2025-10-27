import React, { useEffect, useState } from 'react';
import { Switch, StyleSheet, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';


const SwitchComponent = ({ onValueChange, label, value, small, average, heavy }) => {
  if (label) {
  return (
    <View style={[styles.switchContainer, { top: 10 }]}>
      <View>
        <Text style={[BDiaryStyles.h5, { textAlign:"left", paddingBottom: 20 }]}>{label}</Text>
      </View>
      <View style={{  paddingBottom: 20 }}>
        <View style={styles.switchBtn}>
          <Switch
          thumbColor={Colors.white} // bouton rond toujours blanc
            trackColor={{ true: Colors.greenBuddy, false: 'grey' }}
            onValueChange={onValueChange}
            value={value} />
        </View>
      </View>
    </View>
  )
  } else {
    return
  }
};


const styles = StyleSheet.create({

  switchContainer: {
    borderWidth:0,
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderTopColor: '#ccc',
    borderTopWidth: 0,
    alignItems: 'center',
    alignContent:'space-between',
    justifyContent:"space-between",
  },

  switchBtn: {
    alignItems: 'flex-end',
    paddingRight: 0,
  },

});


export default SwitchComponent