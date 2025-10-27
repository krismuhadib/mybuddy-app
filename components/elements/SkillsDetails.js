import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import AnimatedBar from './AnimatedBar';

const ScreenWidth = Math.round(Dimensions.get('window').width);


const SkillsDetails = ({ item }) => {

  const generateGradient = (startColor, endColor, steps) => {
    const interpolate = (start, end, factor) => start + (end - start) * factor;
  
    const gradient = [];
    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1);
      const red = Math.round(interpolate(startColor[0], endColor[0], factor));
      const green = Math.round(interpolate(startColor[1], endColor[1], factor));
      const blue = Math.round(interpolate(startColor[2], endColor[2], factor));
      gradient.push(`rgb(${red}, ${green}, ${blue})`);
    }
  
    return gradient;
  };
  
  // Utilisation : Rouge (255, 0, 0) vers Vert (0, 255, 0) avec 6 étapes
  const startColor = [255, 0, 0]; // Rouge
  const endColor = [0, 255, 0];   // Vert
  //const gradient = generateGradient(startColor, endColor, 6);
  
  const gradient = generateGradient([255, 165, 0], [135, 206, 235], 5);

  return (
    <View>

      <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 5 }}>
        <Text style={styles.label}>{i18n.t('animalProfile.height')}</Text>
      </View>
      <AnimatedBar barColor={gradient[0]} ScreenWidth={ScreenWidth} weight={item.height} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label}>{i18n.t('animalProfile.weight')}</Text>
      </View>
      <AnimatedBar barColor={gradient[1]} weight={item.weight} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.dynamic')}</Text>
      </View>
      <AnimatedBar barColor={gradient[2]} weight={item.dynamic} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.sociability')}</Text>
      </View>
      <AnimatedBar  barColor={gradient[3]} weight={item.sociability} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.player')}</Text>
      </View>
      <AnimatedBar  barColor={gradient[4]} weight={item.player} />

    </View>

  );
};
const styles = StyleSheet.create({

  label: {
    fontFamily:'Roboto-Regular',
    color: Colors.greyH,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 14,
    //fontWeight: 400,
  }
});

export default SkillsDetails