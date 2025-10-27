import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
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

const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const MediasScreen = (route) => {

  const storeDispatch = useDispatch();

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const params = route ? route.route.params : null;

  //console.log(animalData)
  const [image, setImage] = useState(null);
  const [ready, setReady] = useState(false);
  const [avatar, setAvatar] = useState("");


  console.log("USER Medias Screen Animal from", params);


  useEffect(() => {
    getAnimalData();
  }, [params]);


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

  const pickImageLibrary = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // -> Just Images // All
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // Image Manipulator
      let resizeObj = {};
      resizeObj = { width: 1080 };
      let opts = [{ resize: resizeObj }];

      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        opts,
        { compress: 1.0, format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );

      const fileName = 'avatar.jpg';
      const imageUri = manipResult.uri.replace('file:/data', 'file:///data');
      const imageType = result.assets[0].type.split('.')[1];
      const postdata = new FormData();

      if (Platform.OS === 'web') {
        // Just passing the image URI works only on web
        postdata.append('file', imageUri);
      } else {
        postdata.append('_id', userData._id);
        postdata.append('venue', animalData._id);
        postdata.append('animal_id', animalData._id);

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

        fetch(config.uri + 'animals/saveavatar', options)
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              console.log("saveavatar res", res)

              getAnimalData();
              var result = res;
              var newimagename = res.newimagename;
              setAvatar(config.linkserver + animalData._id + '/images/avatar/' + animalData._id + '.jpg');
              addImagetoDb(newimagename);
              navigation.goBack();
              // if (params && params.from === "User") {
              //   navigation.goBack();
              //   setTimeout(() => {
              //     navigation.navigate('UserProfile', {
              //       screen: 'User',
              //     });
              //   }, 50);
              // }

              // console.log("NAVIGATION IN saveavatar")

              // if (params && params.from === "Alert") {
              //   navigation.goBack();
              // }

              //  if (params && params.from === undefined) {
              //   navigation.goBack();
              //  navigation.navigate('Root');
              // }


              //  if ((params && params.from !== "Alert" && params && params.from !== "User") ||  params && params.from == undefined) {
              //   navigation.navigate('ModalAddPicture', {
              //     // from: "User"
              //   });
              // }
            }
            else {
              console.log('ca marche PASSSS avec le RES ?', res);
              alert('Probleme avec backend getusssssserdatas');
            }
          });
      }
    }
  };


  useEffect(() => {
  }, []);

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


  const takePictureAndCreateAlbum = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // Image Manipulator
      let resizeObj = {};
      resizeObj = { width: 1080 };
      let opts = [{ resize: resizeObj }];

      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        opts,
        { compress: 1.0, format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );

      const fileName = 'avatar.jpg';
      const imageUri = manipResult.uri.replace('file:/data', 'file:///data');
      const imageType = result.assets[0].type.split('.')[1];
      const postdata = new FormData();

      if (Platform.OS === 'web') {
        // Just passing the image URI works only on web
        postdata.append('file', imageUri);
      } else {
        postdata.append('_id', userData._id);
        postdata.append('venue', animalData._id);
        postdata.append('animal_id', animalData._id);

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

        fetch(config.uri + 'animals/saveavatar', options)
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              getAnimalData();
              var result = res;
              var newimagename = res.newimagename;
              setAvatar(config.linkserver + animalData._id + '/images/avatar/' + animalData._id + '.jpg');
              addImagetoDb(newimagename);

             navigation.goBack();
              
            }
            else {
              console.log('ca marche PASSSS avec le RES ?', res);
              alert('Probleme avec backend getuserdatas');
            }
          });
      }
    }


  };



  return (
    <View style={BDiaryStyles.container}>

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
          }} onPress={pickImageLibrary}>
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

      </View>
    </View>
  );
};

export default MediasScreen;


