import React, { useEffect, useState, useRef, useCallback } from 'react';
import { TouchableOpacity, View, Alert, StyleSheet, Animated, Dimensions } from 'react-native'
import { Video, ResizeMode } from 'expo-av';
import config from '../../config';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';


// Const
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
const ratioPortrait = 0.562;
const ratioLandscape = 1.777;
const VideoPortraitHeight = (ScreenWidth * ratioPortrait) + ScreenWidth;
const VideoLandscapeHeight = (ScreenWidth * ratioLandscape) - ScreenWidth;



// DisplayVideo
const DisplayVideo = ({ item, shouldPlayVideo, isLooping }) => {


  //console.log("DisplayVideo isvideoplay", shouldPlayVideo)

  // const shouldPlayVideo = shouldPlayVideo;
  const volume = 10.0;
  //const isMmuted = false;
  const islooping = true;
  const video = React.useRef(null);
  const videoUri = config.linkserver + item.animal_id._id + '/images/posts/videos/' + item.video_id + '.mp4';
  const [isMuted, setIsMuted] = useState(true);
  const [icon, setIcon] = useState("videocam");

  useEffect(() => {
    if (shouldPlayVideo === false) {
      setIsMuted(true);
      setIcon("videocam");
    }

    if (isMuted === true) {
      setIcon("videocam");
    }

  }, [shouldPlayVideo, isMuted]);


  const toggleAudio = () => {
    setIsMuted(!isMuted);
    setIcon("volume-high")
  };


  return (
    <View>
      <View>
        {(item.videoformat === "portrait") &&
          <View style={{ flex: 1, borderWidth: 0, position: "absolute", zIndex: 1000, paddingLeft: ScreenWidth - 50, paddingTop: VideoPortraitHeight - 50 }}>
            {(isMuted) && 
            <TouchableOpacity onPress={() => toggleAudio()}>
              <Ionicons name={icon} size={22} color={Colors.white} style={{ padding: 15 }} />
            </TouchableOpacity>
            }
            {(!isMuted) && 
            <TouchableOpacity onPress={() => toggleAudio()}>
              <Ionicons name={icon} size={22} color={Colors.white} style={{ padding: 15 }} />
            </TouchableOpacity>
            }
          </View>
        }
        {(item.videoformat === "landscape") &&
          <View style={{ flex: 1, borderWidth: 0, position: "absolute", zIndex: 1000, paddingLeft: ScreenWidth - 50, paddingTop: VideoLandscapeHeight - 50 }}>
            {(isMuted) && 
            <TouchableOpacity onPress={() => toggleAudio()}>
              <Ionicons name={icon} size={22} color={Colors.white} style={{ padding: 15 }} />
            </TouchableOpacity>
            }
            {(!isMuted) && 
            <TouchableOpacity onPress={() => toggleAudio()}>
              <Ionicons name={icon} size={22} color={Colors.white} style={{ padding: 15 }} />
            </TouchableOpacity>
            }
          </View>
        }
        <>
          {(item.videoformat === "portrait") &&
            <View style={{ position: "relative" }}>
              <Video
                ref={video}
                //key = {key}
                source={{
                  uri: videoUri
                }}
                volume={volume}
                isMuted={isMuted}
                style={[styles.cardVideoPortrait, { zIndex: 2 }]}
                //useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping={islooping}
                shouldPlay={shouldPlayVideo}
              />
            </View>
          }
          {(item.videoformat === "landscape") &&
            <View style={{ position: "relative" }}>
              <Video
                ref={video}
                source={{
                  uri: videoUri
                }}
                volume={volume}
                isMuted={isMuted}
                style={[styles.cardVideoLandscape, { zIndex: 0 }]}
                // useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={shouldPlayVideo}
              />
            </View>
          }
        </>
      </View>
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

export default DisplayVideo