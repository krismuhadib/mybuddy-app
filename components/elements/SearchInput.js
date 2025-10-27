import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';


const SearchInput = ({ placeholder, text, functionProp }) => {

  return (
    <View style={{ marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10}}>
      <View style={BDiaryStyles.formContainerRow}>
        <Ionicons style={BDiaryStyles.searchIcon} name="search" size={25} color={Colors.greyL} />
        <TextInput
          style={{ flex: 1 }}
          placeholder={placeholder}
          inputContainerStyle='#fff'
          placeholderTextColor={Colors.greyL}
          value={text}
          onChangeText={functionProp} />
      </View>
    </View>
  );
};

export default SearchInput