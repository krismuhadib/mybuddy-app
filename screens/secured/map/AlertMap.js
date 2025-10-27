import React, { useEffect, useState, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, Platform, Dimensions, TouchableOpacity, Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View, ViewBase } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import MapView, { Marker, Circle, CalloutSubview, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MyCircleAnimation from '../../../components/elements/MyCircleAnimation';
import { myLocalisation, GetDistanceBetweenTwoPoints } from '../../../utils/helpers';
import SearchInput from '../../../components/elements/SearchInput';
import { i18n } from "../../../constants/Localization";
import AnimalMarkers from '../../../components/elements/AnimalMarkers';
import { AntDesign, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { MarkerDate } from '../../../utils/helpers';
import PulsingMarker from '../../../components/elements/PulsingMarker';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
import BDButton from '../../../components/elements/BDButton';

const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const AlertMapScreen = (route) => {

  const mapRef = useRef(null);

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [loading, setLoading] = useState(false);
  const params = route.route.params;
  const [mapList, setMapList] = useState([]);
  const [animalList, setAnimalList] = useState([]);
  const [region, setRegion] = useState({});
  const [myPosition, setMyPosition] = useState({});
  const [myPositionLat, setMyPositionLat] = useState("");
  const [myPositionLong, setMyPositionLong] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalListVisible, setModalListVisible] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState();
  const [createMarker, setCreateMarker] = useState(false);
  const [marker, setMarker] = useState(false);
  const [markerList, setMarkerList] = useState([]);
  const [displayFlat, setDisplayFlat] = useState(false);
  const [markerCount, setMarkerCount] = useState(0);
  const [markerLike, setMarkerLike] = useState(0);
  const [markerUnLike, setMarkerUnLike] = useState(0);
  const [androidModalVisible, setAndroidModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [imgUri, setImgUri] = useState("");
  const [cord1, setCord1] = useState(0);
  const [cord2, setCord2] = useState("");
  const [roomId, setRoomId] = useState([]);

  console.log("AlertMapScreen");

  useEffect(() => {
    setRegion({
      latitude: 48.8566,     // Paris
      longitude: 2.3522,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }, []);


  useEffect(() => {
    getAllAlerts();
    fetchLocation();
  }, [animalData, marker, params,]);

  useEffect(() => {
    getAllAlerts();
    if (params && params.createMarkers === false) {
      setCreateMarker(false);

    }
  }, [params]);

  const gotoMap = () => {
    if (params.navigateTo === "Newprofile" || params.from === "Alert") {
      navigation.goBack();
    } else {
      navigation.navigate('Map', {
        from: "Map",
        user_id: userData._id,
        //latitude: marker.latitude,
        // longitude: marker.longitude,
        reload: true,
      })
    }


  };



  const fetchLocation = async () => {
    const position = await myLocalisation();
    if (position) {
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setMyPosition(position);
      setMyPositionLat(position.coords.latitude);
      setMyPositionLong(position.coords.longitude);

    } else {
      console.log("pas de position")
    }
  };

  const getAllAlerts = async () => {
    await fetch(config.uri + 'alerts/getallalerts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        blokeduser: animalData.blokeduser
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var markerstList = res;
          const postListKey = Object.keys(markerstList.markerstList).map(key => ({
            key,
            ...markerstList.markerstList[key]
          }));
          setMarkerList(postListKey);
        }
        else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('PRB Markers');
        }
      });
  };

  const onMarkerPress = location => () => {
    navigation.navigate('AnimalDetailsMap', {
      from: "Home",
      title: location.name,
      item: location,
      userToken: userData._id,
    });
  };

  const filterData = (text) => {
    setSearchText(text);
    const filtereddData = animalList.filter(item => {
      const itemData = `${item.typeofname.toLowerCase()} +
        ${item.breedname.toLowerCase()} +
        ${item.description} +
        ${item.name.toLowerCase()}`;
      const textData = text.toLowerCase();
      return itemData.includes(textData);
    });
    setFilteredData(filtereddData);
  };

  const handleSearchChange = (text) => {
    setDisplayFlat(true);
    setSearchText(text);
    if (text === '') {
      setDisplayFlat(false);
      setFilteredData(animalList)
    } else {
      filterData(text);
    }
  };

  const onCreatePin = () => {
    setCreateMarker(true);
  };

  const abortCreatePin = () => {
    //this.onCenterDisplay();
    setCreateMarker(false);
    setMarker(null);
  };

  const onPressCenter = () => {
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const getDatasForModal = (locationmarker, cord1, cord2, pin) => {
    //console.log("Androidmodalvisible", androidModalVisible, modalData)
    setModalData(locationmarker);
    setCord1(cord1);
    setCord2(cord2);
    setImgUri(pin)

    if (modalData) {
      openAndroidMarkerModal();
    }
  };

  const openAndroidMarkerModal = () => {
    console.log("openAndroidMarkerModal", modalData, cord1)
    setAndroidModalVisible(true);
  };

  const closeAndroidMarkerModal = () => {
    setAndroidModalVisible(false);
  };


  const displayMarker = (idx, locationmarker, type, cord1, cord2) => {

    const images = {
      2: require("../../../assets/images/pin_stolen.png"),
      1: require("../../../assets/images/pin_search.png"),
      3: require("../../../assets/images/pin_injured.png"),
      4: require("../../../assets/images/pin_toxic.png"),
    };

    const zoneColors = {
      1: "rgba(149, 138, 255, 0.2)",  // bleu transparent
      3: "rgba(255,0,0,0.1)",   // rouge transparent
      4: "rgba(0,255,0,0.3)",   // vert transparent
      2: "rgba(202, 208, 55, 0.3)",   // jaune transparent
    };

    const zoneDistances = {
      1: 5000,
      3: 3000,
      4: 1000,
      2: 5000,
    };

    const imgUri = images[type];

    const zoneColor = zoneColors[type];

    const zoneDistance = zoneDistances[type];

    return (

      <View key={idx}>
        {(Platform.OS !== "android") &&
          <Marker
            coordinate={{ longitude: Number(locationmarker.longitude), latitude: Number(locationmarker.latitude) }}
            title={locationmarker.title}
            description={locationmarker.body}
            stopPropagation={false}
          >
            <Image source={imgUri}
              style={{}}
            />

            {(Platform.OS !== "android") &&
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <View style={{ padding: 0, paddingBottom: 10 }}>
                      <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", padding: 0 }}>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.markertitle}>{locationmarker.title}</Text>
                          <Text style={[styles.markeradress, { top: -5, fontSize: 10 }]}>{GetDistanceBetweenTwoPoints(cord1, cord2)} Km</Text>
                          <Text style={styles.markeradress}>{locationmarker.formatted}</Text>
                        </View>
                        <Image source={imgUri}
                          style={{ height: 30, width: 22, }} />
                      </View>

                      <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", padding: 0 }}>

                        <View style={{ flexDirection: "row", }}>
                          {/* avatar */}
                          <CalloutSubview
                            onPress={() => navigation.navigate('AnimalDetailsMap', {
                              navigateTo: "MapScreenMarker",
                              item: locationmarker,
                              fromWho: "SearchScreenMap",
                              userToken: userData._id,
                              item_user: locationmarker.animal_id,
                              item_animal: locationmarker.animal_id,// a virer
                              friends: locationmarker.animal_id.friends,
                            })}>
                            <View style={[styles.avatarPlaceholderBig, { marginBottom: 10 }]}>
                              <Image
                                source={{ uri: config.linkserver + locationmarker.animal_id._id + '/images/avatar/small/' + locationmarker.animal_id._id + '.jpg' }}
                                size='small'
                                style={styles.avatarBig} />
                            </View>
                          </CalloutSubview>
                        </View>

                      </View>
                      <Text style={styles.markerdescription}>{locationmarker.body}</Text>
                    </View>

                    <View style={{}}>
                      <CalloutSubview
                        onPress={() => sendMessage(locationmarker)}>
                        <BDButton
                          bgcolor={Colors.red}
                          color={Colors.white}
                          display={true}
                          //functionProp={sendMessage}
                          label={i18n.t('launchAlert.contact')}
                        />
                      </CalloutSubview>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: "row", alignContent: "center", justifyContent: "center", }}>
                      <Text>{MarkerDate(locationmarker.ldate)}</Text>
                    </View>

                    <View style={{ borderWidth: 0, flexDirection: "row", padding: 5, alignContent: "center", justifyContent: "center", }}>
                      {(Platform.OS !== "android") &&
                        <CalloutSubview
                          onPress={() => markerSignalment(locationmarker)}>
                          <TouchableOpacity>
                            <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                          </TouchableOpacity>
                        </CalloutSubview>
                      }
                    </View>
                  </View>
                  <View style={styles.arrowborder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            }

          </Marker>

        }
        {(zoneDistances && locationmarker.latitude) &&
          <Circle
            center={{
              latitude: Number(locationmarker.latitude),
              longitude: Number(locationmarker.longitude),
            }}
            radius={zoneDistance} // en mètres
            strokeWidth={2}
            strokeColor={zoneColor}
            fillColor={zoneColor} // couleur transparente
          />
        }

        {(Platform.OS === "android") &&
          <Marker
            onPress={() => getDatasForModal(locationmarker, cord1, cord2, imgUri)}
            coordinate={{ longitude: Number(locationmarker.longitude), latitude: Number(locationmarker.latitude) }}
            //title={locationmarker.title}
            // description={locationmarker.body}
            stopPropagation={false}
          >
            <Image source={imgUri}
              style={{}}
            />
          </Marker>
        }
      </View>
    )
  };

  const displayAnimal = (location, animal) => {

    if (!location?.latitude || !location?.longitude) return null;

    const images = config.animalPinMap;

    const imgUri = images[animal];

    const coordinate = {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    };

    const isMyAnimal = location._id === animalData._id;


    return (
      <View>
        {!isMyAnimal &&
          <>
            <Marker
              coordinate={coordinate}
              onPress={onMarkerPress(location)}
            >
              <Image source={imgUri}
                style={styles.pin}
              />
            </Marker>
          </>
        }
        {isMyAnimal &&
          <>

            {Platform.OS === "android" &&

              // <PulsingMarker 
              // location={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
              // imgUri={imgUri}
              // onMarkerPress={onMarkerPress}
              // mapRef={mapRef}
              // />
              <Marker
                coordinate={coordinate}
              //onPress={onMarkerPress(location)}
              >

                <View style={{ width: 50, height: 50, borderRadius: 25, borderColor: Colors.pinkBuddy, borderWidth: 3, }}>

                  <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center" }}>

                    {/* <Feather style={{ postion: "relative", paddingTop: 0 }} name="circle" size={60} color={Colors.red} /> */}
                    <View>

                      <Image source={imgUri}
                        style={[styles.pin, { height: 43, width: 50, }]} />
                    </View>

                  </View>

                </View>

              </Marker>
            }



            {Platform.OS !== "android" &&
              <PulsingMarker
                location={coordinate}
                imgUri={imgUri}
                onMarkerPress={onMarkerPress}
                mapRef={mapRef}
              />
            }



            <Marker
              coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
              onPress={onMarkerPress(location)}
            >
              {Platform.OS === "android" &&
                <View style={{ flex: 1, width: 100, height: 100, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                  <Feather style={{ postion: "relative", paddingTop: 0 }} name="circle" size={60} color={Colors.red} />
                  <Image source={imgUri}
                    style={[styles.pin, {
                      height: 40,
                      width: 40, position: "absolute"
                    }]} />
                </View>
              }
              {Platform.OS !== "android" &&
                <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                  <Feather style={{ postion: "relative", paddingTop: -10 }} name="circle" size={60} color={Colors.pink} />
                  <Image source={imgUri}
                    style={[styles.pin, { position: "absolute" }]} />
                </View>
              }


            </Marker>
            <Marker
              coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}>
              <Feather name="circle" size={60} color={Colors.pink} style={{ paddingTop: -10 }} />
            </Marker>
          </>
        }
      </View>
    )
  };

  const gotoMarkerDetails = () => {
    navigation.navigate('AlertDetails', {
      navigateTo: "Map",
      user_id: userData._id,
      latitude: marker.latitude,
      longitude: marker.longitude,
    })

  };

  const toggleLike = async (item) => {
    await fetch(config.uri + 'markers/like', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        marker_id: item._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          if (Platform.OS === "android") {
            setAndroidModalVisible(false);
          }
          setMarkerCount(item.markerlikes.length);
          setMarkerLike(res.markerlikes);
          getAllAlerts();
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
  };

  const toggleUnLike = async (item) => {
    await fetch(config.uri + 'markers/unlike', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        marker_id: item._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          if (Platform.OS === "android") {
            setAndroidModalVisible(false);
          }
          setMarkerCount(item.markerlikes.length);
          setMarkerUnLike(res.markerunlikes);
          getAllAlerts();
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
  };

  const markerSignalment = (item) => {
    navigation.navigate('SignalmentMapScreen', {
      from: "Map",
      item: item,
      animal_id: animalData._id
    })
  };

  const gotoMarkersList = () => {
    navigation.navigate('AlertList', {
      navigateTo: "Map",
      animal_id: animalData._id
    })

  };

  const androidMarkerModal = () => {

    return (
      <View>
        <View style={[styles.bubble, { borderWidth: 0 }]}>
          <View style={{ padding: 0, paddingBottom: 10 }}>
            <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", padding: 0 }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.markertitle}>{locationmarker.title}</Text>
                <Text style={[styles.markeradress, { top: -5, fontSize: 10 }]}>{GetDistanceBetweenTwoPoints(cord1, cord2)} Km</Text>
                <Text style={styles.markeradress}>{locationmarker.formatted}</Text>
              </View>
              <Image source={imgUri}
                style={{ height: 30, width: 22, }} />
            </View>
            <Text style={styles.markerdescription}>{locationmarker.body}</Text>
          </View>

          <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", padding: 0 }}>
            <Text>{MarkerDate(locationmarker.ldate)}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 10, color: Colors.greyL }}>{i18n.t('Page.Author')} :</Text>
              {/* avatar */}
              <TouchableOpacity
                onPress={() => navigation.navigate('AnimalDetailsMap', {
                  navigateTo: "MapScreenMarker",
                  item: locationmarker,
                  fromWho: "SearchScreenMap",
                  userToken: userData._id,
                  item_user: locationmarker.animal_id,
                  item_animal: locationmarker.animal_id,// a virer
                  friends: locationmarker.animal_id.friends,
                })}>
                <View style={[styles.avatarPlaceholder, { top: -10 }]}>
                  <Image
                    source={{ uri: config.linkserver + locationmarker.animal_id._id + '/images/avatar/small/' + locationmarker.animal_id._id + '.jpg' }}
                    size='small'
                    style={styles.avatar} />
                </View>
              </TouchableOpacity>
            </View>

          </View>

          <View style={{ borderWidth: 0, flexDirection: "row", padding: 5, alignContent: "space-between", justifyContent: "space-between", }}>
            <View style={{ flexDirection: "column" }}>
              {(Platform.OS !== "android") &&
                <CalloutSubview
                  onPress={() => toggleUnLike(locationmarker)}>
                  <TouchableOpacity>
                    {(locationmarker.markerunlikes.length === 0) &&
                      <AntDesign name="dislike2" size={24} color={Colors.greyL} />
                    }
                    {(locationmarker.markerunlikes.length > 0) &&
                      <AntDesign name="dislike2" size={24} color={Colors.red} />
                    }
                  </TouchableOpacity>
                </CalloutSubview>
              }
              {(locationmarker.markerunlikes) &&
                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{locationmarker.markerunlikes.length}</Text>
              }
            </View>
            <View style={{ flexDirection: "column" }}>
              {(Platform.OS !== "android") &&
                <CalloutSubview
                  onPress={() => markerSignalment(locationmarker)}>
                  <TouchableOpacity>
                    <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                  </TouchableOpacity>
                </CalloutSubview>
              }

            </View>

          </View>

        </View>
        <View style={styles.arrowborder} />
        <View style={styles.arrow} />
      </View>

    )
  };



  const sendMessage = async (item) => {

    console.log("SendMessage", item)
    await fetch(config.uri + 'messages/create_userchatroom', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_destinary: item.animal_id._id,
        animal_destinary_age: item.animal_id.age,
        animal_destinary_genre: item.animal_id.genre,
        animal_destinary_typeofname: item.animal_id.typeofname,
        animal_destinary_breedname: item.animal_id.breedname,
        animal_destinary_avatars: item.animal_id.avatars,
        animal_id: animalData._id,
        user_id: userData._id,
        destination_data: item.animal_id._id,
        destination_name: item.animal_id.name,
        creator_name: animalData.name,
        animal_datas: animalData,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("sendmessage res", res)
        if (res.success === true) {

          setRoomId(res._id);
          navigation.navigate('Message', {
            screen: "MessageListScreen",
            from: "Alert",
            room_id: roomId
          });
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
        }
      });

  };





  return (

    <View style={styles.container}>

      <HeaderBuddy
        // openModal={openModal}
        //iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        //iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('alert.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={false}
      />


      <Modal
        animationType="fade"
        transparent={true}
        visible={androidModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setAndroidModalVisible(!androidModalVisible);
        }}>

        <View style={[styles.modalView]}>
          <View style={[styles.modalContent, { backgroundColor: "#FFF" }]}>


            {(modalData !== null) &&

              <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <View style={[styles.bubble, { borderWidth: 0, width: 280 }]}>
                  <View style={{ paddingBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", padding: 0 }}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.markertitle}>{modalData.title}</Text>
                        <Text style={[styles.markeradress, { top: -5, fontSize: 10 }]}>{GetDistanceBetweenTwoPoints(cord1, cord2)} Km</Text>
                        <Text style={styles.markeradress}>{modalData.formatted}</Text>
                      </View>
                      <Image source={imgUri}
                        style={{ height: 30, width: 22, }} />
                    </View>

                    <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", padding: 0 }}>

                      <View style={{ flexDirection: "row", }}>
                        {/* avatar */}
                        <TouchableOpacity
                          onPress={() => navigation.navigate('AnimalDetailsMap', {
                            navigateTo: "MapScreenMarker",
                            item: modalData,
                            fromWho: "SearchScreenMap",
                            userToken: userData._id,
                            item_user: modalData.animal_id,
                            item_animal: modalData.animal_id,// a virer
                            friends: modalData.animal_id.friends,
                          })}>
                          <View style={[styles.avatarPlaceholderBig, { marginBottom: 10 }]}>
                            <Image
                              source={{ uri: config.linkserver + modalData.animal_id._id + '/images/avatar/small/' + modalData.animal_id._id + '.jpg' }}
                              size='small'
                              style={styles.avatarBig} />
                          </View>
                        </TouchableOpacity>
                      </View>

                    </View>
                    <Text style={styles.markerdescription}>{modalData.body}</Text>
                  </View>

                  <View style={{ marginTop: 0, marginBottom: 10, alignContent: "center", alignItems: "center", justifyContent: "center", }}>
                    <TouchableOpacity
                      onPress={() => sendMessage(modalData)}
                      style={{
                        alignContent: "center", alignItems: "center", justifyContent: "center", width: 200, borderWidth: 1, borderColor: Colors.red, borderRadius: 18, backgroundColor: Colors.red,
                        height: 30,
                      }}>
                      <Text style={[BDiaryStyles.h5Bold, { fontSize: 12, color: Colors.white }]}>{i18n.t('launchAlert.contact')}</Text>

                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", padding: 0 }}>
                    <Text>{MarkerDate(modalData.ldate)}</Text>
                  </View>

                  <View style={{ marginTop: 10, marginBottom: 10, width: "100%", borderWidth: 0, flexDirection: "row", padding: 0, alignContent: "space-around", justifyContent: "space-around", alignItems: "center" }}>
                    <View style={{ flexDirection: "column" }}>
                      <TouchableOpacity
                        onPress={() => markerSignalment(modalData)}>
                        <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>

              </View>
            }


            <View style={{ flexDirection: 'row', marginBottom: 15, }}>

              <View style={{ borderWidth: 0, flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => closeAndroidMarkerModal()}
                  style={{ width: 200, borderWidth: 1, borderColor: Colors.greyL, borderRadius: 18, height: 30, }
                  }>
                  <Text style={{ lineHeight: 25, textAlign: 'center', color: Colors.greyM, fontSize: 15, }}>{i18n.t('fullScreenVideo.close')}</Text>
                </TouchableOpacity>
              </View>


            </View>

          </View>


        </View>

      </Modal>

      {/* Pin Alert */}
      {(displayFlat === false && createMarker === false && region !== null) &&
        <MapView
          showsMyLocationButton={false} // <-- Ceci enlève le bouton de localisation
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          onPress={Keyboard.dismiss}
          style={{ flex: 1, position: "relative" }}
          // minZoomLevel={3}
          ref={mapRef}
          //initialRegion={region}
          region={region}
          // initialRegion={{
          //     latitude: 48.8566,     // Paris
          //     longitude: 2.3522,
          //     latitudeDelta: 0.0922,
          //     longitudeDelta: 0.0421,
          // }}
          showsUserLocation={false}
        >

          {markerList && markerList.map((locationmarker, idx) => {
            var cord1 = { lat: locationmarker.latitude, lon: locationmarker.longitude };
            var cord2 = { lat: myPositionLat, lon: myPositionLong };
            if (![1, 2, 3, 4].includes(locationmarker.typeofmarkers)) {
              return null; // sécurise
            }

            if (locationmarker.typeofmarkers === 2) {
              // return (
              //     <View key={idx}>
              //         {displayMarker(locationmarker, 2, cord1, cord2)}
              //     </View>
              // )
              return (
                displayMarker(idx, locationmarker, 2, cord1, cord2)
              )
            }
            if (locationmarker.typeofmarkers === 1) {
              return (
                displayMarker(idx, locationmarker, 1, cord1, cord2)
              )
            }
            if (locationmarker.typeofmarkers === 3) {
              return (
                displayMarker(idx, locationmarker, 3, cord1, cord2)
              )
            }
            if (locationmarker.typeofmarkers === 4) {
              return (
                displayMarker(idx, locationmarker, 4, cord1, cord2)
              )
            }
          })
          }
        </MapView>
      }


      {(displayFlat === false && createMarker === true && region !== null) &&
        <MapView
          showsMyLocationButton={false} // <-- Ceci enlève le bouton de localisation
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{ flex: 1 }}
          // minZoomLevel={3}
          ref={mapRef}
          // initialRegion={{
          //     latitude: 48.8566,     // Paris
          //     longitude: 2.3522,
          //     latitudeDelta: 0.0922,
          //     longitudeDelta: 0.0421,
          // }}
          //region={region}
          //initialRegion={region}
          region={region}
          showsUserLocation={true}
          onPress={(e) => setMarker(e.nativeEvent.coordinate)}
        >
          {(marker && marker !== undefined) &&
            <Marker coordinate={marker}>


              <MaterialIcons name="location-pin" size={45} color={Colors.red} />
            </Marker>
          }

          {markerList && markerList.map((locationmarker, idx) => {
            var cord1 = { lat: locationmarker.latitude, lon: locationmarker.longitude };
            var cord2 = { lat: myPositionLat, lon: myPositionLong };

            if (![1, 2, 3, 4].includes(locationmarker.typeofmarkers)) {
              return null; // sécurise
            }

            if (locationmarker.typeofmarkers === 2) {
              return (

                displayMarker(idx, locationmarker, 2, cord1, cord2)

              )
            }
            if (locationmarker.typeofmarkers === 1) {
              return (

                displayMarker(idx, locationmarker, 1, cord1, cord2)

              )
            }
            if (locationmarker.typeofmarkers === 3) {
              return (

                displayMarker(idx, locationmarker, 3, cord1, cord2)

              )
            }
            if (locationmarker.typeofmarkers === 4) {
              return (

                displayMarker(idx, locationmarker, 4, cord1, cord2)

              )
            }

          })
          }

        </MapView>
      }

      {/*End Pin Alert */}

      {/* Map Buttons */}

      <TouchableOpacity onPress={() => gotoMap()}
        style={{
          margin: 0,
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.pinkBuddy,
          borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
          width: Dimensions.get('window').width * 0.10,
          height: Dimensions.get('window').width * 0.10,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          position: 'absolute',//use absolute position to show button on top of the map
          top: '60%', //for center align
          left: '85%',
          alignSelf: 'flex-end', //for align to right
          //alignSelf: 'center',
        }}>
        <Feather name="map" size={25} color={Colors.white} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressCenter()}
        style={{
          margin: 0,
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.pinkBuddy,
          borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
          width: Dimensions.get('window').width * 0.10,
          height: Dimensions.get('window').width * 0.10,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          position: 'absolute',//use absolute position to show button on top of the map
          top: '90%', //for center align
          left: '85%',
          alignSelf: 'flex-end', //for align to right
          //alignSelf: 'center',
        }}>
        <Ionicons name="locate" size={25} color={Colors.white} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => gotoMarkersList()}
        style={{
          margin: 0,
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.pinkBuddy,
          borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
          width: Dimensions.get('window').width * 0.10,
          height: Dimensions.get('window').width * 0.10,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          position: 'absolute',//use absolute position to show button on top of the map
          top: '80%', //for center align
          left: '85%',
          alignSelf: 'flex-end', //for align to right
          //alignSelf: 'center',
        }}>
        <MaterialIcons name="list" size={25} color={Colors.white} />
      </TouchableOpacity>

      {(createMarker === false) &&
        <TouchableOpacity onPress={() => onCreatePin()}
          style={{
            //display: this.state.display_pin,
            margin: 0,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.pinkBuddy,
            borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
            width: Dimensions.get('window').width * 0.10,
            height: Dimensions.get('window').width * 0.10,
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            position: 'absolute',//use absolute position to show button on top of the map
            top: '70%', //for center align
            left: '85%',
            alignSelf: 'flex-end', //for align to right
            //alignSelf: 'center',
          }}>
          <Ionicons name="warning" size={25} color={Colors.white} />
        </TouchableOpacity>
      }

      {(createMarker === true) &&
        <TouchableOpacity onPress={() => abortCreatePin()}
          style={{
            //display: this.state.display_pin,
            margin: 0,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.pinkBuddy,
            borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
            width: Dimensions.get('window').width * 0.10,
            height: Dimensions.get('window').width * 0.10,
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            position: 'absolute',//use absolute position to show button on top of the map
            top: '70%', //for center align
            left: '85%',
            alignSelf: 'flex-end', //for align to right
            //alignSelf: 'center',
          }}>
          <Ionicons name="warning" size={25} color={Colors.white} />
        </TouchableOpacity>}

      {(createMarker === true) &&
        <View style={{ backgroundColor: Colors.white, position: "absolute", top: '20%', left: '3%', right: '5%', borderWidth: 2, borderColor: Colors.pinkBuddy, borderRadius: 12, padding: 10, alignContent: "center", alignItems: 'center', justifyContent: 'center', }}>

          <View style={{}}>
            <View style={{ flexDirection: 'column', }}>

              <View style={{}}>
                <Text style={BDiaryStyles.h5}>{i18n.t('launchAlert.informations')}</Text>
              </View>


              <View style={{}}>
                <Text style={BDiaryStyles.h5}>{i18n.t('launchAlert.alertPinPlace')}</Text>
              </View>

              <View style={{ flexDirection: "row", flex: 1, }}>
                <Text style={BDiaryStyles.h5}>{i18n.t('launchAlert.alertPinPCancel')}</Text>
                <MaterialIcons style={{ top: -5, padding: 0 }} name="warning" size={30} color={Colors.pinkBuddy} />
              </View>

              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={BDiaryStyles.h5}>{i18n.t('launchAlert.savePinAlert')}</Text>
                <Feather style={{ top: 0, padding: 0 }} name="edit-3" size={30} color={Colors.pinkBuddy} />
              </View>
            </View>


          </View>

        </View>
      }

      {(createMarker === true && marker !== null) &&
        <TouchableOpacity onPress={() => gotoMarkerDetails()}
          style={{
            margin: 0,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.pinkBuddy,
            borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
            width: Dimensions.get('window').width * 0.10,
            height: Dimensions.get('window').width * 0.10,
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            position: 'absolute',//use absolute position to show button on top of the map
            top: '60%', //for center align
            left: '85%',
            alignSelf: 'flex-end', //for align to right
            //alignSelf: 'center',
          }}>
          <Feather name="edit-3" size={25} color={Colors.white} />
        </TouchableOpacity>
      }
      {/* End Map Buttons */}



    </View>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalView: {
    width: ScreenWidth,
    height: ScreenHeight,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        //position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        elevation: 1,
        //opacity: 0.5,
        //top:140,

      },
    }),
  },

  modalContent: {
    opacity: 1,
    width: 280,
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,
    position: 'relative',
    top: ScreenHeight / 3,
  },

  pin: {
    height: 50,
    width: 43,
    resizeMode: "contain",
  },
  map: {
    width: '100%',
    height: '100%',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#ccc',
    opacity: 0.9,
    borderWidth: 0,
    alignSelf: 'center',
    marginTop: -32,

  },
  arrowborder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    opacity: 1,
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 10,
    width: 250,
    //  height:250,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,

  },
  markertitle: {
    borderWidth: 0,
    maxWidth: 200,
    color: Colors.greyH,
    fontSize: 16,
    textTransform: 'capitalize',
    fontWeight: "bold",
    marginBottom: 5,
  },
  markerdescription: {
    maxWidth: 200,
    color: Colors.greyM,
    fontSize: 14,
    marginBottom: 5,
  },
  markeradress: {
    maxWidth: 200,
    color: Colors.greyM,
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 5,
  },
  avatar: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0,
    borderColor: 'red',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarBig: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'red',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderBig: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#ff0000ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default AlertMapScreen;

