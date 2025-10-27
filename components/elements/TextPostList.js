import React from 'react';
import { TouchableOpacity, Platform, Dimensions, StyleSheet, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../assets/styles/styles";
import { i18n } from "../../constants/Localization";
import Colors from '../../constants/Colors';
const ScreenWidth = Math.round(Dimensions.get('window').width);


const TextPostList = ({ item, navigate }) => {


  const goAddComment = (item) => {

    navigate('AddComment', {
      from: "Home",
      navigateTo: "Home",
      screen: 'AddComment',
      postUpdate: item,
      newcomment: true,
    })
  };

  return (
    <View>
      <TouchableOpacity style={{ borderWidth: 0, paddingRight: 10, paddingLeft: 10}}
        onPress={() => { goAddComment(item) }}>
        <Text style={[BDiaryStyles.postText, {width: ScreenWidth - 20,}]}
          numberOfLines={7}>
          {item.comment} {"\n"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};




export default TextPostList