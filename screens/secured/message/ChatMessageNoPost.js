import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, Text, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/styles";
import Colors from '../../../constants/Colors';
import { i18n } from "../../../constants/Localization";
import moment from 'moment';
import io from "socket.io-client";
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import PinchableBoxChat from '../../../components/elements/PinchableBoxChat';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import MessageImage from '../../../components/elements/MessageImage';
import MessageVideo from '../../../components/elements/MessageVideo';
import MessageText from '../../../components/elements/MessageText';
import MessageNoPostImage from '../../../components/elements/MessageNoPostImage';
import MessageNoPostVideo from '../../../components/elements/MessageNoPostVideo';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
import { CheckVideoFormat } from '../../../utils/helpers';
import ConfettiAnimation from '../../../components/elements/ConfettiAnimation';
const config = require('../../../config');
const noImg = require('../../../assets/images/logo_avatar.png');
const roomBackgroundImage = require('../../../assets/images/fondchatroom.jpg');


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const ratioPortrait = 0.562;
const ratioLandscape = 1.777;
const VideoPortraitHeight = (ScreenWidth * ratioPortrait) + ScreenWidth;
const VideoLandscapeHeight = (ScreenWidth * ratioLandscape) - ScreenWidth;
const messageHeight = 80;
const imageHeight = 300;
const videoHeight = 400;
const videoHeightLandscape = 300;

