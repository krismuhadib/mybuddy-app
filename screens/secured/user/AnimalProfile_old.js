import React, { useMemo, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView, Platform, KeyboardAvoidingView, ScrollView,
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
import * as Location from 'expo-location';
import { CapitalizeFirstLetter, myLocalisation } from '../../../utils/helpers';
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const AnimalProfileScreen = () => {

  // User Redux Store Data
  const navigation = useNavigation();
  const storeDispatch = useDispatch();

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const [typeOf, setTypeOf] = useState(animalData.typeof);
  const [typeOfName, setTypeOfName] = useState(animalData.typeofname);
  const [breed, setBreed] = useState(animalData.breed);
  const [breedName, setBreedName] = useState(animalData.breedname);
  const [birthday, setBirthday] = useState(animalData.birthday);
  const [showdatepiker, setShowDatePicker] = useState(false);
  const [name, setName] = useState(CapitalizeFirstLetter(animalData.name));
  const [genre, setGenre] = useState(animalData.genre);
  const [height, setHeight] = useState(animalData.height);
  const [weight, setWeight] = useState(animalData.weight);
  const [dynamic, setDynamic] = useState(animalData.dynamic);
  const [player, setPlayer] = useState(animalData.player);
  const [allow_geoloc, setAllow_geoloc] = useState(animalData.allow_geoloc);
  const [allow_loveswap, setAllow_loveswap] = useState(animalData.allow_loveswap);



  const [sociability, setSociability] = useState(animalData.sociability);
  const [sterilisation, setSterilisation] = useState(animalData.sterilisation);
  const [lof, setLof] = useState(animalData.lof);
  const [reproduction, setReproduction] = useState(animalData.reproduction);
  const [adoption, setAdoption] = useState(animalData.adoption);
  const [description, setDescription] = useState(animalData.description);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [bufferScrollViewHeight, setBufferScrollViewHeight] = useState(0);
  const [displaybutton, setDisplayButton] = useState(true);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  console.log("User Animal Profile")



  useEffect(() => {
    fetchLocation();
    validateForm();

  }, [typeOfName, breedName, name, genre, keyboardOffset, scrollEnabled, bufferScrollViewHeight]);

  const validateForm = () => {
    if (!name || name === '' || !animalData.breed || animalData.breed === '' || !genre || genre === null || genre === "null") {
      return setDisplayButton(false);
    }
    return setDisplayButton(true);
  };

  const SubmitDate = async () => {
    const res = await Post(ApiRoutes.animalEdit, {
      id: animalData._id,
      birthday: new Date(birthday).toLocaleDateString('en-CA'),
    });
    if (res.success) {
      // console.log("Date res", res)
      // ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      storeDispatch(SaveAnimal(res.value));

    } else {
      // ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }
    setShowDatePicker(false);
    setScrollEnabled(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr");
  };

  const genderItems = useMemo(() => (
    [
      {
        id: '1',
        label: 'Male',
        value: 'Male',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
      {
        id: '2',
        label: ' Femelle',
        value: 'Femelle',
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
              setScrollEnabled(true);
            }
            }
              style={styles.dateCloseIconContainer}>
              <EvilIcons name="close-o" size={35} color={Colors.greyM} />
            </TouchableOpacity>

            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                maxDate={new Date()}
                maxYear={(new Date()).getFullYear()}
                yearTextStyle={{ color: Colors.greyH, fontSize: 20, }}
                yearContainerStyle={{ backgroundColor: Colors.greyL, color: Colors.greyH, fontSize: 20, }}
                monthContainerStyle={{ backgroundColor: Colors.primary, color: "#ccc", fontSize: 20, }}
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
                  style={[BDiaryStyles.buttonLabelOn, { alignContent: "center", alignItems: "center", justifyContent: "center" }]}>
                  {i18n.t('animalProfile.submit')}</Text>
              </TouchableOpacity>

            </View>
          </View>

        </View>
      )
    }
  };

  const onFocusHandler = (ref) => {
    console.log("tut", ref)
    if (ref === 'top') {
      setBufferScrollViewHeight(0);
    } else {
      setKeyboardOffset(0)
      setBufferScrollViewHeight(800)
    }
  };

  const handleScrollViewHeight = (item) => {
    if (item === "top") {
      setBufferScrollViewHeight(0)
      this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })
    } else {
      setBufferScrollViewHeight(600)
      this.myScrollView.scrollTo({ x: 0, y: 850, animated: true })
    }
  };




  const fetchLocation = async () => {
    const position = await myLocalisation();
    if (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }
  };


  const EditAnimal = async () => {

    console.log("EditAnimal", animalData);

    let animalProps = {
      id: animalData._id,
      user_id: userData._id,
      sterilisation: sterilisation,
      lof: lof,
      adoption: adoption,
      reproduction: reproduction,
      allow_geoloc: allow_geoloc,
      allow_loveswap: allow_loveswap,
      latitude: latitude,
      longitude: longitude,
    };

    if (name && name !== "") animalProps.name = name.toLowerCase();
    if (description && description !== "") animalProps.description = description;
    if (breed && breed !== "") animalProps.breed = breed;
    if (breedName && breedName !== 0) animalProps.breedname = breedName.toLowerCase();
    if (typeOf && typeOf !== "") animalProps.typeof = typeOf;
    if (typeOfName && typeOfName !== "") animalProps.typeofname = typeOfName.toLowerCase();
    if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    if (genre && genre !== "") animalProps.genre = genre;
    if (height && height !== "") animalProps.height = height;
    if (player && player !== "") animalProps.player = player;
    if (weight && weight !== "") animalProps.weight = weight;
    if (sociability && sociability !== "") animalProps.sociability = sociability;
    if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;

    const res = await Post(ApiRoutes.validate, animalProps);
    if (res.success) {
      //ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      storeDispatch(SaveAnimal(res.value));
      navigation.navigate('UserAddPicture');
    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }
  };


  return (


    <View style={BDiaryStyles.container}>

      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardOffset}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView ref={component => { this.myScrollView = component; }}
          contentInset={{ bottom: bufferScrollViewHeight }}>
          <SafeAreaView style={BDiaryStyles.container}>

            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

            <View style={BDiaryStyles.formsContainer}>

              <View style={{ height: 20 }}></View>

              <View style={{ paddingTop: 0, paddingBottom: 10, flexDirection: "row" }}>
                {/* <MaterialIcons name="height" size={24} color={Colors.greyM} /> */}
                <Text style={[BDiaryStyles.h4, { color: Colors.greyM }]}>Informations</Text>
              </View>


              {/* <Text style={[BDiaryStyles.h5, { top: -2, paddingLeft: 20, }]}>{i18n.t('species.title')}</Text> */}
              <View style={BDiaryStyles.inputContainer}>
                <TouchableOpacity style={BDiaryStyles.inputContainerRow}
                  onPress={() => navigation.navigate("Species", {
                    from: "profile"
                  })}>
                  <Text style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyM }]}>{typeOfName}</Text>
                  <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} />
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }}></View>

              {/* <Text style={[BDiaryStyles.h6, { top: 0, paddingLeft: 20,fontStyle:"italic",  }]}>{i18n.t('breeds.title')}</Text> */}

              <View style={BDiaryStyles.inputContainer}>
                <TouchableOpacity style={BDiaryStyles.inputContainerRow}
                  onPress={() => navigation.navigate("Breeds", {
                    from: "profile",
                    animal_id: animalData._id
                  })}>
                  <Text style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyM }]}>{breedName}</Text>
                  <Feather style={{ paddingRight: 10 }} name="chevron-down" size={25} color={Colors.greyL} />
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }}></View>


              <View style={BDiaryStyles.inputContainer}>
                <View style={BDiaryStyles.inputContainerRow}>
                  <TextInput
                    style={[BDiaryStyles.h5, { flex: 1, textTransform: "capitalize", color: Colors.greyM }]}
                    placeholder={i18n.t('animalProfile.name')}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here
                    multiline
                    //numberOfLines={4}
                    editable
                    focusRef="top"
                    onFocusHandler={() => handleScrollViewHeight("top")}
                    onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 0, animated: true })} // <- your coordinates here

                  />

                </View>
              </View>
              <Text style={[BDiaryStyles.h5ItalicRed, { top: 5, paddingLeft: 15, }]}>* {i18n.t('animalProfile.obligatory')}</Text>


              <View style={{ height: 20 }}></View>


              <View style={{ flexDirection: "row" }}>

                <View style={{}}>
                  {/* <Text style={[BDiaryStyles.h5, {paddingLeft:10}]}>Genre</Text> */}
                  <RadioGroup
                    buttonColor={Colors.greyH}
                    radioButtons={genderItems}
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

                <View style={{ borderWidth: 0, flex: 1, top: 0, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <View style={styles.datePickerContainer}>

                    {/* <Text style={[BDiaryStyles.h4Secondary, { top: -2, paddingRight: 50, }]}>{i18n.t('animalProfile.birthday')}</Text> */}

                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(true)
                        setScrollEnabled(false)
                      }}
                      style={BDiaryStyles.DateButtonContainer}>
                      {!birthday ? (
                        <Text style={[BDiaryStyles.h5, { fontSize: 12 }]}>{i18n.t('animalProfile.birthday')}</Text>
                      ) : (
                        <Text style={BDiaryStyles.h5}>{formatDate(birthday)}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {datePicker()}
              </View>

              <View style={{ height: 40 }}></View>

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
                small="0"
                average="5"
                heavy="10"
                label={i18n.t('animalProfile.sociability')}
                data={sociability}
                onValueChange={setSociability}
              />
              <SliderComponent
                unit="metric"
                small="0"
                average="5"
                heavy="10"
                label={i18n.t('animalProfile.dynamic')}
                data={dynamic}
                onValueChange={setDynamic}
              />

              <SliderComponent
                unit="metric"
                small="0"
                average="5"
                heavy="10"
                label={i18n.t('animalProfile.player')}
                data={player}
                onValueChange={setPlayer}
              />


              <View style={{ height: 0 }}></View>

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
              <SwitchComponent
                label={i18n.t('animalProfile.reproduction')}
                onValueChange={setReproduction}
                value={reproduction}
              />

              <SwitchComponent
                label={i18n.t('Page.Geolocalisation')}
                onValueChange={setAllow_geoloc}
                value={allow_geoloc}
              />

              <SwitchComponent
                label={i18n.t('Page.LoveSwap')}
                onValueChange={setAllow_loveswap}
                value={allow_loveswap}
              />


              <View style={{ height: 20 }}></View>

              <View>
                <View >
                  <Text style={[BDiaryStyles.h4, { color: Colors.greyM, paddingTop: 20, paddingBottom: 20 }]}>Description :</Text>
                </View>
                {/* Bloc name  */}
                <View >
                  <View style={{ borderColor: Colors.greyL, borderWidth: 1, paddingBottom: 10, paddingTop: 10, borderRadius: 8, }}>
                    <TextInput
                      keyboardType="default"
                      multiline
                      style={[BDiaryStyles.h5, { color: Colors.greyM, padding: 10, justifyContent: 'flex-start' }]}
                      //Type='rounded'
                      defaultValue={description}
                      placeholder={i18n.t('animalProfile.description')}
                      autoCapitalize='none' autoCorrect={false}
                      onChangeText={(text) => setDescription(text)}
                      //onFocus={() => this.myScrollView.scrollTo({ x: 0, y: 600, animated: true })} // <- your coordinates here
                      onBlur={() => this.myScrollView.scrollTo({ x: 0, y: 500, animated: true })} // <- your coordinates here
                      //numberOfLines={4}
                      editable
                      onFocus={() => handleScrollViewHeight("bottom")}
                      // onBlur={() => setBufferScrollViewHeight(-1)}
                      focusRef="bottom1"
                    // onFocusHandler={(focusRef) => onFocusHandler(focusRef)} 
                    />

                  </View>
                </View>
              </View>

              <View style={{ height: 30 }}></View>

              <View style={{ alignContent: "center", alignItems: "center" }}>
                <BDButton
                  bgcolor={Colors.greyL}
                  color={Colors.white}
                  display={true}
                  functionProp={EditAnimal}
                  label={i18n.t('Page.Validate')}
                />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
};



const styles = StyleSheet.create({



  generalCalendarContainer: {
    width: ScreenWidth,
    // position:"relative",
    padding: 0,
    top: 0,
    zIndex: 1,
    height: ScreenHeight,
    backgroundColor: Colors.white,
    marginBottom: 0,
    left: - ScreenWidth / 1.88,
    //alignContent:"center",
    //alignItems:"center",
    // justifyContent:"center"

  },

  dateTimePickerContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Colors.white,
    top: 0
  },

  dateTimeSubmitContainer: {
    width: 200,
    top: 0,
    borderWidth: 0,
    borderColor: "#FFF",
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
    justifyContent: "center"
  },

  slider: {
    //position: 'absolute',
    //marginTop: width * 0.57,
    //width: 250,
    //transform: [{ rotateZ: '-90deg' }],
    marginLeft: 0,
    marginRight: 0,
  },

  track: {
    height: 1,
    backgroundColor: 'red',
  },


  thumb: {
    width: 10,
    height: 10,
    // backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderColor: 'rgba(150, 150, 150, 0.6)',
    borderWidth: 14,
    borderRadius: 15,
  },

  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    // backgroundColor: '#fff',
    borderTopColor: '#ccc',
    //opacity: 0.9,
    borderTopWidth: 0,
    alignItems: 'center',
  },

  switchContainertext: {
    marginLeft: 0,
    fontFamily: 'Roboto-Regular',

    fontSize: 15,
    //textAlign:'left',
    //justifyContent: 'center',
  },

  switchBtn: {

    alignItems: 'flex-end',
    paddingRight: 0,
    //backgroundColor:'red'
  },

});



export default AnimalProfileScreen;


