import React from 'react';
import { Text, View } from 'react-native';
import { i18n } from "../../constants/Localization";
import { StarsDisplay } from '../../utils/helpers';

const StarsDisplayComponent = ({ animalData }) => {

  return (
    <View>

      <View style={{ flexDirection: 'row', paddingTop: 10, borderWidth: 0, alignContent: 'space-between', justifyContent: 'space-between' }}>
        <View style={{ borderWidth: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{}}>{i18n.t('animalProfile.height')}</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', borderWidth: 0 }}>
            {StarsDisplay(animalData, "height")}
          </View>
        </View>

        <View style={{ borderWidth: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{}}>{i18n.t('animalProfile.weight')}</Text>
          <View style={{ flex: 1, flexDirection: 'row', borderWidth: 0, alignContent: 'center' }}>
            {StarsDisplay(animalData, "weight")}
          </View>
        </View>

        <View style={{ borderWidth: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{}}>{i18n.t('animalProfile.dynamic')}</Text>
          <View style={{ flex: 1, flexDirection: 'row', borderWidth: 0, alignContent: 'center' }}>
            {StarsDisplay(animalData, "dynamic")}
          </View>
        </View>
      </View>

      <View style={{ paddingTop: 20, flexDirection: 'row', borderWidth: 0, alignContent: 'space-around', justifyContent: 'space-around' }}>
        <View style={{ borderWidth: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{}}>{i18n.t('animalProfile.player')}</Text>
          <View style={{ alignContent: 'center', borderWidth: 0 }}>
            {StarsDisplay(animalData, "player")}
          </View>
        </View>

        <View style={{ borderWidth: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{}}>{i18n.t('animalProfile.sociability')}</Text>
          <View style={{ flex: 1, flexDirection: 'row', borderWidth: 0, alignContent: 'center', }}>
            {StarsDisplay(animalData, "sociability")}
          </View>
        </View>

      </View>

    </View>
  );
};

export default StarsDisplayComponent