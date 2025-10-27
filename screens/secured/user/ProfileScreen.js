import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, ScrollView, ActivityIndicator, SafeAreaView, FlatList, Dimensions, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { i18n } from "../../../constants/Localization";
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { GetProfile, calculateAge, GetGenreName } from '../../../utils/helpers';
import AnimatedSwipeHint from '../../../components/elements/AnimatedSwipeHint';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
import ModalWarning from '../modals/ModalWarning';
import RowProfileInfos from '../../../components/elements/RowProfileInfos';
import RowProfileDescription from '../../../components/elements/RowProfileDescription';


const noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
var config = require('../../../config.js');
var logo_small = require('../../../assets/images/logo_small.png');

const ProfileScreen = () => {

  const translateX = useRef(new Animated.Value(0)).current;


  // User Redux Store Data
  const navigation = useNavigation();
  const storeDispatch = useDispatch();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState([]);

  const [newpostList, setNewpostList] = useState([]);
  const [animalList, setAnimalList] = useState([]);

  const [animalListcount, setAnimalListcount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showIcon, setShowIcon] = useState(true);
  const [profileAnimal, setProfileAnimal] = useState("sss");
  const [animal, setAnimal] = useState("");
  const [adoption, setAdoption] = useState("");


  const [modalWarning, setModalWarning] = useState(false);
  const [postItem, setPostItem] = useState({});

  console.log("ProfileScreen AAAAAAA",)

  useEffect(() => {
    getAnimalList();
  }, [animalData]);

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

    return () => clearTimeout(timer); // Nettoyer le timer en cas de démontage
  }, [fadeAnim]);



  const LeftActions = (progress, dragX) => {
  };

  const RightActions = ({ item, closeSwipeable }) => {

    return (
      <RectButton style={styles.rightAction}
        onPress={() => {
          closeSwipeable();
          openModal(item._id)

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

    //console.log(item)

    const swipeableRef = useRef(null);

    const closeSwipeable = () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };


    if (item) {

      //console.log('Item AAQAQAQ', item);

      return (
        <Animated.View style={[styles.item, { transform: [{ translateX }] }]}>

          <Swipeable
            item={item}
            ref={swipeableRef}
            renderLeftActions={LeftActions}
            renderRightActions={() => <RightActions item={item} closeSwipeable={closeSwipeable} />}
            overshootRight={false}
            overshootLeft={false}
            onSwipeableOpen={() => console.log("first")}
          >

            <View key={i}>
              <View style={styles.card}>


                <View style={{ flexDirection: 'row', paddingBottom: 10, borderWidth: 0, alignContent: "flex-start", alignItems: "center", justifyContent: "flex-start" }}>
                  <TouchableOpacity style={{}}
                    onPress={() => GoToUser(item._id)}>
                    <View style={{ alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, top: 0, padding: 10 }}>


                      {(item.avatars.length === 0) &&
                        <View>
                          {(item._id === animalData._id) &&
                            <View style={styles.avatarBorderUser}>
                              <Image source={noImg} style={[styles.avatar, { borderWidth: 1, }]} />
                            </View>
                          }
                          {(item._id !== animalData._id) &&
                            <Image source={noImg} style={[styles.avatar, { borderWidth: 1, }]} />
                          }
                        </View>
                      }

                      {(item.avatars.length > 0) &&
                        <View >
                          {(item._id === animalData._id) &&
                            <View style={styles.avatarBorderUser}>
                              <Image
                                source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                                size='small'
                                style={styles.avatar}
                              />
                            </View>
                          }
                          {(item._id !== animalData._id) &&
                            <Image
                              source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                              size='small'
                              style={styles.avatar}
                            />
                          }
                        </View>}

                      {(item.notif_message === true) &&
                        <Ionicons style={{ top: -20, paddingRight: 5 }} name="notifications-sharp" size={25} color="red" />
                      }
                    </View>
                  </TouchableOpacity>

                  {(item) &&
                    <View style={{ flexDirection: "column", flex: 1, paddingTop: 5, paddingLeft: 5, alignItems: "flex-start", justifyContent: "center" }}>
                      {/* <View style={{justifyContent:'center'}}>
                          <Text style={{textTransform: 'capitalize',fontSize:18, fontWeight:"bold"}}>{item.name}{this.NotifsPoint()}</Text>
                            </View> */}
                      <View style={{ alignContent:"flex-start", alignItems:"flex-start", justifyContent:"flex-start" }}>
                    <Text style={[BDiaryStyles.h5Bold,{ textAlign:"left", textTransform: 'capitalize' }]}>{item.name}</Text>
                      <RowProfileInfos item={item} />
                      <RowProfileDescription item={item} />
                  </View>

                     
                      
       

                      <View style={{ justifyContent: 'center', paddingTop: 5, borderWidth: 0 }}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{item.friends.length} {i18n.t('Page.Subscriptions')}</Text>
                            {(item.followers) &&
                              <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{item.followers.length} {i18n.t('Page.Followers')}</Text>
                            }
                            {(item.hidden === true) &&
                              <View>
                                <Text style={[BDiaryStyles.h5Italic,{ marginRight: 5, textAlign: "left", textTransform: 'capitalize', color: Colors.greyM,  }]}>{i18n.t('Form.Private_Profile')}</Text>
                              </View>
                            }
                          </View>
                      </View>


                    </View>}

                  {(!item.breed && !item.birthday && !item.genre && item.profile !== "pros") &&
                    <View style={{ flexDirection: "column", borderWidth: 0, flex: 1, paddingLeft: 5, alignItems: "flex-start", justifyContent: "center" }}>
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 18, fontWeight: "bold" }}>{item.name}{NotifsPoint()}</Text>
                      </View>

                      <View style={{ flexDirection: "row", justifyContent: 'flex-start', marginTop: -30, borderWidth: 0 }}>
                        {(item.typeofname) &&
                          <View>
                            <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 14, color: Colors.greyM, fontStyle: "italic" }}>{item.typeofname} ...</Text>
                          </View>}
                        <Text style={{ paddingRight: 5, textAlign: "right", fontSize: 14, color: Colors.greyM, fontStyle: "italic" }}>{i18n.t('Page.No_Profil')}</Text>

                      </View>

                    </View>}
                  {(fadeAnim) &&

                    <Animated.View style={{ opacity: fadeAnim }}>
                      <View style={styles.hintContainer}>
                        <FontAwesome name="arrow-left" size={30} color={Colors.greyUL} style={styles.hintIcon} />
                      </View>
                    </Animated.View>
                  }
                </View>

              </View>
            </View>

          </Swipeable>
          <ModalWarning
            isTrigger={0}
            postnumerselected={0}
            getAnimalList={getAnimalList}
            animationType="fade"
            item={postItem}
            //getUserMarkers={getUserMarkers}
            post_animal_id={postItem._id}
            animal_id={animalData._id}
            modalVisible={modalWarning}
            navigation={navigation}
            navigateToModal="DeleteProfile"
            closeModal={closeModal}
          />
        </Animated.View>
      );
    }
  };

  const getAnimalDoc = async () => {
    console.log("userToken getpdddddwdkey", this.props.user._id, this.props.token.token)

    //setTimeout(() => {
    if (this.props.token.token) {
      //console.log('-------------> MAPSCREEN - GETUSERDATAS LANCEMNT',this.state.userToken);
      //fetch('http://localhost:3000/users/getuserdatas', {
      fetch(config.uri + 'animals/getdatas', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken
        },
        body: JSON.stringify({
          user_id: userData._id,
          token: this.props.token.token
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            // var userToken = res.key;
            const animaldoc = res;
            //var userfavorites = res.userfavorites;
            //var favorites = res.favoris;
            console.log('-------------> PROFILESCREEN - GETANIMALDOC OK pour le retour backend :', animaldoc);
            //console.log('-------------> MAPSCREEN - GETUSERDATAS OK pour le retour favorites :',userfavorites);
            // this.setState({userfavorites})
            // this._storeData();
            // this.props.navigation.navigate('Main');
            // enregistrement dans async
            // Save animalDoc in  Local storage

            this.setState({
              animalId: animaldoc._id,
            })

            console.log('this.state.animalId ?', this.state.animalId);


          } else {
            //console.log('ca marche PASSSS RES ?', res.success);


          }
        });
    } else {
      console.log('getuserdatas / PRB USERTOKEN  ?');
    }
    // }, 1000);
  };

  const GoBack = () => {
    //this.props.navigation.navigate('User')
    this.props.navigation.goBack();
  };

  const getAnimalList = async () => {
    //console.log("getAnimalList c", userData);

    fetch(config.uri + 'animals/getuseranimals', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken
      },
      body: JSON.stringify({
        user_id: userData._id,
        // token: this.props.token.token
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //console.log("getUserAnimalsList", res);
          setAnimalList(res.postList);

          if (res.poslist && res.postList.length) {
            setAnimalListcount(res.postList.length);
          } else {
            setAnimalListcount(null);
          }
          setIsFetching(false);
          setIsLoading(false);
          //console.log("getAnimalList / length", res);


          // Are multi animals for this user ?

          // NO ANIMALS
          if (res && res.postList.length === 0) {
            //storeDispatch(SaveAnimal([]));
            navigation.navigate('WelcomeUser', {
              from: "UserNewprofile",

            });
          };

          if (animalListcount > 0) {
            var erasedanimal = 0;
            //console.log("animalListcount", this.state.animalListcount);
            for (let i = 0; i < animalList.length; i++) {
              //console.log("Nbr animalList i :", i);

              if (animalList[i].status === 1) {
                erasedanimal = erasedanimal + 1;
              } else {
                erasedanimal = erasedanimal;
              }
              //console.log("erasedanimal ss", erasedanimal)
            }

            if (animalListcount > erasedanimal) {
              //console.log("final gotofilter", erasedanimal);
              //this.props.removeAnimalDoc();
              navigation.navigate('Root', {
                navigateTo: "Newprofile",
              });
            }
          };

          if (animalListcount === erasedanimal) {
            // console.log("final gotofilter", erasedanimal);
            //this.props.removeAnimalDoc();
            // navigation.navigate('FilterAnimalScreen', {
            //   navigateTo: "Newprofile",

            // });
          }
          var remove_id = animalData._id
          var lists = res.postList.filter(x => {
            return x._id != remove_id;
          })
          //console.log(lists);
          setLists(lists)


          if (animalListcount === 1) {
            setLists(lists)

            //console.log("PROFILESCREEN / animalsLIST", this.state.animalListcount);
          };
          if (animalListcount - erasedanimal === 1) {
            setLists(animalList)


            //console.log("PROFILESCREEN / animalsLIST", this.state.animalListcount);
          };

        }
        else {
          console.log(config.fetcherror.prbToken);
          // this.props.navigation.push('Root');
        }
      });
  };

  // Recuperation des FRIENDS
  const getAllFriends = async () => {
    setTimeout(() => {
      //console.log("Friends SCREEN  SCREENSCREENSCREENSCREENSCREEN /", this.props.user._id, this.state.animalId)
      // this.setState({
      //   isLoading: true 
      // });

      if (this.props.token.token) {
        //fetch('http://localhost:3000/users/getuserdatas', {
        fetch(config.uri + 'animals/getallfriends', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            user_id: userData._id,
            animal_id: animalData._id,
            // token: this.props.token.token,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              //var userToken = res.key;
              var postList = res;
              //console.log("res rees", postList)
              //var userfavorites = res.userfavorites;
              //var favorites = res.favoris;
              this.setState({
                postList: postList,
                newpostList: postList,
                isLoading: false
              });

              if (this.state.postList.friends === null) {
                this.setState({
                  friends: [animalData._id]
                });
              };

              var remove_id = animalData._id

              var lists = this.state.newpostList.postList.filter(x => {
                return x._id != remove_id;
              })
              console.log(lists);

              this.setState({
                newpostList: lists,
              });
              //console.log("FRIENDS SCREEN FRIENDS SCREEN FRIENDS SCREEN POSTLIST", this.state.postList)

              this.setState({ isFetching: false });
              //  this.getAllFriends();
              //setTimeout(()=>{this.setState({isLoading: false})}, 1000);
              //console.log('-------------> WALLSCREEN - GETANIMALDOC OK pour le retour backend :',postList);
            }
            else {
              // console.log('ca marche PASSSS RES ?',res.success, res.key);
              alert('Les infos User/Password sont mal remplies');
            }
          });
      } else {
        console.log('getuserdatas / PRB USERTOKEN  ?');
      }
    }, 1000);

  };


  const GoToUser = async (item) => {
    await fetch(config.uri + 'animals/getdatasfromanimalid', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken
      },
      body: JSON.stringify({
        animal_id: item,
        // token: this.props.token.token
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //console.log("PROFILESCRREN / GoToUser", res);
          storeDispatch(SaveAnimal(res.animaldoc));
          setFriendsCount(res.animaldoc.friends.length)
          if (res.breed === "visitor") {
            navigation.navigate('User');
          } else {
            navigation.navigate('User');
          }
        }
      });
  };

  const reloadList = () => {
    setIsFetching(true);
  };

  const onRefresh = () => {
    setIsFetching(true);
  };

  const GoToNewProfile = () => {
    this.props.navigation.navigate('NewPetProfile', {
      navigateTo: "Newprofile",
      screen: 'User',
      // sendPostData : item,
      // item_message : this.state.item_message
    });
  };

  const GoToAddAnimal = () => {
    this.props.navigation.navigate('FilterAnimalScreen', {
      navigateTo: "VisitorAddAnimal",
      screen: 'FilterAnimalScreen',
      // sendPostData : item,
      // item_message : this.state.item_message
    });
  };

  const NotifsPoint = () => {
    if (!animalList) {
      return (
        <View style={{ padding: 5, borderWidth: 0, }}>
          <View style={{ top: 0, width: 10, height: 10, backgroundColor: Colors.red, borderRadius: 5 }}></View>
        </View>
      )
    } else {
      return (
        <View style={{ padding: 5, borderWidth: 0, }}>
          <View style={{ top: 0, width: 10, height: 10, backgroundColor: Colors.green, borderRadius: 5 }}></View>
        </View>
      )
    }
  };

  const reloadAnimalData = async (item) => {
    const resultAnimal = await Post(ApiRoutes.animalMe, { _id: item });
    if (resultAnimal) {
      storeDispatch(SaveAnimal(resultAnimal.value));
      navigation.navigate('Root');
    }
    else {
      storeDispatch(SaveAnimal());
    }
  };

  const DeleteAnimal = async (animal_id) => {
    await fetch(config.uri + 'animals/deleteanimal', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: animal_id
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //storeDispatch(SaveAnimal([]));
          //var keypassword = res.key;
          //var user = res;
          //  console.log("postId ", res)


          getAnimalList();
        }
        else {
          alert(res.message);
          alert('PRB Delete Animal');
        }
      })



  };

  const openModal = (item) => {
    setModalWarning(true);
    setPostItem(item);
  };

  const closeModal = () => {
    setModalWarning(false);
  };


  // const SwipeableRow = ({ item, index }) => {
  //   // if (index % 2 === 0) {
  //   return (
  //     <MarkerAppleSwipeableRow>
  //       <Row item={item}
  //        // onRefresh={this}
  //        // GoToUser={this}
  //       />
  //     </MarkerAppleSwipeableRow>
  //   );
  //   /* } else {
  //    return (   
  //      <MarkerGmailSwipeableRow>
  //        <Row item={item} />
  //      </MarkerGmailSwipeableRow>
  //    );
  //  } */
  // };



  const AppButton = ({ onPress, title, iconame, bgcolor }) => (
    <TouchableOpacity onPress={onPress}
      style={[styles.appButtonContainer, { flexDirection: 'row', backgroundColor: bgcolor }]}>
      <Feather style={{ padding: 5 }}
        color={Colors.greyH}
        name={iconame} size={15}
      />
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" color={Colors.greyM} />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>

        <HeaderBuddy
          // openModal={openModal}
          iconNameL="angle-left"
          iconNameR="add"
          iconFamilyL="FontAwesome"
          iconFamilyR="Ionicons"
          label={i18n.t('profile.chooseProfile')}
          navigationName="User"
          navigationFrom="User"
          navigationNameR="WelcomeUser"
          navigationFromR="User"
          goBack={true}

        />

        {(animalListcount === 0) &&
          <View style={{ flex: 1, alignItems: "flex-start", alignContent: "flex-start", justifyContent: 'flex-start' }}>
            <Text style={{ padding: 20, fontSize: 15, textAlign: 'center', color: Colors.greyM }}>{i18n.t('Error.No_Animal')}</Text>
          </View>

        }

        <GestureHandlerRootView style={{ flex: 1 }}>

          <FlatList
            style={{ flex: 1, height: 600 }}
            showsVerticalScrollIndicator={false}
            // inverted={true}
            data={animalList}
            onRefresh={() => reloadList}
            refreshing={isFetching}
            //extraData={this.state}
            //renderItem={renderItem}
            renderItem={({ item, i }) => <SwipeableRow item={item} i={i} />}
            keyExtractor={(item, i) => (item, i)}
          />

        </GestureHandlerRootView>

      </View>
    );
  }

}

const styles = StyleSheet.create({

  avatarBorderUser: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 1,
    //borderColor: Colors.greenBuddy,
    borderRadius: 35

  },
  hintContainer: {
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


  container: {
    flex: 1,
    backgroundColor: Colors.white

  },
  card: {
    backgroundColor: '#fff',
    //marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },

  appButtonContainer: {
    // elevation: 8,
    //backgroundColor:Colors.red,
    borderColor: Colors.red,
    borderWidth: 0,
    borderRadius: 4,
    padding: 5,
  },
  appButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});


export default ProfileScreen;


