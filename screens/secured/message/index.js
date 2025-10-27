import React, { useEffect, useState, useRef, } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, FlatList, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import ListSeparator from '../../../components/elements/ListSeparator';
import { Feather, Ionicons } from '@expo/vector-icons';
import SearchInput from '../../../components/elements/SearchInput';
import BuddyButton from '../../../components/elements/BuddyButton';
import config from '../../../config';
import { FormatDateToNow } from '../../../utils/helpers';
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import HeaderBuddyPrimary from '../../../components/elements/HeaderBuddyPrimary';
const noImg = require('../../../assets/images/logo_avatar.png');


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const MessageScreen = ({ route }) => {

  // User Redux Store Data
  const navigation = useNavigation();

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.params;

  console.log("MessageScreen");

  const [messageList, setMessageList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(); // Données filtrées
  const [likerList, setLikerList] = useState([]);

  useEffect(() => {
    getAllChatUsers();
  }, [isFetching, animalData, params]);

  const getAllChatUsers = () => {
    fetch(config.uri + 'messages/getuserschatroom', {
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
          var postList = res.postList;
          setMessageList(postList);
          setIsFetching(false);
        }
        else {
          setMessageList(null);
        }
      });
  };

  const reloadList = () => {
    setIsFetching(true);
    getAllChatUsers();
  };


  const IsAnimalAvatar = async () => {
    fetch(config.uri + 'animals/isanimalavatar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animal_destinary,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          // var postList = res.postList;
          // //var userfavorites = res.userfavorites;
          // //var favorites = res.favoris;
          // setMessageList(postList);
          // setIsFetching(false);
        }
        else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('Les infos User/Password sont mal remplies');
        }
      });
  };

  const getAllLikers = async () => {
    if (animalData) {
      await fetch(config.uri + 'animals/getalllikers', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          user_id: userData._id,
          animal_id: animalData._id,
          favorites: item.favorites,
          token: userData._id,
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

  const goToProfile = (item) => {

    navigation.navigate('AnimalDetails', {
      from: "Likers",
      item: item,
      userToken: userData._id,

    })


  };


  const deleteChatRoom = async (item) => {

    await fetch(config.uri + 'messages/deletanimal', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: item.destinary,
        room_id: item._id,
        animal_id: animalData._id,

      })
    })
      .then((response) => response.json())
      .then((res) => {

        if (res.success === true) {
          getAllChatUsers();
        }
        else {
          getAllChatUsers();

          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });

  };

  const LeftActions = (progress, dragX) => {
  };

  const RightActions = ({ item, closeSwipeable }) => {
    if (item) {
      return (
        <RectButton style={styles.rightAction}
          onPress={() => {
            closeSwipeable();
            deleteChatRoom(item);
          }}>
          <Text style={styles.actionText}>{i18n.t('Form.Delete')}</Text>
          <Feather style={{ padding: 5 }}
            color={Colors.red}
            name="trash" size={25}
          />
        </RectButton>
      )
    } else {
      return null
    }
  };

  const sendMessage = (item) => {
    navigation.navigate('ChatMessageNoPosts', {
      from: "Message",
      screen: 'MessageScreen',
      post_datas: item,
      sendPostData: item,
      //notificationtoken: item.user_id.notificationtoken,
      room_id: item._id,
      animal_name: item.name,
      animal_destinary: item.destinary,
      item_message: null,
      title: item.name
    });

  };

  const SwipeableRow = ({ item, i }) => {

    const swipeableRef = useRef(null);
    const closeSwipeable = () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };

    var bgColor = Colors.white;

    if (item.lastmessage === undefined) {
      bgColor = Colors.greenBuddyL;


    }

    // Check id in talkers to display picture avatar
    const ids = item.talkers;
    const filteredId = ids.filter(id => id !== animalData._id);

    if (item) {
      return (
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
            <View style={[styles.card, { backgroundColor: bgColor }]}>
              <View style={{ height: 80, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => { sendMessage(item) }} style={{ flexDirection: 'row' }}>
                  <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10 }}>
                    <View style={styles.avatarPlaceholder}>

                      {(item.animal_datas && item.animal_datas._id !== animalData._id) &&
                        <View>
                          {(item.animal_datas.avatars.length > 0) &&
                          <Image
                              source={{ uri: config.linkserver + item.animal_datas._id + '/images/avatar/small/' + filteredId + '.jpg' }}
                              style={styles.avatar}
                            />
                            }
                          {(item.animal_datas.avatars.length === 0) &&
                            <Image
                              source={noImg}
                              style={[styles.avatar, { borderWidth: 0 }]}
                            />}
                        </View>
                      }

                      {(item.animal_datas && item.animal_datas._id === animalData._id) &&
                        <View>
                          {(item.animal_destinary_avatars.length > 0) &&
                            <Image
                              source={{ uri: config.linkserver + filteredId + '/images/avatar/small/' + filteredId + '.jpg' }}
                              style={styles.avatar}
                            />}
                          {(item.animal_destinary_avatars.length === 0) &&
                            <Image
                              source={noImg}
                              style={[styles.avatar, { borderWidth: 0 }]}
                            />}
                        </View>
                      }
                    </View>
                  </View>

                  <View style={{ justifyContent: 'center', flexDirection: "column" }}>
                    {(item.destinary === animalData._id) &&
                      <View>
                        <Text style={[BDiaryStyles.h4,{  }]}>{item.creator_name}</Text>
                      </View>}

                    {(item.destinary !== animalData._id) &&
                      <View>
                        <Text style={[BDiaryStyles.h4,{  }]}>{item.name}</Text>
                      </View>}

                    {(item.isdeleted.length > 0) &&
                      <View>
                        <Text style={[BDiaryStyles.h5, { color: Colors.greyM }]}>{i18n.t('messages.deletedRoom')}</Text>
                      </View>
                    }
                    {(item.isdeleted.length === 0) &&
                      <View>
                        <Text style={[BDiaryStyles.h6,{
                          width: ScreenWidth - 180,
                          color: Colors.greyM
                        }]}
                          numberOfLines={2}>{item.lastmessage}</Text>
                      </View>
                    }



                  </View>
                  <View style={{ justifyContent: 'flex-end', flexDirection: 'row', borderWidth: 0, flex: 1, alignItems: 'center' }}>
                    <View style={{ padding: 10 }}>
                      <Text style={[BDiaryStyles.h6,{color:Colors.greyL}]}>{FormatDateToNow(item)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ paddingLeft: 10 }}>
              </View>
            </View>
          </View>

        </Swipeable>
      );
    }
  };

  const renderItem = ({ item, i }) => (
    <View key={i}>
      <TouchableOpacity onPress={() => { this.SendMessage(item) }}>

        <View style={styles.card}>
          <View style={{ height: 80, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderWidth: 0, justifyContent: 'center', padding: 10 }}>
                <View style={styles.avatarPlaceholder}>



                  {(item.destinary !== userData._id) &&
                    <Image
                      source={{ uri: config.linkserver + item.destinary + '/images/avatar/' + item.destinary + '.jpg' }}
                      size='small'
                      style={styles.avatar}
                    />}

                  {(item.destinary === userData._id) &&
                    <Image
                      source={{ uri: config.linkserver + item.user_id._id + '/images/avatar/' + item.user_id._id + '.jpg' }}
                      size='small'
                      style={styles.avatar}
                    />}
                </View>
              </View>

              <View style={{ justifyContent: 'center', flexDirection: "column" }}>
                {(item.name === animalData.name) &&
                  <View>
                    <Text style={{  }}>{item.user_name}</Text>
                  </View>}

                {(item.name !== animalData.name) &&
                  <View>
                    <Text style={{  }}>{item.name}</Text>
                  </View>}

                <View>
                  <Text style={{
                    fontWeight: 'normal',
                    width: ScreenWidth - 180,
                    fontSize: 13,
                    color: Colors.greyM
                  }}
                    numberOfLines={1}>{item.lastmessage}</Text>
                </View>
              </View>
              <View style={{ justifyContent: 'flex-end', flexDirection: 'row', borderWidth: 0, flex: 1, alignItems: 'center' }}>

                <View style={{ padding: 10 }}>
                  <Text style={{}}>{FormatDateToNow(item)}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 10 }}>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const filterData = (text) => {
    setSearchText(text);
    const filteredData = messageList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredData(messageList);
    } else {
      filterData(text);
    }
  };



  return (
    <View style={[BDiaryStyles.container, { backgroundColor: Colors.white }]}>

      < HeaderBuddyPrimary
        //openModal={openModal}
        // iconNameL="camera"
        iconNameR="add"
        // iconFamilyL="Feather"
        iconFamilyR="Ionicons"
        // navigationName="MediaPost"
        navigationNameR="CreateChatRoom"
        navigationFromR='message'
        logo={true}
      />

      <View style={{ width: ScreenWidth }}>
        <SearchInput
          placeholder={i18n.t('species.search')}
          functionProp={handleSearchChange}
          list={likerList}
        /> 
      </View>

      {(messageList && messageList.length === 0) &&
        <EmptyListMessage
          text={i18n.t('Error.NoMessages')}
        />
      }

      {(messageList) &&

        <GestureHandlerRootView style={{ flex: 1, top: 10 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            // inverted={true}
            data={messageList}
            onRefresh={() => (reloadList())}
            refreshing={isFetching}
            //extraData={this.state}
            //renderItem={renderItem}
            renderItem={({ item, i }) => <SwipeableRow item={item} i={i} />}
            keyExtractor={(item, i) => item._id}
            ItemSeparatorComponent={ListSeparator}
          />

        </GestureHandlerRootView>
      }
    </View>
  );
};


const styles = StyleSheet.create({

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: Colors.red,
    fontSize: 12,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    backgroundColor: Colors.greyUL,
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    // flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  card: {
    backgroundColor: Colors.white,
    borderColor: "#ccc"
  },
});

export default MessageScreen;


