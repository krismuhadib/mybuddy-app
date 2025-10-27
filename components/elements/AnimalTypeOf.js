import React from 'react';
import { Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';

const AnimalTypeOf = ({ item, params }) => {

  const Typeof = "typeofname";

  return (
    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>

      <View style={{flexDirection: "row", }}>

        {(item.typeof) &&
          <View style={{ paddingLeft: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 0 }}>
            {MyFonctions.IconsDisplayDetails(item, Typeof)}
            <Text style={{ paddingLeft: 10, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', textTransform: "capitalize", }}>{item.typeofname}</Text>
          </View>}


        {(item.breed) &&
          <View style={{ paddingLeft: 0, flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderWidth: 0 }}>
            <Image source={require('../../assets/images/lof.png')} style={{ height: 30, width: 30 }} />
            <Text numberOfLines={2} style={{ flex: 1, paddingLeft: 10, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', textTransform: "capitalize" }}>
              {item.breedname.length < 40
                ? `${item.breedname}`
                : `${item.breedname.substring(0, 40)}...`}</Text>
          </View>}

      </View>

    </View>
  );
};

export default AnimalTypeOf