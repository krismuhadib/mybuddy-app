import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import AnimatedBar from './AnimatedBar';

const ScreenWidth = Math.round(Dimensions.get('window').width);

const SkillsDetails = ({ item }) => {

  return (
    <View>

      <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 5 }}>
        <Text style={styles.label}>{i18n.t('animalProfile.height')}</Text>
      </View>
      <AnimatedBar ScreenWidth={ScreenWidth} weight={item.height} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label}>{i18n.t('animalProfile.weight')}</Text>
      </View>
      <AnimatedBar weight={item.weight} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.dynamic')}</Text>
      </View>
      <AnimatedBar weight={item.dynamic} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.sociability')}</Text>
      </View>
      <AnimatedBar weight={item.sociability} />

      <View style={{ marginLeft: 20, marginTop: 20, marginBottom: 5 }}>
        <Text style={styles.label} >{i18n.t('animalProfile.player')}</Text>
      </View>
      <AnimatedBar weight={item.player} />

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