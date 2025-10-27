import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from "../../../constants/Localization";

import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

function VideoCaptureScreen(route) {
  const navigation = useNavigation();
  //const params = route.params;

  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
  const CameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState("back");
  const [facing, setFacing] = useState('back');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);  // Nouvel état pour vérifier si la caméra est prête
  const params = route.route.params;
  const [hasPermission, setHasPermission] = useState(null);


  // useEffect(() => {

  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasCameraPermission(status === 'granted');

  //     const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
  //     setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();

      if (cameraStatus === 'granted' && audioStatus === 'granted') {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Demande de permissions...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Accès refusé à la caméra/micro</Text>;
  }




  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const switchFacing = () => {
    if (facing === 'front') {
      setFacing('back');
    } else {
      setFacing('front');
    }
  };

  const recordVideo = async () => {
    // Vérifie que cameraRef est défini avant de démarrer l’enregistrement
    if (!CameraRef?.current) {
      console.log("cameraRef n'est pas défini");
      return;
    }
    try {
      setIsRecording(true);
      const options = {
        quality: '1080p',
        maxDuration: config.video.duration,
        mute: false,
      };

      // Attends la fin de l'enregistrement
      const recordedVideo = await CameraRef.current.recordAsync(options);
      console.log("recordedVideo", recordedVideo)
      setVideo(recordedVideo); // Enregistre la vidéo dans l'état


    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la vidéo :", error);
    } finally {
      console.log('Vidéo enregistrée :', video);

      setIsRecording(false); // Assurez-vous que l'état est mis à jour même en cas d'erreur
    }
  };

  const goBack =() => {
    navigation.goBack();
  };

  const stopRecording = () => {
    console.log("stop reccording", video)
    setIsRecording(false);
    CameraRef.current.stopRecording();
  };

  const shareVideo = () => {
    shareAsync(video.uri).then(() => {
      setVideo(undefined);
    });
  };

  const saveVideo = () => {
    MediaLibrary.saveToLibraryAsync(video.uri).then(() => {

      if (params.from === "Message") {
        navigation.navigate('ChatMessageNoPosts', {
          itemId: video.uri,
          videocamerauri: video.uri,
          fileType: "video",
        });

      } else {
        navigation.navigate('AddPost', {
          screen: 'DetailsScreen',
          itemId: video.uri,
          uri: video.uri,
          fileType: "video",
        });
      }
    });
  };



  if (video) {


    return (
      <View style={styles.container}>

        <Video
          positionMillis={200}
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode="cover"
          isLooping
        />


        {/* <View style={{borderBottomWidth:1, borderColor:Colors.greyL, width:"100%"}}>
        <TouchableOpacity style={{ height: 50, padding: 10, justifyContent: "center", alignContent: "center" }}
          onPress={() => shareVideo()}>
          <Text style={{ textAlign:"center", fontSize: 20, color: Colors.greyH }}>{i18n.t('Medias.Share_Video')}</Text>
        </TouchableOpacity>
      </View> */}




        <View style={{ borderBottomWidth: 1, borderColor: Colors.greyL, width: "100%" }}>
          <TouchableOpacity style={{ height: 50, padding: 10, justifyContent: "center", alignContent: "center" }}
            onPress={() => saveVideo(undefined)}>
            {(params.from !== "SendScreen") &&
              <Text style={{ textAlign: "center", fontSize: 20, color: Colors.greyH }}>{i18n.t('Medias.PostVideo')}</Text>
            }
            {(params.from === "SendScreen") &&
              <Text style={{ textAlign: "center", fontSize: 20, color: Colors.greyH }}>{i18n.t('Medias.sendVideo')}</Text>
            }
          </TouchableOpacity>
        </View>


        <View style={{ borderBottomWidth: 1, borderColor: Colors.greyL, width: "100%" }}>
          <TouchableOpacity style={{ height: 50, padding: 10, justifyContent: "center", alignContent: "center" }}
            onPress={() => setVideo()}>
            <Text style={{ textAlign: "center", fontSize: 20, color: Colors.greyH }}>{i18n.t('Medias.Takevideo')}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={{ height: 50, padding: 10, justifyContent: "center", alignContent: "center" }}
            onPress={() => GotoMediaScreen()}>
            <Text style={{ fontSize: 20, color: Colors.greyH }}>{i18n.t('Modal.Cancel')}</Text>
          </TouchableOpacity>
        </View>


      </View>
    );
  } else {

    return (
      <View style={styles.container}>

        <CameraView style={styles.camera}
          mode="video"
          facing={facing}
          ref={CameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                // borderWidth:1, 
                // borderColor:"#FFF",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >

              <TouchableOpacity
                style={{
                  //flex: 0.5,
                  //alignSelf: "flex-start",
                }}
                onPress={() => goBack()}
              >
                <Ionicons
                  style={{ paddingLeft: 0, top: 5 }}
                  name="arrow-back"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{ }}
              // onPress={isRecording ? stopRecording : recordVideo}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                </View>
              </TouchableOpacity> */}


              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => isRecording ? stopRecording() : recordVideo()}
              >

                {(isRecording === false) &&
                  <View
                    style={{
                      top: 0,
                      margin: 10,
                      borderWidth: 2,
                      borderRadius: 25,
                      borderColor: "red",
                      height: 50,
                      width: 50,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderRadius: 25,
                        borderColor: "red",
                        height: 40,
                        width: 40,
                        backgroundColor: "red",
                      }}
                    ></View>
                  </View>
                }
                <View>
                  {(isRecording === true) &&
                    <Ionicons
                      style={{ paddingLeft: 0, top: 0 }}
                      name="stop-circle-outline" size={60} color="white" />
                  }
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  //flex: 0.5,
                  alignSelf: "flex-start",
                }}
                onPress={() => switchFacing()}
              >
                <Ionicons
                  style={{ paddingLeft: 0, top: 5 }}
                  name="camera-reverse-outline"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>




            </View>



          </View>
        </CameraView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  video: {
    flex: 1,
    alignSelf: 'stretch',
    width: ScreenWidth,
  }
});

export default VideoCaptureScreen;