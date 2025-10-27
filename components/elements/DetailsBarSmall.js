import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import { Feather, Ionicons } from '@expo/vector-icons';

const config = require('../../config');

const DetailsBarSmall = ({ postData }) => {
  //console.log("PostDatas", postData)

  const typeOfDisplay = (item, type) => {

    if (item.animal_id.typeofname) {
      if (i18n.locale === "fr") {
        return (
          <View>
            <Image source={config.AnimalIcones_fr.typeofname[type]} style={{ top: -2, height: 23, width: 23 }} />
          </View>
        )
      }
      if (i18n.locale !== "fr") {
        return (
          <View>
            <Image source={config.AnimalIcones.typeofname[type]} style={{ top: -2, height: 23, width: 23 }} />
          </View>
        )
      }

    } else {
      return (
        <View style={{ padding: 0 }}></View>
      )

    }
  };

  const genreIconDisplay = (item) => {
    if (item.animal_id.genre) {

      if (item.animal_id.genre === "1") {
        return (
          <View style={{ padding: 0, borderWidth: 0 }}>
            {(item.animal_id.sterilisation === false) &&
              <Image source={require('../../assets/images/male_on.png')} style={{ height: 20, width: 20 }} />
            }
            {(item.animal_id.sterilisation === true) &&
              <Image source={require('../../assets/images/male_off.png')} style={{ height: 20, width: 20 }} />
            }
          </View>
        )
      }
      if (item.animal_id.genre === "2") {
        return (
          <View style={{ padding: 0, borderWidth: 0 }}>
            {(item.animal_id.sterilisation === false) &&
              <Image source={require('../../assets/images/femelle_on.png')} style={{ height: 20, width: 20 }} />}
            {(item.animal_id.sterilisation === true) &&
              <Image source={require('../../assets/images/femelle_off.png')} style={{ height: 20, width: 20 }} />}
          </View>
        )
      }
    } else {
      return (
        <View style={{ padding: 0, borderWidth: 0 }}></View>
      )
    }
  };

  const wantChildIconDisplay = (item) => {
    if (item.animal_id.reproduction = true) {
      return (
        <View style={{ backgroundColor: "white", padding: 0 }}>
          <Image source={require('../../assets/images/wantbaby.png')} style={{ height: 20, width: 20 }} />
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: "white" }}></View>
      )
    }
  };

  const adoptionIconDisplay = (item) => {
    var male = "";
    if (item.animal_id.adoption = true) {
      return (
        <View style={{ backgroundColor: "white", padding: 0 }}>
          <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={22} color={Colors.red} />
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: "white" }}></View>
      )
    }
  };

  const lofIconDisplay = (item) => {
    var male = "";
    if (item.animal_id.animallof === true) {
      return (
        <View style={{ backgroundColor: "white", padding: 0 }}>
          <Image source={require('../../assets/images/lof.png')} style={{ height: 20, width: 20 }} />
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: "white" }}></View>
      )
    }
  };


  return (
    <View style={{ flexDirection: "row" }}>
      {(postData && postData.animal_id.profile === "adoption") &&

        <View>
          {/* If Adoption */}
          <View style={{ padding: 0, paddingLeft: 0, flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[BDiaryStyles.h5Italic, {}]}>{i18n.t('profile.adoption')} /</Text>
              <Text style={[BDiaryStyles.h5Italic, { textTransform: "capitalize" }]}> {postData.animal_id.typeofname}</Text>
              <Text style={[BDiaryStyles.h5Italic, { textTransform: "capitalize" }]}> {postData.animal_id.breedname}</Text>
            </View>

            {(postData.animal_id.city !== undefined && postData.animal_id.city !== null && postData.animal_id.zipcode !== null && postData.animal_id.zipcode !== undefined) &&
              <View style={{ flexDirection: "row" }}>
                <Text style={[BDiaryStyles.h5Italic, { fontSize: 10, textTransform: "capitalize" }]}>{postData.animal_id.city}</Text>
                <Text style={[BDiaryStyles.h5Italic, { fontSize: 10, textTransform: "capitalize" }]}> {postData.animal_id.zipcode}</Text>
              </View>
            }
          </View>
        </View>
      }

      {(postData && postData.animal_id.profile === "noadoption") &&
        <View style={{ flexDirection: "row" }}>

          <View style={{ padding: 5, paddingLeft: 0 }}>
            {typeOfDisplay(postData, postData.animal_id.typeofname)}
          </View>

          <View style={{ padding: 5 }}>
            {genreIconDisplay(postData)}
          </View>

          {(postData && postData.animal_id.reproduction === true) &&
            <View style={{ padding: 5 }}>
              {wantChildIconDisplay(postData)}
            </View>
          }
          {(postData && postData.animal_id.adoption === true) &&
            <View style={{ padding: 5 }}>
              {adoptionIconDisplay(postData)}
            </View>
          }
          {(postData && postData.animal_id.animallof) &&
            <View style={{ padding: 5 }}>
              {lofIconDisplay(postData)}
            </View>
          }
        </View>
      }

      {/* If Pros */}
      {(postData && postData.animal_id.profile === "pros") &&
        <View style={{ padding: 0, paddingLeft: 0, flexDirection: "column" }}>
          <Text style={[BDiaryStyles.h5Italic, {}]}>{i18n.t('profile.society')}</Text>
          <View style={{ marginTop: 0, flexDirection: "row" }}>
            <Text style={[BDiaryStyles.h5Italic, { fontSize: 10, textTransform: "capitalize" }]}>{postData.animal_id.city}</Text>
            <Text style={[BDiaryStyles.h5Italic, { fontSize: 10, textTransform: "capitalize" }]}> {postData.animal_id.zipcode}</Text>
          </View>
        </View>

      }

      {/*
    <View>
      <AntDesign style={{padding:5}} name="ellipsis1" size={20} color="black" />
    </View>
    */}
    </View>
  );
};


const styles = StyleSheet.create({

  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderTopColor: '#ccc',
    borderTopWidth: 0,
    alignItems: 'center',
  },

  switchBtn: {
    alignItems: 'flex-end',
    paddingRight: 0,
  },

});


export default DetailsBarSmall