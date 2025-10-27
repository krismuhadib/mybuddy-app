import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaProvider, SafeAreaView, Modal, Pressable, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import moment from 'moment';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../assets/styles/styles";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../redux/slices/animalSlice';
import { TextEllipsis } from '../../utils/helpers';
import { Countries } from '../../assets/datas/Countries';

const config = require('../../config');



const AnimalStatusDetails = ({  item}) => {

  const navigation = useNavigation();
  const storeDispatch = useDispatch();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [profile, setProfile] = useState("");
  //const [modalWarnings, setModalWarnings] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



  //console.log("AnimalStatusDetails item", item.profile);

  const memberdate = () => {
    const date = moment(item.cdate).format("DD/MM/YYYY");
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 12, color: Colors.greyM }}>{date}</Text>
    )
  };

  const getNameProfile = (item) => {
    if (item.profile) {
      var profile = "";

      if (item.profile === "noadoption") {
        profile = i18n.t('profile.animal')
        return profile
      }
      if (item && item.profile === "adoption") {
        profile = i18n.t('profile.adoption')
        return profile
      }
      if (item.profile && item.profile === "pros") {
        profile = i18n.t('profile.society')
        return profile
      }
    }
  };

  // Blokers

  const addBloker = async (item) => {

    console.log("ADDBLOKERS ItEM", item)

    await fetch(config.uri + 'animals/addbloker', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          //user_id_animal: this.state.item.animal_id._id,
          blokedanimal: item._id,
          blokeduser: item.user_id,
          animal_item_id: animalData._id,
          animal_id: animalData._id,
          user_id: userData._id,
          bloker_id: item._id,
         // user_id: item.user_id 
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setModalVisible(false);
            storeDispatch(SaveAnimal(res.animaldoc));
            navigation.navigate('Home', {
              navigateTo: "Home",
              reload: true,
            });
          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert('Les infos User/Password sont mal remplies');
          }
        });
    };
    
    // Country 
    const CountriesArrayToObjects = () => {
        const countriesObject = [];
        for (let i = 0; i < Countries.length; i++) {
          const objet = {
            title: Countries[i][0],
            code: Countries[i][1],
            indicatif: Countries[i][2],
            id: i + 1
          };
          countriesObject.push(objet);
        }
        return countriesObject;
      };
    
      const countriesObjectFinal = CountriesArrayToObjects(Countries);
    
      const getCountryName = () => {
        for (let i = 0; i < countriesObjectFinal.length; i++) {
          if (Countries[i][1] === userData.country) {
            return Countries[i][0];
          }
        }
        return null;
      };

  return (
    <View style={{marginBottom: 20}}>
      <View style={{ borderWidth: 0, flexDirection: "row" }}>

        {(item.ispremium === true && item.ispremium !== undefined) &&
          <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM }}>{i18n.t('Page.Premium_Member_Date')}</Text>
        }
        {(item.ispremium !== true && item.ispremium === undefined) &&
          <>
           {(item.profile === "pros") &&
            <Text style={[BDiaryStyles.h5, { fontWeight: 'normal', color: Colors.greyM }]}>{getNameProfile(item)} | </Text>
           }
           <Text style={[BDiaryStyles.h5, { fontWeight: 'normal', color: Colors.greyM }]}>{i18n.t('Page.Member_Date')}</Text>
            <Text style={[BDiaryStyles.h5, { fontWeight: 'normal', color: Colors.greyM }]}> {memberdate()}</Text>
          </>
        }


        {(animalData._id !== item._id) &&
          <TouchableOpacity style={{ borderWidth: 0, top: 0, flexDirection: "row", paddingLeft: 5, }}
          onPress={() => setModalVisible(true)}>
            <Text style={[BDiaryStyles.h5, { fontWeight: 'normal', color: Colors.greyM }]}>|  {i18n.t('Page.Block_Member')}</Text>
          </TouchableOpacity>
        }

        {(item.hidden === true) &&
          <View>
            <Text style={[BDiaryStyles.h5, { fontWeight: 'normal', color: Colors.greyM }]}> - {i18n.t('Form.Private_Profile')}</Text>
          </View>
        }


        {/* {(this.state.ispremium === true) &&
          <View style={{flex:1, width:50, height:50}}>
            {MyFonctions.isPremiumLogo(this.state.ispremium)}
          </View> 
        } */}

        {/* {(item.status === 0 || item.status !== undefined) &&
          <View style={{ top: 5, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>
            <View style={{ borderWidth: 0, flexDirection: "row", }}>
              <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM }}>{i18n.t('Page.Member_No')}</Text>
            </View>
          </View>
        } */}


      </View>

      <View style={{ marginLeft:-2, marginTop: 5 }}>
        {(item.animaldoc?.city) &&
          <View style={{ flexDirection: "row", }}>
            <Feather name="map-pin" size={15} color="red" />
            <Text style={[BDiaryStyles.h5, { textTransform: "capitalize", fontWeight: 'normal', color: Colors.greyM }]}> {item.animaldoc?.city} {item.animaldoc?.zipcode} {getCountryName(userData.country)}</Text>
          </View>}
        {(item.city) &&
          <View style={{  flexDirection: "row", }}>
            <Feather name="map-pin" style={{marginRight:0}} size={15} color={Colors.greyM} />
            <Text style={[BDiaryStyles.h5, { textTransform: "capitalize", fontWeight: 'normal', color: Colors.greyM }]}> {item.city} {item.zipcode} {getCountryName(userData.country)}</Text>
          </View>}

      </View>




      {/* {((item.profile === "pros")) &&
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignContent: "space-between" }}>
          <View style={{ borderWidth: 1, alignItems: "center", alignContent: "center", justifyContent: "center", borderRadius: 12, marginTop: 10, padding: 5, }}>
            <Text style={[BDiaryStyles.h4, { fontFamily: 'Roboto-Bold', padding: 5, fontSize: 14, color: Colors.greyM }]}>{getNameProfile(item)}</Text>
          </View>

      
        </View>

      } */}

      {((item.profile === "adoption" || item.animaldoc?.profile === "adoption")) &&
        <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "space-between", alignItems: "center", alignContent: "space-between" }}>
          <View style={{ borderWidth: 0, backgroundColor: Colors.pink, alignItems: "center", alignContent: "center", justifyContent: "center", borderRadius: 18, marginTop: 10, padding: 5, }}>
            <Text style={[BDiaryStyles.h4, { fontFamily: 'Roboto-Bold', padding: 5, fontSize: 12, color: Colors.white }]}>{getNameProfile(item)}</Text>
          </View>

          <View style={{ alignItems: "center", marginLeft: 10, alignContent: "center", justifyContent: "center", borderRadius: 18, backgroundColor: Colors.greenBuddy, borderWidth: 0, marginTop: 10, padding: 5, }}>
            <Text style={[BDiaryStyles.h4, { textTransform: "capitalize", fontFamily: 'Roboto-Bold', padding: 5, fontSize: 12, color: Colors.white }]}>{TextEllipsis(item.typeofname, 10)}</Text>
          </View>

          <View style={{ alignItems: "center", marginLeft: 10, alignContent: "center", justifyContent: "center", borderRadius: 18, backgroundColor: Colors.skin, borderWidth: 0, marginTop: 10, padding: 5, }}>
            <Text style={[BDiaryStyles.h4, { textTransform: "capitalize", fontFamily: 'Roboto-Bold', padding: 5, fontSize: 12, color: Colors.white }]}>{TextEllipsis(item.breedname, 18)}</Text>
          </View>
        </View>
      }



        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={BDiaryStyles.centeredView}>
            <View style={BDiaryStyles.modalView}>
              <Text style={BDiaryStyles.modalTitle}> {i18n.t('Modal.confirmation')}</Text>

              <View>
              <Text style={BDiaryStyles.modalText}> {i18n.t('Modal.WarningBlokerMessage')}</Text>
              </View>

              <View style={{flexDirection:"row", width:"80%",alignContent:"space-between", justifyContent:"space-between", alignItems:"center" }}>

              <TouchableOpacity
                style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('fullScreenVideo.close')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                onPress={() => addBloker(item)}>
                <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Modal.Block')}</Text>
              </TouchableOpacity>

              </View>
              
            </View>
          </View>
        </Modal>
    </View>
  );
};



export default AnimalStatusDetails