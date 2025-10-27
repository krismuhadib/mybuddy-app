import React from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import Colors from '../../constants/Colors';
import MyFonctions from '../MyFonctions';


var noImg = require('../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const LikersDisplayPostList = ({ goAddComment, item, navigate }) => {

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);


  return (
    <View style={{ paddingLeft: 10, zIndex: -1, }}>

      {(item.favorites.length > 0) &&
        <TouchableOpacity

          onPress={() => navigate('LikerList', {
            from: "Home",
            item: item,
            userToken: userData._id,
            item_user: item.user_id._id,// a virer
            item_animal: item.animal_id,// a virer
          })}>
          <View style={{ flexDirection: "row", borderWidth: 0 }}>
            <Text style={[styles.TextStyle, { color: Colors.greyM, paddingTop: 10, paddingLeft: 0, fontSize: 12 }]} >
              {i18n.t('Page.Liked_by')}
            </Text>
            <Text style={[styles.TextStyle, { flexDirection: "row", }]} >
              {MyFonctions.whoLikers(item)}
            </Text>
          </View>
        </TouchableOpacity>
      }
      <View style={{ height: 10 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({

  TextStyle: {
    fontSize: 12,
    padding: 0,
    color: '#000'
  },

  cardImage1: {
    //justifyContent: "center",
    borderWidth: 0,
    resizeMode: "center",
    zIndex: 1,
    marginTop: -100,
    height: ScreenHeight,
    paddingBottom: 1000,
    //objectFit: "fill"
  },




});


export default LikersDisplayPostList