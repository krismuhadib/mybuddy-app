import React, { useEffect, useRef } from 'react';
import { Platform, Animated, Dimensions, View, Easing, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

// Couleur aléatoire (rouge ou blanc)
const randomColor = () => (Math.random() < 0.5 ? 'red' : 'pink');

// Mappe la vitesse vers une durée de chute
const getDurationRange = (speed) => {
  switch (speed) {
    case 'slow':
      return [4000, 6000];
    case 'fast':
      return [300, 4000];
    default:
      return [2500, 4500]; // "normal"
  }
};

const Heart = ({ x, delay, active, shouldStop, globalOpacity, speed }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(x)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const animation = useRef(null);

  const [minDur, maxDur] = getDurationRange(speed);

  const fall = () => {
    if (shouldStop.current) return;

    const drift = (Math.random() - 0.5) * 80;
    const duration = minDur + Math.random() * (maxDur - minDur);

    animation.current = Animated.parallel([
      Animated.timing(translateY, {
        toValue: height + 50,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: x + drift,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]);

    animation.current.start(({ finished }) => {
      if (finished && !shouldStop.current && active) {
        translateY.setValue(-50);
        translateX.setValue(x);
        rotate.setValue(0);
        fall(); // boucle
      }
    });
  };

  useEffect(() => {
    let timeout;
    if (active) timeout = setTimeout(fall, delay);
    return () => {
      clearTimeout(timeout);
      if (animation.current) animation.current.stop();
    };
  }, [active]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        opacity: globalOpacity,
        transform: [{ translateX }, { translateY }, { rotate: spin }],
      }}
    >
      <Text
        style={{
          fontSize:
            Platform.OS === 'android'
              ? 30 + Math.random() * 25 // Android → taille variable
              : 60 + Math.random() * 25, // iOS → taille fixe
          color: randomColor(),
        }}
      // style={{
      //   fontSize: 30 + Math.random() * 25,
      //   color: randomColor(),
      // }}
      >
        ♥
      </Text>
    </Animated.View>
  );
};

export default function HeartConfettiCustomizable({
  active = true,
  fadeDuration = 1000,
  speed = 'fast', // "slow" | "normal" | "fast"
  count = 35,
}) {
  const globalOpacity = useRef(new Animated.Value(active ? 1 : 0)).current;
  const shouldStop = useRef(false);

  useEffect(() => {
    if (active) {
      shouldStop.current = false;
      Animated.timing(globalOpacity, {
        toValue: 1,
        duration: fadeDuration / 2,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(globalOpacity, {
        toValue: 0,
        duration: fadeDuration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // stoppe les boucles après le fade-out
        shouldStop.current = true;
      });
    }
  }, [active]);

  const hearts = Array.from({ length: count }).map((_, i) => ({
    x: Math.random() * width,
    delay: Math.random() * 1500,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {hearts.map((h, i) => (
        <Heart
          key={i}
          x={h.x}
          delay={h.delay}
          active={active}
          shouldStop={shouldStop}
          globalOpacity={globalOpacity}
          speed={speed}
        />
      ))}
    </View>
  );
}
