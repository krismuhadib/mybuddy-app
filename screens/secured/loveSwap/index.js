import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {Button, Image, TouchableOpacity, Text, Dimensions, Animated, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import HeaderBuddyPrimary from '../../../components/elements/HeaderBuddyPrimary';
import LoveSwap from '../../../components/elements/LoveSwap';
import { i18n } from "../../../constants/Localization";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { myLocalisation, SpreadGeolocalisationLongitude, SpreadGeolocalisationLatitude } from '../../../utils/helpers';
import ConfettiAnimation from '../../../components/elements/ConfettiAnimation';
import HeartConfettiTwoColors from '../../../components/elements/HeartConfetti';
import EmojiConfetti from '../../../components/elements/EmojiConfetti';

const noImg = require('../../../assets/images/logo_avatar.png');
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const matchImage = require('../../../assets/images/matches.png');


const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 80, // Définir un seuil de visibilité (par exemple, 50%)
};

const LoveSwapScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const params = route.route.params;


  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [skipNumber, setSkipNumber] = useState(0);
  const [loveList, setLoveList] = useState([]);
  const [newLoveList, setNewLoveList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loveListCount, setLoveListCount] = useState();
  const [swapDistance, setSwapDistance] = useState(animalData ? animalData.swapdistance : animalData.swapdistance);
  const [latitude, setLatitude] = useState(animalData ? animalData.latitude : animalData.latitude);
  const [longitude, setLongitude] = useState(animalData ? animalData.longitude : animalData.longitude);
  const [cardIndex, setCardIndex] = useState(0);
  const [matchVisible, setMatchVisible] = useState(false);
  const [running, setRunning] = useState(true);
  const [active, setActive] = useState(false);
  const [idMatch, setIdMatch] = useState("");

  console.log("LoveSwap Index");
 

  //   useEffect(() => {
  //     setTimeout(() => {
  //       displayLoveMatchAnimation();
  //     }, 5000);
  // }, []);

   

  useEffect(() => {
    getLoveList();
    fetchLocation();
  }, []);

  useEffect(() => {
   if (matchVisible && matchVisible === true) {
   displayLoveMatchAnimation();
   } 
  }, [matchVisible]);

  const displayLoveMatchAnimation = () => {
     setActive(true);
     setTimeout(() => {
       setActive(false);
       setMatchVisible(false)
     }, 10000);
  };

  useEffect(() => {
    getLoveList();
  }, [params,swapDistance]);

  const reloadLoveList = () => {
    setIsFetching(true);
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
 
  const gotoMatchScreen = () => {
    setCardIndex(0);
  };


  const getLoveList = async () => {
    await fetch(config.uri + 'animals/getlovesearch', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken
      },
      body: JSON.stringify({
        premium: userData.ispremium,
        animal_id: animalData._id,
        swapdistance: animalData.swapdistance,
        lovebreedname: animalData.lovebreedname,
        lovebreed: animalData.lovebreed,
        lovetypeof: animalData.lovetypeof,
        lovetypeofname: animalData.lovetypeofname,
        lovegenre: animalData.lovegenre,
        latitude: latitude,
        longitude: longitude,
        lovereproduction: animalData.lovereproduction,
        loveadoption: animalData.loveadoption,
        nolovers: animalData.nolovers,
        skipnumber: skipNumber,
        loveallspecies: animalData.loveallspecies,
        genre: animalData.lovegenre
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          setLoveList(res.animalList);
          setIsFetching(false);
          if (res && res.animalList) {
            // Remove User in animalList
            var remove_id = animalData._id
            var loveLists = res.animalList.filter((x) => {
              return x._id != remove_id;
            });
            var loveListCount = loveLists.length;
            //console.log("LoveList", res.animalList);
            setSkipNumber(skipNumber + config.skipNumber.skipNumber)
            setNewLoveList(loveLists);
            setLoveListCount(loveListCount);
          };

        } else {
          alert('Love Search Prb');
        }
      });
  };


  return (
    <View style={BDiaryStyles.container}>
      <View style={{position:"relative", zIndex:10}}>
      <HeaderBuddyPrimary
        //openModal={openModal}
        iconNameL="heart"
        iconNameR="sliders"
        iconFamilyL="Feather"
        iconFamilyR="FontAwesome"
        navigationName="LoveMatch"
        navigationNameR="LoveSwapSetting"
        logo={true}
      />
      </View>
      
 {/* <Button
        title={active ? "Stop" : "Start"}
          onPress={() => setActive(!active)}
      />
       */}
      


      {/* <View style={{  flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: '#F0F0F0',
            padding: 5,}}
            onPress={() => this.gotoMatchScreen()
            }>

            <AntDesign style={{
              top: 5, shadowColor: '#000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
            }} name="heart" size={35} color={"violet"} />
          </TouchableOpacity>
        </View> */}

{(matchVisible === false && loveList && loveList.length > 0) &&
     
        <LoveSwap 
        setCardIndex={setCardIndex}
        cardIndex={cardIndex}
        cards={loveList}
        matchVisible={matchVisible}
        setMatchVisible={setMatchVisible}
        active={active}
        setActive={setActive}
        setIdMatch={setIdMatch}
        idMatch={idMatch}
        />
    
    }
      

      <View style={{ padding: 20 }}>

        <View style={styles.loveswapcardblack}>
          <Text style={{ color: Colors.greyM, textAlign: "center", fontSize: 15, lineHeight: 30 }}>
            {i18n.t('Page.Nomore_Cards')}
          </Text>
          <View style={{ paddingRight: 10 }}>
            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: '#F0F0F0',
              padding: 5,

            }}
              onPress={() => gotoMatchScreen()
              }>
              <AntDesign style={{
                top: 5, shadowColor: '#000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 5,
              }} name="heart" size={35} color={"violet"} />
            </TouchableOpacity>
          </View>


        </View>


      </View>

      {(matchVisible === true) &&
      <View style={{  position:"absolute", zIndex:100, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <HeartConfettiTwoColors
        active={active}
        fadeDuration={1500}  // durée du fondu in/out
        speed="normal"         // "slow" | "normal" | "fast"
        count={30}           // nombre de cœurs à l’écran
        />

        {/* <EmojiConfetti
        active={active}
        fadeDuration={1200}
        speed="normal"
        count={50}
        emojis={["💖","💎","🌸","✨","🎉","💫"]}
      /> */}

      {/* <EmojiConfetti
        active={active}
        fadeDuration={1200}
        speed="normal"
        count={40}
        emoji="⭐"
      /> */}

         
      </View>
      }
 
{(matchVisible === true) &&
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.0)', height: ScreenHeight -30, width: ScreenWidth , position: "absolute" }}>
              <Image
                style={[styles.matchImage, {  position: "absolute", zIndex: 999 }]}
                source={matchImage} />

                 <Image
                style={{Zindex:900, padding:0, borderRadius:0, resizeMode: "contain", width: "100%", height: ScreenHeight -30}}
                source={{ uri: config.linkserver + idMatch + '/images/avatar/large/' + idMatch + '.jpg' }}
                 />
                 
            </View>
          }
 
    </View>
  );
};



