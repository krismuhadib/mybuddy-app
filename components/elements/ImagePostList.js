import React, { useEffect, useState } from 'react';
import { Image, Text,TouchableHighlight, Dimensions, StyleSheet, View } from 'react-native';
import PinchableBox from './PinchableBox';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import DisplayVideo from './DisplayVideo';
import FullScreenVideo from './FullScreenVideo';
const config = require('../../config');
const ScreenHeight = Math.round(Dimensions.get('window').height);

const ImagePostList = ({ setIsMuted, isMuted, isvideoplay, openPostModal, item, navigate }) => {

  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const [ready, setReady] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setReady(true), 500);
  return () => clearTimeout(timer);
}, []);


  const openVideo = () => {
    setIsVideoVisible(true);
  };

  const closeVideo = () => {
    setIsVideoVisible(false);
  };

  const openImage = () => {
    setIsVideoVisible(true);
  };



  return (
    <View style={{ zIndex: 2 }}>
      {/* Video */}
      {(item.video_id !== null && item.image_id === null) &&
        <View>
          <TouchableHighlight onPress={() => { openVideo(item) }}>
            <DisplayVideo
              setIsMuted={setIsMuted}
              item={item}
              shouldPlayVideo={false}
              islooping={true}
              isMuted={isMuted}
            />
          </TouchableHighlight>
        </View>
      }

      {/* Image */}
      {(ready && item.image_id !== null && item.video_id === null) &&
        <View style={{ zIndex: 0 }}>
          <TouchableHighlight onPress={() => openImage(item)}
            
            >
              <Image source={{ uri: config.linkserver + item.animal_id._id + '/images/posts/' + item.image_id + '.jpg' }}
              style={{ padding:0, borderRadius:0, resizeMode: "cover", width: "100%", height: 300 }} />

            {/* <PinchableBox imageUri={config.linkserver + item.animal_id._id + '/images/posts/' + item.image_id + '.jpg'}
              item={item}
              style={[styles.cardImage1, { zIndex: 2 }]}
            /> */}
          </TouchableHighlight>
        </View>
      }

      <FullScreenVideo
        visible={isVideoVisible}
        onClose={closeVideo}
        item={item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ImagePostList