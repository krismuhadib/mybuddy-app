import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity, Text, Dimensions, Animated, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import LoveSwap from '../../../components/elements/LoveSwap';
import { i18n } from "../../../constants/Localization";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import RowLoversAvatar from '../../../components/elements/RowLoversAvatar';
import { FormatDateToNow } from '../../../utils/helpers';
import MyFonctions from '../../../components/MyFonctions';
import ListSeparator from '../../../components/elements/ListSeparator';
import ModalWarning from '../modals/ModalWarning';
const noImg = require('../../../assets/images/logo_avatar.png');
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 80, // Définir un seuil de visibilité (par exemple, 50%)
};

const LoveMatchScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const params = route.route.params;
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [likersList, setLikersList] = useState([]);
  const [likers, setLikers] = useState([]);
  const [newLikersList, setNewLikersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [likersCount, setLikersCount] = useState(0);
  const [matchList, setMatchList] = useState([]);
  const [modalWarning, setModalWarning] = useState(false);
  const [postItem, setPostItem] = useState({});

  console.log("LoveMatchScreen");

  useEffect(() => {
    getAllLikers();
    getAllLovers();
  }, [params, animalData]);


  const onRefresh = () => {
    setIsFetching(true);
    getAllLovers();
  };

  const getAllLikers = async () => {

    setIsLoading(true);

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
          var LikerList = res;
          setLikersList(LikerList);
          setNewLikersList(res.postList);
          setIsLoading(false);
          setLikersCount(LikerList.postList.length)
          var remove_id = animalData._id;
          var lists = newLikersList.postList.filter(x => {
            return x._id != remove_id;
          })
          setNewLikersList(lists);
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success);
        }
      });
  };

  const getAllLovers = async () => {

    setIsFetching(true);

    await fetch(config.uri + 'animals/getloverslist', {
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
          setMatchList(res.postList);
          setIsFetching(false);
        }
        else {
          console.log('Prb -> getAllLovers()', res.success, res.key);
        }
      });
  };

  const renderLovers = ({ item, i }) => (
    <View key={i}>
      <View style={styles.card}>

        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: "center", flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ borderWidth: 0, padding: 10, alignItems: "center", justifyContent: 'center', alignContent: "center" }}
            onPress={() => navigation.navigate('AnimalDetailsLove', {
              navigateTo: "SearchScreenLove",
              item: item,
              item_user: item.user_id._id,// a virer
              item_animal: item._id,// a virer
            })}>

            {(item.avatars.length > 0) &&
              <Image
                source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
                size='small'
                style={[styles.avatar]}
              />
            }
            {(item.avatars.length === 0) &&
              <Image
                source={noImg}
                size='small'
                style={[styles.avatar]}
              />
            }
          </TouchableOpacity>

          <TouchableOpacity style={{ justifyContent: 'center', flex: 1, borderWidth: 0, flexDirection: "column" }}
            onPress={() => createChatRoom(item)}>
            {(item.name === animalData.name) &&
              <View>
                <Text style={{ textTransform: 'capitalize', fontWeight: "bold", fontStyle: "italic" }}>{item.name}AAAAA</Text>
                <Text style={BDiaryStyles.h5Italic}>{FormatDateToNow(item)}</Text>

                <Text style={{ color: Colors.greyM, fontSize: 12, fontStyle: "italic" }} numberOfLines={1}>{MyFonctions.ucfirst(item.lastmessage)}</Text>

              </View>
            }
            {(item.name !== animalData.name) &&
              <View>
                <Text style={{ textTransform: 'capitalize', fontWeight: "bold" }} >{item.name}</Text>
                <Text style={BDiaryStyles.h5Italic}>{FormatDateToNow(item)}</Text>

                <Text style={{ color: Colors.greyM, fontSize: 12, fontStyle: "italic" }} numberOfLines={1}>{MyFonctions.ucfirst(item.lastmessage)}</Text>
              </View>
            }
          </TouchableOpacity>

          <View style={{ justifyContent: 'center', alignContent: "flex-end", alignItems: 'flex-end' }}>

            <TouchableOpacity style={{ padding: 10 }}
              onPress={() => createChatRoom(item)}>

              <AntDesign style={{ padding: 5 }}
                color={Colors.greyM}
                name={"message"} size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 10 }}
              onPress={() => openModal(item)}>

              <AntDesign style={{ padding: 5 }}
                color={Colors.greyM}
                name={"delete"} size={20}
              />
            </TouchableOpacity>



          </View>

        </View>
      </View>
    </View>
  );

  const openModal = (item) => {
    setModalWarning(true);
    setPostItem(item);
  };

  const closeModal = () => {
    setModalWarning(false);
  };

  const goToChat = () => {
    navigation.navigate('Message', {
      screen: 'MessageListScreen',  // <-- la route dans le stack Love
    });
  };
  
  const createChatRoom = async (item) => {
    goToChat(item);
    await fetch(config.uri + 'messages/create_userchatroom', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_destinary: item._id,
        animal_destinary_age: item.age,
        animal_destinary_genre: item.genre,
        animal_destinary_typeofname: item.typeofname,
        animal_destinary_breedname: item.breedname,
        animal_destinary_avatars: item.avatars,
        animal_id: animalData._id,
        user_id: userData._id,
        destination_data: item._id,
        destination_name: item.name,
        creator_name: animalData.name,
        animal_datas: animalData,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setRoomId(res._id);
          
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success);
        }
      });

  };

  if (isLoading === true) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" color={Colors.greyM} />
      </View>
    )
  } else {

    return (

      <View style={BDiaryStyles.container}>
        <HeaderBuddyLeft
          //openModal={openModal}
          iconNameL="angle-left"
          // iconNameR="sliders"
          iconFamilyL="FontAwesome"
          label={i18n.t('loveMatch.title')}
          //iconFamilyR="FontAwesome"
          goBack={true}
          navigationName="LoveSwap"
          navigationNameR="LoveSwapSetting"
          logo={false}
        />

        <View style={{ alignContent: "center", padding: 10, alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoveSwap', {
              navigateTo: "MatchScreen",
              reload: true,
            })}
            >
            {(animalData.avatars.length === 0) &&
              <Image
                source={noImg}
                size='small'
                style={[styles.avatar, { width: 130, height: 130, borderRadius: 65, borderWidth: 1, }]}
              />
            }
            {(animalData.avatars.length > 0) &&
              <Image
                source={{ uri: config.linkserver + animalData._id + '/images/avatar/medium/' + animalData._id + '.jpg' }}
                size='small'
                style={[styles.avatar, { width: 130, height: 130, borderRadius: 65, }]}
              />
            }
          </TouchableOpacity>
          <View style={{ flexDirection: "column", alignContent: "center", alignItems: "center", justifyContent: "center", top: 5, }}>
            <Text style={{ fontStyle: "italic", fontWeight: "bold", fontSize: 15, color: Colors.greyH, textTransform: "capitalize" }}>{animalData.name}</Text>
            <Text style={{ fontStyle: "italic", fontWeight: "normal", fontSize: 12, color: Colors.greyH }}>{likersCount} {i18n.t('Page.Likers')} / {likersCount} {i18n.t('Page.Matches')}</Text>
          </View>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={[BDiaryStyles.h4, { color: Colors.pinkBuddy }]}>{i18n.t('loveMatch.myLikers')}</Text>
        </View>

        <View style={{ paddingLeft: 10, backgroundColor: Colors.white }}>
          <RowLoversAvatar
            likersList={newLikersList}
            animal={animalData}
            animalData={animalData}
            myanimal_id={animalData._id}
            myuser_id={userData._id}
            navigation={navigation}
          />
        </View>

        <View style={{ padding: 10, marginTop: 20 }}>
          <Text style={[BDiaryStyles.h4, { color: Colors.pinkBuddy }]}>{i18n.t('loveMatch.myLovers')}</Text>
        </View>

        {(!matchList) &&
          <View style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, textAlign: 'center', fontStyle: "italic", color: Colors.greyL }}>{i18n.t('Error.No_Matches')}</Text>
          </View>
        }
        <View style={{borderWidth:0}}>
          
          <FlatList
          // inverted={true}
          ItemSeparatorComponent={ListSeparator}
          data={matchList}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          renderItem={renderLovers}
          keyExtractor={(item, i) => item._id}
        />
        </View>

       

        <ModalWarning
          isTrigger={0}
          postnumerselected={0}
          getAllLovers={getAllLovers}
          animationType="fade"
          item={postItem}
          //getUserMarkers={getUserMarkers}
          post_animal_id={postItem._id}
          animal_id={animalData._id}
          modalVisible={modalWarning}
          navigation={navigation}
          navigateToModal="DeleteLover"
          closeModal={closeModal}
        />

      </View>
    );
  }
};



const styles = StyleSheet.create({

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 0,
    resizeMode: "cover",
  },

  card: {
    backgroundColor: Colors.white,
    height: 90,
    borderBottomWidth: 1,
    borderColor: Colors.greyL
  }
});

export default LoveMatchScreen;
