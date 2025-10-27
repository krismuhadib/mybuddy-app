import React, { useMemo, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Modal, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView,
  TextInput, StyleSheet, Dimensions, View, Text, TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import { useDispatch } from "react-redux";
import { Feather } from '@expo/vector-icons';
import BDButton from '../../../components/elements/BDButton';
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from 'react-native-ui-datepicker';
import { EvilIcons } from '@expo/vector-icons';
import SliderComponent from '../../../components/elements/SliderComponent';
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import SwitchComponent from '../../../components/elements/SwitchComponent';
import { ShowToast } from '../../../services/notification';
import { myLocalisation, SpreadGeolocalisationLongitude, SpreadGeolocalisationLatitude } from '../../../utils/helpers';
import DateInput from '../../../components/elements/DateInput';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
import { Countries } from '../../../assets/datas/Countries';


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const AnimalProfileScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const storeDispatch = useDispatch();
  const params = route.route.params;

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

  const [birthday, setBirthday] = useState(animalData ? animalData.birthday : '');
  const [showdatepiker, setShowDatePicker] = useState(false);
  const [name, setName] = useState(animalData ? animalData.name : '');
  const [genre, setGenre] = useState(animalData ? animalData.genre : '');
  const [height, setHeight] = useState(animalData ? animalData.height : 1);
  const [weight, setWeight] = useState(animalData ? animalData.weight : 1);
  const [dynamic, setDynamic] = useState(animalData ? animalData.dynamic : 1);
  const [sociability, setSociability] = useState(animalData ? animalData.sociability : 1);
  const [player, setPlayer] = useState(animalData ? animalData.player : 1);
  const [sterilisation, setSterilisation] = useState(animalData ? animalData.sterilisation : false);
  const [lof, setLof] = useState(animalData ? animalData.lof : false);
  const [reproduction, setReproduction] = useState(animalData ? animalData.reproduction : false);
  const [hidden, setHidden] = useState(animalData ? animalData.hidden : false);
  const [adoption, setAdoption] = useState(animalData ? animalData.adoption : false);
  const [description, setDescription] = useState(animalData ? animalData.description : '');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [bufferScrollViewHeight, setBufferScrollViewHeight] = useState(0);
  const [displaybutton, setDisplayButton] = useState(false);
  const [profile, setProfile] = useState(animalData ? animalData.profile : "noadoption");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [jours, setJours] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [map, setMap] = useState(animalData ? animalData.map : false);
  const [love, setLove] = useState(animalData ? animalData.love : false);
  const [geoloc, setGeoloc] = useState(animalData ? animalData.geoloc : false);
  const [zipCode, setZipCode] = useState(animalData ? animalData.zipcode : '');
  const [city, setCity] = useState(animalData ? animalData.city : '');
  const [adress, setAdress] = useState(animalData ? animalData.adress : '');
  const [descriptionPlaceHolder, setDescriptionPlaceHolder] = useState(i18n.t('animalProfile.description'));
  const [countriesList, setCountriesList] = useState([]);


  //const [expertiseDescription, setExpertiseDescription] = useState(userData ? userData.expertiseDescription : '');
  //const [drivingLicense, setDrivingLicense] = useState(userData ? userData.drivingLicense : false);

  const myScrollView = 0;

  const { specify } = route.route.params;
  const { from } = route.route.params;

  console.log("AnimalProfileScreen BBBBB params", params);

  useEffect(() => {
    if (from === "User" || from === "Pros") {
      setName("");
      setDescription("");
    }
    fetchLocation();
    getDatePicker();
  }, [sterilisation]);

  useEffect(() => {
    validateForm();
  }, [genre, description, zipCode, city]);

  useEffect(() => {
    if (Countries && Countries !== undefined) {
      setCountriesList(CountriesArrayToObjects(Countries));
    }
  }, [from]);

   useEffect(() => {
   descriptionPlaceholderDisplay();
   console.log("useEffect description", params.specify)

  }, [params]);

  const getDatePicker = () => {
    if (birthday && birthday.slice !== 0 && birthday.slice !== undefined) {
      setJours(birthday.slice(8, 10));
      setMois(birthday.slice(5, 7));
      setAnnee(birthday.slice(0, 4));
    } else {
      setJours(i18n.t('animalProfile.dd'));
      setMois(i18n.t('animalProfile.mm'));
      setAnnee(i18n.t('animalProfile.aaaa'));
    }
    //console.log("month", month)
  };


  const validateForm = () => {

    if (!name) {
      setName(userData.firstName)
    }
    if (specify === "Adoption") {
      setProfile("Adoption");

      if (!name || name === '' || !description || description === '') {
        return setDisplayButton(false);
      }
      return setDisplayButton(true);

    }

    if (specify === "NoAdoption" || specify === "Noadoption") {
      setProfile("noadoption");

      if (!name || name === '' || !animalData.breed || animalData.breed === '' || !genre || genre === null || genre === "null") {
        return setDisplayButton(false);
      }
      return setDisplayButton(true);

    }

    if (specify === "Pros") {
      setProfile("Pros");
      if (!name || name === '' || !description || description === '' || !city || city === ''
        || !zipCode || zipCode === ''
      ) {
        return setDisplayButton(false);
      }
      return setDisplayButton(true);

    }


    // else {
    //   setProfile("NoAdoption");

    //   if (!name || name === '' || !animalData.breed || animalData.breed === '' || !genre || genre === null || genre === "null") {
    //     return setDisplayButton(false);
    //   }
    //   return setDisplayButton(true);
    // }

  };


  const SubmitDate = async () => {
    setModalVisible(false);

    // console.log("new Date(birthday).toLocaleDateString('en-CA')",birthday)
    const res = await Post(ApiRoutes.animalEdit, {
      id: animalData._id,
      birthday: new Date(birthday).toLocaleDateString('en-CA'),
    });
    if (res.success) {
      console.log("Date res", res)
      // ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      storeDispatch(SaveAnimal(res.value));

    } else {
      // ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }
    setShowDatePicker(false);

  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr");
  };

  const genderItems = useMemo(() => (
    [
      {
        id: '1',
        label: i18n.t('profiles.male'),
        value: 'Male',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
      {
        id: '2',
        label: i18n.t('profiles.female'),
        value: 'Femelle',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
      {
        id: '3',
        label: i18n.t('profiles.other'),
        value: 'Other',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },


    ]), []
  );

  const genderItemsAdoption = useMemo(() => (
    [
      {
        id: '1',
        label: i18n.t('profiles.male'),
        value: 'Male',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
      {
        id: '2',
        label: i18n.t('profiles.female'),
        value: 'Femelle',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
      {
        id: '3',
        label: i18n.t('profiles.other'),
        value: 'All',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },

    ]), []
  );

  const datePicker = () => {
    
    if (showdatepiker) {

      const birthdayTmp = birthday;
      return (
        <View style={[styles.generalCalendarContainer]}>

          <View style={styles.calendarContainer}>

            <TouchableOpacity onPress={() => {
              setBirthday(animalData.birthday);
              setShowDatePicker(false);
              setModalVisible(!modalVisible)
            }
            }
              style={styles.dateCloseIconContainer}>
              <EvilIcons name="close-o" size={35} color={Colors.greyM} />
            </TouchableOpacity>

            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                // maxDate={new Date()}
                // maxYear={(new Date()).getFullYear()}
                yearTextStyle={{ color: Colors.greyH, fontSize: 20, }}
                yearContainerStyle={{ backgroundColor: Colors.greyL, color: Colors.greyH, fontSize: 20, }}
                monthContainerStyle={{ backgroundColor: Colors.greyL, color: "#ccc", fontSize: 20, }}
                calendarTextStyle={{ color: Colors.greyH }}
                headerTextStyle={{ color: Colors.greyH }}
                headerButtonColor={Colors.greyH}
                headerTextContainerStyle={{ color: Colors.greyH, fontSize: 20, }}
                dayContainerStyle={{ color: Colors.greyH, fontSize: 20, }}
                todayContainerStylee={{ color: Colors.greyH, fontSize: 20, }}
                todayTextStyle={{ color: Colors.greyH, fontSize: 20, }}
                weekDaysTextStyle={{ color: Colors.greyH, fontSize: 15, }}
                locale={undefined}
                timeZoneOffsetInMinutes={'fr-FR'}
                mode="single"
                date={birthday}
                selectedItemColor={Colors.greyH}
                onChange={(params) => setBirthday(params.date)}
              />
            </View>
          </View>
          <View style={{ width: ScreenWidth, alignContent: "center", alignItems: "center", justifyContent: "center" }}>

            <View style={styles.dateTimeSubmitContainer}>
              <TouchableOpacity
                style={[BDiaryStyles.buttonOn]}
                onPress={SubmitDate}
              >
                <Text
                  style={[BDiaryStyles.buttonLabelOn, { color: Colors.white, alignContent: "center", alignItems: "center", justifyContent: "center" }]}>
                  {i18n.t('animalProfile.submit')}</Text>
              </TouchableOpacity>

            </View>
          </View>

        </View>
      )
    }
  };

  const fetchLocation = async () => {
    const position = await myLocalisation();
    if (position) {
      const newLat = SpreadGeolocalisationLatitude(position.coords.latitude);
      const newLong = SpreadGeolocalisationLongitude(position.coords.longitude);
      setLatitude(newLat);
      setLongitude(newLong);
    }
  };

  const navigateToSpecies = () => {

    if (params.from === "User" && specify === "Adoption") {
      navigation.navigate("UserSpecies", {
        from: "User",
        specify: "Adoption"
      });
    }

    if (params.from === "change" && specify === "Adoption") {
      navigation.navigate("UserSpecies", {
        from: "change",
        specify: "Adoption"
      });
    }
    if (params.from === "change" && specify === "Noadoption") {
      navigation.navigate("UserSpecies", {
        from: "change",
        specify: "Noadoption"
      });
    };

    if (params.from !== "change" && specify !== "Adoption") {
      navigation.navigate("ModalSpecies", {
        from: "new"
      });
    };

  };

  const goToCountries = () => {

     if (params.from === "User" && params.specify === "Pros") {
      navigation.navigate("UserCountry", {
        from: "User",
        specify: "Pros"
      });
     }

     if (params.from === "NewUser" && params.specify === "Pros") {
      navigation.navigate("ModalCountry", {
        from: "Modal",
        specify: "pros"
      });
     }


    // if (params.from !== "breeds" && params.specify === "Adoption") {

    //   navigation.navigate("ModalCountry", {
    //     from: "Modal",
    //     specify: "Adoption"
    //   });
    // } else {
    //   navigation.navigate("UserCountry", {
    //     from: "User",
    //     specify: "Pros"
    //   });

    // }



  };

  const navigateToBreeds = () => {
    navigation.navigate("ModalBreeds", {
      from: "change",
      animal_id: animalData._id,
      typeof: animalData.typeof,
      typeOfname: animalData.typeofname
    })
  };

  const EditAnimal = async () => {
    const animalProps = {
      id: animalData._id,
      user_id: userData._id,
      sterilisation: sterilisation,
      lof: lof,
      adoption: adoption,
      reproduction: !sterilisation ? reproduction : false,
      typeof: animalData.typeof,
      typeofname: animalData.typeofname,
      breed: animalData.breed,
      breedname: animalData.breedname,
      hidden: hidden,
      map: map,
      love: love,
      geoloc: geoloc,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      // status:0, 
    };

    if (name && name !== "") animalProps.name = name;
    if (description && description !== "") animalProps.description = description;
    // if (breed && breed !== "") animalProps.breed = breed;
    // if (breedName && breedName !==0) animalProps.breedname = breedName;
    // if (typeOf && typeOf !=="") animalProps.typeof = typeOf;
    // if (typeOfName && typeOfName !=="") animalProps.typeofname = typeOfName;
    if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    if (genre && genre !== "") animalProps.genre = genre;
    if (height && height !== "") animalProps.height = height;
    if (weight && weight !== "") animalProps.weight = weight;
    if (player && player !== "") animalProps.player = player;
    if (sociability && sociability !== "") animalProps.sociability = sociability;
    if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;
    if (latitude && latitude !== "") animalProps.latitude = latitude;
    if (longitude && longitude !== "") animalProps.longitude = longitude;
    if (profile && profile !== "") animalProps.profile = profile;
    if (map && map !== undefined) animalProps.map = map;
    if (love && love !== undefined) animalProps.love = love;
    if (geoloc && geoloc !== undefined) animalProps.geoloc = geoloc;
    if (zipCode && zipCode !== "") animalProps.zipcode = zipCode;
    if (city && city !== "") animalProps.city = city;
    if (adress && adress !== "") animalProps.adress = adress;

    const res = await Post(ApiRoutes.validate, animalProps);

    // console.log("ANIMAL PROFILE EDIT ANIMAL ", res.value)
    if (res.success) {

      if (params.from === "breeds") {
        //ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
        storeDispatch(SaveAnimal(res.value));
        navigation.navigate('ModalAddPicture', {
          from: "modal"
        });

      } else {
        //ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
        storeDispatch(SaveAnimal(res.value));
        navigation.navigate('UserAddPicture', {
          from: "User"
        });
      }

    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }

  };

  const validateAdoption = async (id) => {

    const animalProps = {
      id: id,
      user_id: userData._id,
      sterilisation: false,
      lof: false,
      adoption: false,
      hidden: hidden,
      reproduction: false,
      typeof: "visitor",
      typeofname: "visitor",
      breed: "visitor",
      breedname: "visitor",
      hidden: hidden,
      map: map,
      love: love,
      geoloc: geoloc,
      // status:0, 
    };

    if (name && name !== "") animalProps.name = name;
    if (description && description !== "") animalProps.description = description;
    //if (breed && breed !== "") animalProps.breed = breed;
    //if (breedName && breedName !==0) animalProps.breedname = breedname;
    // if (typeOf && typeOf !=="") animalProps.typeof = typeOf;
    // if (typeOfName && typeOfName !=="") animalProps.typeofname = typeOfName;
    // if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    // if (genre && genre !== "") animalProps.genre = genre;
    // if (height && height !== "") animalProps.height = height;
    // if (weight && weight !== "") animalProps.weight = weight;
    // if (sociability && sociability !== "") animalProps.sociability = sociability;
    // if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;
    if (latitude && latitude !== "") animalProps.latitude = latitude;
    if (longitude && longitude !== "") animalProps.longitude = longitude;
    if (profile && profile !== "") animalProps.profile = profile;
    if (map && map !== undefined) animalProps.map = map;
    if (love && love !== undefined) animalProps.love = love;
    if (geoloc && geoloc !== undefined) animalProps.geoloc = geoloc;
    if (zipCode && zipCode !== "") animalProps.zipcode = zipCode;
    if (city && city !== "") animalProps.city = city;
    if (adress && adress !== "") animalProps.adress = adress;


    const res = await Post(ApiRoutes.validate, animalProps);
    if (res.success) {
      ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      storeDispatch(SaveAnimal(res.value));
      if (params.from === "User") {
        navigation.navigate('UserAddPicture', {
          from: "User",
        });
      } else {
        navigation.navigate('ModalAddPicture', {
          from: "NewUser",
        });
      }

    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }
  };

  const CreateAnimal = async () => {

    console.log("create animal")

    const animalProps = {
      //id: animalData._id,
      user_id: userData._id,
      sterilisation: sterilisation,
      lof: lof,
      adoption: adoption,
      reproduction: !sterilisation ? reproduction : false,
      // typeof: animalData.typeof,
      // typeofname: animalData.typeofname,
      // breed: animalData.breed,
      // breedname: animalData.breedname,
      hidden: hidden,
      map: map,
      love: love,
      geoloc: geoloc,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },

      // status:0, 
    };


    if (name && name !== "") animalProps.name = name;
    if (description && description !== "") animalProps.description = description;
    //if (breed && breed !== "") animalProps.breed = breed;
    //if (breedName && breedName !==0) animalProps.breedname = breedname;
    // if (typeOf && typeOf !=="") animalProps.typeof = typeOf;
    // if (typeOfName && typeOfName !=="") animalProps.typeofname = typeOfName;
    // if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    // if (genre && genre !== "") animalProps.genre = genre;
    // if (height && height !== "") animalProps.height = height;
    // if (weight && weight !== "") animalProps.weight = weight;
    // if (sociability && sociability !== "") animalProps.sociability = sociability;
    // if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;
    if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    if (genre && genre !== "") animalProps.genre = genre;
    if (height && height !== "") animalProps.height = height;
    if (weight && weight !== "") animalProps.weight = weight;
    if (player && player !== "") animalProps.player = player;
    if (sociability && sociability !== "") animalProps.sociability = sociability;
    if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;
    if (latitude && latitude !== "") animalProps.latitude = latitude;
    if (longitude && longitude !== "") animalProps.longitude = longitude;
    if (profile && profile !== "") animalProps.profile = profile;
    if (map && map !== undefined) animalProps.map = map;
    if (love && love !== undefined) animalProps.love = love;
    if (geoloc && geoloc !== undefined) animalProps.geoloc = geoloc;
    if (zipCode && zipCode !== "") animalProps.zipcode = zipCode;
    if (city && city !== "") animalProps.city = city;
    if (adress && adress !== "") animalProps.adress = adress;

    const res = await Post(ApiRoutes.create, animalProps);
    if (res.success) {
      console.log("CREATE ANIMAL", res)
      storeDispatch(SaveAnimal(res.value.value));
      validateAdoption(res.value.value._id);
    } else {
      console.log("Error", res);
      ShowToast(CheckBackendErrors(res.error));
    }
  };

  const CreateSociety = async () => {

    const societyProps = {
      profile: "Pros",
      user_id: userData._id,
      id: animalData._id,
      geoloc: geoloc,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
    };

    if (name && name !== "") societyProps.name = name;
    if (geoloc && geoloc !== undefined) societyProps.geoloc = geoloc;
    if (zipCode && zipCode !== "") societyProps.zipcode = zipCode;
    if (description && description !== "") societyProps.description = description;
    if (city && city !== "") societyProps.city = city;
    if (map && map !== undefined) societyProps.map = map;
    if (love && love !== undefined) societyProps.love = love;
    if (geoloc && geoloc !== undefined) societyProps.geoloc = geoloc;
    if (latitude && latitude !== "") societyProps.latitude = latitude;
    if (longitude && longitude !== "") societyProps.longitude = longitude;
    if (city && city !== "") societyProps.city = city;
    if (adress && adress !== "") societyProps.adress = adress;


    const res = await Post(ApiRoutes.create, societyProps);
    if (res.success) {
      storeDispatch(SaveAnimal(res.value.value));
      console.log("CreateSociety RESSSS", res);
      if (params.from !== "User") {
        navigation.popToTop();
        //const target = params.from === 'User' ? undefined : 'Root';
        navigation.replace('Root'); // remplace la modal par la screen cible
      } else {
        console.log("its from USERRRRRR")
        navigation.navigate('UserAddPicture', {
          from: "User"
        });

      }




    } else {
      console.log("Error", res);
      ShowToast(CheckBackendErrors(res.error));
    }
  };

  const handleDateChange = async (date) => {
    setBirthday(date);
    const res = await Post(ApiRoutes.animalEdit, {
      id: animalData._id,
      birthday: new Date(date).toLocaleDateString('en-CA'),
    });
    if (res.success) {
      console.log("Date res", res);
      // ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      storeDispatch(SaveAnimal(res.value));

    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }


  };


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

  const descriptionPlaceholderDisplay = () => {
    params.specify === "Pros" &&
  setDescriptionPlaceHolder(i18n.t('animalProfile.prosDescription'));
  };


  return (

    <View style={BDiaryStyles.container}>


      {(from === "breeds") &&
        <HeaderBuddy
          // openModal={openModal}
          //iconNameL="angle-left"
          //iconNameR="ellipsis-vertical-sharp"
          iconFamilyL="FontAwesome"
          //iconFamilyR="Ionicons"
          label={i18n.t('animalProfile.title')}
          navigationName="User"
          navigationFrom={"User"}
          goBack={true}
        />
      }
      {(from !== "breeds") &&
        <HeaderBuddy
          // openModal={openModal}
          iconNameL="angle-left"
          //iconNameR="ellipsis-vertical-sharp"
          iconFamilyL="FontAwesome"
          //iconFamilyR="Ionicons"
          label={i18n.t('animalProfile.title')}
          navigationName="User"
          navigationFrom={"User"}
          goBack={true}
        />
      }

      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardOffset}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >

        {/* <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              {datePicker()}
            </View>
          </Modal>
        </View> */}

        <ScrollView
          contentInset={{ bottom: bufferScrollViewHeight }}>

          <SafeAreaView style={BDiaryStyles.container}>

            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

            <View style={BDiaryStyles.inner}>

              <View style={BDiaryStyles.formsContainer}>

                {(specify === "Adoption" || specify === "Pros") &&
                  <>
                    <View style={{ marginTop: 30, marginBottom: 20, flexDirection: "row" }}>
                      {/* <MaterialIcons name="height" size={24} color={Colors.greyM} /> */}
                      <Text style={[BDiaryStyles.h5BoldTitle, { color: Colors.pinkBuddy }]}>{i18n.t('animalProfile.adoptionName')}</Text>
                    </View>

                    <View style={{ marginTop: 0 }}>
                      <Text style={[BDiaryStyles.h6, { color: Colors.greyM }]}>{i18n.t('animalProfile.fname')}</Text>
                    </View>

                    <View style={BDiaryStyles.inputContainer}>
                      <View style={[BDiaryStyles.inputContainerRow]}>
                        <TextInput
                          style={[BDiaryStyles.h5, { textAlign: "left", color: Colors.greyM }]}
                          placeholderTextColor={Colors.greyL}
                          placeholder={userData.firstName}
                          value={name}
                          onChangeText={setName}
                          onFocus={() => setBufferScrollViewHeight(0)} // <- your coordinates here
                          //multiline
                          //numberOfLines={4}
                          editable
                          focusRef="top"
                          onFocusHandler={() => setBufferScrollViewHeight(0)}
                        // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                    </View>
                  </>
                }
                {(specify === "Adoption" || specify === "Pros") &&

                  <View>

                    <View style={{ marginTop: 50, }}>
                      {/* <MaterialIcons name="height" size={24} color={Colors.greyM} /> */}

                      <Text style={[BDiaryStyles.h5BoldTitle, { color: Colors.pinkBuddy }]}>{i18n.t('profiles.localisation')}</Text>


                    </View>


                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      {/* {(animalData.adress) &&
                      <Text style={[BDiaryStyles.h6, { color: Colors.greyM }]}>{i18n.t('animalProfile.adress')}</Text>
                      
                      } */}
                      <View style={BDiaryStyles.inputContainer}>
                        <View style={[BDiaryStyles.inputContainerRow, { textAlignVertical: "center", width: 150 }]}>
                          <TextInput
                            style={[BDiaryStyles.h5, { padding: 5, borderWidth: 0, textAlign: "left", color: Colors.greyM }]}
                            placeholder={!userData ? userData : i18n.t('animalProfile.adress')}
                            placeholderTextColor={Colors.greyL}
                            value={adress}
                            onChangeText={setAdress}
                            onFocus={() => setBufferScrollViewHeight(0)} // <- your coordinates here
                            editable
                            focusRef="top"
                            onFocusHandler={() => setBufferScrollViewHeight(0)}
                          // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                          />
                        </View>
                      </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: "center", alignContent: "space-between" }}>

                      <View>
                        {/* <Text style={[BDiaryStyles.h6, { color: Colors.greyM }]}>{i18n.t('animalProfile.town')}</Text> */}
                        <View style={BDiaryStyles.inputContainer}>
                          <View style={[BDiaryStyles.inputContainerRow, { textAlignVertical: "center", width: 150 }]}>
                            <TextInput
                              style={[BDiaryStyles.h5, { padding: 5, borderWidth: 0, textAlign: "left", color: Colors.greyM }]}
                              placeholder={!userData ? userData : i18n.t('animalProfile.town')}
                               placeholderTextColor={Colors.greyL}
                              value={city}
                              onChangeText={setCity}
                              onFocus={() => setBufferScrollViewHeight(0)} // <- your coordinates here
                              editable
                              focusRef="top"
                              onFocusHandler={() => setBufferScrollViewHeight(0)}
                            // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                            />
                          </View>
                        </View>
                        <View>
                          <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                        </View>
                      </View>


                      <View>
                        <View style={{ marginTop: 0 }}>
                          {/* <Text style={[BDiaryStyles.h6, { color: Colors.greyM }]}>{i18n.t('animalProfile.zipCode')}</Text> */}
                        </View>
                        <View style={[BDiaryStyles.inputContainer, { width: 130 }]}>

                          <TextInput
                            style={[BDiaryStyles.h5, { color: Colors.greyM }]}
                            placeholder={!userData ? userData : i18n.t('animalProfile.zipCode')}
                             placeholderTextColor={Colors.greyL}
                            value={zipCode}
                            onChangeText={setZipCode}
                            onFocus={() => setBufferScrollViewHeight(0)} // <- your coordinates here
                            keyboardType="numeric"
                            editable
                            focusRef="top"
                            onFocusHandler={() => setBufferScrollViewHeight(0)}
                          // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                          />

                        </View>
                        <View>
                          <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                        </View>
                      </View>

                    </View>

               

                    <View style={{ marginTop: 20 }}>
                      <Text style={[BDiaryStyles.h6, { color: Colors.greyM }]}>{i18n.t('animalProfile.country')}</Text>
                    </View>

                    <View style={BDiaryStyles.inputContainer}>
                      <TouchableOpacity style={[BDiaryStyles.inputContainerRow, { alignItems: "center", justifyContent: "center", alignContent: "center" }]}
                        onPress={() => goToCountries()}>
                       
                          <Text style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyM }]}>{getCountryName(userData.country)}</Text>
                        
                        <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                    </View>
                  </View>
                }





                {(specify !== "Pros") &&
                  <View style={{ paddingTop: 30, marginBottom: 25, flexDirection: "row" }}>
                    {/* <MaterialIcons name="height" size={24} color={Colors.greyM} /> */}
                    <Text style={[BDiaryStyles.h5BoldTitle, { color: Colors.pinkBuddy }]}>{specify !== "Adoption" ? i18n.t('animalProfile.informations') : i18n.t('animalProfile.yourSearch')}</Text>
                  </View>
                }

                {(specify !== "Pros") &&
                  <>
                    <View style={{}}>
                      <Text style={[BDiaryStyles.h6, { top: 0, paddingLeft: 0, }]}>{i18n.t('species.title')}</Text>
                    </View>

                    <View style={BDiaryStyles.inputContainer}>
                      {/* {(from === "User" || from === "change") &&
                      <TouchableOpacity style={BDiaryStyles.inputContainerRow}
                        onPress={() => navigateToSpecies()}>
                        <Text style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyL }]}>{animalData.typeofname}</Text>
                        <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} />
                      </TouchableOpacity>
                      } */}
                      {(from === "change") &&
                        <TouchableOpacity style={[BDiaryStyles.inputContainerRow, { marginTop: 3, }]}
                          onPress={() => navigateToSpecies()}>
                          <Text style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyM }]}>{animalData.typeofname}</Text>
                          <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} />
                        </TouchableOpacity>
                      }

                      {(from !== "change") &&
                        <View style={BDiaryStyles.inputContainerRow}>
                          <Text style={[BDiaryStyles.h5, { marginTop: 3, textTransform: "capitalize", color: Colors.greyM }]}>{animalData.typeofname}</Text>

                        </View>
                      }
                    </View>

                    <View style={{ marginTop: 20 }}>
                      <Text style={BDiaryStyles.h6}>{i18n.t('breeds.title')}</Text>
                    </View>

                    <View style={[BDiaryStyles.inputContainer, { marginBottom: 20 }]}>
                      <View style={[BDiaryStyles.inputContainerRow, { marginTop: 3, }]}>
                        <Text style={[BDiaryStyles.h5, { textTransform: "capitalize", color: Colors.greyM }]}>{animalData.breedname}</Text>
                        {/* <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} /> */}
                      </View>
                    </View>
                  </>

                }



                <>
                  <View style={{ marginTop: 0 }}>
                    {(specify !== "Adoption" && specify !== "Pros") &&
                      <Text style={[BDiaryStyles.h6, { top: 0, paddingLeft: 0 }]}>{i18n.t('animalProfile.name')}</Text>
                    }
                    {/* {(specify === "Adoption") &&
                      <Text style={[BDiaryStyles.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}>{i18n.t('animalProfile.fname')}</Text>
                    } */}
                  </View>
                  {(specify !== "Adoption" && specify !== "Pros") &&
                    <>
                      <View style={BDiaryStyles.inputContainer}>

                        <TextInput
                          style={[BDiaryStyles.h5, { padding: 0, alignItems: "center", alignContent: "center", justifyContent: "center", width: "100%", textAlign: "left", textTransform: "capitalize", color: Colors.greyM }]}
                          placeholder={i18n.t('animalProfile.name')}
                          placeholderTextColor={Colors.greyL}
                          value={name}
                          onChangeText={setName}
                          onFocus={() => setBufferScrollViewHeight(0)} // <- your coordinates here
                          //numberOfLines={4}
                          editable
                          focusRef="top"
                          onFocusHandler={() => setBufferScrollViewHeight(0)}
                        // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                        />

                      </View>
                      <View>
                        <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                      </View>
                    </>
                  }
                </>


                {(specify !== "Adoption" && specify !== "Pros") &&
                  <View style={{ flex: 1, marginTop: 30, flexDirection: "row" }}>

                    <View style={{}}>
                      <Text style={[BDiaryStyles.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('animalProfile.gender')}</Text>
                      <RadioGroup
                        buttonColor={Colors.greyH}
                        radioButtons={specify !== "Adoption" ? genderItems : genderItemsAdoption}
                        onPress={setGenre}
                        selectedId={genre}
                        borderColor={'#000'}
                        color={Colors.greyM}
                        borderSize={10}
                        labelHorizontal={true}
                        layout={'row'}
                        labelStyle={BDiaryStyles.radioGrouplabelStyle}
                        containerStyle={BDiaryStyles.radioGroupContainer}
                      />
                    </View>


                  </View>
                }


                {(specify !== "Adoption" && specify !== "Pros") &&

                  // <View style={{ borderWidth: 0, flex: 1, top: 0, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  //   <View style={styles.datePickerContainer}>

                  //     {/* <Text style={[BDiaryStyles.h4Secondary, { top: -2, paddingRight: 50, }]}>{i18n.t('animalProfile.birthday')}</Text> */}

                  //     <TouchableOpacity
                  //       onPress={() => {
                  //         setShowDatePicker(true)
                  //         setModalVisible(true)
                  //       }}
                  //       style={BDiaryStyles.DateButtonContainer}>
                  //       {!birthday ? (
                  //         <Text style={[BDiaryStyles.h5, { fontSize: 12 }]}>{i18n.t('animalProfile.birthday')}</Text>
                  //       ) : (
                  //         <Text style={BDiaryStyles.h5}>{formatDate(birthday)}</Text>
                  //       )}
                  //     </TouchableOpacity>
                  //   </View>
                  // </View>
                  <View style={{ flex: 1, marginTop: 20, alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start" }}>
                    <Text style={[BDiaryStyles.h6, { paddingBottom: 10, paddingLeft: 0, fontStyle: "italic", }]}>{i18n.t('animalProfile.birthday')}</Text>
                    <DateInput jours={jours} mois={mois} annee={annee} onDateChange={handleDateChange} />
                  </View>
                }

                <View style={{ paddingTop: 30, marginBottom: 0, flexDirection: "row", marginBottom: 20, }}>
                  {/* <MaterialIcons name="height" size={24} color={Colors.greyM} /> */}
                  <Text style={[BDiaryStyles.h5BoldTitle, { color: Colors.pinkBuddy }]}>{specify !== "Adoption" ? i18n.t('animalProfile.description') : i18n.t('animalProfile.searchDescription')}</Text>
                </View>

                {(specify !== "Adoption" && specify !== "Pros") &&
                  <View style={{ marginTop: 0, marginBottom: 0, width: "100%" }}>

                    <SliderComponent
                      unit="no"
                      small={i18n.t('animalProfile.small')}
                      average={i18n.t('animalProfile.average')}
                      heavy={i18n.t('animalProfile.tall')}
                      label={i18n.t('animalProfile.height')}
                      data={height}
                      onValueChange={setHeight}
                    />
                    <SliderComponent
                      unit="no"
                      small={i18n.t('animalProfile.small')}
                      average={i18n.t('animalProfile.average')}
                      heavy={i18n.t('animalProfile.tall')}
                      label={i18n.t('animalProfile.weight')}
                      data={weight}
                      onValueChange={setWeight}
                    />
                    <SliderComponent
                      unit="metric"
                      small={0}
                      average={5}
                      heavy={10}
                      label={i18n.t('animalProfile.sociability')}
                      data={sociability}
                      onValueChange={setSociability}
                    />
                    <SliderComponent
                      unit="metric"
                      small={0}
                      average={5}
                      heavy={10}
                      label={i18n.t('animalProfile.dynamic')}
                      data={dynamic}
                      onValueChange={setDynamic}
                    />

                    <SliderComponent
                      unit="metric"
                      small={0}
                      average={5}
                      heavy={10}
                      label={i18n.t('animalProfile.player')}
                      data={player}
                      onValueChange={setPlayer}
                    />
                  </View>
                }



                <View style={{ marginTop: 0 }}>
                  {/* {(specify === "noAdoption") &&
                    <View >
                      <Text style={[BDiaryStyles.h4, { color: Colors.greyM, paddingTop: 20, paddingBottom: 20 }]}>Description :</Text>
                    </View>
                  }
                  {(specify === "Adoption") &&
                    <View >
                      <Text style={[BDiaryStyles.h6, { color: Colors.greyM, paddingTop: 0, paddingBottom: 10 }]}>{i18n.t('animalProfile.searchDescription')}</Text>
                    </View>
                  } */}
                  {/* {(specify === "Pros") &&
                    <View >
                      <Text style={[BDiaryStyles.h4, { color: Colors.greyM, paddingTop: 30, paddingBottom: 20 }]}>{i18n.t('animalProfile.prosDescription')}</Text>
                    </View>
                  } */}
                  {/* Bloc description  */}
                  <View >
                    <View style={{ minHeight: 100, borderColor: Colors.greyL, borderWidth: 1, paddingTop: 0, borderRadius: 8, backgroundColor: "#FFF", }}>
                      
                      
                      <TextInput
                        keyboardType="default"
                        multiline
                        style={[BDiaryStyles.h5, { color: Colors.greyM, paddingLeft: 10, paddingTop: 10 }]}
                        //Type='rounded'
                        defaultValue={description}
                        placeholder={descriptionPlaceHolder}
                         placeholderTextColor={Colors.greyL}
                        autoCapitalize='none' autoCorrect={false}
                        onChangeText={(text) => setDescription(text)}
                        //onFocus={() => myScrollView.scrollTo({ x: 0, y: 600, animated: true })} // <- your coordinates here
                        // onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 400, animated: true })} // <- your coordinates here
                        //numberOfLines={4}
                        editable
                        // onFocus={() => this.myScrollView.scrollTo({ x: 0, y: 520, animated: true })}
                        //onBlur={() => setBufferScrollViewHeight(0)}
                        focusRef="bottom1"
                      // onFocusHandler={(focusRef) => onFocusHandler(focusRef)} 
                      />

                    </View>
                    <View>
                      <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>
                    </View>
                  </View>
                </View>


                {(specify === "Adoption") &&
                  <View style={{ marginTop: 30 }}>
                    {/* <SwitchComponent
                      label={i18n.t('animalProfile.adoption')}
                      onValueChange={setAdoption}
                      value={adoption}
                    />
                    <SwitchComponent
                      label={i18n.t('animalProfile.reproduction')}
                      onValueChange={setReproduction}
                      value={reproduction}
                    /> */}
                    <SwitchComponent
                      label={i18n.t('animalProfile.private')}
                      onValueChange={setHidden}
                      value={hidden}
                    />
                  </View>
                }

                {(specify !== "Adoption" && specify !== "Pros") &&

                  <View style={{ marginTop: 30 }}>

                    <SwitchComponent
                      label={i18n.t('animalProfile.sterilisation')}
                      onValueChange={setSterilisation}
                      value={sterilisation}
                    />
                    <SwitchComponent
                      label={i18n.t('animalProfile.lof')}
                      onValueChange={setLof}
                      value={lof}
                    />
                    <SwitchComponent
                      label={i18n.t('animalProfile.adoption')}
                      onValueChange={setAdoption}
                      value={adoption}
                    />
                    {(sterilisation === false) &&
                      <SwitchComponent
                        label={i18n.t('animalProfile.reproduction')}
                        onValueChange={setReproduction}
                        value={reproduction}
                      />
                    }

                    <SwitchComponent
                      label={i18n.t('animalProfile.private')}
                      onValueChange={setHidden}
                      value={hidden}
                    />

                    <SwitchComponent
                      label={i18n.t('animalProfile.map')}
                      onValueChange={setMap}
                      value={map}
                    />
                    <SwitchComponent
                      label={i18n.t('animalProfile.love')}
                      onValueChange={setLove}
                      value={love}
                    />
                    <SwitchComponent
                      label={i18n.t('animalProfile.allowGeoloc')}
                      onValueChange={setGeoloc}
                      value={geoloc}
                    />
                  </View>
                }



                {/* <View style={{ marginBottom: 30, paddingTop: 50, width: "100%", alignContent: "center", alignItems: "center" }}>

                  {(params.from === "change") &&
                    <View style={{ width: "100%", marginTop: 20, }}>
                      <BDButton
                        bgcolor={Colors.greenL}
                        color={Colors.white}
                        display={displaybutton}
                        functionProp={EditAnimal}
                        label={i18n.t('medias.library')}
                      />
                    </View>
                  }



                </View> */}
              </View>

            </View>
            <View style={{ marginTop: 30, marginBottom: 100, alignItems: "center", justifyContent: "center", alignContent: "center" }}>
              <View style={{ width: "70%", marginBottom: 30 }}>

                {/* New animal / first connexion */}
                {(animalData && from === "breeds" && specify === "NoAdoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={true}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }

                {/* Edit Animal */}
                {(animalData && from === "change" && specify === "Noadoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={true}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }

                {(animalData && from === "User" && specify === "NoAdoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={true}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }

                {/* Adoption */}
                {(from === "breeds" && specify === "Adoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={displaybutton}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }
                {/* Edit Adoption */}
                {(from === "change" && specify === "Adoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={displaybutton}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }
                {(from === "User" && specify === "Adoption") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={displaybutton}
                    functionProp={EditAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }


                {/* Society */}
                {(from === "NewUser" && specify === "Pros") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={displaybutton}
                    functionProp={CreateAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }

                {/* Society */}
                {(from === "User" && specify === "Pros") &&
                  <BDButton
                    bgcolor={Colors.greenBuddy}
                    color={Colors.white}
                    display={displaybutton}
                    functionProp={CreateAnimal}
                    label={i18n.t('auth.login.submit')}
                  />
                }
                {(from === "change" && specify === "Pros") &&
                  <View style={{ marginTop: 20 }}>
                    <BDButton
                      bgcolor={Colors.greenBuddy}
                      color={Colors.white}
                      display={displaybutton}
                      functionProp={EditAnimal}
                      label={i18n.t('auth.login.submit')}
                    />
                  </View>
                }

                {/* {(animalData && from !== "NewUser" && from !== "NewUser") &&
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={true}
                  functionProp={EditAnimal}
                  label={i18n.t('auth.login.submit')}
                />
                } */}

              </View>

            </View>
          </SafeAreaView>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
};



const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  generalCalendarContainer: {
    width: ScreenWidth,
    //position:"relative",
    padding: 0,
    top: 0,
    zIndex: 1,
    //height: ScreenHeight,
    backgroundColor: Colors.white,
  },

  dateTimePickerContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    //width: "100%",
    backgroundColor: Colors.white,
    top: 0
  },

  dateTimeSubmitContainer: {
    width: 200,
    top: 0,
    borderWidth: 0,
    borderColor: "#FFF",
    marginBottom: 30,
  },

  calendarContainer: {
    //padding: 10,
    top: 0,
    zIndex: 0,
    padding: 0,
    color: "#000",
    width: ScreenWidth,
    heigh: ScreenHeight,
    backgroundColor: Colors.white,
  },

  dateCloseIconContainer: {
    padding: 10,
    height: 60,
    alignContent: "flex-start",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },

  datePickerContainer: {
    flex: 1,
    paddingRight: 0,
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "center",
  },

});



export default AnimalProfileScreen;