const ChatMessageNoPostScreen = ({ route }) => {

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.params;
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(route.params.room_id);
  const [itemMessage, setItemMessage] = useState(route.params.item_message);

  const [postList, setPostList] = useState([]);
  const [displayDownloadText, setDisplayDownloadText] = useState("none");
  const [heightDimension, setHeightDimension] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [imageChat, setImageChat] = useState(null);
  const [videoChat, setVideoChat] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [image, setImage] = useState("");
  const [imageFromCameraHeight, setImageFromCameraHeight] = useState("portrait");
  const [videoFormat, setVideoFormat] = useState("portrait");
  const [display, setDisplay] = useState("none");
  const [messageLength, setMessageLength] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageValidate, setMessageValidate] = useState(false);
  const [text, setText] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [getChatMessages, setGetChatMessages] = useState([]);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [itemModal, setItemModal] = useState([]);
  const [typeOfModal, setTypeOfModal] = useState([]);
  const [urlMedia, setUrlMedia] = useState("");
  const [imageModalDisplay, setImageModalDisplay] = useState('none');
  const [postDatas, setPostDatas] = useState(route.params.post_datas);
  const [hasConnection, setConnection] = useState(false);
  const [shareImageUri, setShareImageUri] = useState("");
  const [time, setTime] = useState(null);
  const [videoCameraUri, setVideoCameraUri] = useState("");
  const [displayCompressView, setDisplayCompressView] = useState("none");
  const [roomAvatarId, setRoomAvatarId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(i18n.t('Page.Add_Comments'));


  // Socket
  const socketRef = useRef(null);

  console.log("ChatMessageNoPost");

  useEffect(() => {
    getmessages();
    setImageId(null);
    if (route.params) {
      setVideoCameraUri(route.params.videocamerauri);
      setVideoChat(route.params.videocamerauri);
      setVideoFormat("Portrait");
      console.log("videocamerauri", videoCameraUri)
    }
  }, [params, isFetching, animalData, chatMessages]);

  useEffect(() => {
    getAvatarImage();
  }, [params, animalData]);


  useEffect(() => {
    inputValidate();
  }, [text]);

  useEffect(() => {
    // Socket
    socketRef.current = io(config.urichat, { transports: ["websocket"] });
    socketRef.current.on("connect", () => {
      //console.log("✅ Connecté au serveur avec ID :", socketRef.current.id);
    });

    socketRef.current.on("chat message", (msg) => {
      //console.log("Message reçu du serveur :", msg);
      setChatMessages([...chatMessages, msg]);
    });

    socketRef.current.on("disconnect", () => {
      // console.log("❌ Déconnecté du serveur");
    });

    socketRef.current.on("connect_error", (err) => {
      // console.log("⚠️ Erreur de connexion :", err);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


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



  // useEffect(() => {
  //   console.log("socket")
  //   const socket = io(config.urichat);
  //   console.log(socket)
  //   socket.on("chat message", msg => {
  //     console.log("socket msg", msg);
  //    // chatMessages: [...this.state.chatMessages, msg],
  //       setChatMessages([...chatMessages, msg]);
  //   })
  // }, [chatMessages]);


    const sendPushMessagetNotification = async () => {
      console.log("Fonction sendPushMessagetNotification")
      //var commentary = item.comment || '';
    //  const commentary_elliptic = commentary.length > 40 ? commentary.substring(0, 40) + "..." : commentary;
      var isavatar = animalData.avatars.length;
  
      try {
        const response = await fetch(config.uri + 'notifications/sendaddmessagenotifications', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagefrom: "comment",
            animal_id: animalData._id,
            otheranimal: params.animal_destinary,
            to: params.animal_destinary,
            title: "Notification Like",
            name: animalData.name,
            post_text: "commentary_elliptic",
            //post_id: item._id,
            notif_message: true,
            sender_id: animalData._id,
            sender_avatar: isavatar,
            language: i18n._locale,
            originname: params.animal_name,
            postanimalid: params.animal_destinary,
          }),
        });
        const res = await response.json();
        if (res.success) {
          console.log("Notification message envoyée avec succès !");
        } else {
          console.log("Erreur lors de l'envoi de la notification :", res);
        }
      } catch (error) {
        console.error("Erreur fetch notification:", error);
      }
    };

  const onRefresh = () => {
    setIsFetching(true);
    getmessages();
  };

  const getmessages = async () => {
    await fetch(config.uri + 'messages/getmessages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        room_id: roomId,

      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var postList = res;
          var PostListcount = Object.keys(res.postList).length;
          const postListKey = Object.keys(postList.postList).map(key => ({
            key,
            ...postList.postList[key]
          }));

          const lists = postList.postList.filter((x) => {
            //return x._id != remove_id;
            if (x.image_id !== null || x.video_id !== null) {
              //console.log("filter image",x.image_id);
              return x.room_id;
            } else {
              if (!x.image_id || !x.video_id) {
                return x.body !== " ... " && x.body !== " "
              }
            }
          });
          setPostList(lists.reverse());
          setDisplay("none");
          setIsFetching(false);
        }
        else {
          // console.log('ca marche PASSSS RES ?',res.success, res.key);
          alert('PRB GET MESSAGE');
        }
      });


  };

  const formdateDD = (item) => {
    const date = moment(item.cdate).format("DD/MM/YYYY");
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyH }}>{date}</Text>
    )
  };

  const findDimensions = (layout, index) => {
    const { x, y, width, height } = layout;

    setHeightDimension(height);



    //return layout
  };

  const submitChatMessage = async () => {

    if (itemMessage) {
      socketRef.current.emit('chat message', {
        image_id: itemMessage.image_id,
        video_id: itemMessage.video_id,
        videoformat: itemMessage.videoformat,
        // token: this.props.token.token,
        animal_infos: animalData,
        animal_id: animalData._id,
        // postmakerid: itemMessage,
        body: message,
        room_id: roomId,
        destination_data: itemMessage,
        // notificationtoken: this.state.notificationtoken,
      });

      setChatMessages(null);
      setDisplay("none");
      setItemMessage(null);
      setMessageLength(1);
    } else {
      socketRef.current.emit('chat message', {
        image_id: imageId,
        video_id: videoId,
        videoformat: videoFormat,
        //token: this.props.token.token,
        animal_infos: animalData,
        animal_id: animalData._id,
        // postmakerid: this.state.item_message,
        body: message,
        room_id: roomId,
        // destination_data: this.state.item,
        // notificationtoken: this.state.notificationtoken,
        // messagelength: 1,
      });
      setChatMessages(null);
      setDisplay("none");
      setItemMessage(null);
      setMessageLength(1);
    }
    setDisplay("none");
  };

  const inputValidate = (text, type) => {
    if (type == 'message') {
      var messagelength = text.length;
      if (messagelength === 0) {
        setMessageValidate(false);
        setMessage(text);
      }
      else {
        setMessageValidate(true);
        setMessage(text);
      }
    }
  };

  const addMessage = async () => {

    if (params.videocamerauri && videoChat) {
      saveVideo(videoChat, config.randomkey(16));
    }
    // Disable publish button to avoid double click
    setMessage(null);
    setText(null);
    setChatMessages(text);
    await fetch(config.uri + 'messages/addmessage', {
      method: 'POST',
      headers: {
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        // token: this.props.token.token,
        image_id: imageId,
        video_id: videoId,
        animal_infos: animalData,
        user_id: userData._id,
        videoformat: postDatas.videoformat,
        body: message,
        animal_id: animalData._id,
        destinary: postDatas.destinary,
        postanimalmakerid: postDatas.animal_datas._id,
        room_id: params.room_id,
        destination_data: postDatas.animal_destinary,
        //notificationtoken: this.props.user.notificationtoken,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setImageChat(null);
          setVideoChat(null);
          // setVideoId(null);
          setVideoCameraUri(null);
          setText(' ');
          setImageId(null);
          // setVideoId(null);
          setNotifMessage(res.notifinfo.message);
          setNotifTitle(res.notifinfo.title);
          // setMessageLength(1);
          setDisplay("none");
          submitChatMessage();
          setChatMessages(null);
          Keyboard.dismiss();
          sendPushMessagetNotification();
          
        } else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('PRB adding Message');
        }
      })
  };

  const formdate = (item) => {
    const date = moment(item.cdate).fromNow();
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 11, color: Colors.greyM }}>... {date}</Text>
    )
  };

  const formdateImage = (item) => {
    const date = moment(item.cdate).fromNow();
    return (
      <Text style={{ fontWeight: 'normal', fontSize: 13, color: Colors.white }}>... {date}</Text>
    )
  };

  const removeMessage = (item) => {
    setDisplay("flex");
    setItemModal(item);
    setTypeOfModal("erase");
  };

  const openImageModal = async (url) => {
    setImageModalDisplay('flex');
    setTypeOfModal('image')
    setUrlMedia(url);
  };

  const closeImageModal = () => {
    setImageModalDisplay('none');
  };

  const openLoadingModal = (url, item) => {
    setDisplay('flex');
    setUrlMedia(url);
    setTypeOfModal('download')
  };

  const onCloseModal = () => {
    setDisplay('none');
  };

  const deleteOneMessage = async () => {
    setDisplay('none');
    fetch(config.uri + 'messages/deleteonemessage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        user_id: userData._id,
        room_id: roomId,
        item: itemModal,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setDisplay('none');
          getmessages();
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
  };

  const gotoPostDetails = async (item) => {

    await fetch(config.uri + 'posts/getonepost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: item.post_datas[0]._id

      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          var postList = res;
          // console.log("res rees", res)
          //var userfavorites = res.userfavorites;
          //var favorites = res.favoris;

          //console.log("GETONE POST postListpostListpostListAAAAA", postList.postList);

          // this.setState({

          //   newpostUpdate: postList.postList,
          //   // postUpdate:  postList.postList,
          //   // favorites: postList.postList.favorites,
          //   isLoading: false,
          //   modalVisible: false,
          //   modalSearchVisible: false,
          //   post_datas: postList.postList[0],
          //   loadingrender: true,
          // });

          navigation.navigate('AddComment', {
            navigateTo: "SearchScreen",
            navigateToChat: true,
            screen: 'AnimalDetails',
            postUpdate: postList.postList[0],
            item: postList.postList[0],
            // postnumerselected: index,
            otherParam: 'anything you wxxxxxxant here',
          })





          //console.log("GETONE POST newpostUpdatenewpostUpdatenewpostUpdate", this.state.newpostUpdate[0]);



        }
        else {
          console.log("No Posts")
          //alert(config.fetcherror.prbRes);
        }
      });

  };

  const takePictureAndCreateAlbum = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImageChat(result.assets[0].uri);
      setImageId(config.randomkey(16));
      saveImage(result.assets[0].uri, config.randomkey(16));
    } else {
      return;
    }
  };

  const pickImageLibrary = async () => {

    setDisplay("none");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("pickImageLibrairy result", result);


    if (!result.canceled) {

      if (result.assets[0].type !== "video") {
        console.log("pickImageLibrairy result ok Image");
        setImageChat(result.assets[0].uri);
        setImageId(config.randomkey(16));
        saveImage(result.assets[0].uri, config.randomkey(16));
      } else {
        console.log("pickImageLibrairy result ok VIDEO", result.assets[0].uri);
        setVideoChat(result.assets[0].uri);
        // setVideoId(config.randomkey(16));
        saveVideo(result.assets[0].uri, config.randomkey(16));
      }

    } else {
      console.log("Picker Image Prb");
      return;
    }
  };

  const saveImage = async (LibraryimageUri, newImageId) => {

    const manipResult = await ImageManipulator.manipulateAsync(
      LibraryimageUri,
      [{ resize: { width: 1080 } }],
      {
        compress: 1.0,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: false
      }
    );

    let file = [];
    let mfile = newImageId;
    const fileName = newImageId;
    setImageId(newImageId);

    const dataPost = new FormData();
    const imageUriPost = manipResult.uri.replace('file:/data', 'file:///data');

    if (Platform.OS === 'web') {
      // Just passing the image URI works only on web
      dataPost.append('file', imageUriPost);
    } else {
      dataPost.append('venue', userData._id);
      dataPost.append('_id', animalData._id);
      dataPost.append('avatarImg', {
        uri: imageUriPost,
        type: "image/jpeg",
        name: newImageId,
      });

      const options = {
        method: 'POST',
        body: dataPost,
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          //'x-access-token': userData._id
        })
      };

      fetch(config.uri + 'posts/saveimage', options)
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            // setImageId(imageId);
            setDisplay(none);
            setVideoId(null);
          }
          else {
            console.log('saveImage Prb', res);
          }
        });
    }
  };

  const saveVideo = async (LibraryVideoUri, newVideoId) => {

    let file = [];
    let mfile = 'file';
    const fileName = newVideoId;

    Keyboard.dismiss();
    setDisplayCompressView("flex");
    setImageId(null);
    setVideoId(newVideoId);

    const imageId = newVideoId;
    const postdata = new FormData();
    const imageUri = LibraryVideoUri.replace('file:/data', 'file:///data');

    if (Platform.OS === 'web') {
      // Just passing the image URI works only on web
      postdata.append('file', imageUri);
    } else {
      postdata.append('venue', userData);
      postdata.append('_id', animalData._id);
      postdata.append('avatarImg', {
        uri: imageUri,
        type: "video/mov",
        name: fileName,
        videoId: newVideoId
      });

      const options = {
        method: 'POST',
        body: postdata,
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          // 'x-access-token': this.props.token.token
        })
      };

      fetch(config.uri + 'posts/savevideo', options)
        .then((response) => response.json())
        .then((res) => {

          console.log("ressss SAVE VIDEO", res)
          if (res) {
            setVideoFormat(res.format);
            // setVideoId(videoId);
            setDisplay("none");
            setDisplayCompressView("none");
            setImageId(null);
            setIsFetching(false);
          }
        });
    }
  };

  const openShareDialogAsync = async (item) => {

    if (Platform.OS === 'web') {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    FileSystem.downloadAsync(
      config.linkserver + item.animal_id._id + '/images/posts/' + item.image_id + '.jpg',
      FileSystem.documentDirectory + item.image_id + '.jpeg'
    )
      .then(({ uri }) => {
        setShareImageUri(uri);
        try {
          let filename = item.image_id + '.jpeg'; // or some other way to generate filename
          let filepath = `${FileSystem.documentDirectory}/${filename}`;
          console.log("filepath", filepath)
          let rslt = FileSystem.writeAsStringAsync(filepath, shareImageUri, { encoding: 'base64' });
          console.log("FileSystem rslt :", rslt)
          Sharing.shareAsync(filepath, { mimeType: 'image/jpeg' })
        } catch (e) {
          alert(e.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const loadChatPicture = async (url) => {
    // Open validate Modal
    setDisplay("none");
    //console.log("MediaLibrary.saveToLibraryAsync(url)",UserPermissions.getCameraPermission())
    const { uri } = JSON.stringify(url);

    if (url) {
      await MediaLibrary.saveToLibraryAsync(url)
      // alert('Image saved to Library')

      setDisplayDownloadText("flex");

      setTimeout(() => {
        setDisplayDownloadText("none"),
          setDisplay("none")
      }, 1000);


    } else {
      alert('You did not allow permissions to camera');
    }



  };

  const getAvatarImage = () => {
    if (params && params.sendPostData.talkers) {
      const array = params.sendPostData.talkers ?? [];
      const otherAnimalId = array.find(id => id !== animalData._id);
      if (otherAnimalId !== animalData._id) {
        setRoomAvatarId(otherAnimalId);
        // setRoomName(params.sendPostData.animal_id.name);
      } else {
        setRoomAvatarId(animalData._id);
        //setRoomName("arams.sendPostData.animal_id.name");
        // setRoomName(params.animal_name);
      }
    }
  };

  const renderItem = (item, index) => {

    //const imagehorizontalLeft= 0;

    if (item.item.animal_id._id === animalData._id) {
      var imagehorizontalLeft = 80;
      var imagehorizontalRight = 0;
      var horizontalLeft = 40;
      var horizontalRight = 0;
      var backgroundcolor = "#e5efd5"
      var bordercolor = "#e5efd5"
    };

    if (item.item.animal_id._id !== animalData._id) {
      var imagehorizontalLeft = 0;
      var imagehorizontalRight = 0;
      horizontalLeft = 0;
      horizontalRight = 0;
      backgroundcolor = "#c5ea7f"
      bordercolor = "#c5ea7f"
    };

    return (
      <View key={index}>
        <View style={{ padding: 10, marginTop: 0 }} onLayout={(event) => { findDimensions(event.nativeEvent.layout, index) }}>

          {/* First from who is the message Post or chat ?}  
          {/* Message from Post (postanimalmakerid)}
          {/* ITS A POST FROM WALL */}

          <View>
            {(item && item.item.post_datas.length === 1) &&
              <View>

                <MessageImage
                  item={item}
                  openImageModal={openImageModal}
                  removeMessage={removeMessage}
                  modalVisible={modalVisible}
                  display={display}
                  openLoadingModal={openLoadingModal}
                  gotoPostDetails={gotoPostDetails}
                  openShareDialogAsync={openShareDialogAsync}
                />
                <MessageVideo
                  item={item}
                  openImageModal={openImageModal}
                  removeMessage={removeMessage}
                  modalVisible={modalVisible}
                  display={display}
                  openLoadingModal={openLoadingModal}
                  gotoPostDetails={gotoPostDetails}
                  VideoFormat={CheckVideoFormat(ScreenWidth, item)}
                  shouldPlay={shouldPlay}
                />

                {/* Message without img & video && body (message) */}
                <MessageText
                  item={item}
                  removeMessage={removeMessage}
                />

              </View>
            }
          </View>

          {/* ITS NOT A POST FROM WALL */}
          {(item && item.item.post_datas.length === 0) &&
            <View>

              <MessageNoPostImage
                item={item}
                openImageModal={openImageModal}
                removeMessage={removeMessage}
                modalVisible={modalVisible}
                display={display}
                openLoadingModal={openLoadingModal}
                gotoPostDetails={gotoPostDetails}
                openShareDialogAsync={openShareDialogAsync}
              />

              <MessageNoPostVideo
                item={item}
                openImageModal={openImageModal}
                removeMessage={removeMessage}
                modalVisible={modalVisible}
                display={display}
                openLoadingModal={openLoadingModal}
                gotoPostDetails={gotoPostDetails}
                videoFormat={CheckVideoFormat(ScreenWidth, item)}
                shouldPlay={shouldPlay}
                displayDownloadText={displayDownloadText}
              />
              <MessageText
                item={item}
                removeMessage={removeMessage}
              />

            </View>
          }

          {/* Start Creation Room date */}
          {(item.item.body === "bodyTxt") &&
            <View style={{ marginLeft: 0, marginRight: 0, borderWidth: 0, }}>
              <View style={{ alignContent: "center", justifyContent: "center", height: 40, paddingTop: 0, paddingLeft: 10, borderWidth: 0, }}>
                <Text style={{ fontWeight: 'normal', fontStyle: "italic", fontSize: 12, color: Colors.greyH, }}>{i18n.t('Page.Discuss_Creation')} {formdateDD(item.item)}</Text>
              </View>
            </View>
          }

        </View>
      </View>

    )
  };

  const handlePickVideo = async () => {
    navigation.navigate('VideoCapture', {
      screen: 'Message',
      from: "Message",
      navigateTo: "Message"
    });
  };


  if (isFetching) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" color={Colors.greyL} />
      </View>
    )
  } else {

    const renderchatMessages = getChatMessages.map((chatMessage, i) => (
      <View key={i} display={display}>
        {(chatMessage.animal_infos._id === animalData._id) &&
          <View style={{ borderBottomWidth: 0, borderColor: "#f2dbec", backgroundColor: "#fff", padding: 10, }}>
            {/* Image from camera  */}
            {(chatMessage.image_id !== null) &&
              <Image
                source={{
                  uri: config.linkserver + chatMessage.animal_infos.animal_id + '/images/posts/' + chatMessage.image_id + '.jpg',
                }}
                style={{
                  justifyContent: "center",
                  borderRadius: 8,
                  borderWidth: 0,
                  // borderColor:borderColor,
                  //resizeMode: "contain",
                  width: '100%',
                  height: 300,
                  marginBottom: 5
                }}
              />
            }
            {/* Image from video  */}
            {(chatMessage.video_id !== null) &&
              <>

                <Video
                  source={{
                    uri: config.linkserver + chatMessage.animal_id + '/images/posts/videos/' + chatMessage.video_id + '.mp4'
                  }}
                  volume={5}
                  isMuted={true}
                  style={[styles.cardVideoPortrait, { height: ScreenHeight, zIndex: 2 }]}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={shouldPlay}
                />

              </>
            }

            {/* Image from posts  */}
            <View style={{ backgroundColor: "#f2dbec", borderRadius: 10, borderWidth: 3, borderColor: "#f2dbec", marginLeft: 0, marginRight: 0, width: ScreenWidth - 60 }}>
              <View style={{ flexDirection: "row", paddingTop: 10, borderWidth: 0, justifyContent: "space-between", backgroundColor: "#f2dbec" }}>
                <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 14, padding: 10, paddingTop: -10, textTransform: 'capitalize' }}>
                  {chatMessage.animal_infos.name}</Text>
                <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM, paddingTop: 5, paddingRight: 10 }}>{i18n.t('Page.Just_Now')}</Text>
              </View>
              <View style={{ backgroundColor: "#f2dbec" }}>
                <Text style={{ paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 12 }}>{chatMessage.body}</Text>
              </View>
            </View>
          </View>
        }
        {/* From Other */}
        {(chatMessage.animal_id !== animalData._id) &&
          <View style={{ borderBottomWidth: 5, borderColor: "#f2dbec", backgroundColor: "#fff", padding: 10, }}>

            {(chatMessage.image_id !== null && itemMessage) &&
              <Image
                source={{
                  uri: config.linkserver + chatMessage.postmakerid.animal_id._id + '/images/posts/' + chatMessage.image_id + '.jpg',
                }}
                style={{
                  justifyContent: "center",
                  borderRadius: 8,
                  borderWidth: 0,
                  // borderColor:borderColor,
                  //resizeMode: "contain",
                  width: '100%',
                  height: 280,
                  marginBottom: 5
                }}
              />

            }
            {(chatMessage.image_id !== null && !itemMessage) &&
              <Image
                source={{
                  uri: config.linkserver + chatMessage.animal_id + '/images/posts/' + chatMessage.image_id + '.jpg',
                }}
                style={{
                  justifyContent: "center",
                  borderRadius: 8,
                  borderWidth: 0,
                  // borderColor:borderColor,
                  //resizeMode: "contain",
                  width: '100%',
                  height: 280,
                  marginBottom: 5
                }}
              />

            }

            {(chatMessage.video_id !== null && itemMessage) &&
              <View>
                <Video
                  source={{
                    uri: config.linkserver + chatMessage.postmakerid._id + '/images/posts/videos/' + chatMessage.video_id + '.mp4'
                  }}
                  volume={5}
                  isMuted={true}
                  style={[styles.cardVideoPortrait, { zIndex: 2 }]}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={shouldPlay}
                />

              </View>


            }
            {(chatMessage.video_id !== null && !itemMessage) &&
              <View>
                <Video
                  source={{
                    uri: config.linkserver + chatMessage.animal_id + '/images/posts/videos/' + chatMessage.video_id + '.mp4'
                  }}
                  volume={5}
                  isMuted={true}
                  style={[styles.cardVideoPortrait, { zIndex: 2 }]}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={shouldPlay}
                />

              </View>

            }

            <View style={{ backgroundColor: "#f2dbec", borderRadius: 10, borderWidth: 3, borderColor: "#f2dbec", marginLeft: 40, marginRight: 0, width: ScreenWidth - 60 }}>
              <View style={{ flexDirection: "row", paddingTop: 10, borderWidth: 0, justifyContent: "space-between", backgroundColor: "#f2dbec" }}>
                <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 14, padding: 10, paddingTop: -10, textTransform: 'capitalize' }}>
                  {chatMessage.animal_infos.name}
                </Text>
                <Text style={{ textAlign: "right", paddingTop: 5, paddingRight: 10, fontWeight: 'normal', fontSize: 10, color: Colors.white }}>{i18n.t('Page.Just_Now')}</Text>
              </View>

              <View style={{ backgroundColor: "#f2dbec" }}>
                <Text style={{ paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 12 }}>{chatMessage.body}</Text>
              </View>
            </View>
          </View>}


        {/*  <View>
      <Text style={{borderWidth: 2, color:"#000", top: 0}}>{chatMessage}</Text>
      </View> */}

      </View>

    ));


    return (


      <View style={[BDiaryStyles.container, {}]}>
<ImageBackground
          source={require('../../../assets/images/fondchatroom.jpg')}
          style={BDiaryStyles.container}
          resizeMode="cover"
        >
        {(roomAvatarId !== null) &&

        <View style={{position:"relative", zIndex:10,}}>
 
          <HeaderBuddy
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={params?.title || params.name}
            navigationName="User"
            navigationFrom="User"
            goBack={true}
            avatar={true}
            animal_destinary={roomAvatarId}
            roomName={roomName}
          />
          </View>
        }
        {/* <View style={{ position:"relative", zIndex:0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ConfettiAnimation />
    </View> */}

       
          <View style={{ borderWidth: 0, display: displayCompressView, height: ScreenHeight, alignContent: "center", justifyContent: "center", alignItems: "center", zIndex: 1 }}>
            <ActivityIndicator size="small" color={Colors.greyH} />
            <Text style={{ top: 10, padding: 10, fontSize: 15, fontWeight: "normal", color: Colors.greyM }}>{i18n.t('Medias.VideoProcessing')}</Text>
            <Text style={{ padding: 5, fontSize: 15, fontWeight: "normal", color: Colors.greyM }}>{i18n.t('Medias.PleaseWait')} ...</Text>
          </View>

          


            {/* Fond gris de la modal */}

            <View style={[BDiaryStyles.centeredView, {
              zIndex: 900, width: '100%', flex: 1,
              height: '100%', position: "absolute", display: display
            }]}>
              <View style={[BDiaryStyles.modalView]}>
                <Text style={BDiaryStyles.modalTitle}> {i18n.t('Modal.confirmation')}</Text>
                {(typeOfModal === "download") &&
                  <View>
                    <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.Warning_Download')}</Text>
                  </View>
                }
                {(typeOfModal === "downloadvideo") &&
                  <View>
                    <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.Warning_DownloadVideo')}</Text>
                  </View>
                }
                {(typeOfModal === "erase") &&
                  <View>
                    <Text style={BDiaryStyles.modalText}>{i18n.t('Modal.Warning_Delete_Message')}</Text>
                  </View>
                }

                <View style={{ flexDirection: "row", width: "80%", alignContent: "space-between", justifyContent: "space-between", alignItems: "center" }}>
                  <TouchableOpacity
                    style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonClose]}
                    onPress={() => onCloseModal()}>
                    <Text style={BDiaryStyles.modalTextStyle}>{i18n.t('Form.Cancel')}</Text>
                  </TouchableOpacity>
                  {(typeOfModal === "erase") &&
                    <TouchableOpacity
                      style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                      onPress={() => deleteOneMessage()}>
                      <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('addComment.delete')}</Text>
                    </TouchableOpacity>
                  }
                  {(typeOfModal === "download") &&
                    <TouchableOpacity
                      style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                      onPress={() => loadChatPicture(url)}>
                      <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Page.Download')}</Text>
                    </TouchableOpacity>
                  }
                  {(typeOfModal === "downloadvideo") &&
                    <TouchableOpacity
                      style={[BDiaryStyles.modalButton, BDiaryStyles.modalButtonAction]}
                      onPress={() => loadVideoPicture(url)}>
                      <Text style={BDiaryStyles.modalTextStyleAction}>{i18n.t('Page.Download')}</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View>

            <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 0}
            style={{ flex: 1 }}>

            {(typeOfModal === "image") &&
              <View style={{ backgroundColor: "black", alignContent: "center", padding: 0, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => closeImageModal()}
                  style={{ display: imageModalDisplay, borderWidth: 0, top: - ScreenHeight / 8 }}>

                  {/* <PinchableBoxChat imageUri={urlMedia}
                    item={urlMedia}
                  /> */}
                  <Image
                    source={{
                      uri: urlMedia,
                    }}
                    style={{
                      top: ScreenHeight / 12,
                      zIndex: 999,
                      justifyContent: "center",
                      borderRadius: 0,
                      borderWidth: 0,
                      // borderColor:borderColor,
                      resizeMode: "contain",
                      width: ScreenWidth,
                      height: ScreenHeight
                    }}
                  />


                </TouchableOpacity>
              </View>
            }


            {(postList.length === 0) &&
              <View style={{ flex: 1, margin: 15 }}>
                <Text style={{ textAlign: 'center', color: Colors.greyM }}>{i18n.t('Error.NoMessages')}</Text>
              </View>
            }

            <View style={[styles.inner]}>
              {(!itemMessage) &&
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 0 }}
                  //getItemLayout={this.getItemLayout}
                  //ref={(ref) => { this.flatListRef = ref; }}
                  horizontal={false}
                  data={postList}
                  //extraData={this.state}
                  keyExtractor={(item) => item._id}
                  inverted={true}
                  renderItem={renderItem}
                  onRefresh={() => onRefresh()}
                  refreshing={isFetching}
                />
              }



              {renderchatMessages}

              {(imageChat) &&
                <View style={{
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center", width: "100%", padding: 0, backgroundColor: Colors.white
                }}>

                  <Image
                    source={{
                      uri: imageChat,
                    }}
                    style={{
                      justifyContent: "center",
                      borderRadius: 0,
                      borderWidth: 0,
                      // borderColor:borderColor,
                      resizeMode: "contain",
                      width: ScreenWidth,
                      height: "auto"
                    }}
                  />


                  <View>

                    {(imageFromCameraHeight === "portrait") &&
                      <Image
                        source={{
                          uri: imageChat,
                        }}
                        style={{

                          borderRadius: 12,
                          borderWidth: 0,
                          // borderColor:borderColor,
                          resizeMode: "contain",
                          padding: 10,
                          width: 350,
                          height: 350
                        }}
                      />

                    }

                    {(imageFromCameraHeight === "landscape") &&
                      <View style={{ zIndex: 2, backgroundColor: "#000", width: ScreenWidth, height: ScreenHeight - 100 }}>
                        <Image
                          source={{
                            uri: imageChat,
                          }}
                          style={{
                            top: ScreenHeight / 2.66,
                            zIndex: 999,
                            justifyContent: "center",
                            borderRadius: 0,
                            borderWidth: 0,
                            // borderColor:borderColor,
                            //resizeMode: "contain",
                            width: ScreenWidth,
                            height: ScreenHeight / 3
                          }}
                        />
                      </View>
                    }
                  </View>
                </View>
              }

              {(videoChat) &&
                <View style={{ padding: 0, backgroundColor: "#000" }}>

                  {(videoFormat === "landscape") &&
                    <View style={{ zIndex: 2, backgroundColor: "#000", width: ScreenWidth, height: ScreenHeight - 100 }}>
                      <Video
                        source={{
                          uri: videoChat,
                        }}
                        volume={5}
                        isMuted={true}
                        style={{
                          top: ScreenHeight / 2.66,
                          position: "relative",
                          justifyContent: "center",
                          resizeMode: "cover",
                          zIndex: 12,
                          borderRadius: 0,
                          width: ScreenWidth,
                          height: ScreenHeight / 3
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay={shouldPlay}
                      />

                    </View>
                  }
                  {(videoFormat === "portrait" || videoFormat === "Portrait") &&
                    <Video
                      source={{
                        uri: videoChat,
                      }}
                      volume={5}
                      isMuted={true}
                      style={{
                        justifyContent: "center",
                        resizeMode: "cover",
                        zIndex: 1,
                        borderRadius: 8,
                        width: ScreenWidth,
                        height: "100%"
                      }}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      shouldPlay={shouldPlay}
                    />}

                </View>
              }

              {(videoCameraUri) &&
                <View style={{ padding: 0, backgroundColor: "#000" }}>

                  {(videoFormat === "landscape") &&
                    <View style={{ zIndex: 2, backgroundColor: "#000", width: ScreenWidth, height: ScreenHeight - 100 }}>
                      <Video
                        source={{
                          uri: videoCameraUri,
                        }}
                        volume={5}
                        isMuted={true}
                        style={{
                          top: ScreenHeight / 2.66,
                          position: "relative",
                          justifyContent: "center",
                          resizeMode: "cover",
                          zIndex: 12,
                          borderRadius: 0,
                          width: ScreenWidth,
                          height: ScreenHeight / 3
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay={shouldPlay}
                      />
                      <Text>dqdqdqsd</Text>
                    </View>
                  }
                  {(videoFormat === "portrait") &&
                    <Video
                      source={{
                        uri: videoCameraUri,
                      }}
                      volume={5}
                      isMuted={true}
                      style={{
                        justifyContent: "center",
                        resizeMode: "cover",
                        zIndex: 1,
                        borderRadius: 8,
                        width: ScreenWidth,
                        height: "100%"
                      }}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      shouldPlay={shouldPlay}
                    />

                  }

                </View>
              }

              <View>

                {(itemMessage && itemMessage !== "PostDatas") &&
                  <>
                    {(itemMessage !== "PostDatas" && itemMessage.image_id !== null) &&
                      <View style={{ padding: 0, backgroundColor: "#000" }}>
                        <Image
                          source={{
                            uri: config.linkserver + itemMessage.animal_id._id + '/images/posts/' + itemMessage.image_id + '.jpg',
                          }}
                          style={{
                            justifyContent: "center",
                            borderRadius: 8,
                            borderWidth: 0,
                            // borderColor:borderColor,
                            //resizeMode: "contain",
                            width: '100%',
                            height: 400
                          }}
                        />
                        {(itemMessage) &&
                          <Text style={{ padding: 10, fontStyle: "italic", color: Colors.greyM, alignSelf: 'flex-start', borderWidth: 0 }}>
                            {config.textEllipsis2(itemMessage.comment, 120)}
                          </Text>
                        }
                      </View>
                    }
                    <>
                      {(itemMessage.video_id !== null) &&
                        <View style={{ padding: 0, backgroundColor: "#000" }}>
                          {(itemMessage.videoformat === "portrait") &&
                            <View>
                              <Video
                                source={{
                                  uri: config.linkserver + itemMessage.animal_id._id + '/images/posts/videos/' + itemMessage.video_id + '.mp4'
                                }}
                                volume={5}
                                isMuted={true}
                                style={[styles.cardVideoPortrait, { zIndex: 2 }]}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                shouldPlay={shouldPlay}
                              />

                            </View>}
                          {(itemMessage.videoformat === "landscape") &&
                            <View>
                              <Video
                                source={{
                                  uri: config.linkserver + itemMessage.animal_id._id + '/images/posts/videos/' + itemMessage.video_id + '.mp4'
                                }}
                                volume={5}
                                isMuted={true}
                                style={[styles.cardVideoLandscape, { zIndex: 2 }]}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                shouldPlay={shouldPlay}
                              />
                            </View>}
                          {(itemMessage) &&
                            <Text style={{ padding: 10, fontStyle: "italic", color: Colors.greyM, alignSelf: 'flex-start', borderWidth: 0 }}>
                              {config.textEllipsis2(itemMessage.comment, 120)}

                            </Text>}

                        </View>
                      }
                    </>
                  </>
                }

              </View>

              <View style={{ top: 0, flexDirection: 'row', borderBottomWidth: 0, borderTopWidth: 0, borderColor: '#ccc', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, }}>

                <View style={{ backgroundColor: Colors.white, flex: 1, padding: 0, flexDirection: "row", borderWidth: 1, top: 0, borderColor: "#ccc", borderRadius: 22, }}>
                  <TextInput
                    style={{ padding: 10, top: 0, flex: 1, fontSize: 14, justifyContent: 'flex-start', borderWidth: 0, }}
                    defaultValue={text}
                    //value={this.state.text}
                    multiline
                    autoFocus={false}
                    //autoCorrect={true}
                    // autoFocus={this.state.autoFocus}
                    placeholder={i18n.t('chatRoom.yourMessage')}
                    autoCapitalize='none'
                    autoCorrect={false}
                    caretHidden={false}
                    onChangeText={(chatMessage) => inputValidate(chatMessage, 'message')}
                  />
                  <View>
                    {(message !== null) &&
                      <TouchableOpacity
                        onPress={() => addMessage()}
                        style={{ borderWidth: 0, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end", padding: 0, }} >
                        <Ionicons
                          name="paper-plane-outline"
                          size={20}
                          color={Colors.greyH}
                          //color='rgba(233, 233, 233, 0.9)'
                          style={{ alignContent: "center", padding: 5, paddingTop: 10, marginRight: 10, alignItems: "center", justifyContent: "center" }}></Ionicons>
                      </TouchableOpacity>
                    }
                  </View>
                </View>

                {(!itemMessage && (keyboardOpen && keyboardOpen === true)) &&
                  <View style={{ height: 40, flexDirection: "row", padding: 0, alignItems: "center", alignContent: "center", justifyContent: "flex-start" }}>


                    <TouchableOpacity onPress={() => takePictureAndCreateAlbum()} >
                      <Feather
                        name="camera"
                        size={22}
                        color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ padding: 10 }}></Feather>
                    </TouchableOpacity>


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


                    <TouchableOpacity
                      onPress={() => { pickImageLibrary() }}>

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
          </KeyboardAvoidingView>
        </ImageBackground>

       
      </View>

    )
  }
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },


  inner: {
    marginTop: 0,
    paddingBottom: 0,
    flex: 1,
    justifyContent: "space-around",
    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: "flex-end",
      },
      android: {
        paddingTop: 0,
        paddingBottom: 10,
        justifyContent: "flex-end",
      },
    }),
  },

  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },

  card: {
    backgroundColor: '#ccc',
    marginBottom: 25
  },

  cardVideoPortrait: {
    justifyContent: "center",
    resizeMode: "cover",
    zIndex: 1,
    borderRadius: 8,
    // width: ScreenWidth,
    height: VideoPortraitHeight,
  },

  cardVideoLandscape: {
    justifyContent: "center",
    resizeMode: "cover",
    zIndex: 1,
    borderRadius: 8,
    // width: ScreenWidth,
    height: VideoLandscapeHeight,
  },

});

export default ChatMessageNoPostScreen;


