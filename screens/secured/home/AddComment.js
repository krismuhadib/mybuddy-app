import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Modal, Pressable, TouchableWithoutFeedback, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TextInput, FlatList, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { Fontisto, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import { ApiRoutes, Post, setToken, getToken, removeToken } from '../../../services/api';
import PinchableBox from '../../../components/elements/PinchableBox';
import DetailsBarSmall from '../../../components/elements/DetailsBarSmall';
import MyFonctions from '../../../components/MyFonctions';
import { FormDate } from '../../../utils/helpers';
import DisplayVideoComment from '../../../components/elements/DisplayVideoComment';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import LikeComment from '../../../components/elements/LikeComment';
import ChildListing from '../../../components/elements/comment/ChildList';
import { CapitalizeFirstLetter } from '../../../utils/helpers';
import LikeAddComment from '../../../components/elements/LikeAddComment';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FullScreenVideo from '../../../components/elements/FullScreenVideo';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Bug ScrollView
import { LogBox } from 'react-native'
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])


const noImg = require('../../../assets/images/logo_avatar.png');
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const AddComment = (route) => {

  const storeDispatch = useDispatch();

  const navigation = useNavigation();
  const params = route.route.params;

  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);

  const textInputRef = useRef(null);

  const [paramsChild, setParamsChild] = useState(route.route.params);
  const [commentlength, setCommentlength] = useState(0);
  const [postList, setPostList] = useState([]);
  const [newpostUpdate, setNewpostUpdate] = useState([]);
  const [postListNumber, setPostListNumber] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [childList, setChildList] = useState([]);
  const [placeholder, setPlaceholder] = useState(i18n.t('Page.Add_Comments'));
  const [postUpdate, setPostUpdate] = useState(params.postUpdate);
  const [favorite, setFavorite] = useState([]);
  const [count, setCount] = useState(0);
  const [bookmark, setBookmark] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [buttondisplay, setButtondisplay] = useState(true);
  const [autofocus, setAutofocus] = useState(false);
  const [text, setText] = useState("");
  const [postId, setPostId] = useState(null);
  const [answer, setAnswer] = useState(false);
  const [switcha, setSwitcha] = useState(0);
  const [answerName, setAnswerName] = useState("");
  const [answerId, setAnswerId] = useState("");
  const [display, setDisplay] = useState("none");
  const [parentPostId, setParentPostId] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState(i18n.t('Page.Add_Comments'));
  const [ifmodifydata, setIfmodifydata] = useState(false);
  const [comments, setComments] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [modalPostVisible, setModalPostVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentDisplay, setCommentDisplay] = useState("none");
  const [imagePost, setImagePost] = useState("");
  const [imageId, setImageId] = useState(config.randomkey(16));
  const [textError, setTextError] = useState(0);
  const [imageChat, setImageChat] = useState(null);
  const [imageRender, setImageRender] = useState("");
  const [isPostImage, setIsPostImage] = useState(false);
  const [isFullImage, setIsFullImage] = useState(false);

  console.log("AddComment");

  //   useEffect(() => {
  //   getPost();

  // }, [ postUpdate]);


  useEffect(() => {
    getAllAddComments();
    addPostCommentNumber();

  }, [params]);

  // useEffect(() => {
  //   setImageChat(config.randomkey(16))
  // }, [imagePost]);



  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
      setPlaceholder(i18n.t('Page.Add_Comments'));

    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
      setPlaceholder(i18n.t('Page.Add_Comments'))
    });


    // Nettoyage
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();

    };
  }, [placeholder]);




  const openKeyboard = () => {
    // Force le TextInput à se concentrer et donc à ouvrir le clavier
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const onRefresh = () => {
    Keyboard.dismiss();
    setIsFetching(false);
    getAllAddComments();
  };

  const getAllAddComments = async () => {

    const res = await Post(ApiRoutes.commentList, {
      newcomment: true,
      user_id: userData._id,
      animal_id: animalData._id,
      token: userData._id,
      post_id: params.postUpdate._id,
      blokeduser: animalData.blokeduser
    });
    //console.log("getAllAddComments getAllAddComments res", res)

    if (res.success === true) {
      setPostList(res.value);
      setPostListNumber(res.value.length);
      setIsFetching(false);
      setCommentlength(0);
      let ParentListId = [];
      let ParentListA = [];
      let ChildListId = [];
      let ChildListA = [];

      // Create parentList from postList
      // First create ParentListId
      res.value.forEach(function (item) {
        if (item.parentpost_id) {
          ParentListId.push(item.parentpost_id);
        }
      });
      // Two create ParentList
      var mapping = res.value.reverse().map(function (item) {
        if (!item.parentpost_id) {
          ParentListA.push(item)
          return item;
        }
      });
      // Create ChildList from postList
      res.value.map(function (item) {
        //console.log("search",item)
        if (item.parentpost_id) {
          ChildListA.push(item)
          return item;
        }
      });

      let childs = res.value.find(function (child) {
        return child.answer === true
      });
      setParentList(ParentListA);
      setChildList(ChildListA)
      setPostList(ParentListA);
      setCommentlength(0);
      getPost();

    } else if (res.success === false) {
      setPostList([]);
      setParentList([]);

      // setCommentlength(0);
      getPost();
      //ShowToast(CheckBackendErrors(res.error));
    }
  };

  const sendPushLikeCommentNotification = async (item) => {
    var commentary = item.body || '';
    var commentary_elliptic = commentary.length > 40 ? commentary.substring(0, 40) + "..." : commentary;
    var isavatar = animalData.avatars.length;

    try {
      const response = await fetch(config.uri + 'notifications/sendlikecommentnotifications', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pagefrom: "comment",
          to: item.animal_id._id,
          title: "Notification Like",
          name: CapitalizeFirstLetter(animalData.name),
          post_text: commentary_elliptic,
          post_id: item._id,
          notif_message: true,
          sender_id: animalData._id,
          sender_avatar: isavatar,
          language: i18n._locale,
          originname: item.animal_id.name,
          postanimalid: item.animal_id._id,
        }),
      });
      const res = await response.json();
      if (res.success) {
        //console.log("Notification commentaire envoyée avec succès !");
      } else {
        console.log("Erreur lors de l'envoi de la notification :", res);
      }
    } catch (error) {
      console.error("Erreur fetch notification:", error);
    }
  };

  const sendPushAddCommentNotification = async (item) => {
    var commentary = item.comment || '';
    const commentary_elliptic = commentary.length > 40 ? commentary.substring(0, 40) + "..." : commentary;
    var isavatar = animalData.avatars.length;

    try {
      const response = await fetch(config.uri + 'notifications/sendaddcommentnotifications', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pagefrom: "comment",
          animal_id: animalData._id,
          otheranimal: item.animal_id._id,
          pagefrom: "comment",
          to: item.animal_id._id,
          title: "Notification Like",
          name: CapitalizeFirstLetter(animalData.name),
          post_text: commentary_elliptic,
          post_id: item._id,
          notif_message: true,
          sender_id: animalData._id,
          sender_avatar: isavatar,
          language: i18n._locale,
          originname: item.animal_id.name,
          postanimalid: item.animal_id._id,
        }),
      });
      const res = await response.json();
      if (res.success) {
        // console.log("Notification commentaire envoyée avec succès !");
      } else {
        // console.log("Erreur lors de l'envoi de la notification :", res);
      }
    } catch (error) {
      console.error("Erreur fetch notification:", error);
    }
  };

  const toggleFav = async (item) => {
    if (item) {
      try {
        const response = await fetch(config.uri + 'addcomments/commentlikes', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: i18n._locale,
            animal_id: animalData._id,
            post_id: item, // A verfiier
            favorites: animalData._id,
            likers: animalData.name,
          })
        })
        const res = await response.json();

        if (res.success === true) {
          // Conditions pour envoyer la notification
          if (
            item.user_id._id !== userData._id &&
            animalData._id !== item.animal_id._id &&
            !item.favorites.includes(animalData._id)
          ) {
            await sendPushLikeCommentNotification(item); // Appel direct
          }

          if (item.favorites.length) {
            var count = item.favorites.length;
          } else {
            count = 0;
          }
          setFavorite(res.favoris);
          setCount(count);
          getAllAddComments();
        }
        else {
          console.log('ca marche PASSSS RES ?');
          alert(i18n.t('Fetch_Error.Empty_Field'));
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    } else {
      console.log("PRB ITEM");
    }
  };

  const commmenttoggleFav = async (item) => { // Irst comment
    if (item) {
      try {
        const response = await fetch(config.uri + 'addcomments/commentlikes', {

          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            language: i18n._locale,
            parentpost_id: postUpdate._id,
            animal_id: animalData._id,
            post_id: item, // A verfiier
            favorites: animalData._id,
            likers: animalData.name,
          })
        })
        const res = await response.json();
        if (res.success === true) {

          if (
            item.user_id._id !== userData._id &&
            animalData._id !== item.animal_id._id &&
            !item.favorites.includes(animalData._id)
          ) {
            await sendPushLikeCommentNotification(item); // Appel direct
          }

          //let favorites = this.state.favorite;
          var count = item.favorites.length;
          // favorites[this.props.user._id] = res.favoris;
          //console.log("backend return res.favoris & favorites", res.favoris)

          setFavorite(res.favoris);
          setCount(count);
          getAllAddComments();
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert(i18n.t('Fetch_Error.Emsssspty_Field'));
        }

      } catch (error) {
        console.error('Error liking post:', error);
      }
    } else {
      console.log("PRB ITEM");
    }
  };

  const toggleFavCard = async (item) => {

    try {
      const response = await fetch(config.uri + 'posts/likes', {


        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          animal_id: animalData._id,
          post_id: postUpdate, // A verfiier
          favorites: animalData._id,
          likers: animalData._id,
          language: i18n._locale,
        })
      })
      const res = await response.json();

      if (res.success === true) {
        if (
          item.user_id._id !== userData._id &&
          animalData._id !== item.animal_id._id &&
          !item.favorites.includes(animalData._id)
        ) {
          await sendPushLikeCommentNotification(item); // Appel direct
        }
        var count = item.favorites.length;
        setFavorite(res.favoris);
        setCount(item.favorites.length);
        getAllAddComments();
      }

    } catch (error) {
      console.error('Error liking post:', error);
    }

  };

  const getPost = async () => {
    fetch(config.uri + 'posts/getonepost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: postUpdate._id
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          var postList = res;
          setPostList(res);
          setNewpostUpdate(res.postList);
          setPostUpdate(res.postList[0]);
        }
        else {
          console.log("No Posts")
          //alert(config.fetcherror.prbRes);
        }
      });

  };

  const bookmarkIconDisplay = (item, i) => {
    var bookmarktcolor = Colors.greyH;
    //setBookmark(item.bookmarks)
    // this.state.bookmark = item.bookmarks;
    // this.state.modalVisible = false;

    var count = item.bookmarks.length;
    if (count) {
      bookmarktcolor = Colors.greyH;
    }
    // if (bookmark.includes(item.bookmarks)) {
    //   bookmarktcolor = 'black';
    // }
    return (
      <View key={i}>
        {(animalData) &&
          <View style={{ width: 50, flexDirection: 'row', height: 50, borderWidth: 0 }}>

            {/* <View style={[styles.animatedlike, {borderWidth:1}]}>
          <TouchableWithoutFeedback
          onPress={() =>{
           
            if (this.state.heartButton_on && !this.state.favorite.includes(item.favorites)) { 

              Animated.timing(this.state.progress, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            }
            else {
              Animated.timing(this.state.progress, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            };
            this.setState({
              heartButton_on: !this.state.heartButton_on
            });
            this.toggleFav(item)
          }}>
            <LottieView
            source={require('../../assets/animated/like-button.json')}
            loop= {false}
            progress={this.state.progress}/>
          </TouchableWithoutFeedback>
        </View> */}
            <TouchableOpacity
              style={{}}
              onPress={() => toggleBookmark(item)}
            >
              <Ionicons style={{ padding: 10 }}
                color={bookmarktcolor}
                name={MyFonctions.isBookmarked(animalData._id, item.bookmarks) ? 'pricetag' : 'pricetag-outline'}
                size={27}
              />
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  };

  const toggleBookmark = (item) => {
    fetch(config.uri + 'posts/bookmarks', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: item, // A verfiier
        bookmarks: animalData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var count = item.bookmarks.length;
          setBookmarks(res.favoris);
          getPost();
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
  };

  const friendsButtonDisplay = (item, i) => {
    //console.log("FriendsButtonDisplay this.props.user._id.includes(item)", item, this.props.animal.friends, this.props.animal.friends.includes(this.state.item_animal))
    const AppButton = ({ onPress, title, iconame, bgcolor, txtcolor }) => (
      <TouchableOpacity onPress={onPress}
        style={[styles.appButtonContainer, { flexDirection: 'row', backgroundColor: bgcolor }]}>
        <Ionicons style={{ paddingRight: 0 }}
          color={Colors.red}
          name={iconame} size={20}
        />
        <Text style={{
          fontSize: 9,
          fontFamily: 'Poppins-Regular',
          color: txtcolor,
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>{title}</Text>
      </TouchableOpacity>
    );

    if (buttondisplay === true && animalData.friends) {
      if (animalData.friends.includes(item.animal_id._id) === false) {
        //console.log("il sont copains", this.props.animal.friends, this.state.item.user_id._id);
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.white}
                bgcolor={Colors.black}
                // iconame="ios-add-circle-outline"
                title={i18n.t('addComment.addFollower')}
                onPress={() => toggleFriends(item)} />
            </View>
          </View>);
      };

      if (animalData.friends.includes(item.animal_id._id) === true) {
        //console.log("il ne sont pas copains");
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.black}
                bgcolor={Colors.white}
                //iconame="ios-close-circle-outline"
                title={i18n.t('addComment.removeFollower')}
                onPress={() => ButtonRemoveFriends(item.animal_id._id)} />
            </View>
          </View>
        )
      }
    };
  };

  const toggleFriends = (item) => {
    //let friend = [item.friends];

    //console.log("click clickclickclick friends", this.props.user._id, this.state.friend);
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    fetch(config.uri + 'animals/addfriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
        animal_item_id: item.animal_id._id,
        animal_id: animalData._id,
        friend_id: item.animal_id._id, // A verfiier


      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {

          getUserAnimalDatas();

        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Les infos User/Password sont mal remplies');
        }
      });

  };

  const getUserAnimalDatas = async () => {

    fetch(config.uri + 'animals/getdatasfromanimalid', {
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
          storeDispatch(SaveAnimal(res.animaldoc));
        } else {
          console.log('ca marche PASSSS RES ?', res.success);

        }
      });

  };

  const ButtonRemoveFriends = (item) => {
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    fetch(config.uri + 'animals/deletefriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
        animal_id: animalData._id,
        user_id: userData._id,
        friend_id: item,
        animal_item_id: item,
        // post_id: this.state.item.user_id._id, // A verfiier
        //friends: this.props.user._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          getUserAnimalDatas();
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Les infos User/Password sont mal remplies');
        }
      });

  };

  const postText = () => {
    //count = this.state;
    //var bodytext = data.item.body
    return (
      <Text style={[BDiaryStyles.postText, { width: ScreenWidth - 20, }]}>{postUpdate.comment}</Text>
    );
  };

  const answerAddPostUpdate = (item) => {
    openKeyboard();
    // var value = itemmodify.item;
    setNewPlaceholder(i18n.t('Page.Add_Comments'));
    setPlaceholder(i18n.t('Page.Add_Comments'));
    setText('');
    //setAutofocus(true);
    setPostId(postUpdate._id);
    setAnswer(false);
    setParentPostId("");
    setSwitcha(0);

  };

  const inputValidate = (text, type) => {

    if (type == 'comment') {
      //commentlength = text.length;
      setCommentlength(text.length);
      setIfmodifydata(true);
      setComments(text);
      setText(text);
      if (text.length > 0) {
        setTextError(0)
      } else {
        setTextError(1)
      }
    }
  };

  const addNewComments = async (item, imageIdnumber) => {
    if (isPostImage === true && imagePost !== undefined && imagePost !== null && imagePost.length !== 0) {
      setImagePost(imagePost.split("/").pop());
    } else {
      setImagePost(null);
      imageIdnumber = null;
    }
    if (postUpdate && params.from !== "Notifications" && textError === 0) {
      try {
        const response = await fetch(config.uri + 'addcomments/addcomments', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            language: i18n._locale,
            post_id: postUpdate._id,
            parentpost_id: parentPostId,
            user_id: userData._id,
            body: comments,
            answer: answer,
            image_id: imageIdnumber,
            addcommentsnumber: postListNumber + 1,
            notificationtoken: userData._id,
            animal_name: animalData.name,
            animal_id: animalData._id,
            answer_name: answerName,
            answer_id: answerId,
          })
        })
        const res = await response.json();
        if (res.success === true) {

          if (item.user_id._id !== userData._id &&
            animalData._id !== item.animal_id._id) {
            sendPushAddCommentNotification(item);
          }
          setNewPlaceholder(i18n.t('Page.Add_Comments'));
          setPlaceholder(i18n.t('Page.Add_Comments'));
          setComments(null);
          setText(null);
          setCommentlength(0);
          setAutofocus(false);
          Keyboard.dismiss();
          getAllAddComments();
          setImageId(config.randomkey(16));
          setIsPostImage(false);
        }
        else {
          console.log('RES Prb', res.success, res.userToken);
          alert(i18n.t('Fetch_Error.Emsssspty_Field'));
        }
      } catch (error) {
        console.error('Error Addcomments coments:', error);
      }


    } else {

      fetch(config.uri + 'addcomments/addcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          post_id: this.state.postUpdate.post_id._id,
          parentpost_id: this.state.parentPost_Id,
          user_id: this.props.user._id,
          body: this.state.comments,
          answer: this.state.answer,
          addcommentsnumber: this.state.postListNumber + 1,
          notificationtoken: this.state.notificationtoken,
          animal_name: this.props.animal.name,
          animal_id: this.props.animal._id,
          answer_name: this.state.answer_name,
          answer_id: this.state.answer_id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {

            this.setState({
              // value : "res.favoris",
              //count : count,
              text: ' ',
              notiflike: res.notifinfo.like_comment,
              notifcomment: res.notifinfo.add_comment,
              notiftitle: res.notifinfo.title,
              newplaceholder: i18n.t('Page.Add_Comments'),
              placeholder: i18n.t('Page.Add_Comments'),
              commentlength: 0,

              //likers : likers
            });
            //this.sendAddCommentNotifs();
            this.getAllAddComments();

            setTimeout(() => {
              this.setState({
                // value : "res.favoris",
                //count : count,
                text: this.props.text,
                newplaceholder: i18n.t('Page.Add_Comments'),
                placeholder: i18n.t('Page.Add_Comments'),

                //likers : likers
              });
              Keyboard.dismiss();
              onRefresh();
            }, 0)
            //var userToken = res.key;
          

          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    }

  };

  const addComments = () => {
    if (postUpdate && params.from !== "Notifications") {

      // Envoi du tableau array des favorites dans le backend pour un save mongo
      fetch(config.uri + 'addcomments/addcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          post_id: postUpdate._id,
          parentpost_id: parentPostId,
          user_id: userData._id,
          body: comments,
          answer: answer,
          addcommentsnumber: postListNumber + 1,
          notificationtoken: userData._id,
          animal_name: animalData.name,
          animal_id: animalData._id,
          answer_name: answerName,
          answer_id: answerId,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //console.log("ADDCOMMENTS RES", res)
            setNewPlaceholder(i18n.t('Page.Add_Comments'));
            setPlaceholder(i18n.t('Page.Add_Comments'));
            setComments(null);
            setText(null);
            setCommentlength(0);
            setAutofocus(false);
            Keyboard.dismiss();
            getAllAddComments();

            //this.myTextInput.focus();

            //this.sendAddCommentNotifs();

          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    } else {

      fetch(config.uri + 'addcomments/addcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          post_id: this.state.postUpdate.post_id._id,
          parentpost_id: this.state.parentPost_Id,
          user_id: this.props.user._id,
          body: this.state.comments,
          answer: this.state.answer,
          addcommentsnumber: this.state.postListNumber + 1,
          notificationtoken: this.state.notificationtoken,
          animal_name: this.props.animal.name,
          animal_id: this.props.animal._id,
          answer_name: this.state.answer_name,
          answer_id: this.state.answer_id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {

            this.setState({
              // value : "res.favoris",
              //count : count,
              text: ' ',
              notiflike: res.notifinfo.like_comment,
              notifcomment: res.notifinfo.add_comment,
              notiftitle: res.notifinfo.title,
              newplaceholder: i18n.t('Page.Add_Comments'),
              placeholder: i18n.t('Page.Add_Comments'),
              commentlength: 0,

              //likers : likers
            });
            //this.sendAddCommentNotifs();
            this.getAllAddComments();

            setTimeout(() => {
              this.setState({
                // value : "res.favoris",
                //count : count,
                text: this.props.text,
                newplaceholder: i18n.t('Page.Add_Comments'),
                placeholder: i18n.t('Page.Add_Comments'),

                //likers : likers
              });
              Keyboard.dismiss();
              onRefresh();
            }, 0)
           

          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    }

  };

  const deletePost = item => {
    var itemdelete = { item };
    var value = itemdelete.item;
    openModal();
    setPostId(itemdelete.item);
    setParentPostId(postUpdate._id);
  };

  const openModal = () => {
    setDisplay("flex");
    //this.setState({ display: 'flex' })
  };

  const goToMessage = (item) => {
    navigation.navigate('SharePost', {
      from: "Home",
      screen: 'SharePostScreen',
      sendPostData: item,
      item_message: item,
    })
  };

  const navigateToLikers = (item) => {
    navigation.navigate('LikerList', {
      from: "Home",
      item: item,
      userToken: userData._id,
    })
  };

  const openFullSizeModal = () => {
    setModalVisible(true);
  };

  const renderItem = (data, item) => {
    return (
      <>
        <ChildListing
          params={paramsChild}
          setDisplay={setDisplay}
          childList={childList}
          data={data}
          toggleFav={toggleFav}
          setPostId={setPostId}
          setParentPostId={setParentPostId}
          getAllAddComments={() => getAllAddComments}
          setPlaceholder={setPlaceholder}
          setText={setText}
          setAnswer={setAnswer}
          setSwitcha={setSwitcha}
          setAnswerId={setAnswerId}
          setAnswerName={setAnswerName}
          deletePost={deletePost}
          openKeyboard={openKeyboard}
          //toggleFavCard={toggleFavCard}
          favorites={favorite}
          commmenttoggleFav={commmenttoggleFav}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setCommentDisplay={setCommentDisplay}
          setComment={setComments}
          setImagePost={setImagePost}
          imagePost={imagePost}

        />
      </>
    )
  };

  const onCloseModal = () => {
    setDisplay("none")
  };

  const addPostCommentNumber = async () => {
    const res = await Post(ApiRoutes.addCommentNumber, {
      newcomment: true,
      user_id: userData._id,
      animal_id: animalData._id,
      token: userData._id,
      post_id: params.postUpdate._id,
      blokeduser: animalData.blokeduser

    });

    if (res.success === true) {
      setPostListNumber(res.number)


    } else {
      console.log("addCommentNumber ca marche PAS", res)
    }

  };

  const GoToDeletePost = async () => {

    await fetch(config.uri + 'addcomments/deleteuseraddcomment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: postId,
        parentpost_id: postUpdate._id,
        addcommentsnumber: postListNumber,
        user_id: userData._id
      })
    })
      .then((response) => response.json())
      .then((res) => {

        if (res.success === true) {


          answerAddPostUpdate();
          // setParentList([]);
          getAllAddComments();

          setComments(' ');
          closeKeyboard();

          setDisplay("none");
          addPostCommentNumber();

        }
        else {

          alert(i18n.t('Fetch_Error.Empty_Field'));
        }

      })



  };

  const AddSubComment = (data) => {
    addNewComments(data, imageId);
    setModalVisible(!modalVisible);
    setImagePost(undefined);
  };

  const addImage = () => {
    setIsPostImage(true);
    if (imageId !== null) {
      pickImageLibrary(imageId);
    }
  };

  const addSubImage = () => {
    setIsPostImage(true);
    if (imageId !== null) {
      pickImageLibrary(imageId);
    }
  };

  const pickImageLibrary = async (image) => {
    // Reset ImagePost uri
    setImagePost("");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled === false) {
      // Image Manipulator
      let resizeObj = {};
      resizeObj = { width: 1080 };
      let opts = [{ resize: resizeObj }];

      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        opts,
        { compress: 1.0, format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );

      setImagePost(result.assets[0].uri);

      const fileName = image;
      const imageUri = manipResult.uri.replace('file:/data', 'file:///data');
      const imageType = result.assets[0].type.split('.')[1];
      const postdata = new FormData();

      if (Platform.OS === 'web') {
        // Just passing the image URI works only on web
        postdata.append('file', imageUri);
      } else {
        postdata.append('venue', animalData._id);
        postdata.append('animal_id', animalData._id);
        postdata.append('_id', animalData._id);
        // Passing an object only works on Android and iOS
        postdata.append('avatarImg', {
          uri: imageUri,
          type: "image/jpeg",
          name: fileName,
        });

        const options = {
          method: 'POST',
          body: postdata,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': animalData._id,
          }),
        };

        //SEND IMAGE TO SERVER

        fetch(config.uri + 'posts/saveimage', options)
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              //getAnimalData();
              var result = res;
              setImageRender(config.linkserver + animalData._id + '/images/posts/' + imageId + '.jpg');
              setModalVisible(true);
              //setImagePost(config.linkserver + animalData._id + '/images/posts/' + imageId + '.jpg');
              //addImagetoDb(newimagename);


            }
            else {
              console.log('ca marche PASSSS avec le RES ?', res);
              alert('Probleme avec save image to post');
            }
          });
      }
    }
  };

  const deleteImage = async () => {
    // delete image in db folder
    fetch(config.uri + 'addcomments/deleteimage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_id: imageId,
        animal_id: animalData._id,
        parentpost_id: postUpdate._id,
        user_id: userData._id
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setImagePost(null);
        }
        else {
          console.log(i18n.t('Fetch_Error.Empty_Field'))
        }
      })
    // close image view
  };

  const addImagetoDb = async (newimagename) => {

    fetch(config.uri + 'carousel/addimage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //_id : this.state.itemId.id,
        animal_id: animalData._id,
        user_id: userData._id,
        name: newimagename,
        image_id: userData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var result = res;
        }
        else {
          alert(res.message);
          alert('Prb Caroussel picture');
        }
      })
  };


  return (
    <View style={{ flex: 1 }}>

      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('addComment.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 0}
        style={BDiaryStyles.container}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <ScrollView
            showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

            <View style={styles.inner}>

              <View style={{ borderWidth: 0 }}>

                <View style={{ backgroundColor: '#fff', height: 80, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', backgroundColor: Colors.white, }}>

                    <View style={{ borderWidth: 0, justifyContent: 'center', paddingLeft: 10 }}>

                      {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 0) &&
                        <View style={[styles.avatarPlaceholder]} >
                          {(!postUpdate.animal_id.avatars[0]) &&
                            <Image source={noImg} style={[styles.avatar, { borderWidth: 0 }]} />
                          }

                          {(postUpdate.animal_id.avatars.length) &&
                            <TouchableOpacity style={styles.avatarPlaceholder}
                              onPress={() => navigation.navigate('NoUserScreen', {
                                navigateTo: "Home",
                                item: postUpdate,
                                userToken: userData._id,
                                item_user: postUpdate.user_id._id,// a virer
                                item_animal: postUpdate.animal_id,// a virer
                                otherParam: 'anything you want here',// a virer
                              })}>
                              <Image
                                source={{ uri: config.linkserver + postUpdate.animal_id._id + '/images/avatar/small/' + postUpdate.animal_id._id + '.jpg' }}
                                size='small'
                                style={styles.avatar}
                              />
                            </TouchableOpacity>

                          }

                        </View>
                      }

                      {(postUpdate.user_id.statusaccount !== undefined && postUpdate.user_id.statusaccount === 1) &&
                        <View >

                          {(!postUpdate.animal_id.avatars[0]) &&
                            <TouchableOpacity style={styles.avatarPlaceholderCard}
                              onPress={() => navigation.navigate('AnimalDetails', {
                                navigateTo: "Home",
                                item: postUpdate,
                                userToken: userData._id,
                                item_user: postUpdate.user_id._id,// a virer
                                item_animal: postUpdate.animal_id._id,// a virer
                                otherParam: 'anything you want here',// a virer
                              })}>
                              <Image source={noImg} style={[styles.avatarCard, { borderWidth: 1 }]} />
                            </TouchableOpacity>
                          }

                          {(postUpdate.animal_id.avatars[0]) &&

                            <TouchableOpacity style={styles.avatarPlaceholderCard}
                              onPress={() => navigation.navigate('AnimalDetails', {
                                navigateTo: "Home",
                                item: postUpdate,
                                userToken: userData._id,
                                item_user: postUpdate.user_id._id,// a virer
                                item_animal: postUpdate.animal_id._id,// a virer
                                otherParam: 'anything you want here',// a virer
                              })}>

                              <Image
                                source={{ uri: config.linkserver + postUpdate.animal_id._id + '/images/avatar/small/' + postUpdate.animal_id._id + '.jpg' }}
                                size='small'
                                style={styles.avatarCard}
                              />
                            </TouchableOpacity>

                          }
                        </View>
                      }

                    </View>


                    {/*  <WallRow
                item = {item}
                data={postList}
                /> */}

                    <View style={{ flexDirection: 'column', justifyContent: 'center', borderWidth: 0, flex: 1, alignItems: 'flex-start', padding: 10 }}>
                      <View style={{ justifyContent: 'center', }}>

                        <Text style={{ color: Colors.black, fontWeight: '600', fontSize: 18, fontFamily: 'Poppins-Semi-Bold', }}>{postUpdate.animal_id.name}</Text>
                      </View>

                      {/* {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 0) &&
                          <TouchableOpacity
                            style={[styles.bloc_Row, {
                              backgroundColor: "#ffffff",
                              marginTop: 0, justifyContent: 'flex-start', marginRight: 5
                            }]}
                            onPress={() => this.props.navigation.navigate('NoUserScreen', {
                              navigateTo: "Home",
                              item: postUpdate,
                              userToken: userData._id,
                              item_user: postUpdate.user_id._id,// a virer
                              item_animal: postUpdate.animal_id,// a virer 
                              otherParam: 'anything you want here',// a virer
                            })}>
                            <View style={{ borderWidth: 0 }}>
                              <DetailsBarSmall
                                item={postUpdate}
                                token={ userData._id}
                              />
                            </View>
                          </TouchableOpacity>
                        } */}

                      {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 1) &&
                        <TouchableOpacity
                          style={[styles.bloc_Row, {
                            backgroundColor: Colors.white,
                            marginTop: 0, justifyContent: 'flex-start', marginRight: 5
                          }]}
                          onPress={() => navigation.navigate('AnimalDetails', {
                            navigateTo: "Home",
                            item: postUpdate,
                            userToken: userData._id,
                            item_user: postUpdate.user_id._id,// a virer
                            item_animal: postUpdate.animal_id._id,// a virer
                            otherParam: 'anything you want here',// a virer
                          })}>
                          <View style={{ borderWidth: 0 }}>
                            <DetailsBarSmall
                              postData={postUpdate}
                              token={userData._id}
                            />

                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                    <View style={{ alignContent: "center", justifyContent: "center", paddingRight: 10 }}>
                      <TouchableOpacity style={{
                        paddingRight: 15,
                        alignContent: 'flex-end',
                        borderWidth: 0,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                        onPress={() => { setModalPostVisible(postUpdate) }}
                      >
                        <Feather name="more-horizontal" size={25} color={Colors.greyH} />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>

                <View style={{ zIndex: 1000, }}>

                  {(postUpdate.video_id !== null && postUpdate.image_id === null) &&
                    <DisplayVideoComment
                      islooping={true}
                      ismuted={false}
                      item={postUpdate} />
                  }

                  {(postUpdate.image_id !== null && postUpdate.video_id === null) &&
                    <PinchableBox imageUri={config.linkserver + postUpdate.animal_id._id + '/images/posts/' + postUpdate.image_id + '.jpg'}
                      item={postUpdate}
                      style={[styles.cardImage1, { zIndex: 2 }]}
                    />
                  }

                </View>

                <View>

                  <View style={{ backgroundColor: Colors.white, flexDirection: 'row', height: 50, borderWidth: 0, position: "relative", }}>

                    <View style={{ zIndex: 0, }}>
                      <LikeAddComment
                        getAllAddComments={() => getPost()}
                        item={postUpdate}
                        page={0}
                      />
                    </View>

                    <TouchableOpacity style={{ justifyContent: 'center' }}
                      onPress={() => { goToMessage(postUpdate) }}>
                      <Ionicons style={{ padding: 5, marginTop: 0 }} name="paper-plane-outline" size={28} color={Colors.greyH} />
                    </TouchableOpacity>

                    <View style={{ justifyContent: "center" }}>
                      {bookmarkIconDisplay(postUpdate, 0)}
                    </View>

                    <View style={{ zIndex: 0, flex: 1, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "center" }}>
                      {/* FRIENDS & MESSAGES */}
                      {/* {(animalData._id !== postUpdate.animal_id._id) &&
                        <View style={{ borderWidth: 0, flexDirection: "row", alignItems: "flex-end", alignContent: "flex-end", justifyContent: "center", padding: 10, }}>
                          <View style={{ padding: 5, borderWidth: 0, }}>
                            {friendsButtonDisplay(postUpdate, 0)}
                          </View>
                        </View>} */}
                    </View>
                  </View>

                </View>

                <View style={{ borderBottomWidth: 1, borderColor: "#c0c0c0", alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", borderWidth: 0, backgroundColor: Colors.white, alignContent: 'center', padding: 10, }}>

                  {/* avatar */}
                  <View style={{ flex: 1 }}>
                    {postText()}
                  </View>

                  <View style={{ borderWidth: 0, flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", alignContent: "flex-end", padding: 0, marginRight: 0 }}>
                    {/* {(childelement.user_id._id === user._id ) &&
                    <View style={{justifyContent:'center', top:-10}}>
                      <Feather style={{padding:10}} name="edit-2" size={15} color={Colors.greyH} onPress={() => node_modifyPost(childelement)}/>
                    </View>
                    } */}

                    {/* {(childelement.user_id._id === user._id) &&
                    <View style={{justifyContent:'center'}}>
                    <Ionicons style={{padding:10}} name="md-trash-outline" size={15} color={Colors.greyH} onPress={() => node_deletePost(childelement)}/>
                    </View>
                    } */}
                    {/* {(this.state.postUpdate.animal_id._id !== this.props.animal._id) &&
                    <View style={{justifyContent:'center'}}>
                    {this.heartIconDisplay(this.state.postUpdate)}
                    </View>
                    } */}
                    {/* {(childelement.user_id._id !== user._id) &&
                    <View style={{justifyContent:'center'}}>
                    <AntDesign style={{padding:10}} name="message1" size={15} color={Colors.greyH} onPress={() => node_answerAddPost(childelement)}/>
                    </View>
                    } */}
                  </View>

                  <View style={{ flexDirection: "row", paddingTop: 15, }}>

                    <View style={{ paddingLeft: 10, }}>
                      <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: "#c0c0c0" }}>
                        {FormDate(postUpdate.cdate)}
                      </Text>
                    </View>




                    {(params.from === "Notifications") &&
                      <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => navigateToLikers(postUpdate)}>
                          <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.post_id.favorites.length} {i18n.t('addComment.liked')}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postListNumber} {i18n.t('addComment.commentary')}</Text>
                        <TouchableOpacity
                          onPress={() => answerAddPostUpdate(postUpdate.post_id)}>
                          <View style={{ paddingTop: 0, marginLeft: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    }

                    {(params.from === "NotificationsComments") &&
                      <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => navigateToLikers(postUpdate)}>
                          <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.animal_id.favorites.length} {i18n.t('addComment.liked')}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>    {postListNumber} {i18n.t('addComment.commentary')}</Text>
                        <TouchableOpacity
                          onPress={() => answerAddPostUpdate(postUpdate.animal_id)}>
                          <View style={{ paddingTop: 0, marginLeft: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    }

                    {(params.from !== "Notifications") &&
                      <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => navigateToLikers(postUpdate)}>
                          <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.favorites.length} {i18n.t('addComment.liked')}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>    {postListNumber} {i18n.t('addComment.commentary')}</Text>
                        <TouchableOpacity
                          onPress={() => answerAddPostUpdate()}>
                          <View style={{ paddingTop: 0, marginLeft: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    }

                  </View>
                  <View style={{ padding: 10, width: "100%", backgroundColor: Colors.white, }}>
                    <View style={{ marginTop: 10, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                      <Text style={BDiaryStyles.tendancyResponse}>{i18n.t('addComment.tendancyResponse')}</Text>
                      <Ionicons color={Colors.greyM} style={{ margin: 5 }} size={15} name="chevron-down" />


                    </View>
                  </View>


                  {/* ADDMESSAGE && IMAGE MODAL*/}
                  <SafeAreaProvider>
                    <SafeAreaView style={styles.centeredView}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert('Modal has been closed.');
                          setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.greyL, width: "100%" }}>

                              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, alignContent: "space-between" }}>
                                <View>
                                  <Pressable
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={[BDiaryStyles.h4, styles.ButtonCancelStyle]}>{i18n.t('Modal.Cancel')}</Text>
                                  </Pressable>
                                </View>
                                <Pressable
                                  style={[styles.button, styles.buttonClose]}
                                  onPress={() => AddSubComment(postUpdate)}>
                                  <Text style={[BDiaryStyles.h4, styles.ButtonTextStyle]}>{i18n.t('addComment.publish')}</Text>
                                </Pressable>
                              </View>


                            </View>

                            {(imageRender && imagePost !== undefined && imagePost !== null) &&
                              <View style={{
                                flexDirection: "row",
                                margin: 10,
                                alignItems: "flex-start",
                                alignContent: "center",
                                justifyContent: "center",
                                height: 200,
                                width: 300
                              }}>


                                <Image source={{ uri: imagePost }}
                                  style={{
                                    borderRadius: 12,
                                    borderWidth: 0,
                                    // borderColor:borderColor,
                                    resizeMode: "cover",
                                    width: 300,
                                    height: 200
                                  }}
                                />
                                <TouchableOpacity
                                  style={{ padding: 5 }}
                                  onPress={() => deleteImage()}>
                                  <AntDesign style={{}} name="closecircleo" size={24} color="black" />
                                </TouchableOpacity>
                              </View>
                            }

                            {/* ModalTextInput */}
                            <View style={{ width: ScreenWidth }}>
                              {/* Response to */}
                              <View style={{ flexDirection: 'row', alignContent: "flex-start", alignItems: "center", justifyContent: "flex-start", padding: 10, }} >
                                <Text style={BDiaryStyles.commentText}>{i18n.t('addComment.response')}</Text>
                                <Text style={BDiaryStyles.commentTextGreen}>@{postUpdate.animal_id.name}</Text>
                                {(!isPostImage) &&
                                  <TouchableOpacity
                                    style={{ flex: 1, alignContent: "flex-end", alignItems: "flex-end" }}
                                    onPress={() => addImage()}>

                                    <AntDesign
                                      name="picture"
                                      size={22}
                                      color={Colors.greyH}
                                      //color='rgba(233, 233, 233, 0.9)'
                                      style={{ padding: 10 }}></AntDesign>
                                  </TouchableOpacity>
                                }
                              </View>

                              <View style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", padding: 10, backgroundColor: "white" }}>

                                <TextInput
                                  style={styles.textInputComments}
                                  defaultValue={text}
                                  value={text}
                                  keyboardType="default"
                                  multiline
                                  numberOfLines={12}
                                  ref={textInputRef}
                                  //autoCorrect={true}
                                  autoFocus={autofocus}
                                  placeholder={i18n.t('addComment.addComments')}
                                  autoCapitalize='none'
                                  autoCorrect={false}
                                  caretHidden={false}
                                  onChangeText={(text) => inputValidate(text, 'comment')}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </Modal>

                    </SafeAreaView>
                  </SafeAreaProvider>

                  {/* <FullScreenVideo
        visible={isFullImage}
        onClose={closeImage}
        item={postUpdate}
      /> */}

                </View>

              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                styles={{ flex: 1, height: 300 }}
                scrollEnabled={false}
                inverted={true}
                data={parentList}
                onRefresh={() => onRefresh()}
                refreshing={isFetching}
                renderItem={(item) => renderItem(item)}
                keyExtractor={(item) => item._id}
              />
            </View>

          </ScrollView>

        </TouchableWithoutFeedback>

        {(switcha === 0) &&
          <View style={{ flexDirection: 'column', position: "relative", justifyContent: "flex-start", alignContent: "flex-start", backgroundColor: 'rgba(255, 255, 255, 0.2)', borderTopWidth: 0, borderColor: Colors.greyL, padding: 10, }}>
            {(keyboardOpen && keyboardOpen === true) &&
              <View style={{ flexDirection: 'row' }} >
                <Text style={BDiaryStyles.commentText}>{i18n.t('addComment.response')}</Text>
                <Text style={BDiaryStyles.commentTextGreen}>@{postUpdate.animal_id.name}</Text>
              </View>
            }

            <View style={{ flexDirection: 'row', position: "relative", justifyContent: "center", alignContent: "center", }}>

              <View style={{ flex: 1, padding: 0, flexDirection: "row", borderWidth: 1, top: 0, borderColor: "#ccc", borderRadius: 22, }}>


                <TextInput
                  style={styles.textInputComments}
                  //defaultValue={text}
                  value={comments}
                  keyboardType="default"
                  multiline
                  ref={textInputRef}

                  // numberOfLines={8}
                  //autoCorrect={true}
                  autoFocus={autofocus}
                  placeholder={placeholder}
                  autoCapitalize='none'
                  autoCorrect={false}
                  caretHidden={false}
                  onChangeText={(text) => inputValidate(text, 'comment')}
                />




                {(switcha === 0) &&
                  <View>
                    {(commentlength > 0) &&
                      <View>
                        <TouchableOpacity onPress={() => addNewComments(postUpdate, imageId)} style={{}} >
                          <Ionicons

                            name="paper-plane-outline"
                            size={20}
                            color={Colors.greyH}
                            //color='rgba(233, 233, 233, 0.9)'
                            style={{ borderWidth: 0, alignContent: "center", padding: 5, paddingTop: 10, marginRight: 10, alignItems: "center", justifyContent: "center" }}></Ionicons>



                          {/* <Text style={{  paddingLeft: 10, paddingTop: 10, bottom: 0, fontWeight: "bold", color: Colors.greyH }}>{i18n.t('Page.Publish')}</Text> */}
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
                {(switcha === 1) &&
                  <TouchableOpacity style={{ borderWidth: 1, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 0, }} >
                    <Text style={{ padding: 0, bottom: 0, fontWeight: "bold", color: Colors.greyH }} onPress={() => this.modifyComments()}>{i18n.t('addComment.modify')}</Text>
                  </TouchableOpacity>
                }
              </View>

              <View style={{ height: 40, flexDirection: "row", padding: 0, alignItems: "center", alignContent: "center", justifyContent: "flex-start" }}>



                {/* {(params.from !== "SearchScreenSearch") &&
                      <TouchableOpacity
                        onPress={() => handlePickVideo()}>

                        <AntDesign
                          name="videocamera"
                          size={22}
                          color={Colors.greyH}
                          //color='rgba(233, 233, 233, 0.9)'
                          style={{ padding: 10 }}></AntDesign>
                      </TouchableOpacity>
                    } */}


                {(keyboardOpen && keyboardOpen === true) &&
                  <View style={{ flexDirection: "row" }}>
                    {/* <TouchableOpacity
                      onPress={() => openFullSizeModal()}>

                      <Fontisto
                        name="arrow-resize"
                        size={22}
                        color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ padding: 10 }}></Fontisto>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                      onPress={() => addImage()}>

                      <AntDesign
                        name="picture"
                        size={22}
                        color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ padding: 10 }}></AntDesign>
                    </TouchableOpacity>

                  </View>
                }

              </View>
            </View>
          </View>
        }

        {(switcha === 1) &&
          <View style={{}}>

            <View style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", borderBottomWidth: 1, borderTopWidth: 0, borderColor: '#ccc', backgroundColor: "red", padding: 10, }}>

              <View style={{ flex: 1, padding: 10, borderWidth: 3, top: 0, borderColor: "#ccc", borderRadius: 8, backgroundColor: Colors.red }}>
                <TextInput
                  style={styles.textInputComments}
                  //defaultValue={text}
                  value={text}
                  keyboardType="default"
                  multiline
                  numberOfLines={12}
                  ref={textInputRef}
                  //autoCorrect={true}
                  autoFocus={autofocus}
                  placeholder={placeholder}
                  autoCapitalize='none'
                  autoCorrect={false}
                  //caretHidden={false}
                  onChangeText={(text) => inputValidate(text, 'comment')}
                />
              </View>

              {(switcha === 0) &&
                <TouchableOpacity onPress={() => addNewComments(postUpdate, imageId)} style={{ borderWidth: 0, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 20, }} >
                  <Text style={{ padding: 10, fontWeight: "bold", color: Colors.greyH }}>{i18n.t('addComment.publish')}</Text>
                </TouchableOpacity>
              }
              {(switcha === 1) &&
                <TouchableOpacity onPress={() => modifyComments()}
                  style={{ borderWidth: 0, alignContent: "flex-end", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 20, }} >
                  <Text style={{ padding: 10, fontWeight: "bold", color: Colors.greyH }} >{i18n.t('addComment.modify')}</Text>
                </TouchableOpacity>
              }

            </View>
          </View>
        }

        {/* Modal */}
        <View style={[BDiaryStyles.centeredView, { width: ScreenWidth, height: ScreenHeight, position: "absolute", display: display }]}>
          <View style={[BDiaryStyles.modalView, {}]}>
            <Text style={[BDiaryStyles.modalTitle, { marginBottom: 20, }]}> {i18n.t('Modal.confirmation')}</Text>
            <View>
              <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.Warning_comment_message')}</Text>
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", width: "80%", alignContent: "space-between", justifyContent: "space-between", alignItems: "center" }}>
              <TouchableOpacity
                style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                onPress={onCloseModal}>
                <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Form.Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                onPress={() => GoToDeletePost()}>
                <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Form.Delete')}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};



const styles = StyleSheet.create({

  textInputComments: {
    fontFamily: 'Poppins-Regular',
    minHeight: 30,
    paddingLeft: 10,
    flex: 1,
    fontSize: 13,
    marginTop: 5,
    padding: 5,
    justifyContent: 'flex-start',
    borderWidth: 0,
  },

  inner: {
    marginTop: 0,
    paddingBottom: 10,

    flex: 1,
    justifyContent: "space-around",


    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 20,
        justifyContent: "flex-end",
      },
      android: {
        paddingTop: 0,
        paddingBottom: 20,
        justifyContent: "flex-end",
      },
    }),

  },


  appButtonContainer: {
    // elevation: 8,
    // backgroundColor:Colors.red,
    minHeight: 35,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.greyH,
    borderRadius: 3,

  },


  avatarPlaceholder: {
    width: 30,

    height: 30,
    borderRadius: 15,

    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {

    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,

    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarPlaceholderCard: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: Colors.greyH,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center',
  },
  avatarCard: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginTop: 80,
    backgroundColor: 'white',
    width: ScreenWidth,
    height: ScreenHeight,
    padding: 0,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonPublish: {
    backgroundColor: '#2196F3',
  },

  ButtonTextStyle: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 14,
  },
  ButtonCancelStyle: {
    color: Colors.greyH,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 14,
  },

});



export default AddComment;