import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import Slider from '@react-native-community/slider';


const LoveSliderComponent = ({maxValue, unit, onValueChange, data, small, heavy }) => {
  
  return (
    <View style={{ marginTop:10,marginBottom: 30 }}>
     
          <Slider
            style={styles.slider}
            minimumValue={unit}
            maximumValue={maxValue}
            minimumTrackTintColor={Colors.greenBuddyL}
            maximumTrackTintColor={Colors.greyL}
            thumbTintColor={Colors.greenBuddy}
            //width={250}
            step={1}
            value={parseFloat(data)}
            onValueChange={onValueChange}
            thumbStyle={styles.thumb}
          />
        </View>
  );
};


const styles = StyleSheet.create({

  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  slider: {
    //position: 'absolute',
    //marginTop: width * 0.57,
    //width: 250,
    //transform: [{ rotateZ: '-90deg' }],
    marginLeft: 0,
    marginRight: 0,
  },

  track: {
    height: 1,
    backgroundColor: Colors.red,
  },


  thumb: {
    width: 10,
    height: 10,
    // backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderColor:  Colors.red,
    borderWidth: 14,
    borderRadius: 15,
  },




});


export default LoveSliderComponent