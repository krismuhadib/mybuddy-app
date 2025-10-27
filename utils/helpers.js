import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';

import { i18n } from "../constants/Localization";
import Colors from '../constants/Colors';
import BDiaryStylesForms from "../assets/styles/forms";
import * as Location from 'expo-location';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';


const ValidateEmail = (email) => {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
};

const CheckForSpecialChar = (string) => {
  const specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
  for (let i = 0; i < specialChars.length; i++) {
    if (string.indexOf(specialChars[i]) > -1) {
      return true;
    }
  }
  return false;
};

const CheckAllCases = (string) => {
  let upper = false,
    lower = false;
  for (const character of string) {
    if (character.toUpperCase() === character.toLowerCase()) continue;
    upper ||= character === character.toUpperCase();
    lower ||= character === character.toLowerCase();
    if (upper && lower) return true;
  }
  return false;
};

const CheckNumericString = (string) => {
  return /^[0-9]*$/.test(string);
};

const CheckBackendErrors = (errors) => {
  let errorBuffer = '';
  for (const error of errors) {
    errorBuffer += i18n.t('auth.errors.' + error) + '\n';
  }
  return errorBuffer;
};

const RemoveLabel = (datas, label, langue) => {

  let remove_label = label;
  var list = datas.filter((x) => {
    return x.name_en !== remove_label && x.status === 1
  });
  // Ordonate
  if (langue === "fr") {
    // alphabetic order 
    var finalList = list.sort(function (a, b) {
      if (a.name_fr < b.name_fr) {
        return -1;
      } else {
        return 1;
      };
    });
  } else {
    var finalList = list.sort(function (a, b) {
      if (a.name_en < b.name_en) {
        return -1;
      } else {
        return 1;
      };
    });
  }
  return finalList;
};

const ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      //bottomOffset={20}
      style={{ width: "100%", borderBottomWidth: 0, borderRadius: 0, borderColor: Colors.greyH, borderLeftWidth: 8, borderLeftColor: 'green', backgroundColor: Colors.greyUL }}
      // contentContainerStyle={{ paddingHorizontal: 15,  }}
      // text1Style={{
      //   color:Colors.black,
      //   fontSize: 16,
      //   fontWeight: '400'
      // }}
      // text2Style={{
      //   fontSize: 14,
      //   fontWeight: '400',
      //   color:Colors.greyL,
      // }}
      contentContainerStyle={{ borderWidth: 0, top: 8, padding: 5 }}
      text1Style={[BDiaryStylesForms.h4, { fontSize: 16, color: Colors.greyH }]}
      text2Style={[BDiaryStylesForms.h4, { fontSize: 14, color: Colors.greyH }]}

    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ width: "100%", borderWidth: 0, borderRadius: 0, borderColor: 'red', borderLeftWidth: 10, borderLeftColor: 'red', backgroundColor: Colors.greyL }}
      contentContainerStyle={{ borderWidth: 0, top: 8, padding: 5 }}
      text1Style={[BDiaryStylesForms.h4, { fontSize: 16, color: Colors.greyH }]}
      text2Style={[BDiaryStylesForms.h4, { fontSize: 14, color: Colors.greyH }]}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};

const CapitalizeText = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

const CapitalizeFirstLetter = (string) => {
  if (!string) {
    return
  } else {
    var StringTolowerCase = string.toLowerCase();
    return StringTolowerCase.charAt(0).toUpperCase() + StringTolowerCase.slice(1);
  }
};

const myLocalisation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
  }
  let position = await Location.getCurrentPositionAsync({});
  return position
};

const calculateAge = (birthdate) => {

  const birthMoment = moment(birthdate, 'YYYY-MM-DD');
  const now = moment();

  // Si la date de naissance est dans le futur, retourne 0
  if (birthMoment.isAfter(now)) {
    return 0;
  }

  return now.diff(birthMoment, 'years');
};

const GetGenreName = (item) => {
  if (item === "1") {
    return i18n.t('profiles.male')
  } else {
    return i18n.t('profiles.female')
  }
};

const GetSterilizedName = (item) => {
  if (item === true) {
    return i18n.t('animalProfile.sterilisation')
  } else {
    return i18n.t('animalProfile.noSterilisation')
  }
};

const memberDate = (userdate) => {
  if (userdate) {
    const date = moment(userdate).format("DD/MM/YYYY")
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 12, color: Colors.greyM }}>{date}</Text>
    )
  }
};

const StarsDisplay = (item, type) => {
  const Type = type;
  const Nbr = item[type];
  let items = [];
  for (let i = 1; i <= item[type]; i++) {
    items.push(<Ionicons key={i} style={{ padding: 5, }} name="star" size={20} color={Colors.red}></Ionicons>);
  }
  return <View style={{ flexDirection: 'row' }}>{items}</View>
};

const MarkerDate = (item) => {
  const date = moment(item).format("DD/MM/YY, h:mm:ss a")
  return (
    <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{date}</Text>
  )
};


