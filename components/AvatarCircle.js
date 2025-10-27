import React, { useEffect } from 'react';
import {  View } from 'react-native';
import Colors from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const radius = 45;

const AvatarCircle = ({ size, }) => {

  const strokeOffset = useSharedValue(radius * Math.PI * 2);
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, { duration: 3000 }),
    };
  });

  useEffect(() => {
    // Stroke radius pourcentage
    // 290 => 0%
    // 63 => 100%
    strokeOffset.value = 190;
  }, []);

  return (

    <View style={{ flexDirection: 'column', top: 10, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
      <Svg height="200px" width="200px" viewBox="0 0 100 100" style={{ zIndex: 1, position: "relative", transform: [{ rotateY: '0deg' }, { rotateX: '0deg' }, { rotateZ: '-90deg' }], }}>
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx="50"
          cy="50"
          r="35"
          stroke={Colors.secondary}
          strokeWidth="3"
          fill={Colors.avatar}
          strokeDasharray={`${radius * Math.PI * 2}`}
        />
      </Svg>

      <Feather style={{ zIndex: 1, position: "absolute", padding: 10, alignContent: "center", alignItems: "center", justifyContent: "center" }}
        name="user" size={size / 3} color={Colors.white} />
    </View>

  );
};



export default AvatarCircle