import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Linking, Platform, BackHandler, Pressable, Modal, Dimensions, Text, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import ModalPost from '../modals/ModalPost';
import HeaderPostList from '../../../components/elements/HeaderPostList';
import ImagePostList from '../../../components/elements/ImagePostList';
import DatePostList from '../../../components/elements/DatePostList';
import TextPostList from '../../../components/elements/TextPostList';
import LikersDisplayPostList from '../../../components/elements/LikersDisplayPostList';
import ActionContainerPostList from '../../../components/elements/ActionContainerPostList';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import HeaderBuddyPrimary from '../../../components/elements/HeaderBuddyPrimary';
import Colors from '../../../constants/Colors';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { i18n } from "../../../constants/Localization";
import ConfettiAnimation from '../../../components/elements/ConfettiAnimation';
import EmojiConfetti from '../../../components/elements/EmojiConfetti';
import ModalWarning from '../modals/ModalWarning';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import FullScreenVideo from '../../../components/elements/FullScreenVideo';


const config = require('../../../config');
const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 80, // Définir un seuil de visibilité (par exemple, 50%)
};

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const WallScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [loading, setLoading] = useState(false);
  const params = route.route.params;
  const [postList, setPostList] = useState([]);
  const [postItem, setPostItem] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [postAnimalId, setPostAnimalId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [playingItemId, setPlayingItemId] = useState(false);
  const prevVisibleRef = useRef(visible);
  const [visibleItemId, setVisibleItemId] = useState(false);
  const [skipNumber, setSkipNumber] = useState(0);
  const [page, setPage] = useState(0); // Page actuelle
  const [hasMore, setHasMore] = useState(true); // Indique s'il y a encore des données à charger
  const [data, setData] = useState([]);
  const [modalIosVisible, setModalIosVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);

  // FullScreenVideo global
  const [fullScreenItem, setFullScreenItem] = useState(null);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);

  console.log("Wall", config.app.version, userData.firstConnect, params);

  useEffect(() => {
    checkAppVersion();
  }, []);


  useEffect(() => {
    if (params && params.reload === true) {
      checkAppVersion();
      console.log("Reloading");
     
    };
     getAllPost();
  }, [params, page]);

  useEffect(() => {
  if (page > 0) getAllPost(page);
}, [page]);


  useEffect(() => {
    if (userData && userData.firstConnect === true) {
      setActive(true);
      setModalWarning(true)
    } else {
    }
  }, []);
  
  const closeModal = () => {
    setModalWarning(false);
  };

  const goToStore = () => {
    setModalIosVisible(!modalIosVisible);
    const url = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(url).catch(err => console.error("Erreur ouverture store:", err));
    // Fermer l'app (optionnel, Android uniquement)
    // if (Platform.OS === "android") {
    //   BackHandler.exitApp();
    // }

  };


  

  //   useEffect(() => {
  //   getAllPost(page);
  // }, [page]);



  // useEffect(() => {
  //   getAllPost();
  // }, [page, isFetching, modalVisible]);

  // useEffect(() => {
  //   //console.log('hasMore:', hasMore);
  //   //console.log('Nouvelle page:', page); // Réagit aux changements de page
  //   getAllPost(page);

  // }, [page]);

  // const loadMore = () => {
  //   if (!loading && hasMore) {
  //     setPage((prevPage) => {
  //       // console.log('Ancienne page:', prevPage); // Affiche la valeur précédente
  //       return prevPage + 1; // Renvoie la nouvelle page
  //     });
  //   }

  // };

  // ---------------------------
  // FETCH POSTS
  // ---------------------------
const getAllPost = async (pageNumber = 0) => {
  if (loading) return;
  setLoading(true);

  try {
    const response = await fetch(config.uri + 'posts/getwallpost', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userData._id,
        animal_id: animalData._id,
        limit: 10,
        skipNumber: pageNumber * 10,
      }),
    });

    const res = await response.json();
    if (res.success) {
      const newPosts = res.postList || [];
      setPostList(prev =>
        pageNumber === 0 ? newPosts : [...prev, ...newPosts]
      );
      setHasMore(newPosts.length >= 10);
    }
  } catch (err) {
    console.error('Erreur fetch posts:', err);
  } finally {
    setLoading(false);
    setIsFetching(false);
  }
};

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View key={"i"} style={styles.loader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const checkAppVersion = async () => {
    if (config.app.version) {
      await fetch(config.uri + 'users/appversion', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          appversionfront: config.app.version
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setModalIosVisible(false);
          }
          else {
            setModalIosVisible(true);
          }
        });
    } else {
      return
    }
  };

  const updatePostLike = (postId) => {
  setPostList(prev =>
    prev.map(p =>
      p._id === postId
        ? {
            ...p,
            favorites: p.favorites.includes(animalData._id)
              ? p.favorites.filter(f => f !== animalData._id)
              : [...p.favorites, animalData._id]
          }
        : p
    )
  );
};

