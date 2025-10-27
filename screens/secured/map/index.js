import React, { useEffect, useState, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, Platform, Dimensions, TouchableOpacity, Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View, ViewBase } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import MapView, { Marker, CalloutSubview, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MyCircleAnimation from '../../../components/elements/MyCircleAnimation';
import { myLocalisation, GetDistanceBetweenTwoPoints } from '../../../utils/helpers';
import SearchInput from '../../../components/elements/SearchInput';
import { i18n } from "../../../constants/Localization";
import AnimalMarkers from '../../../components/elements/AnimalMarkers';
import { AntDesign, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { MarkerDate } from '../../../utils/helpers';
import PulsingMarker from '../../../components/elements/PulsingMarker';

const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const MapScreen = (route) => {

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

    console.log("MapScreen");

    useEffect(() => {
        setRegion({
            latitude: 48.8566,     // Paris
            longitude: 2.3522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
    }, []);


    useEffect(() => {
        // getAllMarkers();
        fetchLocation();
        getAllAnimals();
    }, [animalData, marker]);

    useEffect(() => {
        getAllMarkers();
        if (params && params.createMarkers === false) {
            setCreateMarker(false);

        }
    }, [params]);

    const getAllAnimals = async () => { 

        await fetch(config.uri + 'animals/getallanimalsmap', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                animal_id: animalData._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    var animalList = res;
                    const postListKey = Object.keys(animalList.animalList).map(key => ({
                        key,
                        ...animalList.animalList[key]
                    }));

                    setMapList(postListKey);
                    setAnimalList(postListKey);
                }
                else {
                    alert('PRB Anomals');
                }
            });
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

    const getAllMarkers = async () => {
        await fetch(config.uri + 'markers/getallmarkers', {
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
        // this.setState({
        //   createmarker: false,
        //   marker : null,

        // })
        //console.log('----> OnPressCenter',this.state.region)
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
            2: require("../../../assets/images/pin_store.png"),
            1: require("../../../assets/images/pin_health.png"),
            3: require("../../../assets/images/pin_service.png"),
            4: require("../../../assets/images/pin_outdoor.png"),
        };
        //console.log("type", type)
        const imgUri = images[type];

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
                                                                <AntDesign name="dislike" size={24} color={Colors.greyL} />
                                                            }
                                                            {(locationmarker.markerunlikes.length > 0) &&
                                                                <AntDesign name="dislike" size={24} color={Colors.red} />
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
                                            <View style={{ flexDirection: "column" }}>
                                                {(Platform.OS !== "android") &&
                                                    <CalloutSubview
                                                        onPress={() => toggleLike(locationmarker)}>
                                                        <TouchableOpacity>
                                                            {(locationmarker.markerlikes.length === 0) &&
                                                                <AntDesign name="like" size={24} color={Colors.greyL} />
                                                            }
                                                            {(locationmarker.markerlikes.length > 0) &&
                                                                <AntDesign name="like" size={24} color={Colors.greenBuddy} />
                                                            }
                                                        </TouchableOpacity>
                                                    </CalloutSubview>
                                                }
                                                {(locationmarker.markerlikes) &&
                                                    <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{locationmarker.markerlikes.length}</Text>
                                                }
                                            </View>
                                        </View>

                                    </View>
                                    <View style={styles.arrowborder} />
                                    <View style={styles.arrow} />
                                </View>
                            </Callout>
                        }

                    </Marker>
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



                        {/* <Marker
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


                        </Marker> */}
                        {/* <Marker
                            coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}>
                            <Feather name="circle" size={60} color={Colors.pink} style={{ paddingTop: -10 }} />
                        </Marker> */}
                    </>
                }
            </View>
        )
    };

    const gotoMarkerDetails = () => {
        navigation.navigate('MarkerDetails', {
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
                    getAllMarkers();
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
                    getAllMarkers();
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
        navigation.navigate('MarkerList', {
            navigateTo: "Map",
            animal_id: animalData._id
        })

    };

        const gotoAlert = () => {
        navigation.navigate('AlertMapScreen', {
      navigateTo: "Newprofile"
    });

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
                                            <AntDesign name="dislike" size={24} color={Colors.greyL} />
                                        }
                                        {(locationmarker.markerunlikes.length > 0) &&
                                            <AntDesign name="dislike" size={24} color={Colors.red} />
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
                        <View style={{ flexDirection: "column" }}>
                            {(Platform.OS !== "android") &&
                                <CalloutSubview
                                    onPress={() => toggleLike(locationmarker)}>
                                    <TouchableOpacity>
                                        {(locationmarker.markerlikes.length === 0) &&
                                            <AntDesign name="like" size={24} color={Colors.greyL} />
                                        }
                                        {(locationmarker.markerlikes.length > 0) &&
                                            <AntDesign name="like" size={24} color={Colors.greenBuddy} />
                                        }
                                    </TouchableOpacity>
                                </CalloutSubview>
                            }
                            {(locationmarker.markerlikes) &&
                                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{locationmarker.markerlikes.length}</Text>
                            }
                        </View>
                    </View>

                </View>
                <View style={styles.arrowborder} />
                <View style={styles.arrow} />
            </View>

        )
    };





    return (

        <View style={styles.container}>


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
                                        <Text style={styles.markerdescription}>{modalData.body}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", alignContent: "space-between", justifyContent: "space-between", padding: 0 }}>
                                        <Text>{MarkerDate(modalData.ldate)}</Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ fontSize: 10, color: Colors.greyL }}>{i18n.t('Page.Author')} :</Text>
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
                                                <View style={[styles.avatarPlaceholder, { top: -10 }]}>
                                                    <Image
                                                        source={{ uri: config.linkserver + modalData.animal_id._id + '/images/avatar/small/' + modalData.animal_id._id + '.jpg' }}
                                                        size='small'
                                                        style={styles.avatar} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    <View style={{ marginTop: 10, marginBottom: 10, width: "100%", borderWidth: 0, flexDirection: "row", padding: 0, alignContent: "space-around", justifyContent: "space-around", alignItems: "center" }}>
                                        <View style={{ flexDirection: "column" }}>
                                            <TouchableOpacity
                                                onPress={() => toggleUnLike(modalData)}>

                                                {(modalData.markerunlikes.length === 0) &&
                                                    <AntDesign name="dislike" size={24} color={Colors.greyL} />
                                                }
                                                {(modalData.markerunlikes.length > 0) &&
                                                    <AntDesign name="dislike" size={24} color={Colors.red} />
                                                }

                                            </TouchableOpacity>

                                            {(modalData.markerunlikes) &&
                                                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{modalData.markerunlikes.length}</Text>
                                            }
                                        </View>
                                        <View style={{ flexDirection: "column" }}>

                                            <TouchableOpacity
                                                onPress={() => markerSignalment(modalData)}>
                                                <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                                            </TouchableOpacity>


                                        </View>
                                        <View style={{ flexDirection: "column" }}>

                                            <TouchableOpacity
                                                onPress={() => toggleLike(modalData)}>

                                                {(modalData.markerlikes.length === 0) &&
                                                    <AntDesign name="like" size={24} color={Colors.greyL} />
                                                }
                                                {(modalData.markerlikes.length > 0) &&
                                                    <AntDesign name="like" size={24} color={Colors.greenBuddy} />
                                                }

                                            </TouchableOpacity>

                                            {(modalData.markerlikes) &&
                                                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{modalData.markerlikes.length}</Text>
                                            }
                                        </View>
                                    </View>

                                </View>

                            </View>
                        }


                        <View style={{ flexDirection: 'row', marginBottom: 15, }}>

                            <View style={{ borderWidth: 0, flex: 1, alignContent: "center", alignItems: "center" }}>
                                <TouchableOpacity onPress={() => closeAndroidMarkerModal()}
                                    style={{ width: 200, borderWidth: 1, borderColor: Colors.greyL, borderRadius: 12, }
                                    }>
                                    <Text style={{ textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('fullScreenVideo.close')}</Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </View>


                </View>

            </Modal>




            {/* Pin Animals & Markers */}
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
                    showsUserLocation={true}
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


                    {animalList && animalList ? animalList.map((location, idx) => {
                        if (location.latitude && location.longitude && location.map === true) {
                            if (location.typeofname === "dog" || location.typeofname === "chien") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "dog")}
                                    </View>
                                )
                            } else if (location.typeofname === "goat" || location.typeofname === "chevre") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "goat")}
                                    </View>
                                )

                            } else if (location.typeofname === "gerbil" || location.typeofname === "gerbille") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "chinchilla" || location.typeofname === "chinchilla") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "rabbit" || location.typeofname === "lapin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "rabbit")}
                                    </View>
                                )
                            } else if (location.typeofname === "cat" || location.typeofname === "chat") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "cat")}
                                    </View>
                                )
                            } else if (location.typeofname === "fish" || location.typeofname === "poisson") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "fish")}
                                    </View>
                                )
                            } else if (location.typeofname === "hamster" || location.typeofname === "hamster") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "bird" || location.typeofname === "oiseau") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bird")}
                                    </View>
                                )
                            } else if (location.typeofname === "sheep" || location.typeofname === "ovin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "sheep")}
                                    </View>
                                )
                            } else if (location.typeofname === "bovine" || location.typeofname === "bovin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "cow")}
                                    </View>
                                )
                            } else if (location.typeofname === "donkey" || location.typeofname === "ane") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "pig" || location.typeofname === "cochon") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "pig")}
                                    </View>
                                )
                            } else if (location.typeofname === "poney" || location.typeofname === "poney") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "degus" || location.typeofname === "octodon") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>

                                )
                            } else if (location.typeofname === "guinea_pig" || location.typeofname === "cobaye") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "bug" || location.typeofname === "insecte") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bug")}
                                    </View>
                                )
                            } else if (location.typeofname === "horse" || location.typeofname === "cheval") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "mouse" || location.typeofname === "souris") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "snake" || location.typeofname === "serpent") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "snake")}
                                    </View>
                                )
                            } else if (location.typeofname === "reptile" || location.typeofname === "reptile") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "reptile")}
                                    </View>
                                )
                            } else if (location.typeofname === "ferret" || location.typeofname === "furret") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "furret")}
                                    </View>
                                )
                            } else if (location.typeofname === "turtle" || location.typeofname === "tortue") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "turtle")}
                                    </View>
                                )
                            } else if (location.typeofname === "squirrel" || location.typeofname === "ecureuil") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "chicken" || location.typeofname === "poule") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bird")}
                                    </View>
                                )
                            } else if (location.typeofname === "spider" || location.typeofname === "araignée") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "spider")}
                                    </View>
                                )
                            }
                        }
                    })
                        : null
                    }


                </MapView>
            }

            {(displayFlat === true && createMarker === false && region !== null) &&
                <MapView
                    showsMyLocationButton={false} // <-- Ceci enlève le bouton de localisation
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                    onPress={Keyboard.dismiss}
                    style={{ flex: 1 }}
                    // minZoomLevel={3}
                    ref={mapRef}
                    // initialRegion={{
                    //     latitude: 48.8566,     // Paris
                    //     longitude: 2.3522,
                    //     latitudeDelta: 0.0922,
                    //     longitudeDelta: 0.0421,
                    // }}
                    region={region}
                    //initialRegion={region}
                    //region={region}
                    showsUserLocation={true}
                >

                    {/* {markerList && markerList.map((locationmarker, idx) => {
                        var cord1 = { lat: locationmarker.latitude, lon: locationmarker.longitude };
                        var cord2 = { lat: myPositionLat, lon: myPositionLong };

                        if (locationmarker.typeofmarkers === "Store") {
                            return (
                                <View key={idx}>
                                    {displayMarker(locationmarker, "Store", cord1, cord2)}
                                </View>
                            )
                        }
                        if (locationmarker.typeofmarkers === "Health") {
                            return (
                                <View key={idx}>
                                    {displayMarker(locationmarker, "Health", cord1, cord2)}
                                </View>
                            )
                        }
                        if (locationmarker.typeofmarkers === "Services") {
                            return (
                                <View key={idx}>
                                    {displayMarker(locationmarker, "Services", cord1, cord2)}
                                </View>
                            )
                        }

                    })
                    } */}


                    {filteredData && filteredData ? filteredData.map((location, idx) => {

                        if (location.latitude && location.longitude && location.map === true) {
                            if (location.typeofname === "dog" || location.typeofname === "chien") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "dog")}
                                    </View>
                                )
                            } else if (location.typeofname === "goat" || location.typeofname === "chevre") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "goat")}
                                    </View>
                                )

                            } else if (location.typeofname === "gerbil" || location.typeofname === "gerbille") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "chinchilla" || location.typeofname === "chinchilla") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "rabbit" || location.typeofname === "lapin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "rabbit")}
                                    </View>
                                )
                            } else if (location.typeofname === "cat" || location.typeofname === "chat") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "cat")}
                                    </View>
                                )
                            } else if (location.typeofname === "fish" || location.typeofname === "poisson") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "fish")}
                                    </View>
                                )
                            } else if (location.typeofname === "hamster" || location.typeofname === "hamster") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "bird" || location.typeofname === "oiseau") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bird")}
                                    </View>
                                )
                            } else if (location.typeofname === "sheep" || location.typeofname === "ovin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "sheep")}
                                    </View>
                                )
                            } else if (location.typeofname === "bovine" || location.typeofname === "bovin") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "cow")}
                                    </View>
                                )
                            } else if (location.typeofname === "donkey" || location.typeofname === "ane") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "pig" || location.typeofname === "cochon") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "pig")}
                                    </View>
                                )
                            } else if (location.typeofname === "poney" || location.typeofname === "poney") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "degus" || location.typeofname === "octodon") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>

                                )
                            } else if (location.typeofname === "guinea_pig" || location.typeofname === "cobaye") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "bug" || location.typeofname === "insecte") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bug")}
                                    </View>
                                )
                            } else if (location.typeofname === "horse" || location.typeofname === "cheval") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "horse")}
                                    </View>
                                )
                            } else if (location.typeofname === "mouse" || location.typeofname === "souris") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "mouse")}
                                    </View>
                                )
                            } else if (location.typeofname === "snake" || location.typeofname === "serpent") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "snake")}
                                    </View>
                                )
                            } else if (location.typeofname === "reptile" || location.typeofname === "reptile") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "reptile")}
                                    </View>
                                )
                            } else if (location.typeofname === "ferret" || location.typeofname === "furret") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "furret")}
                                    </View>
                                )
                            } else if (location.typeofname === "turtle" || location.typeofname === "tortue") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "turtle")}
                                    </View>
                                )
                            } else if (location.typeofname === "squirrel" || location.typeofname === "ecureuil") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "hamster")}
                                    </View>
                                )
                            } else if (location.typeofname === "chicken" || location.typeofname === "poule") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "bird")}
                                    </View>
                                )
                            } else if (location.typeofname === "spider" || location.typeofname === "araignée") {
                                return (
                                    <View key={idx}>
                                        {displayAnimal(location, "spider")}
                                    </View>
                                )
                            }
                        }
                    })
                        : null
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
                            <MaterialIcons name="location-pin" size={30} color={Colors.pinkBuddy} />
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
            {/*End Pin Animals & Markers */}


            {/*Search Input*/}
            <View style={{ position: 'absolute', backgroundColor: 'rgba(52, 52, 52,alpha)', marginTop: 35 }}>
                <View style={{ width: ScreenWidth }}>
                    <SearchInput
                        placeholder={i18n.t('species.search')}
                        functionProp={handleSearchChange}
                        list={animalList}
                    />
                </View>
            </View>
            {/*End Search Input*/}






            {/* Map Buttons */}
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



            <TouchableOpacity onPress={() => gotoAlert()}
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
                <Ionicons name="warning" size={25} color={Colors.white} />
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
                    <MaterialIcons name="location-pin" size={25} color={Colors.white} />
                </TouchableOpacity>}

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
                    <MaterialIcons name="location-pin" size={25} color={Colors.white} />
                </TouchableOpacity>}

            {(createMarker === true) &&
                <View style={{ backgroundColor: Colors.white, position: "absolute", top: '85%', left: '3%', right: '5%', borderWidth: 2, borderColor: Colors.pinkBuddy, borderRadius: 12, height: 80, flex: 1, padding: 10, alignContent: "center", alignItems: 'center', justifyContent: 'center', }}>

                    <View style={{}}>
                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: Colors.greyH, fontSize: 14 }}>{i18n.t('Page.Markerpin_1')}</Text>
                                <MaterialIcons style={{ top: -10, padding: 0 }} name="location-pin" size={30} color={Colors.pinkBuddy} />

                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: Colors.greyH, fontSize: 14 }}>{i18n.t('Page.Markerpin_2')}</Text>
                                <Feather style={{ top: -5, padding: 0 }} name="edit-3" size={20} color={Colors.pinkBuddy} />
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
});

export default MapScreen;
