import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import { i18n } from "../../../constants/Localization";


const ProfilesScreen = () => {

  return (
    <View style={{}}>
      <Text style={{}}>{i18n.t("mission.title")}</Text>
    </View>
  );
};




export default ProfilesScreen;