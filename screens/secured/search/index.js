import React, { useMemo, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import SearchInput from '../../../components/elements/SearchInput';
import RadioGroup from 'react-native-radio-buttons-group';
import HeaderBuddyPrimary from '../../../components/elements/HeaderBuddyPrimary';

import config from '../../../config';
var noImg = require('../../../assets/images/logo_avatar.png');


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const SearchScreen = ({ route }) => {
    const constant = {
        nbimage: 20,
        width: ScreenWidth / 3,
        height: ScreenHeight / 3,
    };
    const navigation = useNavigation();
    const userData = useSelector((state) => state.user.value ? state.user.value : null);
    const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
    const [speciesList, setSpeciesList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [typeOf, setTypeOf] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(); // Données filtrées
    const [likerList, setLikerList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [postListCount, setPostListCount] = useState([]);
    const [selected, setSelected] = useState("");
    const [genre, setGenre] = useState(animalData ? animalData.genre : animalData.genre);
    const [placeholder, setPlaceholder] = useState(i18n.t('Page.Add_Comments'));
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [searchPosition, setSearchPosition] = useState("absolute");
    const [searchColor, setSearchColor] = useState("rgba(255,255,255,0.1)");

    console.log("SearchScreen");

    useEffect(() => {
        getAllPosts();
    }, []);

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
    //         setKeyboardOpen(true);
    //         setPlaceholder(i18n.t('Page.Add_Comments'));
    //         setSearchColor("rgba(255,255,255,1)");
    //         setSearchPosition("relative")

    //     });

    //     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    //         setKeyboardOpen(false);
    //         setPlaceholder(i18n.t('Page.Add_Comments'));
    //         setSearchColor("rgba(255,255,255,0.1)");
    //         setSearchPosition("absolute")

    //     });


    //     // Nettoyage
    //     return () => {
    //         keyboardDidShowListener.remove();
    //         keyboardDidHideListener.remove();

    //     };
    // }, [placeholder]);


    const reloadList = () => {
        setIsFetching(true);
        getAllPosts();
    };

    const getAllPosts = async () => {
        setIsFetching(true);
        await fetch(config.uri + 'posts/getallpost', {
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
                    var postList = res;
                    setPostListCount(Object.keys(postList.postList).length);
                    const postListKey = Object.keys(postList.postList).map(key => ({
                        key,
                        ...postList.postList[key]
                    }));
                    setPostList(postListKey);

                    if (searchText === '') {
                        setFilteredData(postListKey);
                    }
                    setIsFetching(false);
                } else {
                    alert('Probleme avec backend getuserdatas');
                }
            });

    };


    const goToProfile = (item) => {

        navigation.navigate('AnimalDetails', {
            from: "FriendList",
            item: item,
            userToken: userData._id,

        })


    };

    const SelectPost = (index, item) => {
        navigation.navigate('AddComment', {
            navigateTo: "SearchScreen",
            screen: 'AnimalDetails',
            postUpdate: index,
            item_user: index.user_id._id,// a virer
            item_animal: index.animal_id._id,// a virer
            item: index,
            // postnumerselected: index,
            otherParam: 'anything you wxxxxxxant here',
        });
    };

    const getItemLayout = (data, index) => {
        let length = ScreenWidth / 4;
        return { length, offset: length * index, index }
    };


    const renderItem = ({ item, index }) => {

        return (

            <View>
                {(item.animal_id.status === 1 && item.animal_id.private === false || item.animal_id.private === null) &&

                    <TouchableOpacity
                        style={{ borderWidth: 3, borderColor: "white" }}
                        //underlayColor='transparent'
                        onPress={() => SelectPost(item)}
                    >

                        {(item.video_id === null) &&
                            <Image
                                style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                                source={{ uri: config.linkserver + item.animal_id._id + '/images/posts/small/' + item.image_id + '.jpg' }}
                            />}

                        {(item.video_id !== null) &&
                            <Image
                                style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                                source={{ uri: config.linkserver + item.animal_id._id + '/images/posts/small/' + item.video_id + '.jpg' }}
                            />}

                    </TouchableOpacity>

                }
            </View>
        )
    };

    const filterData = (text) => {

        console.log("genre", genre)

        setSearchText(text);
        const filteredData = postList.filter(item => {
            const itemData = `${item.animal_id.typeofname.toLowerCase()} +
            ${item.comment.toLowerCase()} +
            ${item.animal_id.breedname.toLowerCase()} +
            ${item.animal_id._id} +
            ${item.animal_id.name.toLowerCase()}`;
            const textData = text.toLowerCase();
            return itemData.includes(textData);
        });
        setFilteredData(filteredData);
        getAllPosts();
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredData(postList);
        } else {
            filterData(text);
        }
    };

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

    return (
        <View style={BDiaryStyles.container}>

 < HeaderBuddyPrimary
        //openModal={openModal}
        // iconNameL="camera"
        //iconNameR="add"
        // iconFamilyL="Feather"
        //iconFamilyR="Ionicons"
        // navigationName="MediaPost"
       // navigationNameR="CreateChatRoom"
       // navigationFromR='message'
        logo={true}
      />
            

            {/* SearchInput en overlay */}
            <View
                style={{
                    marginTop:90,
                    position: searchPosition, //"relative"
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    backgroundColor: searchColor,
                    padding: 0,
                }}
            >
                <SearchInput
                    placeholder={i18n.t("species.search")}
                    functionProp={handleSearchChange}
                    list={likerList}
                />

                {(keyboardOpen) &&
                    <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", marginTop: 0, borderWidth: 0 }}>
                        <RadioGroup
                            buttonColor={Colors.greyH}
                            radioButtons={genderItems}
                            onPress={setGenre}
                            selectedId={genre}
                            borderColor={'#000'}
                            color={Colors.greyM}
                            borderSize={10}
                            labelHorizontal={true}
                            layout={'row'}
                            labelStyle={BDiaryStyles.radioGrouplabelStyle}
                            containerStyle={BDiaryStyles.radioGroupContainer}
                        />
                    </View>
                }
            </View>

            {/* FlatList en dessous */}
            <FlatList
                contentContainerStyle={{ marginTop: 0 }} // hauteur du SearchInput
                showsVerticalScrollIndicator={false}
                data={filteredData}
                numColumns={3}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${index}`}
                onRefresh={reloadList}
                refreshing={isFetching}
                initialNumToRender={constant.nbimage}
                getItemLayout={getItemLayout}
            />
        </View>
    );
};


const styles = StyleSheet.create({

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

export default SearchScreen;


