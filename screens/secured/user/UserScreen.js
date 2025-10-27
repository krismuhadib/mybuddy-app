import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, FlatList, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import myBuddyStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import { useDispatch } from "react-redux";
import { ApiRoutes, Post} from '../../../services/api';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import CarousselAvatar from '../../../components/elements/CarousselAvatar';
import Layout from '../../../constants/Layout';
import ModalMenuSettings from '../../../components/modal/ModalMenuSettings';
import { useModal } from '../../../components/modal/modalContext';
import BuddysContainerDetails from '../../../components/elements/BuddysContainerDetails';
import AnimalStatusDetails from '../../../components/elements/AnimalStatusDetails';
import AnimalConnectDetails from '../../../components/elements/AnimalConnectDetails';
import AnimalNameDetails from '../../../components/elements/AnimalNameDetails';
import AnimalTypeOf from '../../../components/elements/AnimalTypeOf';
import AnimalGenre from '../../../components/elements/AnimalGenre';
import { RemoveArrayId } from '../../../utils/helpers';
import { CapitalizeFirstLetter, myLocalisation } from '../../../utils/helpers';
import SkillsDetails from '../../../components/elements/SkillsDetails';
import HeaderBuddyPrimary from '../../../components/elements/HeaderBuddyPrimary';


const noImg = require('../../../assets/images/no_img.png');
const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const UserScreen = (route) => {

  const constant = {
    nbimage: 20,
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
  };

  const params = route.route.params;
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [genre, setGenre] = useState(animalData ? animalData.genre : '');
  const { modalVisible, setModalVisible } = useModal();
  const [postList, setPostList] = useState([]);
  const [animalPostList, setAnimalPostList] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [weight, setWeight] = useState("10");
  
  console.log("UserScreen");


  useEffect(() => {
    getAnimalDatas();
    getAnimalPosts();
  }, [params, animalData]);


  const onRefresh = () => {
    setIsFetching(true);
    getAnimalPosts();
  };

  const getAnimalDatas = async () => {

    let postProps = {
      animal_id: animalData._id,
    };
    const res = await Post(ApiRoutes.animalGet, postProps);
    if (res.success) {

      setFriendsCount(RemoveArrayId(animalData._id, res.value.friends));
      setFollowersCount(RemoveArrayId(animalData._id, res.value.followers));


    } else {
      ShowToast('error', i18n.t('form.error.error'), res.error,);
    }
  };


  const _onClose = () => {
    setModalVisible(false)
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const GoToProfileScreen = () => {
    setModalVisible(false);
    navigation.navigate('ProfileScreen')
  };

  const GoToAvatarScreen = () => {
    navigation.navigate('AvatarFullSize', {
      animal_id: animalData._id,
      animal_avatars: animalData.avatars
    })
  };

  const GotoPetProfile = () => {
    setModalVisible(false);

    if (animalData.profile !== "visitor") {
      navigation.navigate('ChangeProfile', {
        from: "change",
        specify: CapitalizeFirstLetter(
          animalData.profile
        ),
        modalPostActionVisible: false,
        modalMenuSetting: false,
      });

    } else {
      //console.log("CapitalizeFirstLetter(animalData.profile),",animalData.profile ? animalData.animaldoc.profile : animalData.profile)
      navigation.navigate('ChangeProfile', {
        from: "change",
        specify: CapitalizeFirstLetter(
          animalData.profile
        ),
        modalPostActionVisible: false,
        modalMenuSetting: false,

      });

    }
  };

  const getAnimalPosts = async () => {
    fetch(config.uri + 'posts/getanimalposts', {
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
          var postList = {
            postList: res.postList,

          };
          const postListKey = Object.keys(postList.postList).map(key => ({
            key,
            ...postList.postList[key]
          }));
          setPostList(res.postList);
          setAnimalPostList(postListKey);
          setPostCount(Object.keys(res.postList).length);
          setIsFetching(false);
          //  friendsNumber();
        } else {
          alert('Backend Failure');
        }
      });
  };

  const getItemLayout = (data, index) => {
    let length = Layout.window.width / 4;
    return { length, offset: length * index, index }
  };

  const SelectPost = (index) => {

    var postUpdate = [];

    postUpdate = animalPostList[index]

    navigation.navigate('UserPostList', {
      title: animalData.name + " Publications",
      from: "User",
      screen: 'PostView',
      // item: item,
      postnumerselected: index,
      animal_id: animalData._id,
    });

  };


  const renderItem = ({ item, index }) => {


    return (

      <>
        {(animalData) &&
          <View>
            {(animalData.status === 1 || animalData.status === undefined) &&
              <TouchableOpacity
                style={{ borderWidth: 3, borderColor: "white" }}
                //underlayColor='transparent'
                onPress={() => SelectPost(index)}
              >

                {(item.video_id === null) &&

                  <Image
                    style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                    source={{ uri: config.linkserver + animalData._id + '/images/posts/small/' + item.image_id + '.jpg' }}
                  />}

                {(item.video_id !== null) &&

                  <Image
                    style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                    source={{ uri: config.linkserver + animalData._id + '/images/posts/small/' + item.video_id + '.jpg' }}
                  />}

              </TouchableOpacity>}
          </View>
        }
      </>
    )
  };


  const HeaderComponent = () => {

    if (animalData) {

      return (

        <View>
          <View style={{ backgroundColor: "#FFF", borderWidth: 0 }}>
            {/* Bloc Avatar + infos  */}
            {(animalData && animalData.avatars && animalData.avatars.length > 0) &&
              <>
                {(animalData.profile === "pros") &&
                  <CarousselAvatar
                    _id={animalData}
                  />
                }
              </>
            }
            {(animalData) &&
              <View style={{ flex: 1, marginTop: 0, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>
                
                <View style={{ flexDirection: "row", borderWidth: 0 }}>

                  <View style={{ flex: 1, flexDirection: "column", borderWidth: 0 }}>

                    <AnimalConnectDetails item={animalData} />

                    <TouchableOpacity style={{ paddingLeft: 5, paddingTop: 0 }}
                      onPress={() => GoToAvatarScreen()}>
                      <AnimalNameDetails
                        item={animalData}
                      />
                    </TouchableOpacity>

                    <View style={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}>

                      <BuddysContainerDetails
                        item={animalData}
                        postCount={postCount}
                        friendsCount={friendsCount.length}
                        followersCount={followersCount.length}
                      />

                      {(animalData.status === 1 || animalData.status === undefined) &&
                        <View style={{ borderWidth: 0, marginTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>
                          <AnimalStatusDetails
                            item={animalData}
                          />
                        </View>
                      }

                      {/* <View style={{ marginLeft: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 0 }}>
                      {(animalData.city) &&
                      <View style={{ flexDirection: 'row', alignItems: 'center',  alignContent:"center", justifyContent: 'flex-start', borderWidth: 1 }}>
                      <Feather name="map-pin" size={27} color="red" />
                        <Text style={{ paddingLeft: 20, fontSize: 13, fontStyle: 'normal', fontWeight: 'normal', textTransform: "capitalize" }}>{animalData.city} - {animalData.zipcode}</Text>
                      </View>}
                      </View> */}

                    </View>

                    <View style={{ width: "100%", marginLeft: 10 }}>
                      {(animalData.profile === "noadoption") &&
                        <AnimalTypeOf
                          item={animalData}
                        // params={from}
                        />
                      }

                      {(animalData.profile === "noadoption" || animalData.animaldoc?.profile === "noadoption") &&
                        <AnimalGenre
                          item={animalData}
                        //  params={params}
                        />
                      }
                    </View>

                  </View>

                  <View style={{ flexDirection: "column", height: 100, borderWidth: 0, margin: 0, padding: 15, paddingTop: 10 }}>
                    <TouchableOpacity style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      width: 40,
                      height: 40,
                      backgroundColor: "white",
                      // shadowColor: '#000',
                      //shadowOffset: {
                      //width: 2,
                      //height:8,
                      // },
                      //shadowOpacity: 0.36,
                      //shadowRadius:6.68
                    }}
                      onPress={() => { GotoPetProfile() }}>
                      <MaterialIcons name="edit" size={25} color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ justifyContent: "center" }}></MaterialIcons>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      marginTop: 10,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      width: 40,
                      height: 40,
                      backgroundColor: "white",
                      // shadowColor: '#000',
                      //shadowOffset: {
                      //width: 2,
                      //height:8,
                      // },
                      //shadowOpacity: 0.36,
                      //shadowRadius:6.68
                    }}
                      onPress={() => { navigation.navigate('UserAddPicture', {from: "User"})}}>
                      <MaterialIcons name="photo-camera" size={25} color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ justifyContent: "center" }}></MaterialIcons>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            }

            {/* <View style={{ flex: 1, marginLeft: 30, paddingRight: 30, marginTop: 30 }}>
              {(animalData.breed !== "visitor") &&
                <StarsDisplayComponent
                  animalData={animalData}
                />
              }
            </View> */}

          </View>



          {/* SKILLS BARS */}
          {(animalData.profile === "noadoption" || animalData.animaldoc?.profile === "noadoption") &&
            <View style={{ borderWidth: 0, marginTop: 10, marginBottom: 25 }}>
              <SkillsDetails item={animalData} />
            </View>
          }

          {/* DESCRIPTION TXT */}
          {(animalData && animalData.description) &&
            <View style={{ borderWidth: 0, marginTop: 0, marginBottom: 30, flex: 1, marginLeft: 25, }}>
              <Text style={{ marginRight: 15, fontSize: 14, }}>{animalData.description}</Text>
            </View>
          }

          {/* <View style={[myBuddyStyles.line_spacer]}></View> */}


          <View>
            {(postCount === 0) &&
              <EmptyListMessage
                text={i18n.t('user.noPosts')}
              />
            }
          </View>
        </View>
      )
    } else {
      return null
    }
  };

  return (
    <View style={myBuddyStyles.container}>
      < HeaderBuddyPrimary
        openModal={openModal}
        iconNameL="pricetag-outline"
        iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="Ionicons"
        iconFamilyR="Ionicons"
        navigationName="BookmarkList"
        logo={true}
      />

      <FlatList
        style={{ backgroundColor: Colors.white }}
        showsVerticalScrollIndicator={false}
        data={animalPostList}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(_, index) => index}
        onRefresh={() => onRefresh()}
        refreshing={isFetching}
        //extraData={this.state}
        ListHeaderComponent={HeaderComponent}
        onEndReached={() => { getAnimalPosts() }}
        onEndReachedThreshold={0.5}
        // ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={constant.nbimage}
        getItemLayout={getItemLayout}
      />

      {/* Bloc Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={[styles.modal]}>
            <ModalMenuSettings
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              _onClose={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      {/* End Bloc Modal */}

    </View>
  );
};



const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modal: {
    width: ScreenWidth -40,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
    //height: ScreenHeight / 1.6,
    borderRadius: 18
  },

  line_spacer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1
  },
});

export default UserScreen;