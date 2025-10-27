import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated, Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import ListSeparator from '../../../components/elements/ListSeparator';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import { FormatDateToNow, RemoveItemId } from '../../../utils/helpers';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import moment from 'moment';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';


import config from '../../../config';
const noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const NotificationListScreen = ({ route }) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  //const { from } = route.params.from;

  //console.log("SpeciesScreen from", from)

  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées
  const [showIcon, setShowIcon] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [notificationList, setNotificationList] = useState([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const [notifMessage, setNotifMessage] = useState(true);
  console.log("NotificationListScreen")


  useEffect(() => {
    getAllNotifications();
    //timerDeleteNotif();
  }, [isFetching, animalData]);

  useEffect(() => {
    // Masquer l'icône après 2 secondes
    const timer = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -100, // Simule un swipe vers la gauche
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0, // Retourne à la position initiale
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Démarrer l'animation de fade-out après 2 secondes
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out à une opacité de 0
        duration: 800, // Durée de la transition en ms
        useNativeDriver: true,
      }).start(() => setShowIcon(false)); // Masquer l'icône une fois l'animation terminée
    }, 1000);

   
timerDeleteNotif();
    return () => clearTimeout(timer); // Nettoyer le timer en cas de démontage
    
  }, [fadeAnim]);

  const deleteNotificationMessage = () =>  {
    if (animalData && userData) {
      fetch(config.uri + 'notifications/deletenotifmessage', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          animal_id: animalData._id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setIsFetching(false);
          }
          else {
            console.log('Les infos User/Password sont mal remplies');
          }
        });
    } else {
      console.log('getuserdatas / PRB USERTOKEN  ?');
    }

