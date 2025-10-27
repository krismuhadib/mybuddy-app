import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SectionList, Image, FlatList, StyleSheet, View, Text, Dimensions,TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import ListSeparator from '../../../components/elements/ListSeparator';
import SearchInput from '../../../components/elements/SearchInput';
import MyFonctions from '../../../components/MyFonctions';
import config from '../../../config';
import { Ionicons } from '@expo/vector-icons';
import { RemoveItemId } from '../../../utils/helpers';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import RowProfileInfos from '../../../components/elements/RowProfileInfos';
import RowProfileDescription from '../../../components/elements/RowProfileDescription';

var noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const CreateChatRoomScreen = ({ route }) => {

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.params;
  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées
  const [friendList, setFriendList] = useState([]);
  const [animalList, setAnimalList] = useState([]);
  const [roomId, setRoomId] = useState([]);
  const [PostDatas, setPostDatas] = useState(route.params.item_message);
  
  console.log("CreateChatRoomScreen from :");

  useEffect(() => {
    getAllFriends();
    getAllAnimals();
  }, [isFetching, params,]);


  const reloadList = () => {
    setIsFetching(true);
    getAllFriends();
  };


  const getAllFriends = async () => {

    let postProps = {
      animal_id: animalData._id,
    };

    const res = await Post(ApiRoutes.friendList, postProps);

    if (res.success) {
      if (searchText === '') {
        setFilteredData(res.value);
      }
      setFriendList(RemoveItemId(animalData._id, res.value));
      setFilteredData(RemoveItemId(animalData._id, res.value));
      setIsFetching(false);

    } else {
      setFriendList(null)
      setFilteredData(null)
      // alert('Les infos User/Password sont mal remplies');
    }
  };

  const getAllAnimals = async () => {
    await fetch(config.uri + 'animals/getallanimals', {
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
          setIsFetching(false);
          setAnimalList(RemoveItemId(animalData._id, res.animalList));
        }
        else {
          alert('Prb Friends List');
        }
      });
  };

  const goToProfile = (item) => {
    navigation.navigate('AnimalDetails', {
      from: "SharePost",
      item: item,
      userToken: userData._id,
    })
  };

  const buttonSendMessage = async (item) => {
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
          navigation.navigate('MessageListScreen', {
            from: "Message",
            room_id: roomId
          });
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
        }
      });

  };

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <View style={styles.card}>
        <View style={{ height: 110, justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row', backgroundColor: "#fff", borderWidth: 0 }}>

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

              <TouchableOpacity
                onPress={() => goToProfile(item)}
                style={{ borderWidth: 0, alignContent: "flex-start", justifyContent: 'flex-start', alignItems: "flex-start" }}>

                  <View style={{ alignContent:"flex-start", alignItems:"flex-start", justifyContent:"flex-start" }}>
                    <Text style={[BDiaryStyles.h5Bold,{ textAlign:"left", textTransform: 'capitalize' }]}>{item.name}</Text>
                      <RowProfileInfos item={item} />
                      <RowProfileDescription item={item} />
                  </View>

               
              </TouchableOpacity>
              

            </View>

            <View>
              <TouchableOpacity
                onPress={() => buttonSendMessage(item)}
                style={{ borderWidth: 0, alignContent: "flex-start", justifyContent: 'flex-start', alignItems: "flex-start" }}>
                <Ionicons style={{ padding: 10, marginRight: 10, marginTop: 0 }} name="paper-plane-outline" size={20} color={Colors.greyH} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const searchFilterFunction = async (text) => {
    var textLower = text.toLowerCase();

    await fetch(config.uri + 'animals/searchanimals', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        text: textLower,
        animal_id: animalData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setIsFetching(false);
          setAnimalList(res.animalList);
        }
        else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('Prb Search Animal Friends');
        }
      })
  };

  return (
    <View style={BDiaryStyles.container}>

<HeaderBuddyLeft 
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('chatRoom.title')}
            navigationName="User"
            navigationFrom= "User"
            goBack={true}
            />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={searchFilterFunction}
          list={animalList}
        />
      </View>

      {(filteredData) &&
        <SectionList
          ItemSeparatorComponent={ListSeparator}
          sections={[
            { title: i18n.t('Page.My_Subscriptions'), data: filteredData },
            { title: i18n.t('Page.All_Animals'), data: animalList },
          ]}
          renderSectionHeader={({ section }) => (
            <Text style={[BDiaryStyles.h5Bold, { marginTop:10, color:Colors.pinkBuddy, padding:5}]}> {section.title} </Text>
          )}
          onRefresh={() => reloadList()}
          refreshing={isFetching}
          renderItem={renderItem}
          keyExtractor={(item, i) => item._id}
          style={{ backgroundColor: Colors.white }}
        />
      }

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
    backgroundColor: '#fff',
    borderColor: "#ccc"
  }
});

export default CreateChatRoomScreen;

