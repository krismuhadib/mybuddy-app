// ConfettiAnimation.js
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const randomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;

const Confetti = ({ x, delay }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 50,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: 10,
        height: 15,
        backgroundColor: randomColor(),
        borderRadius: 2,
        transform: [{ translateY }, { rotate: spin }],
      }}
    />
  );
};

export default function ConfettiAnimation() {
  const confettis = Array.from({ length: 100 }).map((_, i) => ({
    x: Math.random() * width,
    delay: Math.random() * 2000,
  }));

  return (
    <View style={{ width: "100%",flex: 1, backgroundColor: 'transparent' }}>
      {confettis.map((c, i) => (
        <Confetti key={i} x={c.x} delay={c.delay} />
      ))}
    </View>
  );
}