getAllNotifications();

  };

  const timerDeleteNotif =() => {
    setTimeout(() => {
       // Delete notifications
    deleteNotificationMessage();
    }, 4000);

  };

  const getOnePost = async (item) => {
    if (item && item !== undefined) {
      await fetch(config.uri + 'posts/getonepost', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          animal_id: animalData._id,
          post_id: item.post_id._id

        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res && res.success === true) {
            navigation.navigate('AddComment', {
              from: "Home",
              navigateTo: "Home",
              screen: 'AddComment',
              postUpdate: res.postList[0],
              newcomment: true,
            });
          } else {
            console.log("No res")
          }
        });
    } else {
      console.log("error get post")
    }
  };

  const goPages = (item) => {
    console.log("goPages item", item.body);


    if (item.body.includes("MATCH" )) {
      goLoveSwap();
    }
    if (item.alerttype !== undefined && item.alerttype !== null) {
      goAlert();
    }

     if (!item.alerttype) {
      getOnePost(item);
    }





  };

  const goLoveSwap = (item) => {
    navigation.navigate('Loveswap', {
    screen: 'LoveMatch',  // <-- la route dans le stack Love
  });
  };

  const goAlert = (item) => {
  navigation.navigate('MapScreen', {
  screen: 'AlertMapScreen',  // <-- la route dans le stack Love
});
};

  const reloadList = () => {
    setIsFetching(true);
    getAllNotifications();
  };

  const getAllNotifications = async () => {
  
    if (animalData && userData) {
      fetch(config.uri + 'notifications/getnotifications', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          animal_id: animalData._id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setIsFetching(false);
            var postList = res;

            if (searchText === '') {
              setFilteredData(res.postList);
            }
            //console.log("NOTIFICATION / postList", postList)

            var idToRemove = userData._id;
            var lists = postList.postList.filter(x => {
              return x.user_id._id !== idToRemove;
            })
            //const ListFinal = lists.reverse();

            setNotificationList(lists);
          }
          else {
            console.log('Error?',res.success, res.key);
          }
        });
    } else {
      console.log('No datas');
    }


  };

  const goToProfile = (item) => {
    console.log("goToProfile", item.sender_id)
    navigation.navigate('AnimalDetails', {
      from: "Notifications",
      item: item,
      userToken: userData._id,

    })


  };

  const LeftActions = (progress, dragX) => {
  };

  const RightActions = ({ item, closeSwipeable }) => {

    return (
      <RectButton style={styles.rightAction}
        onPress={() => {
          closeSwipeable();
          DeleteNotification(item)

        }}>
        {/* <Text style={styles.actionText}>{i18n.t('Form.Delete')}</Text> */}
        <Feather style={{ padding: 5 }}
          color={Colors.red}
          name="trash" size={22}
        />
      </RectButton>
    );
  };

  const SwipeableRow = ({ item, i }) => {

    const swipeableRef = useRef(null);

    const closeSwipeable = () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };

    if (item) {

      return (

        <Animated.View style={[styles.item, { transform: [{ translateX }] }]}>

          <Swipeable
            item={item}
            ref={swipeableRef}
            renderLeftActions={LeftActions}
            renderRightActions={() => <RightActions item={item} closeSwipeable={closeSwipeable} />}
            overshootRight={false}
            overshootLeft={false}
            onSwipeableOpen={() => console.log("")}
          >


            <View key={i}>

              <View key={i}>
                <View style={styles.card}>
                  <View style={{ justifyContent: 'center', backgroundColor: changeBgColor(item) }}>
                    <View style={{ flexDirection: 'row', justifyContent: "flex-start", }}>
                      <TouchableOpacity
                        onPress={() => goToProfile(item)}>
                        {/* // Match */}
                        {(item.body.includes("MATCH")) &&
                          <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10, backgroundColor: changeBgColor(item) }}>

                            {(item.sender_avatar === "0") &&
                              <Image
                                resizeMode='center'
                                source={noImg} style={[styles.avatar, { borderWidth: 1 }]} />
                            }

                            {(item.sender_avatar > "0") &&
                              <Image
                                source={{ uri: config.linkserver + item.sender_id + '/images/avatar/small/' + item.sender_id + '.jpg' }}
                                size='small'
                                style={[styles.avatar, { backgroundColor: changeBgColor(item) }]}
                              />
                            }

                          </View>
                        }
                        
                         {/* // Match */}
                        {(item.body.includes("LoveSwap")) &&
                          <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10, backgroundColor: changeBgColor(item) }}>


                            {(item.sender_avatar === "0") &&
                              <Image
                                resizeMode='center'
                                source={noImg} style={[styles.avatar, { borderWidth: 1 }]} />
                            }

                            {(item.sender_avatar > "0") &&
                              <Image
                                source={{ uri: config.linkserver + item.animal_id._id + '/images/avatar/small/' + item.animal_id._id + '.jpg' }}
                                size='small'
                                style={[styles.avatar, { backgroundColor: changeBgColor(item) }]}
                              />
                            }
                          </View>
                        }
                        {(!item.body.includes("LoveSwap") && !item.body.includes("MATCH")) &&
                          <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10, backgroundColor: changeBgColor(item) }}>
                            {(item.sender_avatar === "0") &&
                              <Image
                                resizeMode='center'
                                source={noImg} style={[styles.avatar, { borderWidth: 1, position: "relative", }]} />
                            }

                            {(item.sender_avatar > "0") &&
                              <Image
                                source={{ uri: config.linkserver + item.sender_id + '/images/avatar/small/' + item.sender_id + '.jpg' }}
                                size='small'
                                style={[styles.avatar, { position: "relative", backgroundColor: changeBgColor(item) }]}
                              />
                            }

                            {(item.notif_message === true) &&
                              <Ionicons style={{ position: "absolute", top: 0, paddingLeft: 10, zIndex: 1 }} name="notifications-sharp" size={20} color={Colors.greenBuddyL} />
                            }
                          </View>
                        }
                      </TouchableOpacity>

                      <View style={{ backgroundColor: changeBgColor(item), justifyContent: "flex-start", paddingTop: 20, flexDirection: "column", flex: 1, borderWidth: 0, paddingRight: 10 }} >
                        <TouchableOpacity
                          onPress={() => goPages(item)}
                        >
                          <View style={{ flex: 1, flexDirection: "row", backgroundColor: changeBgColor(item) }}>
                            {(item.body.includes("MATCH")) &&
                              <View style={{ flexDirection: "row", flex: 1, backgroundColor: changeBgColor(item) }}>
                                <Ionicons style={{ top: -5 }} name="heart" size={22} color="red" />
                              </View>
                            }

                            <Text style={{ textTransform: 'none', color: "black", }}>{config.textEllipsis2(item.body, 90)}  </Text>

                           

                          </View>
                        </TouchableOpacity>

                        <View>
                          <Text style={{ textAlign: "right", fontSize: 10, fontStyle: "italic", color: Colors.greyM, marginBottom: 10, }}>{FormatDateToNow(item)}</Text>
                        </View>
                      </View>

                      {(fadeAnim) &&
                        <Animated.View style={{ opacity: fadeAnim }}>
                          <View style={styles.hintContainer}>
                            <FontAwesome name="arrow-left" size={30} color={Colors.greyUL} style={styles.hintIcon} />
                          </View>
                        </Animated.View>
                      }

                    </View>
                  </View>
                  <View style={{ paddingLeft: 10 }}></View>
                </View>
              </View>

            </View>
          </Swipeable>
        </Animated.View>
      );
    }
  };

  const DeleteNotification = async (item) => {
    await fetch(config.uri + 'notifications/deletenotifications', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // animal_id: animalData._id,
        notification_id: item._id

      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          console.log("DELETE NOTIFICATION GOOD")


          getAllNotifications();
        }
        else {
          console.log('PRB Delete Notif');
        }
      })



  };

  const filterData = (text) => {
    setSearchText(text);
    const filteredData = notificationList.filter(item =>
      item.body.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData);

  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(notificationList);
    } else {
      filterData(text);
    }
  };

  const changeBgColor = (item) => {
    if (item.body.includes("message") || item.body.includes("message")) {
      var bgcolor = Colors.notifmessage
    }
    if (item.body.includes("commentaire") || item.body.includes("commentary")) {
      var bgcolor = Colors.notifcomment
    }
    if (item.body.includes("aimé par") || item.body.includes("liked by")) {
      var bgcolor = Colors.notiflike
    }
    if (item.body.includes("LoveSwap")) {
      var bgcolor = Colors.notiflovelike
    }
    if (item.body.includes("MATCH")) {
      var bgcolor = Colors.notifmatch
    }
    if (item.alerttype !== null && item.alerttype !== undefined) {
      var bgcolor = Colors.notifalert
    }

    return bgcolor

  };


  return (
    <View style={[BDiaryStyles.container, { backgroundColor: Colors.white }]}>

      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="add"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('notifications.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      //  navigationNameR="WelcomeUser"
      // navigationFromR="User"
      />
      <View style={{ width: ScreenWidth }}>

        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={notificationList}
        />

        {/* <View style={BDiaryStyles.formContainerRow}>
            <Ionicons style={BDiaryStyles.searchIcon} name="search" size={25} color={Colors.greyL} />
            <TextInput
              style={{ flex: 1, textTransform: 'capitalize' }}
              placeholder={i18n.t('species.search')}
              inputContainerStyle='#fff'
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View> */}

      </View>
      <View style={{flex:1}}>

{(notificationList) &&
      <GestureHandlerRootView style={{}}>
          
          
      <FlatList
            inverted={false}
            showsVerticalScrollIndicator={false}
            onRefresh={() => reloadList()}
            refreshing={isFetching}
            keyExtractor={(item, i) => item._id}
            // extraData={this.state}
            data={filteredData}
            ItemSeparatorComponent={ListSeparator}
            renderItem={({ item, i }) => <SwipeableRow item={item} i={i} />}
          />
        
          
     </GestureHandlerRootView>
      }
      </View>

      
    </View>
  );
};


const styles = StyleSheet.create({


  hintContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'

  },
  hintIcon: {
    marginRight: 5,
  },
  hintText: {
    fontSize: 12,
    color: 'green',
  },

  actionText: {
    color: Colors.red,
    fontSize: 12,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    backgroundColor: Colors.pinkLight,
    alignItems: 'center',
    borderLeftColor: Colors.greyUL,
    borderLeftWidth: 1,
    width: 80,
    justifyContent: 'center',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  card: {
    backgroundColor: Colors.white,
    //marginBottom: 25,
    // borderBottomWidth: 1,
    //borderColor: "#ccc"
  },


});

export default NotificationListScreen;