const FormDate = (item) => {
  const now = moment(); // Date et heure actuelles
  const date = moment(item); // Date et heure de l'item
  const diffInHours = now.diff(date, 'hours'); // Différence en heures
  const diffInDays = now.diff(date, 'days'); // Différence en jours

  let formattedDate = '';

  if (diffInHours < 24) {
    // Si la date est dans la même journée, affiche l'heure et les minutes
    formattedDate = date.format('HH:mm');
  } else if (diffInDays === 1) {
    // Si la date est dans les dernières 48 heures, affiche "1 jour" et l'heure et les minutes
    formattedDate = `1 jour, ${date.format('HH:mm')}`;
  } else {
    // Si la date est plus ancienne, affiche la date au format jour/mois/année et l'heure
    formattedDate = date.format('DD/MM/YYYY, HH:mm');
  }

  return (
    <Text style={{ fontWeight: 'normal', fontSize: 10, color: '#808080' }}>
      {formattedDate}
    </Text>
  );
};


const FormatDate = (item) => {
  const date = moment(item.cdate).format("DD/MM/YY, h:mm:ss a")
  return (
    <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{date}</Text>
  )
};

const IsFavorite = (favorite, data) => {
  return favorite.includes(data.item); // True - False
};

const RemoveItemId = (id, data) => {
  var remove_id = id;
  var list = data.filter(x => {
    return x._id != remove_id;
  })
  return list
};

const RemoveArrayId = (id, data) => {
  var remove_id = id;
  var list = data.filter(id => id !== remove_id);
  return list
};


const FormatDateToNow = (item) => {
  const date = moment(item.cdate).fromNow();
  return date
  
};

const SpreadGeolocalisationLatitude = (latitude) => {

  var a = 360.0;
  var newLat1 = latitude - 1 / 50000 + (Math.random() / 250);
  var newLat = newLat1

  var location = {
    latitude: newLat,
  }

  return newLat

};

const SpreadGeolocalisationLongitude = (longitude) => {

  var a = 360.0;
  var newLng1 = longitude - 1 / 50000 + (Math.random() / 250)
  var newLng = newLng1

  var location = {
    longitude: newLng
  }

  return newLng

};

const GetDistanceBetweenTwoPoints = (cord1, cord2) => {

  if (cord1.lat == cord2.lat && cord1.lon == cord2.lon) {
    return 0;
  }

  const radlat1 = (Math.PI * cord1.lat) / 180;
  const radlat2 = (Math.PI * cord2.lat) / 180;

  const theta = cord1.lon - cord2.lon;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km
  dist = Math.round(dist)

  return dist;
};

const CheckVideoFormat = (ScreenWidth, item) => {
  const ratioPortrait = 0.562;
  const ratioLandscape = 1.777;
  const VideoPortraitHeight = (ScreenWidth * ratioPortrait) + ScreenWidth;
  const VideoLandscapeHeight = (ScreenWidth * ratioLandscape) - ScreenWidth;

  //const renderVideoFormat = VideoLandscapeHeight;

  if (item && item.item && item.item.videoformat === "portrait") {
    var renderVideoFormat = VideoPortraitHeight;
  } else {
    var renderVideoFormat = VideoLandscapeHeight;
  }

  return renderVideoFormat



};

const TextEllipsis = (str, maxLength) => {
  const ellipsis = "...";
  const side = "end";
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
};

const EllipsisNoCap = (str, maxLength) => {
  const ellipsis = "...";
  const side = "end";
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
};

const GetProfile = (item) => {
  var profile = ""
  if (item.profile === "noadoption") {
    profile = i18n.t('profile.animal')
    return profile
  }
  if (item.profile === "adoption") {
    profile = i18n.t('profile.adoption')
    return profile
  }
  if (item.profile === "pros") {
    profile = i18n.t('profile.society')
    return profile
  }
};

const CheckBirthady = (dobString) => {
  const birthDate = moment(dobString); // format: "2022-11-10T23:00:00.000Z"
  const now = moment();
  const age = now.diff(birthDate, 'years');
  return age >= 15;
};
const GetSpeciesLang = (item) => {
  if (item) {
    let speciesName = "";
    if (i18n.locale === "en") {
      speciesName = item.name_en
    }
    if (i18n.locale === "fr") {
      speciesName = item.name_fr
    }
    if (i18n.locale === "es") {
      speciesName = item.name_es
    }
    return speciesName
  }
};

const GetCountryName = () => {
    for (let i = 0; i < countriesObjectFinal.length; i++) {
      if (Countries[i][1] === userData.country) {
        return Countries[i][0];
      }
    }
    return null;
  };







export { GetCountryName, GetSpeciesLang, EllipsisNoCap, CapitalizeText, CheckBirthady, GetProfile, TextEllipsis, CheckVideoFormat, FormatDate, MarkerDate, GetDistanceBetweenTwoPoints, SpreadGeolocalisationLongitude, SpreadGeolocalisationLatitude, GetSterilizedName, RemoveArrayId, FormatDateToNow, RemoveItemId, IsFavorite, FormDate, StarsDisplay, memberDate, calculateAge, GetGenreName, myLocalisation, CapitalizeFirstLetter, RemoveLabel, ToastConfig, CheckBackendErrors, ValidateEmail, CheckAllCases, CheckForSpecialChar, CheckNumericString };