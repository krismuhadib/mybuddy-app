import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, Text, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import { i18n } from "../../../constants/Localization";
import moment from 'moment';
import io from "socket.io-client";
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import PinchableBoxChat from '../../../components/elements/PinchableBoxChat';
import HeaderBuddy from '../../../components/elements/HeaderBuddy';
const config = require('../../../config');
const noImg = require('../../../assets/images/logo_avatar.png');

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

const ChatMessageScreen = ({ route }) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const params = route.params;


  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(route.params.room_id);
  const [itemMessage, setItemMessage] = useState(route.params.item_message);
  const [videoCameraUri, setVideoCameraUri] = useState("");
  const [postList, setPostList] = useState([]);
  const [displayDownloadText, setDisplayDownloadText] = useState("none");
  const [heightDimension, setHeightDimension] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [imageChat, setImageChat] = useState(null);
  const [videoChat, setVideoChat] = useState(null);
  const [videoId, setVideoId] = useState("");
  const [imageId, setImageId] = useState("");
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
  const [time, setTime] = useState(null);
  console.log("ChatMessageScreen itemMessage",itemMessage );

  useEffect(() => {
    getmessages();
  }, [params, isFetching, animalData]);


  useEffect(() => {
    inputValidate();
  }, [text]);


  useEffect(() => {
    console.log("socket")
    const socket = io(config.urichat);
    socket.on("chat message", msg => {
     console.log("socket msg", msg);
     chatMessages: [...this.state.chatMessages, msg],
      setChatMessages([...chatMessages, msg]);
    })
  }, [chatMessages]);


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
                console.log("No image");
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
          alert('Les infos User/Password sont mal remplies');
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

  const submitChatMessage = () => {
    

    if (animalData) {
      socket.emit('chat message', {
        image_id: itemMessage.image_id,
        video_id: itemMessage.video_id,
        videoformat: itemMessage.videoformat,
        // token: this.props.token.token,
        animal_infos: animalData,
        animal_id: animalData._id,
        postmakerid: itemMessage,
        body: message,
        room_id: roomId,
        destination_data: itemMessage,
        // notificationtoken: this.state.notificationtoken,
      });

      setChatMessages('');
      setDisplay("none");
      setItemMessage(null);
      setMessageLength(1);
      // this.setState({
      //   chatMessage: '',
      //   display: "none",
      //   placeholder: "",
      //   item_message: null,
      //   messagelength: 1,

      // });
    } else {
      socket.emit('chat message', {
        image_id: itemMessage.image_id,
        video_id: itemMessage.video_id,
        videoformat: itemMessage.videoformat,
        // token: this.props.token.token,
        animal_infos: animalData,
        animal_id: animalData._id,
        postmakerid: itemMessage,
        body: this.state.message,
        room_id: roomId,
        destination_data: itemMessage,
        //notificationtoken: this.state.notificationtoken,
        messageength: 1,
      });
      setChatMessages('');
      setDisplay("none");
      setItemMessage(null);
      setMessageLength(1);

      // this.setState({
      //   chatMessage: '',
      //   display: "none",
      //   placeholder: "",
      //   item_message: null,
      //   messagelength: 1,
      // });

    }
    setDisplay("none");
  };

  const inputValidate = (text, type) => {
    console.log("text", text)

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
    console.log("addMessage itemMessage", itemMessage)
    console.log("addMessage messageValidate", messageValidate)

    // Disable publish button to avoid double click
   // setMessage(null)
   // setText(null)

    console.log("message validate", messageValidate)
    // this.getAnimalDoc();

    //   if (this.state.message) {
    //     alert(i18n.t('Fetch_Error.Empty_Field'));
    //    return;

    // };
    //   console.log("Sending message HHHH, datas sendPostData: this.state.notificationtoken ", this.state.notificationtoken);
    //   console.log("this.state.sendPostDatathis.state.sendPostDatathis.state.sendPostDatathis.state.sendPostData", this.state.sendPostData)


      console.log("ADD MESSAGDE NI POST MESSAGE")
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
          image_id: postDatas.image_id,
          video_id: postDatas.video_id,
          animal_infos: animalData,
          user_id: userData._id,
          videoformat: postDatas.videoformat,
          body: message,
          animal_id: animalData._id,
          destinary: postDatas.animal_destinary,
          postanimalmakerid: postDatas.animal_datas._id,
          room_id: roomId,
          //image_id : this.state.item_message.image_id,
          destination_data: postDatas.animal_destinary,
          //notificationtoken: this.props.user.notificationtoken,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {

            console.log("RESRSRSRS RES  ADD MESSAGDE NI POST MESSAGE")

            getmessages();

            setImageChat(null);
            setVideoChat(null);
            setVideoId(null);
            setVideoCameraUri(null);
            setText(' ');
            setImageId(config.randomkey(16));
            setVideoId(config.randomkey(16));
            setNotifMessage(res.notifinfo.message);
            setNotifTitle(res.notifinfo.title);
           // setMessageLength(1);

            setDisplay("none");
            submitChatMessage();

            //setChatMessages('');

            Keyboard.dismiss();


            // this.setState({
            //   //notificationtoken : res.notificationtoken,
            //   imagechat: null,
            //   image_id: null,
            //   video_id: null,
            //   videocamerauri: null,
            //   text: " ",
            //   imageId: config.randomkey(16),
            //   videoId: config.randomkey(16),
            //   notiftitle: res.notifinfo.title,
            //   notifmessage: res.notifinfo.message,
            //   placeholder: '',
            //   messagelength: 1,
            // });
            //this.SendNotifications()
            // this.sendAddCommentNotifs();

            // setTimeout(() => {
            //   this.submitChatMessage()
            //   this.setState({ chatMessage: '' });
            //   Keyboard.dismiss();
            //   //  this.onRefresh();
            // }, 0);

            // this.SendNotifications();
          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert('PRB adding Message');
          }
        });
      // this.setState({
      //   // value : "res.favoris",
      //   //count : count,
      //   display: "none",
      //   imagechat: null,
      //   videochat: null,
      //   newplaceholder: "",
      //   placeholder: "",
      //   text: "",
      //   messagelength: 0,
      //   //likers : likers
      // });

    
  };



  const addMessageFromWall = async () => {
    console.log("addMessage itemMessage", itemMessage)
    console.log("addMessage messageValidate", messageValidate)

    // Disable publish button to avoid double click
   
    // this.getAnimalDoc();

    //   if (this.state.message) {
    //     alert(i18n.t('Fetch_Error.Empty_Field'));
    //    return;

    // };
    //   console.log("Sending message HHHH, datas sendPostData: this.state.notificationtoken ", this.state.notificationtoken);
    //   console.log("this.state.sendPostDatathis.state.sendPostDatathis.state.sendPostDatathis.state.sendPostData", this.state.sendPostData)

    if (itemMessage !== null && itemMessage !== undefined) {
      console.log("ADD MESSAGDE AVEC POST MESSAGE")
      await fetch(config.uri + 'messages/addmessage', {
        method: 'POST',
        headers: {
          'Pragma': 'no-cache',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          //token: this.props.token.token,
          animal_infos: animalData,
          user_id: userData._id,
          postanimalmakerid: itemMessage.animal_id._id,
          body: message,
          room_id: roomId,
          comment: itemMessage.comment,
          image_id: itemMessage.image_id,
          video_id: itemMessage.video_id,
          videoformat: itemMessage.videoformat,
          postmakerid: itemMessage.animal_id._id,
          destination_data: itemMessage,
          // notificationtoken: this.props.user.notificationtoken,
          animal_id: animalData,
          post_datas: itemMessage,

        })
      })
        .then((response) => response.json())
        .then((res) => {

          console.log( "res itemMessage", res)
          if (res.success === true) {

            getmessages();

            setItemMessage(null);
            setImageId(config.randomkey(16));
            setVideoId(config.randomkey(16));
            setText(' ');
            //setNotifMessage(res.notifinfo.message);
            //setNotifTitle(res.notifinfo.title);
           // setMessageLength(1);
           // setDisplay('flex');
            // this.setState({
            //   //notificationtoken : res.notificationtoken,
            //   imageId: config.randomkey(16),
            //   videoId: config.randomkey(16),
            //   text: ' ',
            //   notiftitle: res.notifinfo.title,
            //   notifmessage: res.notifinfo.message,
            //   display: "none",
            //   messagelength: 1,

            // });

            // this.sendAddCommentNotifs();
            //this.getmessages();

            setText('');
            // setDisplay('flex');
            setMessageLength(1);
            //submitChatMessage();
            //setChatMessages('');

            Keyboard.dismiss();

            navigation.navigate('Home', {
              from: "Home",
              screen: 'SharePostScreen',
              sendPostData: itemMessage,
              item_message: itemMessage,
            });
            // setTimeout(() => {
            //   this.submitChatMessage()
            //   this.setState({ chatMessage: '' });
            //   Keyboard.dismiss();
            //   //  this.onRefresh();
            // }, 0)
          }
         
        });

     
      // this.setState({
      //   // value : "res.favoris",
      //   //count : count,
      //   text: this.props.text,
      //   newplaceholder: "",
      //   placeholder: "",
      //   // item_message: null,
      //   display: "none",
      //   messagelength: 1,


      //   //likers : likers
      // });
    }  else {
      console.log('ca marche PASSSS RES ?', res.success, res.userToken);
      alert('PRB adding Message');
    }

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
    console.log("openLoadingModalopenLoadingModal", item)
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

    console.log("gotoPostDetailsgotoPostDetails item", item.post_datas._id);

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



  const renderItem = (item, index) => {
   //console.log( "renderItem",item.item.post_datas)
    const noImg = noImg;

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

    const ratioPortrait = 0.562;
    const ratioLandscape = 1.777;
    var VideoPortraitHeight = (ScreenWidth * ratioPortrait) + ScreenWidth - 200;
    var VideoLandscapeHeight = (ScreenWidth * ratioLandscape) - ScreenWidth - 100;
    var VideoFormat = VideoLandscapeHeight;

    if (item.item.videoformat === "portrait") {
      VideoFormat = VideoPortraitHeight;
    };



    return (
      <View key={index}>
        <View style={{ backgroundColor: "#fff", padding: 10, marginTop: 0 }} onLayout={(event) => { findDimensions(event.nativeEvent.layout, index) }}>

          {/* First from who is the message Post or chat ?}  
          {/* Message from Post (postanimalmakerid)}
          {/* Medias in post */}

          <View>
            {(item.item.postanimalmakerid) &&
              <View>
                {(item.item.image_id && item.item.image_id !== null && item.item.body !== "bodyTxt") &&
                  <View style={{ borderWidth: 0, flex: 1, flexDirection: "column" }}>
                    <View style={{ borderWidth: 0, flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => openImageModal(config.linkserver + item.item.postanimalmakerid + '/images/posts/' + item.item.image_id + '.jpg')}
                        style={{ borderWidth: 0, paddingLeft: imagehorizontalLeft, paddingBottom: 5, }}>

                        <Image
                          source={{
                            uri: config.linkserver + item.item.postanimalmakerid + '/images/posts/' + item.item.image_id + '.jpg',
                          }}
                          style={{

                            // justifyContent: "center",
                            //position: "relative",
                            // zIndex: 1,
                            borderRadius: 8,
                            borderWidth: 0,
                            //borderColor:borderColor,
                            //resizeMode: "contain",
                            width: ScreenWidth - 100,
                            height: 400,
                          }}
                        />
                      </TouchableOpacity>



                      {(animalData._id !== item.item.animal_datas._id) &&
                        <View style={{ borderWidth: 0, flexDirection: "column" }}>
                          <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10, }}>
                            <>

                              <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => gotoPostDetails(item.item)}
                                >
                                  <Feather
                                    name="eye"
                                    size={22}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </Feather>
                                </TouchableOpacity>
                              </View>
                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => openLoadingModal(config.linkserver + item.item.postanimalmakerid + '/images/posts/' + item.item.image_id + '.jpg', item)}
                                >
                                  <MaterialCommunityIcons
                                    name="share"
                                    size={22}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </MaterialCommunityIcons>
                                </TouchableOpacity>
                              </View>
                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => this.openShareDialogAsync(item.item)}
                                >
                                  <Feather
                                    name="share"
                                    size={22}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </Feather>
                                </TouchableOpacity>
                              </View>
                            </>
                          </View>
                        </View>
                      }


                    </View>

                    <View style={{ borderWidth: 0, padding: 0, borderRadius: 8, borderColor: Colors.greyL, justifyContent: "space-between", alignContent: "space-between", marginBottom: 0, }}>
                      <TouchableOpacity
                        onPress={() => gotoPostDetails(item.item)}>
                        <View style={{ borderWidth: 0, flex: 1, flexDirection: "row", paddingBottom: 10, }}>

                          {(item.item.post_datas) &&
                            <View>
                              {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length > 0) &&
                                <Image
                                  source={{
                                    uri: config.linkserver + item.item.postanimalmakerid + '/images/avatar/xsmall/' + item.item.postanimalmakerid + '.jpg',
                                  }}
                                  style={{
                                    justifyContent: "center",
                                    //position: "relative",
                                    // zIndex: 1,
                                    //borderWidth: 1,
                                    borderRadius: 15,
                                    //borderColor: Colors.black,
                                    //resizeMode: "contain",
                                    width: 30,
                                    height: 30,
                                    marginBottom: 5
                                  }}
                                />
                              }

                              {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length === 0) &&
                                <Image
                                  source={require('../../../assets/images/logo_avatar.png')}
                                  style={{
                                    justifyContent: "center",
                                    //position: "relative",
                                    // zIndex: 1,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    borderColor: Colors.black,
                                    //resizeMode: "contain",
                                    width: 30,
                                    height: 30,
                                    marginBottom: 5
                                  }}
                                />
                              }
                            </View>
                          }

                          <View style={{ flex: 1, paddingRight: 10, paddingLeft: 10, borderWidth: 0 }}>
                            <Text style={{
                              fontStyle: "italic",
                              color: Colors.greyM,
                              alignSelf: 'flex-start',
                              borderWidth: 0
                            }}
                              numberOfLines={3}>
                              {item.item.comment} {"\n"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View>
                        {(item.item.body === " ... ") &&
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onLongPress={() => removeMessage(item.item)}>
                            <Text style={{ textAlign: "right", color: Colors.white, flex: 1 }}>{formdate(item.item)}SSSSSSS</Text>
                          </TouchableOpacity>
                        }

                      </View>
                    </View>
                  </View>
                }
                {(item.item.video_id && item.item.video_id !== null && item.item.body !== "bodyTxt") &&
                  <View style={{ borderWidth: 0, flex: 1, flexDirection: "column" }}>
                    <View style={{ borderWidth: 0, flex: 1, flexDirection: "row" }}>
                      <View style={{ marginLeft: imagehorizontalLeft, marginRight: imagehorizontalRight, }}>
                        <Feather name="video" size={22} color={Colors.white} style={{ position: "absolute", paddingLeft: 10, top: VideoFormat - 30, zIndex: 200 }} />

                        <Video
                          source={{
                            uri: config.linkserver + item.item.postanimalmakerid + '/images/posts/videos/' + item.item.video_id + '.mp4'
                          }}
                          volume={5}
                          isMuted={true}
                          style={{
                            justifyContent: "center",
                            resizeMode: "cover",
                            marginBottom: 5,
                            zIndex: 1,
                            borderRadius: 8,
                            width: ScreenWidth - 100,
                            height: VideoFormat,
                          }}
                          //style={[styles.cardVideoPortrait, { width:'100%', zIndex: 0,marginBottom:5,}]}
                          useNativeControls
                          resizeMode={ResizeMode.COVER}
                          isLooping
                          shouldPlay={shouldPlay}
                        />
                      </View>

                      {(animalData._id !== item.item.animal_datas._id) &&
                        <View style={{ borderWidth: 0, flexDirection: "column" }}>
                          <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10 }}>
                            <>
                              <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => gotoPostDetails(item.item)}
                                >
                                  <Feather
                                    name="eye"
                                    size={22}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </Feather>
                                </TouchableOpacity>
                              </View>

                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => this.openLoadingVideoModal(config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4')}>
                                  <MaterialCommunityIcons
                                    name="share"
                                    size={25}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </MaterialCommunityIcons>
                                </TouchableOpacity>
                              </View>
                              <View style={{ padding: 5 }}>
                                <TouchableOpacity
                                  style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                  onPress={() => this.openShareDialogAsync(item.item)}
                                >
                                  <Feather
                                    name="share"
                                    size={22}
                                    color={Colors.white}
                                    style={{ borderWidth: 0, padding: 0 }}>
                                  </Feather>
                                </TouchableOpacity>
                              </View>

                            </>
                          </View>
                        </View>
                      }

                    </View>
                    <View style={{ borderWidth: 0, padding: 5, borderRadius: 8, borderColor: Colors.greyM, flexDirection: "column", justifyContent: "space-between", alignContent: "space-between", marginBottom: 0, }}>
                      <TouchableOpacity
                        onPress={() => gotoPostDetails(item.item)}>
                        <View style={{ borderWidth: 0, flex: 1, flexDirection: "row", paddingBottom: 10, }}>

                          {(item.item.post_datas) &&
                            <View>
                              {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length > 0) &&
                                <Image
                                  source={{
                                    uri: config.linkserver + item.item.postanimalmakerid + '/images/avatar/xsmall/' + item.item.postanimalmakerid + '.jpg',
                                  }}
                                  style={{
                                    justifyContent: "center",
                                    //position: "relative",
                                    // zIndex: 1,
                                    // borderWidth: 1,
                                    borderRadius: 15,
                                    //borderColor: Colors.red,
                                    //resizeMode: "contain",
                                    width: 30,
                                    height: 30,
                                    marginBottom: 5
                                  }}
                                />}

                              {(item?.item?.post_datas?.[0]?.animal_id?.avatars?.length === 0) &&
                                <Image
                                  source={require('../../../assets/images/logo_avatar.png')}
                                  style={{
                                    justifyContent: "center",
                                    //position: "relative",
                                    // zIndex: 1,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    borderColor: Colors.black,
                                    //resizeMode: "contain",
                                    width: 30,
                                    height: 30,
                                    marginBottom: 5
                                  }}
                                />}
                            </View>

                          }
                          <View style={{ flex: 1, paddingRight: 10, paddingLeft: 10, borderWidth: 0 }}>
                            <Text style={{
                              fontStyle: "italic",
                              color: Colors.greyM,
                              alignSelf: 'flex-start',
                              borderWidth: 0
                            }}
                              numberOfLines={3}>
                              {item.item.comment} {"\n"}
                            </Text>

                          </View>
                        </View>
                      </TouchableOpacity>
                      <View>
                        {(item.item.body === " ... ") &&
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onLongPress={() => removeMessage(item)}>
                            <Text style={{ textAlign: "right", }}>{formdate(item.item)}</Text>
                          </TouchableOpacity>
                        }

                      </View>

                    </View>

                  </View>
                }

                {/* Message without img & video && body (message) */}

                {(!item.item.image_id && !item.item.video_id && item.item.body !== "bodyTxt") &&

                  <View style={{}}>


                    {(item.item.postanimalmakerid !== animalData._id) &&

                      <TouchableOpacity
                        activeOpacity={0.6}
                        onLongPress={() => removeMessage(item)}>

                        <View style={{ borderRadius: 8, borderWidth: 3, borderColor: bordercolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
                          <View style={{ flexDirection: "column", paddingTop: 10, paddingLeft: 10, borderWidth: 0, backgroundColor: backgroundcolor }}>
                            <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 12, textTransform: 'capitalize' }}> {item.item.animal_datas.name}</Text>
                            <Text style={{ paddingTop: 0 }}>{formdate(item.item)}</Text>
                          </View>
                          <View style={{ backgroundColor: backgroundcolor }}>
                            <Text style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>{item.item.body}</Text>

                            <Text>UUUUUUUUUUUUUUUU</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    }


                    {(item.item.postanimalmakerid === animalData._id) &&
                      <TouchableOpacity activeOpacity={0.6}
                        onLongPress={() => removeMessage(item)} style={{ paddingTop: -50, borderRadius: 8, borderWidth: 3, borderColor: bordercolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
                        <View style={{ flexDirection: "column", paddingTop: 10, paddingLeft: 10, borderWidth: 0, backgroundColor: backgroundcolor }}>
                          <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 12, textTransform: 'capitalize' }}> {item.item.animal_datas.name}</Text>
                          <Text style={{ paddingTop: 0 }}>{formdate(item.item)}OOOOOOOOO</Text>
                        </View>
                        <View style={{ backgroundColor: backgroundcolor }}>
                          <Text style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>{item.item.body}</Text>
                        </View>
                      </TouchableOpacity>
                    }
                  </View>
                }

              </View>
            }
          </View>

          {/* NO POST MAKER ID */}
          {(!item.item.postanimalmakerid) &&
            <View>
              {(item.item.image_id && !item.item.video_id) &&
                <View style={{ flex: 1, flexDirection: "row" }}>

                  <TouchableOpacity
                    onPress={() => openImageModal(config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg')}
                    style={{ borderWidth: 0, paddingLeft: imagehorizontalLeft, paddingBottom: 5, }}>

                    <Image
                      source={{
                        uri: config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg',
                      }}
                      style={{
                        justifyContent: "center",
                        //position: "relative",
                        // zIndex: 1,
                        borderRadius: 8,
                        borderWidth: 0,
                        //borderColor:borderColor,
                        resizeMode: "cover",
                        //resizeMode: "contain",
                        //resizeMode:"center",
                        width: ScreenWidth - 100,
                        height: 400,

                      }}
                    />

                  </TouchableOpacity>

                  {(animalData._id !== item.item.animal_datas._id) &&
                    <View style={{ borderWidth: 0, flexDirection: "column" }}>
                      <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10, }}>

                        <>

                          <Text style={{ display: displayDownloadText, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                          <View style={{ padding: 10 }}>
                            <TouchableOpacity
                              onPress={() => openLoadingModal(config.linkserver + item.item.animal_datas._id + '/images/posts/' + item.item.image_id + '.jpg', item)}
                              style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}>
                              <MaterialCommunityIcons
                                name="share"
                                size={25}
                                color={Colors.white}
                                style={{ borderWidth: 0, padding: 0 }}>
                              </MaterialCommunityIcons>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                            onPress={() => this.openShareDialogAsync(item.item)}
                          >
                            <Feather
                              name="share"
                              size={22}
                              color={Colors.white}
                              style={{ borderWidth: 0, padding: 0 }}>
                            </Feather>
                          </TouchableOpacity>
                        </>
                      </View>
                    </View>
                  }
                </View>

              }
              {(item.item.video_id && !item.item.image_id) &&
                <View>
                  <View style={{ flex: 1, marginLeft: imagehorizontalLeft, marginRight: imagehorizontalRight, flexDirection: "row" }}>

                    <Feather name="video" size={22} color={Colors.white} style={{ position: "absolute", paddingLeft: 10, top: VideoFormat - 30, zIndex: 200 }} />

                    <Video
                      source={{
                        uri: config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4'
                      }}
                      volume={5}
                      isMuted={true}
                      style={{
                        // position:"absolute",
                        justifyContent: "center",
                        resizeMode: "cover",
                        marginBottom: 5,
                        zIndex: 1,
                        borderRadius: 8,
                        width: ScreenWidth - 100,
                        height: VideoFormat,
                      }}
                      //style={[styles.cardVideoPortrait, { width:'100%', zIndex: 0,marginBottom:5,}]}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      shouldPlay={shouldPlay}
                    />


                    {(animalData._id !== item.item.animal_datas._id) &&
                      <View style={{ borderWidth: 0, flexDirection: "column" }}>
                        <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", paddingLeft: 10 }}>

                          <>
                            <View style={{ padding: 10 }}>
                              <TouchableOpacity
                                style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                                onPress={() => this.openLoadingVideoModal(config.linkserver + item.item.animal_datas._id + '/images/posts/videos/' + item.item.video_id + '.mp4')}>
                                <Text style={{ display: displaydownloadtext, fontSize: 10, marginTop: 0, padding: 5, paddingRight: 10, color: Colors.greyM, justifyContent: "center", textAlign: "right", borderWidth: 0 }}>{i18n.t('Page.Downloading')} ...</Text>
                                <MaterialCommunityIcons
                                  name="share"
                                  size={25}
                                  color={Colors.white}
                                  style={{ borderWidth: 0, padding: 0 }}>
                                </MaterialCommunityIcons>
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              style={{ borderWidth: 0, borderRadius: 18, backgroundColor: Colors.greyL, height: 36, width: 36, alignContent: "center", alignItems: "center", justifyContent: 'center', }}
                              onPress={() => this.openShareDialogAsync(item.item)}
                            >
                              <Feather
                                name="share"
                                size={22}
                                color={Colors.white}
                                style={{ borderWidth: 0, padding: 0 }}>
                              </Feather>
                            </TouchableOpacity>
                          </>
                        </View>
                      </View>
                    }
                  </View>

                </View>
              }



            </View>
          }

          {(item.item.body === "bodyTxt") &&
            <View style={{ marginLeft: 0, marginRight: 0, borderWidth: 0, }}>
              <View style={{ alignContent: "center", justifyContent: "center", height: 40, paddingTop: 0, paddingLeft: 10, borderWidth: 0, }}>
                <Text style={{ fontWeight: 'normal', fontStyle: "italic", fontSize: 12, color: Colors.greyH, }}>{i18n.t('Page.Discuss_Creation')} {formdateDD(item.item)}</Text>
              </View>
            </View>
          }

          <View style={{}}>
            {/* {(!item.item.item_message && item.item.body !== "bodyTxt" && item.item.body !== " ... " ) &&
              <View style={{ top: 0, }}>

                {(item.item.animal_datas._id === animalData._id) &&
                  <View style={{ borderWidth: 0, marginLeft: horizontalLeft + 30, marginRight: horizontalRight + 30, width: ScreenWidth - 160 }}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onLongPress={() => removeMessage(item)}>
                      <View style={{ flex: 1, position: "absolute", flexDirection: "column", borderWidth: 0, alignContent: "flex-end", }}>
                        <Text style={{ width: "100%", textAlign: "right", borderWidth: 0, marginTop: -30, position: "relative", fontWeight: 'bold', paddingLeft: ScreenWidth - 220, color: "white" }}>
                          {formdateImage(item.item)}</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                }
                {(item.item.animal_datas._id !== animalData._id) &&
                  <View style={{ marginLeft: horizontalLeft - 20, marginRight: horizontalRight - 20, width: ScreenWidth - 160 }}>
                    <View style={{ flex: 1, height: 30, position: "absolute", flexDirection: "column", borderWidth: 0, }}>
                      <Text style={{ width: "100%", textAlign: "right", borderWidth: 0, marginTop: -30, position: "relative", paddingLeft: ScreenWidth - 220, fontWeight: 'bold', color: "white" }}>
                        AAAA{formdateImage(item.item)}</Text>
                    </View>
                  </View>
                }
              </View>
            } */}

            {( item.item.post_datas.length !== 0 && !item.item.item_message && item.item.body !== "bodyTxt" && item.item.body === " ... " && item.item.body !== " ") &&
              <View style={{ top: 0, }}>

                {(item.item.animal_datas._id === animalData._id) &&
                  <View style={{ borderWidth: 0, marginLeft: horizontalLeft + 30, marginRight: horizontalRight + 30, width: ScreenWidth - 160 }}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onLongPress={() => removeMessage(item)}>
                      <View style={{ flex: 1, position: "absolute", flexDirection: "column", borderWidth: 0 }}>
                        <Text style={{ borderWidth: 0, marginTop: -30, position: "relative", fontWeight: 'bold', paddingLeft: 30, color: "white" }}>{formdateImage(item.item)}</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                }
                {(item.item.animal_datas._id !== animalData._id) &&
                  <View style={{ marginLeft: horizontalLeft - 20, marginRight: horizontalRight - 20, width: ScreenWidth - 160 }}>
                    <View style={{ flex: 1, height: 30, position: "absolute", flexDirection: "column", borderWidth: 0, }}>
                      <Text style={{ marginTop: -30, position: "relative", fontWeight: 'bold', paddingLeft: 30, color: "white" }}>{formdateImage(item.item)}</Text>
                    </View>
                  </View>
                }
              </View>
            }


            {( item.item.post_datas.length !== 0 && !item.item.item_message && item.item.body !== "bodyTxt" && item.item.body !== " ... " && item.item.body !== " ") &&

              <View style={{ top: 0, }}>

                {(item.item.animal_datas._id === animalData._id) &&
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onLongPress={() => removeMessage(item)}>

                    <View style={{ borderRadius: 8, borderWidth: 3, borderColor: bordercolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
                      <View style={{ flexDirection: "column", paddingTop: 0, paddingLeft: 5, borderWidth: 0, backgroundColor: backgroundcolor }}>
                        <Text style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>
                          {item.item.body}ECRIVAIN DU POST MESSAGE WALL</Text>
                        <Text style={{ textAlign: "right", paddingRight: 10, paddingBottom: 5, }}>{formdate(item.item)}</Text>
                      </View>

                    </View>
                  </TouchableOpacity>
                }


                {(item.item.animal_datas._id !== animalData._id) &&


                  <View style={{ borderRadius: 8, borderWidth: 3, borderColor: bordercolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
                    <View style={{ flexDirection: "column", paddingTop: 0, paddingLeft: 5, borderWidth: 0, backgroundColor: backgroundcolor }}>
                      <Text style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>
                        {item.item.body}LECTEUR DU POST MESSAGE WALL</Text>
                      <Text style={{ textAlign: "right", paddingRight: 10, paddingBottom: 5, }}>{formdate(item.item)}</Text>
                    </View>
                    <View style={{ backgroundColor: backgroundcolor }}>
                    </View>
                  </View>

                }

              </View>
            }
          </View>

          {(item.item.item_message && item.item.body !== "bodyTxt" && item.item.body !== " ... " && item.item.body !== " ") &&
            <View style={{ borderRadius: 8, borderWidth: 3, borderColor: bordercolor, marginLeft: horizontalLeft, marginRight: horizontalRight, width: ScreenWidth - 60 }}>
              <View style={{ flexDirection: "row", paddingTop: 10, borderWidth: 0, justifyContent: "space-between", backgroundColor: backgroundcolor }}>
                <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 12, padding: 10, paddingTop: -10, textTransform: 'capitalize' }}> </Text>
                <Text style={{ paddingTop: 5, paddingRight: 10, paddingLeft: 10, }}>{formdate(item.item)}</Text>
              </View>
              <View style={{ backgroundColor: backgroundcolor }}>
                <Text style={{ paddingLeft: 10, paddingBottom: 10, fontWeight: 'normal', fontSize: 14 }}>{item.item.body}</Text>
              </View>
            </View>
          }
        </View>
      </View>

    )
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

      <View style={BDiaryStyles.container}>
 <HeaderBuddy
              // openModal={openModal}
              iconNameL="angle-left"
              //iconNameR="ellipsis-vertical-sharp"
              iconFamilyL="FontAwesome"
              //iconFamilyR="Ionicons"
              label={i18n.t('sharePost.title')}
              navigationName="User"
              navigationFrom="User"
              goBack={true}
            />
            
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS == "ios" ? 90 : 0}
          style={{ flex: 1 }}>


          {/* Fond gris de la modal */}
          <View style={[styles.viewModalCamera, { display: display }]}>
            <View style={[styles.modalSecurityStyle]}>
              <View style={{ borderWidth: 0, top: 10, marginLeft: 20, marginRight: 20 }}>

                <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                  <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>{i18n.t('Modal.Warning')}</Text>
                </View>

                {(typeOfModal === "download") &&
                  <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                    <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_Download')}</Text>
                  </View>
                }

                {(typeOfModal === "downloadvideo") &&
                  <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                    <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_DownloadVideo')}</Text>
                  </View>
                }

                {(typeOfModal === "erase") &&
                  <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                    <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_Delete_Message')}</Text>
                  </View>
                }

                <View style={{ flexDirection: 'row', top: 5, alignContent: "space-around", }}>

                  <View style={{ borderWidth: 0, flex: 1 }}>
                    <TouchableOpacity onPress={() => onCloseModal()}>
                      <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Cancel')}</Text>
                    </TouchableOpacity>
                  </View>

                  {(typeOfModal === "erase") &&
                    <View style={{ borderWidth: 0, flex: 1 }}>
                      <TouchableOpacity onPress={() => deleteOneMessage()}>

                        <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('addComment.delete')}</Text>
                      </TouchableOpacity>
                    </View>}

                  {(typeOfModal === "download") &&
                    <View style={{ borderWidth: 0, flex: 1 }}>
                      <TouchableOpacity onPress={() => this.LoadChatPicture(this.state.url)}>

                        <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Page.Download')}</Text>
                      </TouchableOpacity>
                    </View>}

                  {(typeOfModal === "downloadvideo") &&
                    <View style={{ borderWidth: 0, flex: 1 }}>
                      <TouchableOpacity onPress={() => this.LoadVideoPicture(this.state.url)}>

                        <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Page.Download')}</Text>
                      </TouchableOpacity>
                    </View>}
                </View>
              </View>
            </View>



          </View>


          {(typeOfModal === "image") &&
            <View style={{ backgroundColor: "black", alignContent: "center", padding: 0, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => closeImageModal()}
                style={{ display: imageModalDisplay, borderWidth: 0, top: - ScreenHeight / 8 }}>

                <PinchableBoxChat imageUri={urlMedia}
                  item={urlMedia}
                />

              </TouchableOpacity>
            </View>}


          {(postList.length === 0) &&
            <View style={{ flex: 1, margin: 15 }}>
              <Text style={{ textAlign: 'center', color: Colors.greyM }}>{i18n.t('Error.No_Messages')}</Text>
            </View>

          }

          <View style={[styles.inner]}>
            {(!itemMessage) &&
              <FlatList
                //removeClippedSubviews={true}
                //maxToRenderPerBatch={60}
                //windowSize={30}
                //numColumns={1}
                // 
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
              // {...this.props}
              />

            }



            {renderchatMessages}



            {(imageChat) &&
              <View style={{ padding: 0, backgroundColor: "#000" }}>

                <Image
                  source={{
                    uri: imageChat,
                  }}
                  style={{
                    justifyContent: "center",
                    borderRadius: 0,
                    borderWidth: 0,
                    // borderColor:borderColor,
                    //resizeMode: "contain",
                    width: ScreenWidth,
                    height: "100%"
                  }}
                />


                <View>

                  {(imageFromCameraHeight === "portrait") &&
                    <Image
                      source={{
                        uri: imageChat,
                      }}
                      style={{
                        justifyContent: "center",
                        borderRadius: 0,
                        borderWidth: 0,
                        // borderColor:borderColor,
                        //resizeMode: "contain",
                        width: ScreenWidth,
                        height: "100%"
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
                {(videoFormat === "portrait") &&
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

                {(videoformat === "landscape") &&
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
                  </View>
                }
                {(videoformat === "portrait") &&
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
                  />}

              </View>
            }

            <View>

              {(itemMessage) &&
                <>
                  {(itemMessage.image_id !== null) &&
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


            {(!itemMessage) &&
              <View style={{ borderTopWidth: 1, height: 40, backgroundColor: "#f4f4f4", borderColor: Colors.greyL, flexDirection: "row", padding: 0, alignItems: "center", alignContent: "center", justifyContent: "flex-start" }}>
                <TouchableOpacity onPress={() => this.takePictureAndCreateAlbum()} >
                  <AntDesign
                    name="camerao"
                    size={25}
                    color={Colors.greyH}
                    //color='rgba(233, 233, 233, 0.9)'
                    style={{ padding: 10 }}></AntDesign>
                </TouchableOpacity>

                {(params.from !== "SearchScreenSearch") &&

                  <TouchableOpacity
                    onPress={() => this.handlePickVideo()}>
                    <AntDesign
                      name="videocamera"
                      size={25}
                      color={Colors.greyH}
                      //color='rgba(233, 233, 233, 0.9)'
                      style={{ padding: 10 }}></AntDesign>
                  </TouchableOpacity>
                }

                <TouchableOpacity
                  onPress={() => { this.handlePickMediasLibrary() }}>
                  <AntDesign
                    name="picture"
                    size={25}
                    color={Colors.greyH}
                    //color='rgba(233, 233, 233, 0.9)'
                    style={{ padding: 10 }}></AntDesign>
                </TouchableOpacity>











              </View>
            }

            <View style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", borderBottomWidth: 1, borderTopWidth: 0, borderColor: '#ccc', backgroundColor: "#f4f4f4", padding: 10, }}>

              <View style={{ flex: 1, padding: 0, flexDirection: "row", borderWidth: 1, top: 0, borderColor: "#ccc", borderRadius: 8, }}>


                <TextInput
                  style={{ display: "none", padding: 10, borderWidth: 0 }}
                  value={chatMessages}
                  placeholder={"tutu"}
                  onSubmitEditing={() => submitChatMessage()}
                  onChangeText={chatMessage => {
                    setChatMessages(chatMessage)
                  }}
                  autoFocus={true}
                />






                <TextInput
                  style={{ padding: 10, top: 5, flex: 1, fontSize: 14, justifyContent: 'flex-start', borderWidth: 0, }}
                  defaultValue={text}
                  //value={this.state.text}
                  multiline
                  autoFocus={true}
                  //autoCorrect={true}
                  // autoFocus={this.state.autoFocus}
                  // placeholder={this.state.placeholder}
                  autoCapitalize='none'
                  autoCorrect={false}
                  caretHidden={false}
                  onChangeText={(chatMessage) => inputValidate(chatMessage, 'message')}

                />
                <View>
                  {(itemMessage !== undefined && itemMessage !== null) &&
                    <TouchableOpacity
                      onPress={() => addMessageFromWall()}
                      style={{ borderWidth: 0, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end", padding: 0, }} >
                      <Ionicons
                        name="paper-plane-outline"
                        size={20}
                        color={Colors.greyH}
                        //color='rgba(233, 233, 233, 0.9)'
                        style={{ alignContent: "center", padding: 5, paddingTop: 10, marginRight: 10, alignItems: "center", justifyContent: "center" }}></Ionicons>
                    </TouchableOpacity>
                  }
                  {(itemMessage === undefined || itemMessage === null) &&
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
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  // Modal

  viewModalCamera: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        top: -100,
        backgroundColor: '#000000',
        //position: 'absolute',
        elevation: 1,
        opacity: 1,
        //top:140,
      },
    }),
    //top:ScreenHeight - 100,
  },
  modalSecurityStyle: {
    width: '80%',
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,
    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 160,
        //position: 'absolute',
        top: ScreenHeight / 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: ScreenHeight / 2,
        height: 200,

      },
    }),
    backgroundColor: 'white',
  },

  modalSecurityStyleAbort: {
    width: '96%',
    marginRight: '2%',
    marginLeft: '2%',
    borderRadius: 22,
    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 60,
        //position: 'absolute',
        top: ScreenHeight - 305,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,

      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: 40,
        height: 60,

      },
    }),
    backgroundColor: 'white',
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

export default ChatMessageScreen;


