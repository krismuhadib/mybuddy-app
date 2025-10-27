import React from 'react';
import { Image, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';
import { i18n } from "../../constants/Localization";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { calculateAge, GetGenreName, GetSterilizedName } from '../../utils/helpers';
import { useSelector } from 'react-redux';


const AnimalGenre = ({ item, params }) => {

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

  const Genre = "genre";

  return (
    <View>

      <View style={{ marginTop: 10, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>

        <View style={{ flexDirection: "row", }}>

          {(item.breed !== "visitor") &&
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ paddingLeft: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 0 }}>
                <View style={{ top: 5 }}>{MyFonctions.IconsDisplayDetails(item, "genre")}</View>
                <Text style={{ paddingLeft: 10, fontSize: 13, textTransform: "capitalize" }}> {GetGenreName(item.genre)}</Text>
                {(item.birthday) &&
                  <Text style={{ paddingLeft: 0, fontSize: 13, }}> {calculateAge(item.birthday)} {i18n.t('animalProfile.years')}</Text>
                }
              </View>
              <View>
                <Text style={{ paddingLeft: 50, marginTop: -10, fontSize: 10, textTransform: "none" }}> {GetSterilizedName(item.sterilisation)}</Text>

              </View>
            </View>
          }


          {(item.reproduction === true) && // true
            <View style={{ paddingLeft: 10, flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderWidth: 0 }}>
              <Image source={require('../../assets/images/wantbaby.png')} style={{ height: 30, width: 30 }} />
              <Text style={{ paddingLeft: 10, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal' }}>{i18n.t('animalProfile.reproduction')}</Text>
            </View>}

          {(item.reproduction === false && item.adoption === true) && // true
            <View style={{ paddingLeft: 10, flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderWidth: 0 }}>
              <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={28} color={Colors.red} />
              <Text style={{ paddingLeft: 10, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', }}>{i18n.t('animalProfile.adoption')}</Text>
            </View>}

        </View>

      </View>

      <View style={{ marginTop: 15, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>

        <View style={{ flexDirection: "row", }}>

          {(item.adoption === true && item.reproduction === true) &&
            <View style={{ paddingLeft: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 0 }}>
              <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={28} color={Colors.red} />
              <Text style={{ paddingLeft: 10, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', }}>{i18n.t('animalProfile.adoption')}</Text>
            </View>}

          {/* {(item.animal_id.breed) &&
          <View style={{ paddingLeft: 0, flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderWidth: 0 }}>
            <Image source={require('../../assets/images/wantbaby.png')} style={{ height: 30, width: 30 }} />
            <Text style={{ paddingLeft: 20, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal' }}>{i18n.t('Page.Reproduction')}</Text>
          </View>} */}

        </View>

      </View>

      {/* <View style={{ paddingLeft: 10, marginTop: 0,  flexDirection: 'row', alignItems: 'center', borderWidth: 1 }}>
      {(item.animal_id.breed !== "visitor") &&
        <View style={{ flexDirection: 'row', alignItems: 'center', width:180, borderWidth: 1}}>
          
          <View style={{ top: 5 }}>{MyFonctions.IconsDisplay(item, Genre)}</View>

          <View style={{flexDirection: 'row', borderWidth:1, height:20,  alignContent:"center", alignItems:"center", justifyContent:"flex-start"}}>
            <Text style={{ paddingLeft: 15, fontSize: 13, textTransform: "capitalize" }}> {GetGenreName(item.animal_id.gender)}</Text>
            <Text style={{ paddingLeft: 0, fontSize: 13, }}> {calculateAge(item.animal_id.birthday)} {i18n.t('Page.Years')}</Text>
          </View> 
        </View>
      }

      {(item.animal_id.reproduction = true && item.animal_id.adoption === false) && // true
        <View style={{ alignItems: 'center', flexDirection: 'row', borderWidth: 0 }}>
          <Image source={require('../../assets/images/wantbaby.png')} style={{ height: 30, width: 30 }} />
          <Text style={{ paddingLeft: 20, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal' }}>{i18n.t('Page.Reproduction')}</Text>
        </View>}

      {(item.animal_id.reproduction === false && item.animal_id.adoption === true) &&
        <View style={{ alignItems: 'center', flexDirection: 'row', borderWidth: 1 }}>
          <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={28} color={Colors.red} />
          <Text style={{ paddingLeft: 5, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', }}>{i18n.t('Form.Adoption')}</Text>
        </View>
      }
      </View>
      */}



      {/* <View style={{ paddingLeft: 10, marginTop: 10, flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 0 }}>

    {(item.animal_id.adoption = true && item.animal_id.breedname !== "visitor") &&
        <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row', borderWidth: 0 }}>
          <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={28} color={Colors.red} />
          <Text style={{ paddingLeft: 5, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', }}>{i18n.t('Form.Adoption')}</Text>
        </View>}

      {(item.animal_id.adoption = true && item.animal_id.breedname === "visitor") &&
        <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row', borderWidth: 0 }}>
          <Ionicons style={{ padding: 0, marginTop: 0 }} name="heart" size={28} color={Colors.red} />
          <Text style={{ paddingLeft: 5, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', }}>{i18n.t('Form.User_Adoption')}</Text>
        </View>}

      {(item.animal_id.adoption === false) &&
        <View>
        </View>
      }
    </View> */}


    </View>
  );
};

export default AnimalGenre