import React, { useContext, SafeAreaView, useCallback, useRef, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Platform, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
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
import * as MediaLibrary from 'expo-media-library';
import { Camera } from "expo-camera";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);



const MediaPost = (route) => {


  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const params = route.route.params;

  //console.log(animalData)

  const [image, setImage] = useState(null);
  const [ready, setReady] = useState(false);
  const [avatar, setAvatar] = useState("");

  const [albums, setAlbums] = useState(null);
  const [photo, setPhoto] = useState();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  console.log("MediaPost")

  //const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[BDiaryStyles.container, { padding:20,alignContent:"center", justifyContent:"center", alignItems:"center"}]}>
        <Text style={[BDiaryStyles.h4,{textAlign:"center",}]}>{i18n.t('permission.title')}</Text>
        <TouchableOpacity
         onPress={requestPermission}
        style={{marginTop:30, width:200, height:40, borderWidth:0 , borderRadius:22,
alignContent:'center', justifyContent:"center", alignItems: 'center',
backgroundColor:Colors.greenBuddy

        }}>
          <Text style={[BDiaryStyles.h4, {color: Colors.white}]}>{i18n.t('permission.accept')}</Text>

        </TouchableOpacity>

{/* 
        <Button 
      
        style={{borderWidth:1}}
        
        onPress={requestPermission} title="grant permission" /> */}
      </View>
    );
  }

  const getAnimalData = async () => {

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

  const pickImageLibrairy = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      const fileType = result.assets[0].type; // 'image' ou 'video'
      const fileUri = result.assets[0].uri;
      setAvatar(result.assets[0].uri);
      setImage(result.assets[0].uri);

      if (fileType === "image") { // Image

        // Image Manipulator
        let resizeObj = {};
        resizeObj = { width: 300 };
        let opts = [{ resize: resizeObj }];
        const manipResult = await ImageManipulator.manipulateAsync(
          fileUri,
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
          type: fileType,
          name: fileName,
        });

        navigateToAddPost(manipResult.uri, "image");

      }
      else if (fileType === "video") { // Video
        navigateToAddPost(fileUri, "video");
      }
    } else {
      return;
    }
  };

  const navigateToAddPost = (fileUri, fileType) => {
    navigation.navigate('AddPost', {
      screen: 'DetailsScreen',
      fileType,
      uri: fileUri,
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
      setAvatar(result.assets[0].uri);
      setImage(result.assets[0].uri);

      // Enregistrer la photo dans la galerie si la permission est accordée
      if (hasMediaLibraryPermission) {
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        //console.log('Photo enregistrée dans la galerie');
      } else {
        console.log("Permission non accordée pour enregistrer dans la galerie");
      }



      // Image Manipulator
      let resizeObj = {};
      resizeObj = { width: 400 };
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

      navigation.navigate('AddPost', {
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

  const goToVideo = async () => {
    navigation.navigate('VideoCapture', {
      from: "post",
      screen: 'DetailsScreen',
    });

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



  return (
    <View style={BDiaryStyles.container}>



      <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('medias.title')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
        <View style={{ padding: 10 }}>
          <TouchableOpacity style={{
            alignContent: "center",
            justifyContent: "center", margin: 10,
            height: 100, borderRadius: 10, backgroundColor: "hotpink",
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 8,
            },
            shadowOpacity: 0.36,
            shadowRadius: 6.68
          }} onPress={pickImageLibrairy}>
            <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, justifyContent: "center" }}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={{ padding: 20, textAlign: 'left', color: "white", fontSize: 12, fontStyle: "italic", fontWeight: 'normal' }}>{i18n.t('medias.download')}</Text>
                <Text style={{ textAlign: 'center', fontSize: 30, color: "white", fontWeight: 'bold' }}>{i18n.t('medias.library')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={{ padding: 10 }}>
          <TouchableOpacity style={{
            alignContent: "center",
            justifyContent: "center", margin: 10,
            height: 100, borderRadius: 10, backgroundColor: "red",
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 8,
            },
            shadowOpacity: 0.36,
            shadowRadius: 6.68
          }} onPress={takePictureAndCreateAlbum}>
            <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, justifyContent: "center" }}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={{ padding: 20, textAlign: 'left', color: "white", fontSize: 12, fontStyle: "italic", fontWeight: 'normal' }}>{i18n.t('medias.takePicture')}</Text>
                <Text style={{ textAlign: 'center', fontSize: 30, color: "white", fontWeight: 'bold' }}>{i18n.t('medias.camera')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={{ padding: 10 }}>
          <TouchableOpacity style={{
            alignContent: "center",
            justifyContent: "center", margin: 10,
            height: 100, borderRadius: 10, backgroundColor: "salmon",
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 8,
            },
            shadowOpacity: 0.36,
            shadowRadius: 6.68
          }} onPress={goToVideo}>
            <View style={{ flexDirection: "row", flex: 1, borderWidth: 0, justifyContent: "center" }}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={{ padding: 20, textAlign: 'left', color: "white", fontSize: 12, fontStyle: "italic", fontWeight: 'normal' }}>{i18n.t('medias.takeVideo')} :</Text>
                <Text style={{ textAlign: 'center', fontSize: 30, color: "white", fontWeight: 'bold' }}>{i18n.t('medias.videos')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>




      </View>
    </View>
  );
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



export default MediaPost;


