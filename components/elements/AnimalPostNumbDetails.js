import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";


const AnimalPostNumbDetails = ({ postCount }) => {

  return (
    <View style={{ borderWidth: 0, flexDirection: "row" }} >
      <Text style={{ fontWeight: "bold", fontSize: 12, color: Colors.greyH }}>{postCount}</Text>
      <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM }}> {i18n.t('animalDetails.posts')}</Text>
    </View>

  );
};

export default AnimalPostNumbDetails