const styles = StyleSheet.create({
  matchImage: {
    width: ScreenWidth,
    height: ScreenHeight,
    resizeMode: "cover",

  },


  loveswapcard: {
    //flex:1,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
    borderRadius: 10,
    height: ScreenHeight - ScreenHeight / 3.5,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.36,
    // shadowRadius: 6.68,

  },

  loveswapcardblack: {
    padding: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: 'center',
    //flex:1,

    borderColor: '#fff',
    backgroundColor: Colors.white,
    borderRadius: 10,
    height: ScreenHeight - ScreenHeight / 3.5,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.36,
    // shadowRadius: 6.68,

  },



  image: {
    //borderWidth: 0,
    flex: 1,
    resizeMode: "cover",

    borderRadius: 10,
    overflow: 'hidden',


  },


  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  },
  matchImage: {

    width: ScreenWidth,
    height: ScreenHeight,
    resizeMode: "cover",

  },

  lovername: {
    fontStyle: 'italic',
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textTransform: "capitalize",
  },
  loverage: {
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 5,
    textTransform: "capitalize",
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },

  loverdescription: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',

  },
  loverdistance: {
    fontStyle: 'italic',
    paddingTop: 10,
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  appButtonContainer: {
    // elevation: 8,
    // backgroundColor:Colors.red,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  appButtonText: {
    fontSize: 10,
    color: Colors.red,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
});

export default LoveSwapScreen;
