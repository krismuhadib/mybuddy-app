import React, { useRef, useEffect, useState } from 'react';
import { Alert, Platform, Text, Dimensions, Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import PinchableBox from './PinchableBox';


const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const FullScreenSubImage = ({ image_id, animal_id, uri, item, visible, onClose }) => {

  const [modalVisible, setModalVisible] = useState(false);
  
  const videoUri = config.linkserver + animal_id + '/images/posts/videos/' + item.video_id + '.mp4';
  const imageUri = config.linkserver + animal_id + '/images/posts/' + item.image_id + '.jpg';
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);

  //console.log("FULLSCREEN item")

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  const closeWarningModal = () => {
    setModalVisible(false);
    onClose();

  };

  const shareVideo = async () => {
    try {
      // Demande de permission pour accéder à la bibliothèque de médias
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "L'accès à la bibliothèque est nécessaire pour enregistrer la vidéo.");
        return;
      }
      // Téléchargement de la vidéo dans le répertoire de cache
      const fileUri = FileSystem.cacheDirectory + 'downloadedVideo.mp4';
      const { uri } = await FileSystem.downloadAsync(videoUri, fileUri);

      // Enregistrement de la vidéo dans la bibliothèque
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);

      setModalVisible(true);

    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la vidéo :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer la vidéo.");
    }
  };


  const saveImage = async () => {
    setModalPosition("absolute");
    try {
      // Demande de permission pour accéder à la bibliothèque de médias
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "L'accès à la bibliothèque est nécessaire pour enregistrer l'image.");
        return;
      }
      // Déplacer le fichier dans un répertoire persistant
      const fileUri = FileSystem.cacheDirectory + 'downloadedImage.jpeg';
      // Téléchargement de l'image dans documentDirectory
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      setModalVisible(true);

    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'image :", error.message, error.stack);
      Alert.alert("Erreur", "Impossible d'enregistrer l'image.");
    }
  };


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose} // pour Android
    >
      <View style={styles.container}>

        {/* Bouton de fermeture */}
        <View style={{ position: "relative", marginTop: Platform.OS === 'android' ? -10 : 0, zIndex: 400, flex: 1, width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => item.video_id !== null ? shareVideo() : saveImage()}>
            <Ionicons name="download-outline" size={25} color="white" />
          </TouchableOpacity>

        </View>

        {(modalVisible) &&

          <View style={{ position: "relative", zIndex: 300, top: ScreenHeight - ScreenHeight / 1.6, flex: 1, backgroundColor: "transparent", alignContent: "center", justifyContent: "center", alignItems: "center" }}>

            <View style={[styles.modalContent]}>

              <View style={{ backgroundColor: "white", top: 10, height: 40, justifyContent: 'center', }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 20, fontWeight: 'bold' }}>{i18n.t('Modal.Warning')}</Text>
              </View>

              <View style={{ backgroundColor: "white", marginTop: 20, justifyContent: 'center', }}>
                <Text style={{ textAlign: "center", fontSize: 17, margin: 10, color: Colors.greyM, }}>{i18n.t('fullScreenVideo.confirm')}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignContent: "space-around" }}>
                <View style={{ borderWidth: 0, flex: 1 }}>
                  <TouchableOpacity onPress={() => closeWarningModal()}>
                    <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 17, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('fullScreenVideo.close')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          </View>
        }

        {/* Composant vidéo */}
        {(item.image_id === null && item.video_id !== null) &&

          <View
            style={{
              marginTop:20,
              position: "absolute",
              width: ScreenWidth,
              height: ScreenHeight,
              backgroundColor: "black", // ou "transparent"
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <TouchableOpacity
              style={{
                position: "absolute",
                width: ScreenWidth,
                height: ScreenHeight,
                zIndex: 400,
              }}
              onPress={onClose}
              activeOpacity={1}
            >
              <Video
                source={{
                  uri: videoUri
                }}
                style={styles.video}
                resizeMode="contain"
                shouldPlay
                isLooping

                pointerEvents="box-none"
              //useNativeControls
              />
            </TouchableOpacity>
          </View>

        }
        {(item.image_id !== null) &&
          <View style={{ paddingBottom: ScreenHeight / 1.5, alignContent: "center", justifyContent: "center", position: "relative" }}>
            <PinchableBox imageUri={config.linkserver + animal_id + '/images/posts/' + image_id + '.jpg'}
              item={item}
              style={[styles.cardImage1, { zIndex: 2 }]}
            />
          </View>
        }
        
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  cardImage1: {
    //justifyContent: "center",
    borderWidth: 0,
    resizeMode: "center",
    zIndex: 1,
    marginTop: -100,
    height: ScreenHeight,
    paddingBottom: 1000,
    //objectFit: "fill"
  },

  modalContent: {
    width: '80%',
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,
    padding: 5,
    //opacity: 1,
    ...Platform.select({
      ios: {
        //position: 'absolute',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
      },
    }),
    backgroundColor: 'white',
  },

  closeButton: {
    padding: 20,
    top: 20,
    backgroundColor: "transparent"
  },

  video: {
    position: "absolute",
    width: '100%',
    height: '100%',
  },
});

export default FullScreenSubImage;