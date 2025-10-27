import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, TouchableHighlight, ScrollView, TextInput, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import Logo from '../../../components/auth/Logo';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as ImageManipulator from 'expo-image-manipulator';
import { SaveAnimal } from '../../../redux/slices/animalSlice';

import { useDispatch } from "react-redux";
import { ApiRoutes, Post, setToken, getToken, removeToken } from '../../../services/api';
import { Video, ResizeMode } from 'expo-av';
import MyFonctions from '../../../components/MyFonctions';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import BDButton from '../../../components/elements/BDButton';
import FullScreenAddPost from '../../../components/elements/FullScreenAddPost';

const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const AddPost = (route) => {

  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const params = route.route.params;
  const [image, setImage] = useState(null);
  const [ready, setReady] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [formatvideo, setFormatvideo] = useState("portrait");
  const [display, setDisplay] = useState(false);
  const [imageId, setImageId] = useState(config.randomkey(16));
  const [videoId, setVideoId] = useState(config.randomkey(16));
  const [uri, setUri] = useState(params.uri);
  const [fileType, setFileType] = useState(params.fileType);
  const [autofocus, setAutofocus] = useState(true);
  const [comment, setComment] = useState("");
  const [commentValidate, setCommentValidate] = useState(false);
  const [videoformat, setVideoformat] = useState("");
  const [err, setErr] = useState(0);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [displaybutton, setDisplayButton] = useState(true);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  const inputValidate = (text, type) => {
    var commentlength = 0;
    var err = 0;
    var errors = [];
    if (type == 'comment') {
      commentlength = text.length;
      if (commentlength === 0) {
        setCommentValidate(false);
        setComment(text);
        // this.setState({ modalPostActionVisible: false, commentValidate: true, err: 0, ifmodifydata: true, comment: " " });
      }
      else {

        // check if bad words

        // use fonctuion badWords

        //MyFonctions.badWords(text);
        //console.log(" MyFonctions.badWords(text) MyFonctions.badWords(text) MyFonctions.badWords(text)", MyFonctions.badWords(text))
        setCommentValidate(true);
        setComment(text);
        // this.setState({
        //   modalPostActionVisible: false,
        //   commentValidate: true,
        //   comment: text,
        //   err: 0,
        //   ifmodifydata: true
        // });

        //console.log(" MyFonctions.badWords(text) MyFonctions.badWords(text) MyFonctions.badWords(text)", this.state.commentValidate)

      }
    }
  };

  const pickImageForPost = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('pickImageForPost result :', result)

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      setImage(result.assets[0].uri);

      // Image Manipulator
      let resizeObj = {};
      resizeObj = { width: 300 };
      let opts = [{ resize: resizeObj }];

      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        opts,
        { compress: 1.0, format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );

      let file = [];
      let mfile = 'file';
      const fileName = 'avatar.jpg';
      const postdata = new FormData();

      postdata.append('venue', userData._id);
      postdata.append('_id', userData._id);
      postdata.append('avatarImg', {
        uri: Platform.OS === "android" ? manipResult.uri : manipResult.uri.replace("file://", ""),
        type: result.assets[0].type,
        name: fileName,
      });

      const options = {
        method: 'POST',
        body: postdata,
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'x-access-token': userData._id,
        }),
      };

      console.log('-------------> USERINFOS SCREEN - LE POST DATA:', postdata);
      this.props.navigation.push('PostDetailsWall', {
        screen: 'DetailsScreen',
        fileType: 'image',
        itemId: postdata,
        uri: manipResult.uri,
        //expoimage: postdata,
        otherParam: 'anything you wxxxxxxant here',
      })



















    } else {
      return;
    }
  };


  useEffect(() => {
    const newComment = comment.length < 1 ? "..." : comment;
    setComment(newComment); 
}, [comment]); // S'exécute à chaque changement de `comment`



  const GoToHome = () => {
    navigation.pop(3);
    navigation.navigate('Home', { reload: true });
  };

  const LegendDisplay = () => {
    setButtonVisible(false);
    setDisplay(true);
  };

  const saveMedia = async () => {

    Keyboard.dismiss();
    setIsLoading(true);
    setButtonVisible(false);
    setDisplay(false);
    
    // Before all, check the content words vulgary or not ?
    // if (this.state.commentValidate === false) {
    //   alert('Le contenu de votre message comporte des mots a caractere vulgaires ou insultants. Envoi impossible');
    //   return;
    // };

    var dataimage = uri;

    if (fileType !== "video") {

      setVideoId(null);

      // Image Manipulator
      const manipResult = await ImageManipulator.manipulateAsync(
        dataimage,
        [{ resize: { width: 1080 } }],
        {
          compress: 1.0,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false
        }
      );
      //console.log("this.state.itemId.localUri", this.state.itemId.uri)
      //console.log("IMAGE POST RESULT :", manipResult, manipResult.uri);
      //console.log ("IMAGE POST STATE IMG ID :", this.state.imageId);

      let file = [];
      let mfile = 'file';
      const fileName = imageId;
      const postdata = new FormData();
      const imageUri = manipResult.uri.replace('file:/data', 'file:///data');

      if (Platform.OS === 'web') {
        // Just passing the image URI works only on web
        postdata.append('file', imageUri);
      } else {
        postdata.append('venue', userData._id);
        postdata.append('_id', animalData._id);
        postdata.append('avatarImg', {
          uri: imageUri,
          type: "image/jpeg",
          name: fileName,
          imageId: imageId
        });

        const options = {
          method: 'POST',
          body: postdata,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': userData._id
          })
        };
        console.log('-------------> USERINFOS SCREEN - LE POST DATA:', postdata);

        //SEND POSTDATA
        if (userData && animalData) {
          fetch(config.uri + 'posts/saveimage', options)
            .then((response) => response.json())
            .then((res) => {
              if (res.success === true) {
              }
              else {
                console.log('ca marche PASSSS avec le RES ?', res);
              }
            });
        } else {
          console.log('getuserdatas / PRB USERTOKEN  ?');
        };
        saveImagePost();
      }


    } else { // its a video :
      setImageId(null);
      setDisplay(true);

      let file = [];
      let mfile = 'file';
      const fileName = videoId;
      const imageId = videoId;
      const postdata = new FormData();
      const imageUri = uri.replace('file:/data', 'file:///data');

      if (Platform.OS === 'web') {
        // Just passing the image URI works only on web
        postdata.append('file', imageUri);
      } else {
        postdata.append('venue', userData._id);
        postdata.append('_id', animalData._id);
        postdata.append('avatarImg', {
          uri: imageUri,
          type: "video/mov",
          name: fileName,
          videoId: imageId
        });

        const options = {
          method: 'POST',
          body: postdata,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': userData._id
          })
        };

        //SEND POSTDATA
        if (userData && animalData) {
          fetch(config.uri + 'posts/savevideo', options)
            .then((response) => response.json())
            .then((res) => {
              if (res.success === true) {
                setVideoformat(res.format);

                // Video is saved so now save Post
                SaveVideoPost(res.format);
              }
              else {
                setDisplay(false)
                if (res.message === "longvideo") {
                  alert(i18n.t('Fetch_Error.Large_Video'));
                }
              }
            });
        } else {
          console.log('Savemedia post / PRB');
        }
      }
    }
  };

  const saveImagePost = async () => {

    console.log("saveImagePost comment ", comment)

    if (err === 0) { // pas d erreurs

        fetch(config.uri + 'posts/saveuserpost', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            //_id : this.state.itemId.id,
            user_id: userData._id,
            animal_id: animalData._id,
            comment: comment,
            image_id: imageId,
            video_id: null,
            language: i18n.locale,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              var keypassword = res;
              GoToHome();
              setIsLoading(false);
            }
            else {
              alert(res.message);
              alert('Les infos User/Password sont mal remplies');
            }
          })
      
    } else {
      console.log("Error Add Image Post")
    }
  };

  const SaveVideoPost = async (videoFormat) => {

    setIsLoading(true);

    if (err === 0 && videoformat !== null) { // pas d erreurs

      if (comment && comment.length === 0) {
        setComment(" ");
      };

      fetch(config.uri + 'posts/savevideopost', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //_id : this.state.itemId.id,
          user_id: userData._id,
          animal_id: animalData._id,
          comment: comment,
          image_id: null,
          video_id: videoId,
          videoformat: videoFormat,
          language: i18n.locale,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            setIsLoading(false);
            setDisplay(false);
            GoToHome();
          }
          else {
            alert(res.message);
            alert('Les infos User/Password sont mal remplies');
          }
        })
    } else {
      console.log('Errors');
    }
  };

  const addImagetoDb = async (newimagename) => {
    console.log("addImagetoDbaddImagetoDbaddImagetoDb")

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
          console.log("results addimage carousel", result)
        }
        else {
          alert(res.message);
          alert('Prb Caroussel picture');
        }
      })
  };

  const openVideo = () => {
    setIsVideoVisible(true);
  };

  const closeVideo = () => {
    setIsVideoVisible(false);
  };

  const openImage = () => {
    setIsVideoVisible(true);
  };

  if (isLoading) {

    return (
      <View style={{ flex: 1, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={Colors.greyL} />
        <Text style={{ padding: 10 }}>{i18n.t('addPost.mediaTraitment')}</Text>
      </View>
    )
  } else {
    return (

      <View style={{ flex: 1 }}>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>

          <HeaderBuddyLeft
            // openModal={openModal}
            iconNameL="angle-left"
            //iconNameR="ellipsis-vertical-sharp"
            iconFamilyL="FontAwesome"
            //iconFamilyR="Ionicons"
            label={i18n.t('addPost.title')}
            navigationName="User"
            navigationFrom="User"
            goBack={true}
          />

          {(display === true) &&
            <View style={{ flexDirection: 'row', borderTopWidth: 0, borderColor: '#ccc', padding: 10, marginRight:15,  }}>
              <View style={{ padding: 0, flexDirection: "row", borderWidth: 0, borderColor: "#ccc", borderRadius: 8 }}>
                <TextInput
                  style={{ minHeight: 100, 
                    width: '85%', textAlignVertical: 'top', paddingLeft: 5, paddingTop:0, padding: 0, fontFamily: "Poppins-Regular", fontSize: 14 }}
                  keyboardType="default"
                  multiline
                  placeholder={i18n.t('addPost.addLegend')}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={(text) => inputValidate(text, 'comment')}
                />
              </View>
              <TouchableOpacity onPress={() => saveMedia()} style={{borderWidth:0, paddingRight:50, alignItems: "flex-start", justifyContent: "flex-start", alignContent: "flex-start" }}>
                <View style={{   alignContent:"center", alignItems:"center", justifyContent:"center",padding:10, height:40, borderColor:Colors.greyM, borderWidth:1, borderRadius:22,}}>
                <Text style={[BDiaryStyles.h5Bold, {color:Colors.greyM}]}>{i18n.t('addComment.publish')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          }


          {(fileType !== "video") &&
            <TouchableHighlight
              onPress={() => { openVideo(uri) }}>
              <View style={{ marginTop: 20, justifyContent: "center", alignContent: "center", alignItems: 'center', width: '100%', borderWidth: 0 }}>
                <Image source={{ uri: uri }} style={{ padding: 10, borderRadius: 12, resizeMode: "cover", width: "90%", height: 280 }} />
              </View>
            </TouchableHighlight>
          }

          {(fileType === "video") &&
            <View style={{ marginTop: 20, justifyContent: "center", alignContent: "center", alignItems: 'center', borderWidth: 0 }}>
              <Video
                source={{ uri: uri }}
                positionMillis={200}
                style={{ borderRadius: 12, height: 400, width: 300 }}
                useNativeControls
                resizeMode={Video.RESIZE_MODE_COVER}
                isLooping
              />
            </View>
          }

          <View style={{ padding: 20 }}>

            {(buttonVisible) &&
              <TouchableOpacity
                style={{ marginBottom: 20, alignContent: "center", justifyContent: "center", alignItems: "center", height: 40, borderRadius: 22, borderWidth: 1, borderColor: Colors.greyM }}
                onPress={() => LegendDisplay()}
              >
                <Text style={{ color: Colors.greyM, fontFamily: "Poppins-Regulart", fontSize: 14 }}>{i18n.t('addPost.addLegend')}</Text>
              </TouchableOpacity>
            }

            {(buttonVisible) &&
              <BDButton
                bgcolor={Colors.greenBuddy}
                color={Colors.white}
                display={displaybutton}
                functionProp={() => saveMedia()}
                label={i18n.t('addPost.publish')}
              />
            }
          </View>

          <FullScreenAddPost
            visible={isVideoVisible}
            onClose={closeVideo}
            uri={uri}
          />

        </KeyboardAvoidingView>

      </View>

    )
  }
};



const styles = StyleSheet.create({

  colorContainer: {
    borderWidth: 1,
    width: ScreenWidth - 40,
    borderColor: Colors.greyM,
    padding: 5,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
    height: 130,
    backgroundColor: Colors.pastred,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68
  },

});



export default AddPost;


