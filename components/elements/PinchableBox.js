import React from 'react';
import { View, Alert, StyleSheet, Animated, Dimensions } from 'react-native';
import { LongPressGestureHandler, TapGestureHandler, GestureHandlerRootView, PinchGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';

var config = require('../../config.js');
const screen = Dimensions.get('window')
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const PinchableBox = ({ imageUri, item }) => {

  const scale = new Animated.Value(1.01);
  const baseScale = new Animated.Value(1);
  const pinchScale = new Animated.Value(1);
  //scale = Animated.multiply(this.baseScale, this.pinchScale);
  //lastScale = 1;
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);

  // PAN
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY }, },],
    { useNativeDriver: true }
  );

  // PRESS
  const onPressGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY }, }],
    { useNativeDriver: true }
  );

  // PINCH
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  // PINCH CHNAGE
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring((translateY), {
        toValue: 1,
        useNativeDriver: true,
      }).stop()
      Animated.spring((translateX), {
        toValue: 1,
        useNativeDriver: true,
      }).stop()
      Animated.spring(scale, {
        toValue: 1.01,
        useNativeDriver: true,
      }).stop()
      /*this.lastScale *= event.nativeEvent.scale;
        this.baseScale.setValue(this.lastScale);
        this.pinchScale.setValue(1); */
    };

  };

  // PAN CHANGE 
  const onPanHandlerStateChange = (event) => {
    //console.log("event.nativeEvent.", event.nativeEvent)
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1.01,
        useNativeDriver: true,
      }).start()
      Animated.spring((translateY), {
        toValue: 0,
        useNativeDriver: true,
      }).start()
      Animated.spring((translateX), {
        toValue: 0,
        useNativeDriver: true,
      }).start()
      /*  this.lastScale *= event.nativeEvent.scale;
    this.baseScale.setValue(this.lastScale);
    this.pinchScale.setValue(1); */
    };
  };



  // PRESS CHANGE
  const _onPressHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1.01,
        useNativeDriver: true,
      }).start()
      Animated.spring((translateY), {
        toValue: 1,
        useNativeDriver: true,
      }).start()
      Animated.spring((translateX), {
        toValue: 1,
        useNativeDriver: true,
      }).start()
      // alert("I'm being pressed for so long ACTIVE");
    };

    //  event.nativeEvent
    //console.log("LONG PRESS", event.nativeEvent.state, event.nativeEvent);
    //console.log("LONG PRESS, PAN GESTURE SHOULD NOW ACTIVATE");
  };

  const imagePan = React.createRef();
  const imagePin = React.createRef();
  const longPress = React.createRef();

  // console.log("PICHABLE box item",item)
  return (
    <View>

      <GestureHandlerRootView>

        <PinchGestureHandler
          ref={imagePin}
          simultaneousHandlers={imagePan}
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}>
          <Animated.View style={[
            styles.container,
            {
              transform: [{ translateX: translateX },
              { translateY: translateY }, { scale: scale },],
            },]}
            collapsable={false}>


            <LongPressGestureHandler
              ref={longPress}
              minDurationMs={200}
              simultaneousHandlers={imagePan}

              onHandlerStateChange={_onPressHandlerStateChange}
            //onGestureEvent={onPressGestureEvent}
            >
              <Animated.View style={
                {
                  marginLeft: 0, width: ScreenWidth, height: 350,
                  transform: [
                    { translateX: translateX },
                    { translateY: translateY },
                  ],
                  zIndex: 1
                }}>


                <PanGestureHandler
                  enabled={true}
                  ref={imagePan}
                  minPointers={2}
                  waitFor={longPress}
                  simultaneousHandlers={imagePin}
                  onHandlerStateChange={onPanHandlerStateChange}
                  onGestureEvent={onPanGestureEvent}>
                  <Animated.View style={{
                    marginLeft: 0, width: ScreenWidth, height: 350,
                    transform: [
                      { translateX: translateX },
                      { translateY: translateY },
                    ],
                    zIndex: 1
                  }}>
                    <Animated.Image style={[styles.cardImage,
                    {
                      transform:
                        [{ perspective: 1 }, { scale: scale, }],
                    },
                      ,]} resizeMode='cover'
                      source={{ uri: config.linkserver + item.animal_id._id + '/images/posts/' + item.image_id + '.jpg' }}>
                    </Animated.Image>
                  </Animated.View>
                </PanGestureHandler>

              </Animated.View>
            </LongPressGestureHandler>
          </Animated.View>

        </PinchGestureHandler>
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({

  image: {
    ...StyleSheet.absoluteFillObject,
    width: ScreenWidth,
    height: ScreenHeight,
    resizeMode: "cover",
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    // marginBottom: 25
  },

  cardImage: {
    zIndex: 10,
    justifyContent: "center",
    resizeMode: "cover",
    width: ScreenWidth,
    height: 350
  },

});

export default PinchableBox
