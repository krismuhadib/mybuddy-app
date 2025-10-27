import * as React from 'react';
import { Text, View, Platform, Image, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/fontawesome';
// import { Feather } from '@expo/vector-icons'; 
// import { Ionicons } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons'
import Colors from './Colors';
import moment from "moment";
import 'moment/locale/fr';
import * as Localization from 'expo-localization';
// Language
import TextLocalized from '../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
var config = require('../config.js');
var noImg = require('../assets/images/logo_avatar.png');

// MBD FUNCTIONS :
export default {

  VideoHeightFormat: function (format, width) {
    const ratioPortrait = 0.562;
    const ratioLandscape = 1.777;

    if (format = "portrait)") {
      var VideoHeight = (width * ratioPortrait) + width;
    } else {
      VideoHeight = (width * ratioLandscape) - width;
    }

    return VideoHeight
  },

  CleanLocale: function () {
    // SET DEFAULT
    let cleanlocale = Localization.locale;
    let rd = locale.split('-');
    if (rd && rd.length) {
      if (rd.length == 1 || rd.length == 2) { cleanlocale = rd[0].toLowerCase(); }
      if (rd.length == 3) { cleanlocale = rd[0].toLowerCase() + '-' + rd[1].toLowerCase(); }
      // FORCE CHINESE SIMPLIFIED
      rd[0].toLowerCase() == 'zh' ? cleanlocale = 'zh-hans' : null
    }
    return cleanlocale;
    //return ‘zh-hans’;
  },

  SocialsCount: function (array, user) {
    var socialcount = array.length
    if (!array) {
      socialcount = 0
    };
    if (array.includes(user)) {
      socialcount = array.length - 1;
    };
    if (array.length < 0) {
      socialcount === 0;
    };

    return socialcount;
  },

  FollowersCount: function (array, animal_id) {
    var followerscount = array.length;
    if (!array) {
      followerscount = 0
    };
    if (array.includes(animal_id)) {
      followerscount = array.length - 1;
    };
    if (array.length < 0) {
      followerscount = 0;
    };

    return followerscount;
  },

  ucfirst: function (string) {
    if (string) {
      var stringa = string.toLowerCase();
      return stringa.charAt(0).toUpperCase() + stringa.slice(1);
    }
  },

  isFavorite: function (item, favorite) {
    return favorite.includes(item); // True - False
  },

  isBookmarked: function (item, bookmark) {
    return bookmark.includes(item); // True - False
  },

  isPremiumLogo: function (ispremium) {
    if (ispremium === true) {
      return (
        <View>
          <Image source={config.isPremiumIcone.ispremium} style={{ transform: [{ rotate: '90deg' }], height: 50, width: 50 }} />
        </View>
      )
    };
  },

  LoveDetailsIconsDisplay: function (item, type) {
    const Type = type;
    // EN
    if (i18n.locale !== 'fr') {

      if (item.sterilisation === 'yes') {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
      if (item.sterilisation === 'no') {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      }
    };

    // FR
    if (i18n.locale === 'fr') {
      if (item.sterilisation === 'yes') {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };

      if (item.sterilisation === 'no') {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
    };

  },

  IconsDisplay: function (item, type) {
    const Type = type;
    // EN
    if (i18n.locale !== 'fr') {

      if (item.animal_id.sterilisation === false) {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item.animal_id[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
      if (item.animal_id.sterilisation === true) {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item.animal_id[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      }
    };

    // FR
    if (i18n.locale === 'fr') {
      if (item.animal_id.sterilisation === false) {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item.animal_id[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };

      if (item.animal_id.sterilisation === true) {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item.animal_id[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
    }
  },

  IconsDisplayDetails: function (item, type) {
    const Type = type;
    // EN
    if (i18n.locale !== 'fr') {

      if (item.sterilisation === false) {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
      if (item.sterilisation === true) {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      }
    };

    // FR
    if (i18n.locale === 'fr') {
      if (item.sterilisation === false) {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };

      if (item.sterilisation === true) {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
    }
  },

  IconsDisplaynoitem: function (item, type) {

console.log("MY FONCTIONS IconsDisplaynoitem item.sterilisation",item.sterilisation, i18n.locale)
    const Type = type;

    // EN
    if (i18n.locale !== 'fr') {
      if (item.sterilisation === true) {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
       // console.log("eeee",icones[Type][item[Type]])
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
      if (item.sterilisation === false) {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones.typeofname,
        };
       // console.log("eeee",icones[Type][item[Type]])
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      }
    };

    // FR
    if (i18n.locale === 'fr') {
      if (item.sterilisation === 'yes') {
        const icones = {
          genre: config.Animalgenre_sterilisation.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };

      if (item.sterilisation === 'no') {
        const icones = {
          genre: config.Animalgenre.genre,
          typeofname: config.AnimalIcones_fr.typeofname,
        };
        return (
          <View style={{ height: 40 }}>
            <Image source={icones[Type][item[Type]]} style={{ height: 30, width: 30 }} />
          </View>
        )
      };
    }


  },

  whoLikersComment: function (item) {

    if (item.likers && Platform.OS === "android") {
      return item.likers.map((thelikers, index) => {
        let tutu = config.linkserver + thelikers + '/images/avatar/' + thelikers + '.jpg';
        let count = item.likers.length;
        let txta = ' ...';

        //console.log("whoLiker : function (item)",thelikers,count, tutu);

        return (
          <View key={index} style={{ paddingLeft: 5, borderWidth: 0 }}>
            <View style={styles.avatarPlaceholder}>


            </View>
            {(count > 10) &&
              <Text style={{ fontSize: 12, color: Colors.greyH }}>
                {" "}{txta}
              </Text>
            }
          </View>
        )
      })
    }

    if (item.likers && Platform.OS === "ios") {

      return item.favorites.map((thelikers, index) => {
        let tutu = config.linkserver + thelikers + '/images/avatar/' + thelikers + '.jpg';
        let count = item.likers.length;
        let txta = ' ...';


        // console.log(" whoLiker : function (item) { likerslikerslikerslikerslikerslikers", tutu);


        return (
          <View key={index} style={{ paddingLeft: 5, borderWidth: 0, }}>
            <View style={styles.avatarPlaceholder}>
              <Image
                source={{ uri: tutu }}
                size='small'
                style={styles.avatar}
              />

            </View>
            {(count > 10) &&
              <Text style={{ fontSize: 12, color: Colors.greyH }}>
                {" "}{txta}
              </Text>
            }
          </View>
        )



      })



      /* let likers = item.likers.map((thelikers, index) => (
          
          
          <View key={index} style={{paddingLeft:10, borderWidth:1}}>
              <View style={styles.avatarPlaceholder}>
            <Image
              source={{ uri: config.linkserver + item.likers[index] +'/images/avatar/' + item.likers[index] +'.jpg' }}
              size='small'
              style={styles.avatar} 
            />
          </View>
          <Text style={{fontSize:12, color:Colors.greyH}}>
              {" "}{thelikers}
          </Text>
            
          </View>
          
      ));            console.log(" whoLikers : function (item) { likerslikerslikerslikerslikerslikers", config.linkserver + item.likers +'/images/avatar/' + item.likers +'.jpg')

      return likers */
    }
  },

  whoLikers: function (item) {
    if (item.likers && Platform.OS === "android") {
      return item.likers.map((thelikers, index) => {
        let tutu = config.linkserver + thelikers + '/images/avatar/xsmall/' + thelikers + '.jpg';
        let count = item.likers.length;
        let txta = ' ...';
        //console.log("whoLiker : function (item)",thelikers,count, tutu);
        return (
          <View key={index} style={{ paddingLeft: 5, borderWidth: 0 }}>
            <View>
              <Image
                source={{ uri: tutu }}
                size='small'
                style={styles.avatar}
              />

            </View>
            {(count > 10) &&
              <Text style={{ fontSize: 12, color: Colors.greyH }}>
                {" "}{txta}
              </Text>
            }
          </View>
        )
      })
    }

    if (item.likers && Platform.OS === "ios") {

      return item.favorites.map((thelikers, index) => {
        let tutu = config.linkserver + thelikers + '/images/avatar/xsmall/' + thelikers + '.jpg';
        let count = item.likers.length;
        let txta = ' ...';
        // console.log(" whoLiker : function (item) { likerslikerslikerslikerslikerslikers", tutu);
        return (
          <View key={index} style={{ paddingLeft: 5, borderWidth: 0, }}>
            <View>
              <Image
                source={{ uri: tutu }}
                size='small'
                style={styles.avatar}
              />

            </View>
            {(count > 10) &&
              <Text style={{ fontSize: 12, color: Colors.greyH }}>
                {" "}{txta}
              </Text>
            }
          </View>
        )
      })

      /* let likers = item.likers.map((thelikers, index) => (
          
          
          <View key={index} style={{paddingLeft:10, borderWidth:1}}>
              <View style={styles.avatarPlaceholder}>
            <Image
              source={{ uri: config.linkserver + item.likers[index] +'/images/avatar/' + item.likers[index] +'.jpg' }}
              size='small'
              style={styles.avatar} 
            />
          </View>
          <Text style={{fontSize:12, color:Colors.greyH}}>
              {" "}{thelikers}
          </Text>
            
          </View>
          
      ));            console.log(" whoLikers : function (item) { likerslikerslikerslikerslikerslikers", config.linkserver + item.likers +'/images/avatar/' + item.likers +'.jpg')

      return likers */
    }
  },

  nbrComments: function (item, data) {
    var nbrcomments = item.addcommentsnumber;
    if (data === item.user_id._id && item.newcomment === true) {
      return (
        <View style={{ flexDirection: 'column', width: 50, alignContent:"center", alignItems:"center", justifyContent: 'center',  }}>
          <AntDesign style={{ padding: 5 }} name="message" size={25} color="red" />
          {(nbrcomments > 0 && item.addcommentsnumber !== "NaN") &&
            <Text style={{ fontWeight: 'normal', fontSize: 9, zIndex: 999, marginTop: -5, color: Colors.greyH }}>{nbrcomments}</Text>
          }</View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'column', width: 50, borderWidth: 0, alignContent:"center", alignItems:"center", justifyContent: 'center', }}>
          <AntDesign style={{ padding: 5 }} name="message" size={25} color={Colors.greyH} />
          {(nbrcomments > 0 && item.addcommentsnumber !== "NaN") &&
          <Text style={{ fontWeight: 'normal', fontSize: 9, zIndex: 999,  marginTop: -5, color: Colors.greyH }}>{nbrcomments}</Text>
          }
        </View>
      )
    }
  },

  formateDate: function (item) {
    const date = moment(item.cdate).format("DD/MM/YY, h:mm:ss a")
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{date}</Text>
    )
  },

  textEllipsis: function (str, maxLength, { side = "end", ellipsis = "..." } = {}) {

    if (str) {
      var stringa = str.toLowerCase();
      return stringa.charAt(0).toUpperCase() + stringa.slice(1);
    }
    if (stringa.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + stringa.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return stringa.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  },

  badWords: function (text) {
    // Enter the words to be filtered in the line below:
    var swear_words_arr = config.BadWords;
    var swear_alert_arr = new Array;
    var swear_alert_count = 0;

    function reset_alert_count() {
      swear_alert_count = 0;
    };
    reset_alert_count();
    var compare_text = text;

    for (var i = 0; i < swear_words_arr.length; i++) {
      for (var j = 0; j < (compare_text.length); j++) {
        if (swear_words_arr[i] == compare_text.substring(j, (j + swear_words_arr[i].length)).toLowerCase()) {
          swear_alert_arr[swear_alert_count] = compare_text.substring(j, (j + swear_words_arr[i].length));
          swear_alert_count++;
        }
      }
    }
    var alert_text = "";
    for (var k = 1; k <= swear_alert_count; k++) {
      alert_text += "\n" + "(" + k + ")  " + swear_alert_arr[k - 1];
    }
    if (swear_alert_count > 0) {
      console.log('Probleme avec backend getuserdatas');
      let commentValidate = false;
      return commentValidate
    }
    else {
      console.log('NONONO Probleme avec backend getuserdatas');
      //this.setState({commentValidate:true, err:0, ifmodifydata:false})
      let commentValidate = true;
      return commentValidate
    };


  },

  getDistanceBetweenTwoPoints: function (cord1, cord2) {

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
  },

  spreadGeolocalisationLatitude: function (latitude) {

    var a = 360.0;
    var newLat1 = latitude - 1 / 50000 + (Math.random() / 250);
    var newLat = newLat1

    var location = {
      latitude: newLat,
    }

    return newLat

  },
  spreadGeolocalisationLongitude: function (longitude) {

    var a = 360.0;
    var newLng1 = longitude - 1 / 50000 + (Math.random() / 250)
    var newLng = newLng1

    var location = {
      longitude: newLng
    }

    return newLng

  },

  addloveswaplikers: function (item, liker_id, animal_id) {

    // Send AddLovers Id to user array in db
    fetch(config.uri + 'animals/addlovelikers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animal_id,
        liker_id: liker_id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //let favorites = this.state.favorite;
          var count = item.likers.length;
          // favorites[this.props.user._id] = res.favoris;

          const favorite = res.favoris;
          const likers = res.likers;

          // startmongo: 0,




          // IS IT MATCH ?
          if (res.ismatch === 1) {
            console.log("LOVE SWAP RETOUR IS MATCH");
            // Add to Lovers array
            // this.AddLovers(item);
          }
          console.log("fonctions favorite", favorite, likers);



          const object = {
            favorite: favorite,
            likers: likers,
            ismatch: res.ismatch,
          };

          var zob = "zob"



          return zob
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
        //return object
      });

    // return likers
    // return "favorite"

    // return zob


  }

};



const styles = StyleSheet.create({
  animatedlike: {
    width: 70,
    height: 70,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff'

  },
  TextStyle: {
    fontSize: 12,
    padding: 0,
    color: '#000'
  },

  bloc_Row: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#ccc',
    //borderWidth: 1,
    borderColor: '#000',
    height: 40,
    //borderRadius: 26
  },



  card: {
    backgroundColor: '#fff',
    marginBottom: 25
  },
  cardImage: {
    justifyContent: "center",
    resizeMode: "cover",
    width: '100%',
    height: 400
  },


  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.greyM,
    backgroundColor: '#ccc',
    justifyContent: "center",
    alignItems: 'center',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  }
});
