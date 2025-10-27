import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, Text, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import BDiaryStyles from "../../../assets/styles/forms";
import Colors from '../../../constants/Colors';
import { i18n } from "../../../constants/Localization";
import moment from 'moment';
import io from "socket.io-client";
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import PinchableBoxChat from '../../../components/elements/PinchableBoxChat';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
const config = require('../../../config');
const noImg = require('../../../assets/images/logo_avatar.png');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const ratioPortrait = 0.562;
const ratioLandscape = 1.777;
const VideoPortraitHeight = ((ScreenWidth * ratioPortrait) + ScreenWidth) - 100;
const VideoLandscapeHeight = ((ScreenWidth * ratioLandscape) - ScreenWidth) - 200;
const messageHeight = 80;
const imageHeight = 300;
const videoHeight = 400;
const videoHeightLandscape = 300;

const SendPostMessage = ({ route }) => {

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
  console.log("ChatMessageScreen itemMessage", itemMessage);

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

          console.log("res itemMessage", res)
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
    } else {
      console.log('ca marche PASSSS RES ?', res.success, res.userToken);
      alert('PRB adding Message');
    }

  };


  return (

    <View style={[BDiaryStyles.container, {backgroundColor:"#FFF"}]}>
      <HeaderBuddyLeft
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



      <View style={{ padding: 10, width: "80%", flexDirection: "row", }}>

        <View style={{ width: ScreenWidth - 40, flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, }}>

          <TextInput
            style={{ height: 100, width: '85%', textAlignVertical: 'top', paddingLeft: 10, fontFamily:"Poppins-Regular", fontSize: 14 }}
            defaultValue={text}
            //value={this.state.text}
            multiline
            autoFocus={true}
            keyboardType="default"
            //autoCorrect={true}
            // autoFocus={this.state.autoFocus}
            placeholder={i18n.t('addPost.addLegend')}
            autoCapitalize='none'
            autoCorrect={false}
            caretHidden={false}
            onChangeText={(chatMessage) => inputValidate(chatMessage, 'message')}

          />

        </View>


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

        </View>

      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 0}
        style={{ flex: 1, }}>

        <ScrollView>

          {(itemMessage) &&
            <>
              {(itemMessage.image_id !== null) &&
                <View style={{ alignItems:"center", justifyContent:"center", alignContent:"center", padding: 0, backgroundColor: "#FFF", width:"100%" }}>
                  <Image
                    source={{
                      uri: config.linkserver + itemMessage.animal_id._id + '/images/posts/' + itemMessage.image_id + '.jpg',
                    }}
                    style={{
                      justifyContent: "center",
                      borderRadius: 12,
                      borderWidth: 0,
                      // borderColor:borderColor,
                      //resizeMode: "contain",
                      width: '80%',
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
                  <View style={{ padding: 0, backgroundColor: "#FFF" }}>
                    {(itemMessage.videoformat === "portrait") &&
                      <View style={{ alignContent: "center", alignItems: "center", justifyContent: 'center', }}>
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

        </ScrollView>



      </KeyboardAvoidingView>
    </View>
  )

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
    padding: 10,

    justifyContent: "center",
    resizeMode: "cover",
    zIndex: 1,
    borderRadius: 12,
    width: ScreenWidth - 50,
    height: 400
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

export default SendPostMessage;


