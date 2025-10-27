import React from 'react';
import { Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';

const AnimalBreed = ({ item, params }) => {

  const Typeof = "typeofname";

  return (
    <View style={{ flex: 1, marginTop: 20, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>

      <View style={{ borderWidth: 0, flexDirection: "row", }}>

        {(item.animal_id.breed) &&
          <View style={{ paddingLeft: 0, flex: 1, height: 45, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderWidth: 0 }}>
            <Image source={require('../../assets/images/lof.png')} style={{ height: 30, width: 30 }} />
            <Text numberOfLines={2} style={{ flex: 1, paddingLeft: 20, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', textTransform: "capitalize" }}>
              {item.animal_id.breedname.length < 40
                ? `${item.animal_id.breedname}`
                : `${item.animal_idbreedname.substring(0, 40)}...`}</Text>
          </View>}

      </View>

    </View>
  );
};

export default AnimalBreed