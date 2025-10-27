import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { FormatDateToNow } from '../../utils/helpers';
import { GetProfile, calculateAge, GetGenreName } from '../../utils/helpers';
import { i18n } from "../../constants/Localization";
import MyFonctions from '../../components/MyFonctions';

const config = require('../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const RowProfileDescription = ({ item }) => {

    return (
        <View style={{ marginTop: 5, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, marginRight: 0 }}>
                        <Text style={[BDiaryStyles.h5Italic, {color: Colors.greyM, }]} numberOfLines={3}>{MyFonctions.ucfirst(item.description)}{"\n"}</Text>
                      </View>
    );
};




export default RowProfileDescription