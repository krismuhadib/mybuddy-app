import React from 'react';
import { Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';
import { i18n } from "../../constants/Localization";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { StarsDisplay, memberDate, calculateAge, GetGenreName } from '../../utils/helpers';


const AnimalBirthday = ({ item, params }) => {


  console.log("AnimalGenre", item.animal_id)

  const Genre = "genre";

  const getGenre = () => {

    var genreNumber = i18n.t('profiles.female');

    if (item.animal_id.genre === "1") {
      genreNumber = i18n.t('profiles.male')
    }
    if (item.animal_id.genre === "2") {
      genreNumber = i18n.t('profiles.female')
    }
    return (
      <View>
        <Text>{genreNumber}</Text>
      </View>
    )
  };

  return (
    <View style={{ paddingLeft: 10, marginTop: 0, flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 0 }}>
      {(item.animal_id.breed !== "visitor") &&
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 0 }}>
          <View style={{ top: 5 }}>{MyFonctions.IconsDisplay(item, Genre)}</View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ paddingLeft: 20, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', textTransform: "capitalize" }}> {getGenre()} - {calculateAge(item.animal_id.birthday)} {i18n.t('Page.Years')}</Text>
          </View>
        </View>
      }
    </View>
  );
};

export default AnimalBirthday