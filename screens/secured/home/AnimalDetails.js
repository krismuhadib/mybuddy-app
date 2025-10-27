import React, { useMemo, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import StarsDisplayComponent from '../../../components/elements/StarsDisplayComponent';
import CarousselAvatar from '../../../components/elements/CarousselAvatar';
import AnimalTypeOf from '../../../components/elements/AnimalTypeOf';
import AnimalGenre from '../../../components/elements/AnimalGenre';
import BuddyButton from '../../../components/elements/BuddyButton';
import BuddysContainerDetails from '../../../components/elements/BuddysContainerDetails';
import AnimalStatusDetails from '../../../components/elements/AnimalStatusDetails';
import AnimalConnectDetails from '../../../components/elements/AnimalConnectDetails';
import AnimalNameDetails from '../../../components/elements/AnimalNameDetails';
import { Post, ApiRoutes } from '../../../services/api';
import { ShowToast } from '../../../services/notification';
import { RemoveArrayId } from '../../../utils/helpers';
import SkillsDetails from '../../../components/elements/SkillsDetails';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import AlertBanner from '../../../components/elements/AlertBanner';

const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const constant = {
  nbimage: 20,
  width: ScreenWidth / 3,
  height: ScreenWidth / 3,
};

const AnimalDetails = ({ route }) => {


  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.params ? route.params : "";
  const [animalPostList, setAnimalPostList] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [animalDetails, setAnimalDetails] = useState([]);
  const [animalId, setAnimalId] = useState([]);
  const [modalBlokers, setModalBlokers] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);

  console.log("AnimalDetails");

  useEffect(() => {

    if (params.from === "Likers") {
      setAnimalId(params.item._id);
    }
    if (params.from === "SharePost") {
      setAnimalId(params.item._id);
    }
    if (params.from === "Home") {
      setAnimalId(params.item.animal_id_id);
    }
    if (params.from === "Notifications") {
      setAnimalId(params.item.sender_id);
    }
    //  setAnimalId(params?.item?.animal_id?._id || params?.item?._id);
    getAnimalDatas();
    getAnimalPosts();

  }, [params]);


  const onRefresh = () => {
    setIsFetching(true);
    getAnimalPosts();
  };


  const getAnimalDatas = async () => {

    if (params && params.from === "Notifications") {
      const postProps = {
        animal_id: params.item.sender_id
      };
      const res = await Post(ApiRoutes.animalGet, postProps);
      if (res.success) {
        setAnimalDetails(res.value);
        var idremove = res.value._id;
        var friendsArray = RemoveArrayId(idremove, res.value.friends);
        var followerssArray = RemoveArrayId(idremove, res.value.followers);
        setFriendsCount(friendsArray.length);
        setFollowersCount(res.value.followers.length);
      } else {
        ShowToast('error', i18n.t('form.error.error'), res.error,);
      }

    } else {
      const animalIDFrom = params.item.animal_id?._id || params.item._id;
      const postProps = {
        animal_id: animalIDFrom
      };

      const res = await Post(ApiRoutes.animalGet, postProps);
      if (res.success) {
        setAnimalDetails(res.value);
        var idremove = res.value._id;
        var friendsArray = RemoveArrayId(idremove, res.value.friends);
        var followerssArray = RemoveArrayId(idremove, res.value.followers);
        setFriendsCount(friendsArray.length);
        setFollowersCount(res.value.followers.length);
      } else {
        ShowToast('error', i18n.t('form.error.error'), res.error,);
      }
    }
  };

  const getAnimalPosts = async () => {

    let animalIDFrom = params.item.animal_id?._id || params.item._id;

    let postProps = {
      // user_id: params.item.animal_id.user_id._id,
      animal_id: animalIDFrom,
    };

    const res = await Post(ApiRoutes.getAnimalPost, postProps);

    if (res.success) {
      var postList = {
        postList: res.value,
      };

      const postListKey = Object.keys(res.value).map(key => ({
        key,
        ...postList.postList[key]
      }));
      //setPostList(res.value);
      setAnimalPostList(postListKey);
      setPostCount(Object.keys(res.value).length);
      setIsFetching(false);
      //  friendsNumber();
    }
  };



  const getItemLayout = (data, index) => {
    let length = ScreenWidth / 4;
    return { length, offset: length * index, index }
  };

  const SelectPost = (index) => {

    var postUpdate = [];

    postUpdate = animalPostList[index]

    navigation.navigate('PostList', {
      from: "Home",
      screen: 'PostView',
      item: params.item,
      postnumerselected: index,
      animal_id: params.item.animal_id?._id || params.item._id,
    });

  };

  const renderItem = ({ item, index }) => {

    return (
      <>
        {(animalDetails) &&
          <View>
            {(item.animal_id.status === 1 || item.animal_id.status === undefined) &&
              <TouchableOpacity
                style={{ borderWidth: 3, borderColor: "white" }}
                //underlayColor='transparent'
                onPress={() => SelectPost(index)}>

                {(item.video_id === null) &&
                  <Image
                    style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                    source={{ uri: config.linkserver + animalDetails._id + '/images/posts/small/' + item.image_id + '.jpg' }}
                  />
                }

                {(item.video_id !== null) &&
                  <Image
                    style={{ width: ScreenWidth / 3 - 6, height: ScreenWidth / 3 - 6, borderRadius: 4 }}
                    source={{ uri: config.linkserver + animalDetails._id + '/images/posts/small/' + item.video_id + '.jpg' }}
                  />
                }

              </TouchableOpacity>}
          </View>
        }
      </>
    )
  };

  const friendsNumber = () => {
    var number = animalData.friends.length - 1;
    if (number < 0) {
      setFriendsCount(0);
    } else {
      setFriendsCount(animalData.friends.length - 1);
    }
  };

  const goAlert = (item) => {
  navigation.navigate('MapScreen', {
  screen: 'AlertMapScreen',  // <-- la route dans le stack Love
});
};




  const closePostModal = () => {

    setModalWarning(false);
    //setPostItem(item);
    //setPostAnimalId(item.animal_id._id)
    // this.setState({
    //   modalVisible: true,
    //   item: item,
    //   post_animal_id: item.animal_id._id,
    // });

  };


  const HeaderComponent = useMemo(() => {

    return (
      <>
        {(animalDetails) &&
          <View>
            <View style={{ backgroundColor: "#FFF", borderWidth: 0 }}>

              {(animalDetails && animalDetails.avatars && animalDetails.avatars.length > 0) &&
              <>
                {((animalDetails.alert === true && animalDetails.alerttype === 1 || animalDetails.alerttype === 2) || animalDetails.profile === "pros") &&
                <View>
 <CarousselAvatar
                  _id={animalDetails}
                />
{(animalDetails.alerttype === 1 || animalDetails.alerttype === 2) &&
<TouchableOpacity onPress={()=> goAlert()}>
                <AlertBanner text="Cet animal a été perdu ou volé. Si vous le voyez ou le reconnaissez, contactez le propritaire" />
  </TouchableOpacity>
  }
                {/* <View style={{flex:1, height:30, backgroundColor:"red"}}>
                  <Text style={[BDiaryStyles.h4,{color: Colors.white}]}>Animal Alerte</Text>
                </View> */}

                </View>
               
               
                }
                </>
              }

              <View style={{ flex: 1, flexDirection: "row", alignContent: "space-between", alignItems: "center", justifyContent: "space-between" }}>

                <AnimalConnectDetails item={animalDetails} />

                <View style={{ flex: 1, flexDirection: "row", margin: 0, paddingLeft: 5, paddingTop: 0 }}>
                  <AnimalNameDetails
                    item={animalDetails}
                  />
                </View>

                {(animalDetails.status === 1 || animalDetails.status === undefined) &&
                  <View>
                    {/* FRIENDS & MESSAGES */}
                    {(animalData._id !== animalDetails._id) &&
                      <View style={{ borderWidth: 0, padding: 10 }}>
                        <BuddyButton
                          item={animalDetails}
                          reloadList={() => getAnimalDatas()}
                        />
                        {/* {params.from === "SearchScreenLove" &&
                      <View style={{ padding: 5, borderWidth: 0, paddingRight: 15, }}>
                        {this.MessageButtonDisplay(item.animal_id._id)}
                      </View>
                    } */}
                      </View>}
                  </View>
                }

              </View>

              <View style={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}>
                <BuddysContainerDetails
                  item={animalDetails}
                  postCount={postCount}
                  friendsCount={friendsCount}
                  followersCount={followersCount}
                />

                {(animalDetails.status === 1 || animalDetails.status === undefined) &&
                  <View style={{ borderWidth: 0, marginTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: "#fff" }}>
                    <AnimalStatusDetails
                      item={animalDetails}
                    //   openModal={openModal()}
                    />
                  </View>
                }
              </View>

              <View style={{ marginLeft: 15 }}>
                {(animalDetails.profile === "noadoption") &&
                  <>
                    <AnimalTypeOf
                      item={animalDetails}
                      params={params}
                    />
                    <AnimalGenre
                      item={animalDetails}
                      params={params}
                    />
                  </>
                }
              </View>

              {/* SKILLS BARS */}
              {(animalDetails.profile === "noadoption" || animalDetails.animaldoc?.profile === "noadoption") &&
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                  <SkillsDetails item={animalDetails} />
                </View>
              }


              {/* DESCRIPTION TXT */}
              {(animalDetails && animalDetails.description) &&
                <View style={{ borderWidth: 0, marginTop: 20, marginBottom: 20, flex: 1, marginLeft: 25, }}>
                  <Text style={{ marginRight: 15, fontSize: 14, }}>{animalDetails.description}</Text>
                </View>
              }

              {/* STAR DISPLAY */}
              {/* <View style={{ flex: 1, marginLeft: 30, paddingRight: 30, marginTop: 30 }}>
                {(animalDetails.breed !== "visitor") &&
                  <StarsDisplayComponent
                    animalData={animalDetails}
                  />
                }
              </View> */}

              {/* <View style={[styles.line_spacer]}></View> */}


              <View style={{ top: 0 }}>
                {(postCount === 0) &&
                  <View >
                    <Text style={{ textAlign: 'center', color: Colors.greyM }}>{i18n.t('Error.No_ActionPost')}</Text>
                  </View>

                }
              </View>
            </View>
          </View>
        }
      </>
    )
  });


  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, }}>
      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('animalDetails.title')}
        navigationName="User"
        navigationFrom={"User"}
        goBack={true}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.white }}
        data={animalPostList}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(_, index) => index}
        onRefresh={() => onRefresh()}
        refreshing={isFetching}
        ListHeaderComponent={HeaderComponent}
        onEndReached={() => { getAnimalPosts() }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={constant.nbimage}
        getItemLayout={getItemLayout}
      />
      
    </View>
  );
};



const styles = StyleSheet.create({

  line_spacer: {
    // height:50,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
  },
});

export default AnimalDetails;