import React, { useEffect, useState, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, TouchableOpacity, Image, Keyboard, Text, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import MapView, { Marker, CalloutSubview, Callout } from 'react-native-maps';
import MyCircleAnimation from '../../../components/elements/MyCircleAnimation';
import { myLocalisation, GetDistanceBetweenTwoPoints } from '../../../utils/helpers';
import SearchInput from '../../../components/elements/SearchInput';
import { i18n } from "../../../constants/Localization";
import AnimalMarkers from '../../../components/elements/AnimalMarkers';
import { AntDesign, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { MarkerDate } from '../../../utils/helpers';

const config = require('../../../config');

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


    console.log("MapScreen", params);


    useEffect(() => {
        getAllMarkers();
        fetchLocation();
        getAllAnimals();
    }, [animalData, marker]);

    useEffect(() => {
        getAllMarkers();
        getAllAnimals();
        if (params && params.createMarkers === false) {
            setCreateMarker(false);
        }
    }, [ params]);

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

    const displayMarker = (locationmarker, type, cord1, cord2) => {

        const images = {
            2: require("../../../assets/images/pin_store.png"),
            1: require("../../../assets/images/pin_health.png"),
            3: require("../../../assets/images/pin_service.png"),
            4: require("../../../assets/images/pin_outdoor.png"),
        };
        //console.log("type", type)
        const imgUri = images[type] || images;

        return (
            
                    <Marker
                        coordinate={{ longitude: Number(locationmarker.longitude), latitude: Number(locationmarker.latitude) }}
                        title={locationmarker.title}
                        description={locationmarker.body}>
                        <Image source={imgUri}
                            style={{ height: 42, width: 30 }}
                        />
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
                                            <TouchableOpacity
                                                onPress={() => toggleUnLike(locationmarker)}>
                                              
                                                {(locationmarker.markerunlikes.length === 0) &&
                                                    <AntDesign name="dislike2" size={24} color={Colors.greyL} />
                                                }
                                                {(locationmarker.markerunlikes.length > 0) &&
                                                  <AntDesign name="dislike2" size={24} color={Colors.red} />
                                                }
                                             
                                            </TouchableOpacity>
                                            {(locationmarker.markerunlikes) &&
                                                <Text style={{ textAlign: "center", fontSize: 12, color: Colors.greyL }}>{locationmarker.markerunlikes.length}</Text>
                                            }
                                        </View>
                                        <View style={{ flexDirection: "column" }}>
                                            <TouchableOpacity
                                                onPress={() => markerSignalment(locationmarker)}>
                                             
                                                    <Ionicons name="alert-circle-outline" size={30} color={Colors.greyL} />
                                             
                                            </TouchableOpacity>

                                        </View>
                                        <View style={{ flexDirection: "column" }}>
                                            <TouchableOpacity
                                                onPress={() => toggleLike(locationmarker)}>
                                                <View>
                                                    {(locationmarker.markerlikes.length === 0) &&
                                                        <AntDesign name="like2" size={24} color={Colors.greyL} />
                                                    }
                                                    {(locationmarker.markerlikes.length > 0) &&
                                                        <AntDesign name="like2" size={24} color={Colors.greenBuddy} />
                                                    }
                                                </View>
                                            </TouchableOpacity>
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
                    </Marker>
        
        )




    };

    const displayAnimal = (location, animal) => {

        const images = {
            cat: require("../../../assets/images/pin_cat.png"),
            dog: require("../../../assets/images/pin_dog.png"),
            bird: require("../../../assets/images/pin_bird.png"),
            spider: require("../../../assets/images/pin_spider.png"),
            hamster: require("../../../assets/images/pin_hamster.png"),
            turtle: require("../../../assets/images/pin_turtle.png"),
            furet: require("../../../assets/images/pin_furet.png"),
            reptile: require("../../../assets/images/pin_reptile.png"),
            snake: require("../../../assets/images/pin_snake.png"),
            mouse: require("../../../assets/images/pin_mouse.png"),
            horse: require("../../../assets/images/pin_horse.png"),
            bug: require("../../../assets/images/pin_bug.png"),
            pig: require("../../../assets/images/pin_pig.png"),
            cow: require("../../../assets/images/pin_cow.png"),
            sheep: require("../../../assets/images/pin_sheep.png"),
            fish: require("../../../assets/images/pin_fish.png"),
            rabbit: require("../../../assets/images/pin_rabbit.png"),
            goat: require("../../../assets/images/pin_goat.png"),
            rabbit: require("../../../assets/images/pin_rabbit.png"),
            rabbit: require("../../../assets/images/pin_rabbit.png"),
        };

        const imgUri = images[animal];

        return (
            <View>
                {(location._id !== animalData._id) &&
                    <>
                        <Marker
                            coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
                            onPress={onMarkerPress(location)}
                        >
                            <Image source={imgUri}
                                style={styles.pin}
                            />
                        </Marker>
                    </>
                }
                {(location._id === animalData._id) &&
                    <>
                        <Marker
                            coordinate={{ longitude: Number(location.longitude), latitude: Number(location.latitude) }}
                            onPress={onMarkerPress(location)}
                        >
                            <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                <Feather style={{ postion: "relative", paddingTop: -10 }} name="circle" size={60} color={Colors.pink} />
                                <Image source={imgUri}
                                    style={[styles.pin, { position: "absolute" }]}
                                />



                            </View>

                        </Marker>
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

    const toggleLike = (item) => {
        fetch(config.uri + 'markers/like', {
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
                    setMarkerCount(item.markerlikes.length);
                    setMarkerLike(res.markerlikes);
                    getAllMarkers();
                }
                else {
                    alert(i18n.t('Fetch_Error.prbRes'));
                }
            });
    };

    const toggleUnLike = (item) => {
        fetch(config.uri + 'markers/unlike', {
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
    
    
    return (

        <View style={styles.container}>

            <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, }}>
                <SearchInput
                    placeholder={i18n.t('species.search')}
                    functionProp={handleSearchChange}
                    list={animalList}
                />
            </View>


            {/* Pin Animals & Markers */}
            {(displayFlat === false && createMarker === false) &&
                <MapView
                    onPress={Keyboard.dismiss}
                    style={{ flex: 1 }}
                    // minZoomLevel={3}
                    ref={mapRef}
                    initialRegion={{
                        latitude: 48.8566,     // Paris
                        longitude: 2.3522,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    //region={region}
                    showsUserLocation={true}
                >

                    {markerList && markerList.map((locationmarker, idx) => {
                        var cord1 = { lat: locationmarker.latitude, lon: locationmarker.longitude };
                        var cord2 = { lat: myPositionLat, lon: myPositionLong };
                        
                        if (![1, 2, 3, 4].includes(locationmarker.typeofmarkers)) {
                            return null; // sécurise
                        }

                        if (locationmarker.typeofmarkers === 2) {
                            return (
                               
                                    displayMarker(locationmarker, 2, cord1, cord2)
                                
                            )
                        }
                        if (locationmarker.typeofmarkers === 1) {
                            return (
                                displayMarker(locationmarker, 1, cord1, cord2)
                              
                            )
                        }
                        if (locationmarker.typeofmarkers === 3) {
                            return (
                               
                                    displayMarker(locationmarker, 3, cord1, cord2)
                              
                            )
                        }
                        if (locationmarker.typeofmarkers === 4) {
                            return (
                               
                                    displayMarker(locationmarker,4, cord1, cord2)
                             
                            )
                        }

                    })
                    }


                    


                </MapView>
            }

           

            
            {/*End Pin Animals & Markers */}



            {/* Map Buttons */}
            <TouchableOpacity onPress={() => onPressCenter()}
                style={{
                    margin: 0,
                    padding: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F0F0F0',
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
                <Ionicons name="locate" size={30} color={Colors.pinkBuddy} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => gotoMarkersList()}
                style={{
                    margin: 0,
                    padding: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F0F0F0',
                    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                    width: Dimensions.get('window').width * 0.10,
                    height: Dimensions.get('window').width * 0.10,
                    shadowColor: '#000',
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '82%', //for center align
                    left: '85%',
                    alignSelf: 'flex-end', //for align to right
                    //alignSelf: 'center',
                }}>
                <MaterialIcons name="list" size={30} color={Colors.pinkBuddy} />
            </TouchableOpacity>

            {(createMarker === false) &&
                <TouchableOpacity onPress={() => onCreatePin()}
                    style={{
                        //display: this.state.display_pin,
                        margin: 0,
                        padding: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F0F0F0',
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                        width: Dimensions.get('window').width * 0.10,
                        height: Dimensions.get('window').width * 0.10,
                        shadowColor: '#000',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '72%', //for center align
                        left: '85%',
                        alignSelf: 'flex-end', //for align to right
                        //alignSelf: 'center',
                    }}>
                    <MaterialIcons name="location-pin" size={30} color={Colors.pinkBuddy} />
                </TouchableOpacity>}

            {(createMarker === true) &&
                <TouchableOpacity onPress={() => abortCreatePin()}
                    style={{
                        //display: this.state.display_pin,
                        margin: 0,
                        padding: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F0F0F0',
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                        width: Dimensions.get('window').width * 0.10,
                        height: Dimensions.get('window').width * 0.10,
                        shadowColor: '#000',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '72%', //for center align
                        left: '85%',
                        alignSelf: 'flex-end', //for align to right
                        //alignSelf: 'center',
                    }}>
                    <MaterialIcons name="location-pin" size={30} color={Colors.pinkBuddy} />
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
                        backgroundColor: '#F0F0F0',
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                        width: Dimensions.get('window').width * 0.10,
                        height: Dimensions.get('window').width * 0.10,
                        shadowColor: '#000',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '62%', //for center align
                        left: '85%',
                        alignSelf: 'flex-end', //for align to right
                        //alignSelf: 'center',
                    }}>
                    <Feather name="edit-3" size={25} color={Colors.pinkBuddy} />
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
    pin: {
        height: 50,
        width: 50
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
