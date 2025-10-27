import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import ModalPost from '../modals/ModalPost';
import ModalWarning from '../modals/ModalWarning';
import HeaderPostList from '../../../components/elements/HeaderPostList';
import ImagePostList from '../../../components/elements/ImagePostList';
import DatePostList from '../../../components/elements/DatePostList';
import TextPostList from '../../../components/elements/TextPostList';
import LikersDisplayPostList from '../../../components/elements/LikersDisplayPostList';
import ActionContainerPostList from '../../../components/elements/ActionContainerPostList';
import EmptyListMessage from '../../../components/elements/EmptyListMessage';
import { i18n } from "../../../constants/Localization";
import Colors from '../../../constants/Colors';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';

const config = require('../../../config');
const viewabilityConfig = {
  // minimumViewTime: 2, 
  viewAreaCoveragePercentThreshold: 97, // Définir un seuil de visibilité (par exemple, 50%)
};

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const FavoriteList = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.route.params;

  const flatListRef = useRef(null);
  const [postList, setPostList] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [postItem, setPostItem] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isVideoplay, setIsVideoplay] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [postAnimalId, setPostAnimalId] = useState(false);
  const [postnumerselected, setPostnumerselected] = useState(params.postnumerselected ? params.postnumerselected : 0);
  const [modalWarning, setModalWarning] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const [visibleItemId, setVisibleItemId] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  console.log("FavoriteList Page");

  useEffect(() => {
    getAllPost();
  }, [params, isFetching, animalData, modalVisible]);


  const isTrigger = () => {
    setTrigger(false);
  };


  const getAllPost = async () => {

    if (animalData && animalData._id) {
      fetch(config.uri + 'posts/getfavoriteposts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : userData._id,
        },
        body: JSON.stringify({
          animal_id: animalData._id,
          //token: this.props.token
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setIsFetching(false);
            setPostList(res.postList);
          }
          else {
            return true;
            //alert(config.fetcherror.prbRes);
          }
        });
    }
  };




  const onRefresh = () => {
    setIsFetching(true);
    setIsVideoplay(true);
    setIsMuted(false);
    getAllPost();
  };

  const openPostModal = (item) => {
    setModalVisible(true);
    setPostItem(item);
    setPostAnimalId(item.animal_id._id)
    // this.setState({
    //   modalVisible: true,
    //   item: item,
    //   post_animal_id: item.animal_id._id,
    // });

  };

  const openWarningModal = (item) => {
    setModalWarning(true);
    setPostItem(item);
  };


  const closePostModal = () => {

    setModalVisible(false);
    setModalWarning(false);
    //setPostItem(item);
    //setPostAnimalId(item.animal_id._id)
    // this.setState({
    //   modalVisible: true,
    //   item: item,
    //   post_animal_id: item.animal_id._id,
    // });

  };

  const openDeleteModal = (item) => {
    setModalDisplay("flex");
    setItemToDelete(item);
  };

  const closeModal = () => {
    setModalDisplay("none");
  };



  const onViewableItemsChanged = useCallback(({ viewableItems, item }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems.video_id !== null) {
      setVisibleItemId(true);
    } else {
      setVisibleItemId(false);
    }
  }, [visibleItemId]);



  const renderItem = ({ item, i }) => (

    <View key={i}>
      {(item.animal_id.private === false || item.animal_id.private === null || item.animal_id.private === undefined) &&
        <View style={styles.card}>

          <HeaderPostList
            item={item}
            navigate={navigation.navigate}
            openWarningModal={() => openWarningModal(item)}
            openPostModal={() => openPostModal(item)}
            from={params.from}
          />

          <ImagePostList
            isMuted={isMuted}
            isvideoplay={visibleItemId}
            item={item}
            navigate={navigation.navigate}
            openPostModal={() => openPostModal(item)}
          />

          <ActionContainerPostList
            item={item}
            navigate={navigation.navigate}
            getAllPost={() => getAllPost()}
            from={params.from}
          />

          <TextPostList
            item={item}
            navigate={navigation.navigate}
          />

          <DatePostList
            item={item}
          />

          <LikersDisplayPostList
            item={item}
            navigate={navigation.navigate}
          />

        </View>
      }




    </View>
  );


  return (
    <View style={BDiaryStyles.container}>

<HeaderBuddyLeft 
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('favoriteList.title')}
            navigationName="User"
            navigationFrom= "User"
            goBack={true}
            />


      {(postList.length === 0) &&
        <EmptyListMessage
          text={i18n.t('Error.No_Favorites')}
        />
      }

      <View>

        {(postList.length > 0) &&
          <FlatList
            showsVerticalScrollIndicator={false}
            // ref={flatListRef}
            data={postList}
            onRefresh={() => onRefresh()}
            refreshing={isFetching}
            modalVisible={false}
            renderItem={renderItem}
            keyExtractor={(item, i) => item._id}
            onViewableItemsChanged={(item) => onViewableItemsChanged(item)}
            viewabilityConfig={viewabilityConfig}
          />
        }

        <ModalPost
          animationType="fade"
          item={postItem}
          post_animal_id={postAnimalId}
          userToken={userData._id}
          animal_id={animalData._id}
          modalVisible={modalVisible}
          navigation={navigation}
          navigateToModal="Home"
          closePostModal={closePostModal}
        />

        <ModalWarning
          isTrigger={isTrigger}
          postnumerselected={postnumerselected}
          getAllPost={getAllPost}
          animationType="fade"
          item={postItem}
          post_animal_id={postAnimalId}
          userToken={userData._id}
          animal_id={animalData._id}
          modalVisible={modalWarning}
          navigation={navigation}
          navigateToModal="Home"
          closePostModal={closePostModal}
        />

      </View>
    </View>
  );
};



const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    marginBottom: 0,
    // position:"absolute",
    zIndex: 0,
  }
});

export default FavoriteList;