const onRefresh = async () => {
  setIsFetching(true);
  setHasMore(true);
  setPage(0);
  setPostList([]);
  await getAllPost(0);  // 🔥 fetch direct après reset
  setIsFetching(false);
};


  //  const onRefresh = () => {
  //   setIsFetching(true);
  //   setPage(0);
  //   setHasMore(true);
  //   setPostList([]);
  //  // getAllPost(0);
  // };

  const loadMore = () => {
    if (!loading && hasMore) setPage(prev => prev + 1);
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

  const closePostModal = () => {

    setModalVisible(false);
    //setPostItem(item);
    //setPostAnimalId(item.animal_id._id)
    // this.setState({
    //   modalVisible: true,
    //   item: item,
    //   post_animal_id: item.animal_id._id,
    // });

  };

  const onViewableItemsChanged = useCallback(({ viewableItems, item }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems.video_id !== null) {
      setVisibleItemId(true);
    } else {
      setVisibleItemId(false);
    }
  }, [visibleItemId]);

  const deleteFirstConnect = async () => {
    await fetch(config.uri + 'users/firstconnect', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setActive(false);
        }
        else {
          alert(res.message);
          alert('PRB Delete Marker');
        }
      })
  };

   const openFullScreen = (item) => {
    setFullScreenItem(item);
    setIsFullScreenVisible(true);
  };

  const closeFullScreen = () => {
    setFullScreenItem(null);
    setIsFullScreenVisible(false);
  };


  const renderItem = ({ item, i }) => {

    return (
      <View>
        {(item) &&

          <View style={styles.card}>
            <HeaderPostList
              item={item}
              navigate={navigation.navigate}
              openPostModal={() => openPostModal(item)}
              from="Home"
            />
            <ImagePostList
              isMuted={isMuted}
              isvideoplay={visibleItemId}
              item={item}
              navigate={navigation.navigate}
              openPostModal={() => openFullScreen(item)}
            />
            <ActionContainerPostList
              item={item}
              navigate={navigation.navigate}
              getAllPost={(page) => getAllPost(page)}
              page={page}
              updatePostLike={updatePostLike}
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
    )
  };

  if (modalIosVisible) {
    return (

      <View style={BDiaryStyles.container}>

        <SafeAreaProvider>
          <SafeAreaView style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalIosVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalIosVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{i18n.t('wall.unvalidAppVersion')}</Text>
                  <Text style={styles.modalText}>{JSON.stringify(config.app)}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => goToStore()}>
                    <Text style={styles.textStyle}>{i18n.t('wall.newVersion')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    )

  }


  return (
    <View style={BDiaryStyles.container}>
      <HeaderBuddyPrimary
        //openModal={openModal}
        iconNameL="camera"
        iconNameR="notifications-outline"
        iconFamilyL="Feather"
        iconFamilyR="Ionicons"
        navigationName="MediaPost"
        navigationNameR="NotificationListScreen"
        logo={true}
      />

      

      {/* Welcome Modal */}
      {(active) &&
        <View style={{ position: "absolute", zIndex: 20, width: ScreenWidth, height: ScreenHeight , alignItems: "center", justifyContent: "center", alignContent: "center", }}>
          <View style={{ borderColor: Colors.pinkBuddy, borderRadius: 18, padding: 10, alignItems: "center", justifyContent: "flex-start", alignContent: "center", borderWidth: 2, width: ScreenWidth - 40, backgroundColor: "#ffffffff" }}>
            <Text style={[BDiaryStyles.modalTitle, { fontFamily: 'Poppins-Bold', color: Colors.pinkBuddy, fontSize: 20 }]}> {i18n.t('Modal.WelcomeModal')}</Text>
            <View>
              <Text style={[BDiaryStyles.modalText, { color: Colors.greyH, fontFamily: 'Poppins-Medium', fontSize: 14, marginTop: 0, textAlign: "center" }]}>{i18n.t('Modal.WelcomeTextStars')}</Text>
            </View>

            <View style={{ marginTop: 20, }}>
              <TouchableOpacity
                style={{ backgroundColor: Colors.greenBuddy, alignContent: "center", alignItems: "center", justifyContent: "center", width: 200, height: 40, borderWidth: 0, borderRadius: 22, }}
                onPress={() => deleteFirstConnect()}>
                <Text style={[BDiaryStyles.modalTextStyle, { fontFamily: 'Poppins-Medium', color: Colors.white }]}>{i18n.t('Modal.WelcomeGo')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
      {/* End Welcome Modal */}

     

      <View style={{ position: "relative", zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <FlatList
         // key={isFetching ? 'refreshing' : 'stable'} // force rerender sur refresh
          showsVerticalScrollIndicator={false}
          data={postList}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={renderItem}
          extraData={postList}
          keyExtractor={(item) => item._id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          //ListFooterComponent={renderFooter}
          removeClippedSubviews={false}
          initialNumToRender={6}
          windowSize={10}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

       {(active) &&
        <View style={{ position: "absolute", zIndex: 10, justifyContent: 'center', alignItems: 'center' }}>
          <EmojiConfetti
            active={active}
            fadeDuration={800}
            speed="normal"
            count={50}
            emoji="⭐"
          />
        </View>
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
        updatePostLike={updatePostLike}
        getAllPost={getAllPost}
      />




      {/* <ModalWarning
            isTrigger={0}
            postnumerselected={0}
           // getAnimalList={getAnimalList}
            animationType="fade"
            item={postItem}
            //getUserMarkers={getUserMarkers}
            post_animal_id={postItem._id}
            animal_id={animalData._id}
            modalVisible={modalWarning}
            navigation={navigation}
            navigateToModal="FirstConnect"
            closeModal={closeModal}
            setActive={setActive}
          /> */}

           {/* FULLSCREEN VIDEO GLOBAL */}
        {fullScreenItem && 
          <FullScreenVideo
            visible={isFullScreenVisible}
            onClose={closeFullScreen}
            item={fullScreenItem}
          />
        }

    </View>
  );
};



const styles = StyleSheet.create({
  loader: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 0,
    // position:"absolute",
    zIndex: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Colors.greenBuddy,
  },
  textStyle: {
    fontFamily: "Poppins-SemiBold",
    color: 'white',
    fontWSize: 12,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: "Poppins-SemiBold",
    color: Colors.greyH,
    fontWSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    padding: 10,
  },
});

export default WallScreen;
