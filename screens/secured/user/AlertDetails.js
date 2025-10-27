import React, { useEffect, useState, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, TextInput, Dimensions, TouchableOpacity, Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/styles";
import Colors from '../../../constants/Colors';
import BDButton from '../../../components/elements/BDButton';
import { i18n } from "../../../constants/Localization";
import { MaterialIcons } from '@expo/vector-icons';


import RNPickerSelect from '@react-native-picker/picker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import { ScrollView } from 'react-native-gesture-handler';
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const data = [
  { label: i18n.t('alertDetails.lost'), value: '1', key: '0' },
  { label: i18n.t('alertDetails.stolen'), value: '2', key: '1' },
  { label: i18n.t('alertDetails.hurted'), value: '3', key: '2' },
  { label: i18n.t('alertDetails.poisonned'), value: '4', key: '3' },
];

const AlertDetailsScreen = (route) => {

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [loading, setLoading] = useState(false);
  const params = route.route.params;
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [display, setDisplay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [labelMarker, setLabelMarker] = useState([
    { label: i18n.t('alertDetails.lost'), value: 'Lost', key: '0' },
    { label: i18n.t('alertDetails.stolen'), value: 'Stolen', key: '1' },
    { label: i18n.t('alertDetails.hurted'), value: 'Hurted', key: '2' },
    { label: i18n.t('alertDetails.poisonned'), value: 'Poisonned', key: '3' },

  ]);
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [titleValidate, setTitleValidate] = useState(false);

  const [markerDescriptionValidate, setMarkerDescriptionValidate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [geoAddress, setGeoAddress] = useState("");
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);

  console.log("AlertDetailsScreen");

   useEffect(() => {
    console.log("alertType", alertType)
  }, [alertType]);


  useEffect(() => {
    if (params) {
      setLatitude(params.latitude);
      setLongitude(params.longitude);
    }
  }, [params]);

  useEffect(() => {
    if (params && params.latitude && params.longitude && params.from !== "List") {
      getGeoAdress();
    }
    if (params && params.from === "List") {
      setAlertDescription(params.item.body);
      setAlertTitle(params.item.title);

      if (params.item.typeofmarkers) {
        setAlertType(params.item.typeofmarkers);
      }
      //setAlertType(params.item.typeofmarkers);
    }
  }, [alertType]);

  const getGeoAdress = async () => {

    var requestOptions = {
      method: 'GET',
    };
    try {
      const resp = await fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + latitude + "&lon=" + longitude + "&apiKey=32a75a57d91c4f2f96ace966b668763b", requestOptions);
      const respJson = await resp.json();
      const response = respJson.features[0].properties
      setGeoAddress(response);
    } catch (error) {
      console.log('Error: ', error)
    }
  };

  const getUserMarkers = async () => {

    fetch(config.uri + 'markers/getusermarkers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        animal_id: animalData._id,
        token: userData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          var postList = res;
          console.log("MARKER LSTSSS", postList)


          setMarkerList(postList.postList);


          this.setState({ isFetching: false });
        }
        else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('Prb Fetching Markers');
        }
      });


  };


  const inputValidate = (text, type) => {

    if (type == 'title') {
      var titlelength = text.length;
      if (titlelength === 0) {
        setTitleValidate(false);
        setDisplay(false);
      } else {
        setTitleValidate(true);
        setAlertTitle(text);
      }
    }

    else if (type == 'description') {
      var descriptionlength = text.length;
      console.log(descriptionlength)
      if (descriptionlength === 0) {
        setAlertDescription(false);
        setDisplay(false);
      } else {
        setDisplay(true);
        setAlertDescription(text);
        setMarkerDescriptionValidate(true);
      }

      if (text.length > 600) {
        //setAlertDescription(false);
        setModalVisible(true);
        // this.setState({err:1, modalPostActionVisible:true, descriptionValidate:false,ifmodifydata:true})
      }
    }

  };

  const displayAlertType = (alertTypeNbr) => {

    if (alertTypeNbr === 1) {
      return (i18n.t('alertDetails.lost'))
    }
    if (alertTypeNbr === 2) {
      return (i18n.t('alertDetails.stolen'))
    }
    if (alertTypeNbr === 3) {
      return (i18n.t('alertDetails.hurted'))
    }
    if (alertTypeNbr === 4) {
      return (i18n.t('alertDetails.poisonned'))
    }
  };

  const addMedia = () => {

 console.log("addmedia");

 navigation.navigate("AddAlertPicture", {from: "Alert"})

  };


  const saveAlert = async () => {

   
    // if (titleValidate===true && markerDescriptionValidate === true && alertType !== undefined) {
    await fetch(config.uri + 'alerts/addalert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
        zip: geoAddress.postcode,
        city: geoAddress.city,
        country: geoAddress.country,
        county: geoAddress.county,
        housenumber: geoAddress.housenumber,
        formatted: geoAddress.formatted,
        animal_id: animalData._id,
        user_id: userData._id,
        latitude: latitude,
        longitude: longitude,
        title: alertTitle,
        typeofmarkers: alertType,
        body: alertDescription,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("res", res)
        if (res.success === true) {
          navigation.navigate("AddAlertPicture", {from: "Alert"})
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Marker already exist');
        }
      });
  };

  const editMarker = async () => {
    // if (titleValidate===true && markerDescriptionValidate === true && alertType !== undefined) {

    fetch(config.uri + 'alerts/updatealert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        user_id: userData._id,
        marker_id: params.item._id,
        title: alertTitle,
        typeofmarkers: alertType,
        body: alertDescription,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          navigation.navigate('AlertScreen', {
            navigateTo: "MarkerList",
            createMarkers: false,
          });
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Marker already exist');
        }
      });
  };

  return (

    <View style={styles.container}>
      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('alertDetails.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <View style={{ marginTop: 10, padding: 10 }}>

        <ScrollView>

        <View style={{ flexDirection: "row", marginBottom: 10, alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
          <Text style={[BDiaryStyles.h4, { marginLeft: 10, color: Colors.red }]}>{i18n.t('alertDetails.subject')} : </Text>
        </View>

        <View style={{ marginTop: 20, flexDirection: "row", marginBottom: 10, alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>
          <Text style={[BDiaryStyles.h5, { marginLeft: 10, color: Colors.greyH }]}>{i18n.t('alertDetails.alertType')} : </Text>
          <Text style={[BDiaryStyles.h5Bold, { marginLeft: 0, color: Colors.greyH }]}>{animalData.name}</Text>
        </View>

        {(labelMarker) &&
          <View style={{ marginLeft: 10, marginRight: 10, }}>

            <Dropdown
              style={[BDiaryStyles.inputContainer]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={[styles.iconStyle, { paddingRight: 15 }]}
              data={data}
              // value={alertTitle}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? displayAlertType(alertType) : '...'}
              searchPlaceholder={i18n.t('species.search')}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setAlertType(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <MaterialIcons
                  style={styles.icon}
                  color={isFocus ? 'red' : 'black'}
                  name="location-pin"
                  size={20}
                />
              )}
            />
          </View>
        }

        <View style={{ marginTop: 10, flexDirection: "column", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
          <View style={{ marginLeft: 10, marginRight: 10, width: ScreenWidth - ScreenWidth / 10, }}>
            <Text style={{ padding: 5, textAlign: 'left', color: Colors.greyH, fontSize: 15, fontWeight: 'normal' }}>
              {i18n.t('Modal.Marker_Details_Title')}</Text>
            <View style={[BDiaryStyles.inputContainer, { alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start" }]}>
              <TextInput
                style={{ paddingTop: 10, textAlign: "left", }}
                value={alertTitle}
                placeholder={i18n.t('Modal.Marker_Details_Title')}
                autoCapitalize='none' autoCorrect={false}
                onChangeText={(text) => inputValidate(text, 'title')}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 10, flexDirection: "column", alignItems: "center", justifyContent: "center", alignContent: "center" }}>
          <View style={{ marginLeft: 10, marginRight: 10, width: ScreenWidth - ScreenWidth / 10, }}>
            <View>
              <Text style={{ padding: 5, justifyContent: 'flex-start', textAlign: 'left', color: Colors.greyH, fontSize: 15, fontWeight: 'normal' }}>
                {i18n.t('Modal.Marker_Details_Description')}</Text>
              <Text style={{ paddingLeft: 5, top: -5, justifyContent: 'flex-start', fontStyle: "italic", textAlign: 'left', color: Colors.greyH, fontSize: 12, fontWeight: 'normal' }}>
                ({i18n.t('Modal.Marker_Details_DescriptionLimite')})</Text>
            </View>

            <View style={[BDiaryStyles.inputContainer, { alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start", height: 130, borderRadius: 16, }]}>
              <TextInput
                style={{ marginTop: 5 }}
                //maxLength={202}
                keyboardType="default"
                multiline
                //numberOfLines={5}
                placeholder={i18n.t('Modal.Marker_Details_Description')}
                autoCapitalize='none'
                autoCorrect={false}
                value={alertDescription}
                onChangeText={(text) => inputValidate(text, 'description')}
              />
            </View>
          </View>
        </View>



        {(alertType && (alertType === "1" || alertType === "2" )) &&
        <View style={{ marginTop: 40, marginBottom: 0, width: "100%", flex: 1, alignItems: 'center', alignContent: "center", justifyContent: "center", padding: 0 }}>
          <View style={{ width: "80%" }}>
            <BDButton
              bgcolor={Colors.red}
              color={Colors.white}
              display={true}
              functionProp={addMedia}
              label={i18n.t('alertDetails.addImage')}
            />
          </View>
        </View>
        }





        <View style={{ marginTop: 20, borderWidth: 0, flex: 1, marginBottom: 0, alignItems: "center", justifyContent: "center", alignContent: "center" }}>
          <View style={{ width: "80%" }}>
            {(params && params.from !== "List") &&
              <BDButton
                bgcolor={Colors.greenBuddy}
                color={Colors.white}
                display={display}
                functionProp={saveAlert}
                label={i18n.t('auth.login.submit')}
              />
            }
            {(params && params.from === "List") &&
              <BDButton
                bgcolor={Colors.greenBuddy}
                color={Colors.white}
                display={display}
                functionProp={editMarker}
                label={i18n.t('marker.update')}
              />
            }
          </View>
        </View>
        </ScrollView>

      </View>
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
            <Text style={BDiaryStyles.modalTitle}> {i18n.t('alertDetails.warning')}</Text>

            <View>
              <Text style={BDiaryStyles.modalText}> {i18n.t('alertDetails.textTooLong')}</Text>
            </View>

            <View style={{ flexDirection: "row", width: "80%", alignContent: "space-between", justifyContent: "space-between", alignItems: "center" }}>

              <TouchableOpacity
                style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('fullScreenVideo.close')}</Text>
              </TouchableOpacity>


            </View>

          </View>
        </View>
      </Modal>


    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: Colors.greyM
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.greyM
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  pin: {
    height: 50,
    width: 50
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default AlertDetailsScreen;
