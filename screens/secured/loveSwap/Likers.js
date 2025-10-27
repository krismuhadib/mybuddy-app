import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import ListSeparator from '../../../components/elements/ListSeparator';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import config from '../../../config';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import { calculateAge } from '../../../utils/helpers';
import ModalWarning from '../modals/ModalWarning';
import HeartConfettiTwoColors from '../../../components/elements/HeartConfetti';


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height)
const noImg = require('../../../assets/images/logo_avatar.png');
const matchImage = require('../../../assets/images/matches.png');


const LikersScreen = ({ route }) => {

    const navigation = useNavigation();
    const userData = useSelector((state) => state.user.value ? state.user.value : null);
    const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
    const { from } = route.params.from;
    const [isFetching, setIsFetching] = useState(false);
    const [typeOf, setTypeOf] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(); // Données filtrées
    const [likerList, setLikerList] = useState([]);
    const [modalWarning, setModalWarning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [postItem, setPostItem] = useState({});
    const [matchVisible, setMatchVisible] = useState(false);
    const [notifLike, setNotifLike] = useState("");
    const [notifTitle, setNotifTitle] = useState("");
    const [active, setActive] = useState(false);
    


    console.log("LikerList");

 
    //     useEffect(() => {
    //       setTimeout(() => {
    //         displayLoveMatchAnimation();
    //       }, 5000);
    //   }, []);


    useEffect(() => {
        getAllLikers();
    }, [isFetching, typeOf, from,]);


    const reloadList = () => {
        setIsFetching(true);
        getAllLikers();
    };

    const displayLoveMatchAnimation = () => {
     setActive(true);
     setTimeout(() => {
       setActive(false);
       setMatchVisible(false);
     }, 10000);
  };


    const getAllLikers = async () => {
        if (animalData) {
            await fetch(config.uri + 'animals/getlovelikerslist', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'x-access-token' : this.state.userToken,
                },
                body: JSON.stringify({
                    user_id: userData._id,
                    animal_id: animalData._id,

                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === true) {
                        if (searchText === '') {
                            setFilteredData(res.postList);
                        }
                        setLikerList(res.postList);
                        setIsFetching(false);
                    }
                    else {
                        // console.log('ca marche PASSSS RES ?',res.success, res.key);
                        alert('Les infos User/Password sont mal remplies');
                    }
                });
        } else {
            console.log('getuserdatas / PRB USERTOKEN  ?');
        }

    };

    const deleteLiker = async () => {
        this.setState({ display: 'none' });

        fetch(config.uri + 'animals/deletelovelikers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify({
                animal_id: this.props.animal._id,
                liker_id: this.state.item._id,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    //let favorites = this.state.favorite;
                    // var count = this.state.item.likers.length;
                    // favorites[this.props.user._id] = res.favoris;
                    this.setState({
                        likerdata: res,
                        notiflike: res.notifinfo.like,
                        notiftitle: res.notifinfo.title,
                        //likers : likers
                    });
                    //this.getAnimalDatas();
                    this.getAllLikers();

                    if (likerdata.length === 0) {
                        this.props.navigation.navigate('MatchScreen', {
                            reload: true,
                        });

                    }


                }
                else {
                    alert(i18n.t('Fetch_Error.prbRes'));
                }
            });

        // setTimeout(() => {
        //   this.props.navigation.navigate('MatchScreen', {
        //     reload: true,
        //   })
        // }, 100);

    };

    const goToProfile = (item) => {
        navigation.navigate('AnimalDetails', {
            from: "LoveLikers",
            item: item,
        })

    };

    const openWarningModal = (item) => {
        setModalWarning(true);
        setPostItem(item);
    };

    const closeModal = () => {
        setModalWarning(false);
    };

    const removeLoveLiker = (item) => {
        setModalWarning(true);
        setPostItem(item);
    };

    const sendPushMatchNotification = async (item) => {

        var isavatar = animalData.avatars.length;

        try {
            const response = await fetch(config.uri + 'notifications/sendmatchnotifications', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: item._id,
                    title: "Notification Like",
                    name: animalData.name,
                    notif_message: true,
                    sender_id: animalData._id,
                    sender_avatar: isavatar,
                    language: i18n._locale,
                    originname: item.name,
                    postanimalid: item._id,
                }),
            });
            const res = await response.json();
            if (res.success) {
                // console.log("Notification envoyée avec succès !");
            } else {
                // console.log("Erreur lors de l'envoi de la notification :", res);
            }
        } catch (error) {
            console.error("Erreur fetch notification:", error);
        }
    };

    const addtoLovers = async (item, index) => {
         if (item) {
         
      try {
       
        // Send AddLoversId to array in db
        const response = await fetch(config.uri + 'animals/addlovelikers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token' : this.state.userToken,
            },
            body: JSON.stringify({
                animal_id: animalData._id,
                liker_id: item._id,
            })
        })

         const res = await response.json();

          
                if (res.success === true) {
                    setNotifLike(res.notifinfo.like);
                    setNotifTitle(res.notifinfo.title);
                    // Send Notification
                    await sendPushMatchNotification(item);
                }
                else {
                    console.log(i18n.t('Fetch_Error.prbRes'))
                }
           

        getAllLikers();
        setTimeout(() => {
            setMatchVisible(false);
        }, 2000);

        setTimeout(() => {
            navigation.navigate('LoveMatch', {
                reload: true,
            })
        }, 2000)
         } catch (error) {
        console.error('Error liking post:', error);
      
    }
         } else {
      console.log("PRB ITEM");
    }
    };


    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{ justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <TouchableOpacity
                    style={{
                        borderWidth: 0, borderColor: Colors.white, margin: 10, shadowColor: Colors.black,
                        shadowOffset: { width: 3, height: 3 },
                        shadowOpacity: 0.4,
                        shadowRadius: 3,
                    }}
                    //underlayColor='transparent'
                    onPress={() => goToProfile(item)}>

                    {(item.avatars.length > 0) &&
                        <Image
                            style={{ position: "relative", resizeMode: "cover", borderWidth: 0, borderRadius: 22, justifyContent: "center", alignItems: "center", alignContent: "center", width: ScreenWidth / 2.2, height: ScreenWidth / 1.6 - 10, }}
                            source={{ uri: config.linkserver + item._id + '/images/avatar/medium/' + item._id + '.jpg' }}>
                        </Image>
                    }
                    {(item.avatars.length === 0) &&
                        <Image
                            style={{ backgroundColor: Colors.black, position: "relative", resizeMode: "cover", borderWidth: 0, borderRadius: 22, justifyContent: "center", alignItems: "center", alignContent: "center", width: ScreenWidth / 2.2, height: ScreenWidth / 1.6 - 10, }}
                            source={noImg}>
                        </Image>
                    }
                    <Text style={{ position: "absolute", paddingLeft: 10, textTransform: "capitalize", fontWeight:"bold", color: Colors.white, top: 10, fontSize: 18, justifyContent: "flex-start", alignSelf: "flex-start", alignContent: "flex-start" }}>{item.name}</Text>

                    {(item.birthday) &&
                        <Text style={{ position: "absolute", paddingLeft:10, color: Colors.white, top: 30, fontSize: 15, justifyContent: "flex-start", alignSelf: "flex-start", alignContent: "flex-start" }}>{calculateAge(item.birthday)} {i18n.t('Page.Years')}</Text>
                    }

                </TouchableOpacity>


                <View style={{
                    borderWidth: 0, width: ScreenWidth / 2.4, position: "absolute", bottom: 20,
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignContent: "space-between", alignItems: "center", justifyContent: "space-between"
                    }}>

                        <Ionicons style={{ padding: 0, }}
                            color="white"
                            name='heart-dislike-outline'
                            size={30}
                            onPress={() => removeLoveLiker(item)}
                        />

                        {(!item.lovers.includes(animalData._id)) &&
                            <Ionicons style={{ padding: 0, }}
                                color="red"
                                name='heart'
                                size={30}
                                onPress={() => addtoLovers(item, index)} />
                        }

                    </View>
                </View>

                <ModalWarning
                    isTrigger={0}
                    postnumerselected={0}
                    getAllLikers={getAllLikers}
                    animationType="fade"
                    item={postItem}
                    //getUserMarkers={getUserMarkers}
                    post_animal_id={postItem._id}
                    animal_id={animalData._id}
                    modalVisible={modalWarning}
                    navigation={navigation}
                    navigateToModal="Love"
                    closeModal={closeModal}
                />

            </View>
        )
    };

    const renderItemAAA = ({ item, i }) => (
        <View key={i}>
            <View style={BDiaryStyles.card}>
                <View style={{ height: 110, justifyContent: 'center' }}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ borderWidth: 0, justifyContent: 'flex-start', paddingLeft: 10 }}>
                            {(item.avatars.length === 0) &&
                                <View style={{ borderWidth: 0, justifyContent: 'flex-start', alignContent: 'flex-start', paddingLeft: 0, paddingRight: 0 }}>
                                    <TouchableOpacity
                                        onPress={() => goToProfile(item)}>
                                        <Image source={noImg} style={[styles.avatar, { marginLeft: 0, borderWidth: 1, }]} />

                                    </TouchableOpacity>
                                </View>
                            }
                            {(item.avatars.length > 0) &&
                                <TouchableOpacity
                                    onPress={() => goToProfile(item)}>
                                    <View
                                    >
                                        <Image
                                            source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                                            size='small'
                                            style={styles.avatar}
                                        />
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ borderWidth: 0, flex: 1, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", paddingLeft: 10, }}>
                            <View style={{ alignContent: "flex-start", flexDirection: "row", justifyContent: 'flex-start', }}>
                                <View style={{ borderWidth: 0, flex: 1, }}>
                                    <Text style={{ textTransform: 'capitalize' }}>{item.name}</Text>
                                    {(item.breedname !== "visitor") &&

                                        <View style={{ flexDirection: "row", justifyContent: 'flex-start', borderWidth: 0 }}>
                                            <View>
                                                <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.typeofname}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'capitalize', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.breedname}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ paddingRight: 5, textAlign: "right", textTransform: "capitalize", fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.genre}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ paddingRight: 5, textAlign: "right", textTransform: 'none', fontSize: 10, color: Colors.greyM, fontStyle: "italic" }}>{item.age} {i18n.t('Page.Age')}</Text>
                                            </View>
                                        </View>
                                    }
                                </View>

                                <BuddyButton
                                    item={item}
                                    reloadList={() => getAllLikers()}
                                />

                            </View>
                            <View style={{ top: 10, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, marginRight: 20 }}>
                                <Text style={{ paddingRight: 20, fontSize: 12, color: Colors.greyM, fontStyle: "italic" }} numberOfLines={3}>{item.description}{"\n"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const filterData = (text) => {
        setSearchText(text);
        const filteredData = likerList.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filteredData);
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredData(likerList);
        } else {
            filterData(text);
        }
    };

    return (
        <View style={[BDiaryStyles.container]}>

            <HeaderBuddyLeft
                // openModal={openModal}
                iconNameL="angle-left"
                //iconNameR="ellipsis-vertical-sharp"
                iconFamilyL="FontAwesome"
                //iconFamilyR="Ionicons"
                label={i18n.t('loveLikers.title')}
                navigationName="User"
                navigationFrom="User"
                goBack={true}
            />

            <View style={{ width: ScreenWidth }}>
                <SearchInput
                placeholder={i18n.t('species.search')}
                functionProp={handleSearchChange}
                list={likerList}
                />
            </View>
            {(likerList.length == 0) &&
                <EmptyListMessage
                    text={i18n.t('Error.NoLikers')}
                />
            }

            {(likerList) &&
                <>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            onRefresh={() => reloadList()}
                            refreshing={isFetching}
                            keyExtractor={(item, i) => item._id}
                            // extraData={this.state}
                            data={filteredData}
                            //ItemSeparatorComponent={ListSeparator}
                            renderItem={renderItem}
                        />
                    </View>

                </>
            }


            {(!matchVisible) &&
                  <View style={{  position:"absolute", zIndex:100, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <HeartConfettiTwoColors
                    active={active}
                    fadeDuration={500}  // durée du fondu in/out
                    speed="fast"         // "slow" | "normal" | "fast"
                    count={30}           // nombre de cœurs à l’écran
                    />
             </View>
             }
                   
            {(matchVisible === true) &&
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', height: ScreenHeight, width: ScreenWidth, position: "absolute" }}>
                    <Image
                        style={[styles.matchImage, { zIndex: 1, position: "absolute" }]}
                        source={matchImage} />
                </View>
            }

        </View>
    );
};


const styles = StyleSheet.create({
    image: {
        width: 400,
        height: 180,
        resizeMode: "cover",
    },
    matchImage: {
        width: ScreenWidth,
        height: ScreenHeight,
        resizeMode: "cover",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    card: {
        backgroundColor: Colors.background,
        //marginBottom: 25,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },

});

export default LikersScreen;


