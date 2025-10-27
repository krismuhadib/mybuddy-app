import React from 'react'
import { View, Alert, StyleSheet, Animated, Dimensions } from 'react-native'
import { Video, ResizeMode } from 'expo-av';

import config from '../../config';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Const
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const ratioPortrait = 0.562;
const ratioLandscape = 1.777;
const VideoPortraitHeight = (ScreenWidth * ratioPortrait) + ScreenWidth;
const VideoLandscapeHeight = (ScreenWidth * ratioLandscape) - ScreenWidth;

// DisplayVideo
const DisplayVideoComment = ({ item, ismuted, islooping }) => {
  const shouldPlayVideo = true;
  const volume =5.0;
  const muted = false;
  //const ismuted = true;
  const video = React.useRef(null);
  const videoUri =  config.linkserver + item.animal_id._id + '/images/posts/videos/' + item.video_id + '.mp4'
  //console.log("item",item)
  return (
  
      <View>
       
      <>
        {(item.videoformat === "portrait") &&
          <Video
          ref={video}
          //key = {key}
            source={{
              uri: videoUri
            }}
            volume={volume}
            isMuted={muted}
            style={[styles.cardVideoPortrait, { zIndex: 2 }]}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping = {islooping}
            shouldPlay={shouldPlayVideo}
          />
        }
        {(item.videoformat === "landscape") &&
          <Video
          ref={video}
            source={{
              uri: videoUri
            }}
            volume={volume}
            isMuted={muted}
            style={[styles.cardVideoLandscape, { zIndex: 0 }]}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={shouldPlayVideo}
          />
        }
      </>
    </View>
   
  )
};
const styles = StyleSheet.create({
  cardVideoLandscape: {
    justifyContent: "center",
    resizeMode: "cover",
    zIndex: 1,
    width: ScreenWidth,
    height: VideoLandscapeHeight
  },
  cardVideoPortrait: {
    justifyContent: "center",
    resizeMode: "cover",
    zIndex: 1,
    width: ScreenWidth,
    height: VideoPortraitHeight
  }
});

export default DisplayVideoComment