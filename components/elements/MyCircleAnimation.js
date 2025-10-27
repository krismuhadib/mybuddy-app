import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const Ring = ({ delay }) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.6 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    };
  });
  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 4000,
        }),
        -1,
        false
      )
    );
  }, []);
  return <Animated.View style={[styles.ring, ringStyle]} />;
};

const Ringred = ({ delay }) => {
    const ring = useSharedValue(0);
  
    const ringStyle = useAnimatedStyle(() => {
      return {
        opacity: 0.6 - ring.value,
        transform: [
          {
            scale: interpolate(ring.value, [0, 1], [0, 4]),
          },
        ],
      };
    });
    useEffect(() => {
      ring.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: 4000,
          }),
          -1,
          false
        )
      );
    }, []);
    return <Animated.View style={[styles.ringblue, ringStyle]} />;
  };


  const styles = StyleSheet.create({
    box: {
      width: 40,
      height: 40,
      backgroundColor: "tomato",
    },
    ring: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 25,
      borderColor: "#ef5050",
      borderWidth: 5,
    },
    ringblue: {
        position: "absolute",
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: "#ed9f9f",
        borderWidth: 5,
      },
  });

  const MyCircleAnimation = () => {




        return (
            <View
              style={{
               // flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                top:-22,
              }}
            >
              <Ring delay={0} />
              <Ringred delay={500} />
              <Ring delay={1000} />
              <Ringred delay={2000} />
              <Ring delay={2500} />
              <Ringred delay={3000} />
              <Ring delay={3500} />
              <Ringred delay={4500} />
            </View>
          );
        
        
    
};



  export default MyCircleAnimation;