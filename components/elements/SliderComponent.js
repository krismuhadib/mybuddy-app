import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import Colors from '../../constants/Colors';
import Slider from '@react-native-community/slider';

const SliderComponent = ({ onValueChange, label, data, small, average, heavy }) => {
  // state local pour éviter le "tremblement"
  const [sliderValue, setSliderValue] = useState(parseFloat(data) || 1);

  // si la prop `data` change (ex: update externe), on resynchronise
  useEffect(() => {
    setSliderValue(parseFloat(data) || 1);
  }, [data]);

  return (
    <View style={{ paddingBottom: 30 }}>
      <View style={{ paddingTop: 0, paddingBottom: 10, flexDirection: "row" }}>
        <Text style={BDiaryStyles.h5}>{label} :</Text>
      </View>

      <View style={styles.sliderLabelsContainer}>
        <View style={{ width: 50, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Text style={BDiaryStyles.h6}>{small}</Text>
        </View>
        {/* <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={BDiaryStyles.h6}>{average}</Text>
        </View> */}
        <View style={{ width: 50, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text style={BDiaryStyles.h6}>{heavy}</Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={100}
        step={1}
        value={sliderValue}
        minimumTrackTintColor={Colors.greenBuddyL}
        maximumTrackTintColor={Colors.greyL}
        thumbTintColor={Colors.greenBuddy}
        onValueChange={setSliderValue}            // fluide côté UI
        onSlidingComplete={onValueChange}         // callback parent (fin du geste)
        //thumbImage={require('../../assets/images/thumb.png')} // Thumb SVG converti en PNG // NO WORKING
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
    marginLeft: 0,
    marginRight: 0,
  },
  thumb: {
    width: 10,
    height: 10,
    borderColor: 'rgba(150, 150, 150, 0.6)',
    borderWidth: 14,
    borderRadius: 15,
  },
});

export default SliderComponent;