import React, { useEffect, useState, useMemo, useCallback, useDebugValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, Text, Dimensions, Animated, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import LoveSwap from '../../../components/elements/LoveSwap';
import { i18n } from "../../../constants/Localization";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import RadioGroup from 'react-native-radio-buttons-group';
import { CapitalizeText, myLocalisation, SpreadGeolocalisationLongitude, SpreadGeolocalisationLatitude } from '../../../utils/helpers';
import { useDispatch } from "react-redux";
import { Post, ApiRoutes } from '../../../services/api';
import { ShowToast } from '../../../services/notification';
import SliderComponent from '../../../components/elements/SliderComponent';
import LoveSliderComponent from '../../../components/elements/LoveSliderComponent';
import SwitchComponent from '../../../components/elements/SwitchComponent';
import BDButton from '../../../components/elements/BDButton';
import { SaveAnimal } from '../../../redux/slices/animalSlice';


const noImg = require('../../../assets/images/logo_avatar.png');
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);



const LoveSwapSettingScreen = (route) => {


  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [isFetching, setIsFetching] = useState(false);
  const [swapDistance, setSwapDistance] = useState(animalData.swapdistance);
  const [sliderValueDistance, setSliderValueDistance] = useState(animalData.swapdistance);
  const [allSpecies, setAllSpecies] = useState(animalData ? animalData.loveallspecies : animalData.loveallspecies);
  const [allBreeds, setAllBreeds] = useState(animalData ? animalData.loveallbreeds : animalData.loveallbreeds);

  const [loveAdoption, setLoveAdoption] = useState(animalData ? animalData.loveadoption : animalData.loveadoption);
  const [loveReproduction, setLoveReproduction] = useState(animalData ? animalData.lovereproduction : animalData.lovereproduction);

  const [loveGenre, setLoveGenre] = useState(animalData ? animalData.lovegenre : animalData.lovegenre);
  const [loveTypeOf, setLoveTypeOf] = useState(animalData ? animalData.lovetypeof : animalData.lovetypeof);
  const [loveBreed, setLoveBreed] = useState(animalData ? animalData.lovetypeof : animalData.loveBreed);

  const [loveTypeOfName, setLoveTypeOfName] = useState(animalData ? animalData.lovetypeofname : animalData.lovetypeofname);
  const [loveBreedName, setLoveBreedName] = useState(animalData ? animalData.lovebreedname : animalData.lovebreedname);

  const params = route.route.params;

  console.log("LoveSwapSetting");

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
        label: i18n.t('loveSwap.all'),
        value: 'Other',
        color: Colors.greyH,
        borderColor: Colors.greyL,
      },
    ]), []
  );

  useEffect(() => {
    setLoveTypeOfName(animalData.lovetypeofname);
    setLoveBreedName(animalData.lovebreedname);
    // editAnimal();
  }, [params]);



  useEffect(() => {
    // console.log("animal data love sawap setting", animalData)
    if (animalData.lovetypeof === undefined || animalData.lovebreed === undefined) {
      setLoveTypeOf(animalData.typeof);
      setLoveTypeOfName(animalData.lovetypeofname);
      setLoveBreed(animalData.breed);
      setLoveBreedName(animalData.lovebreedname);
    }
    // editAnimal();
  }, [loveGenre, params]);


  const reloadLoveList = () => {
    setIsFetching(true);
  };

  const goLoveSwapPage = () => {
    navigation.navigate("LoveSwap", {
      params: allSpecies,
    })
  };


  const editAnimal = async () => {
    const animalProps = {
      id: animalData._id,
      user_id: userData._id,
      lovegenre: loveGenre,
      swapdistance: sliderValueDistance,
      loveTypeOfName: loveTypeOfName,
      loveTypeOf: loveTypeOf,
      loveBreedName: loveBreedName,
      loveBreed: loveBreed,
      loveallspecies: allSpecies,
      loveallbreeds: allBreeds,
      loveadoption: loveAdoption,
      lovereproduction: loveReproduction
      // status:0, 
    };
    // if (allSpecies && allSpecies !== "") animalProps.loveallspecies = allSpecies;
    // if (birthday && birthday !== "") animalProps.birthday = new Date(birthday).toLocaleDateString('en-CA');
    // if (allSpecies && allSpecies !== "") animalProps.loveallspecies = allSpecies;
    // if (height && height !== "") animalProps.height = height;
    // if (weight && weight !== "") animalProps.weight = weight;
    // if (player && player !== "") animalProps.player = player;
    // if (sociability && sociability !== "") animalProps.sociability = sociability;
    // if (dynamic && dynamic !== "") animalProps.dynamic = dynamic;
    // if (latitude && latitude !== "") animalProps.latitude = latitude;
    // if (longitude && longitude !== "") animalProps.longitude = longitude;
    // if (profile && profile !== "") animalProps.profile = profile;
    // if (map && map !== undefined) animalProps.map = map;
    // if (love && love !== undefined) animalProps.love = love;
    // if (geoloc && geoloc !== undefined) animalProps.geoloc = geoloc;
    // if (zipCode && zipCode !== "") animalProps.zipcode = zipCode;
    // if (city && city !== "") animalProps.city = city;

    const res = await Post(ApiRoutes.validate, animalProps);
    if (res.success) {
      storeDispatch(SaveAnimal(res.value));
      //ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
      goLoveSwapPage();
    } else {
      ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    }

  };

  return (
    <View style={BDiaryStyles.container}>

      <HeaderBuddyLeft
        //openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="notifications-outline"
        iconFamilyL="FontAwesome"
       // iconFamilyR="Ionicons"
        navigationName="LoveSwap"
        navigationNameR="NotificationListScreen"
        logo={false}
        goBack={true}
        label={i18n.t('loveSwap.search')}
      />
      <ScrollView>

        <View style={{ padding: 10, marginTop: 0, }}>

          {/* <Text style={[BDiaryStyles.h5, {fontFamily:"Poppins-bold"}]}>{i18n.t('loveSwap.specifySearch')}</Text> */}

          <View style={{ paddingTop: 10 }}>
            <SwitchComponent
              label={i18n.t('loveSwap.allSpeciesSearch')}
              onValueChange={setAllSpecies}
              value={allSpecies}
            />
          </View>

         

          {(!allSpecies) &&

            <View>
              <View>
                <Text style={BDiaryStyles.h5}>{i18n.t('loveSwap.chooseSpecies')} :</Text>
                <TouchableOpacity style={{ padding: 10 }}
                  onPress={() => navigation.navigate('LoveSpecies', {
                    from: "LoveSwap",
                    typeof: animalData.typeof,
                  })}>
                  {/* Species  */}
                  <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flexDirection: "row", borderWidth: 1, borderRadius: 25, borderColor: Colors.greyL, height: 40, }}>
                    <Text style={[BDiaryStyles.h5, { textTransform: "capitalize", paddingLeft: 15, color: Colors.greyM }]}>
                      {loveTypeOfName}
                    </Text>
                    <View style={[styles.itemContainericon, { flex: 1, borderWidth: 0, alignItems: 'flex-end', }]}>
                      <Ionicons style={{ padding: 10 }} name="search" size={18} color={Colors.greyL} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {(userData.ispremium === true && loveTypeOfName !== undefined) &&

              
                <View>
                   <View style={{ paddingTop: 10 }}>
            <SwitchComponent
              label={i18n.t('loveSwap.allBreedsSearch')}
              onValueChange={setAllBreeds}
              value={allBreeds}
            />
          </View>


                  {(allBreeds === false && loveTypeOfName !== undefined) &&
                   <View>
                  <Text style={BDiaryStyles.h5}>{i18n.t('loveSwap.chooseBreeds')} :</Text>
                  <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => navigation.navigate('LoveBreeds', {
                      from: "LoveSwap",
                      typeof: animalData.lovetypeof,
                    })}>
                    {/* Breeds  */}
                    <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flexDirection: "row", borderWidth: 1, borderRadius: 25, borderColor: Colors.greyL, height: 40, }}>
                      <Text style={[BDiaryStyles.h5, { textTransform: "capitalize", paddingLeft: 15, color: Colors.greyM }]}>
                        {loveBreedName}
                      </Text>
                      <View style={[styles.itemContainericon, { flex: 1, borderWidth: 0, alignItems: 'flex-end', }]}>
                        <Ionicons style={{ padding: 10 }} name="search" size={18} color={Colors.greyL} />
                      </View>
                    </View>
                  </TouchableOpacity>
                   </View>
                  }
                </View>
              }

            </View>
          }

          <View style={{ marginTop: 0 }}>
            <Text style={[BDiaryStyles.h5]}> {i18n.t('animalProfile.gender')}</Text>
            <RadioGroup
              buttonColor={Colors.greyH}
              radioButtons={genderItems}
              onPress={setLoveGenre}
              selectedId={loveGenre}
              borderColor={'#000'}
              color={Colors.greyM}
              borderSize={10}
              labelHorizontal={true}
              layout={'row'}
              labelStyle={BDiaryStyles.radioGrouplabelStyle}
              containerStyle={BDiaryStyles.radioGroupContainer}
            />
          </View>

          {(userData.ispremium === true) &&
            <>
              <View style={{ padding: 0, marginBottom: 0, }}>
                <SwitchComponent
                  label={i18n.t('loveSwap.reproduction')}
                  onValueChange={setLoveReproduction}
                  value={loveReproduction}
                />
              </View>

              <View style={{ padding: 0, marginBottom: 10, }}>
                <SwitchComponent
                  label={i18n.t('loveSwap.adoption')}
                  onValueChange={setLoveAdoption}
                  value={loveAdoption}
                />
              </View>

              <View style={{ padding: 0, paddingBottom: 0, flexDirection: "row" }}>
                <Text style={[BDiaryStyles.h5, { color: Colors.greyH }]}>{i18n.t('loveSwap.searchSwapDistance')} :
                </Text>
                {(sliderValueDistance !== undefined || sliderValueDistance !== null) &&
                  <Text style={[BDiaryStyles.h5, { fontFamily: 'Poppins-Bold', }]}> {sliderValueDistance} km</Text>
                }
              </View>
              <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
                <LoveSliderComponent
                  maxValue={config.loveSwap.maxSearchDistance}
                  unit={5}
                  small={0}
                  average={i18n.t('animalProfile.average')}
                  heavy={100}
                  label={i18n.t('animalProfile.height')}
                  data={sliderValueDistance}
                  onValueChange={setSliderValueDistance}
                />
              </View>
            </>
          }
        </View>

        <View style={{ paddingLeft: 50, paddingRight: 50, marginTop: 20, }}>
          <BDButton
            bgcolor={Colors.greenBuddy}
            color={Colors.white}
            display={true}
            functionProp={editAnimal}
            label={i18n.t('loveSwap.loveNewSearch')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainertext: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',

    fontSize: 15,
    textAlign: 'left',
    justifyContent: 'center',
  },
});

export default LoveSwapSettingScreen;