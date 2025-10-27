import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, Easing, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

// Couleur aléatoire si emoji = cœur (optionnel)
const randomColor = () => (Math.random() < 0.5 ? 'red' : 'white');

const getEmoji = (emoji, emojis) => {
  if (emojis && emojis.length > 0) {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
  return emoji || "♥";
};

// Mappe la vitesse vers une durée de chute
const getDurationRange = (speed) => {
  switch (speed) {
    case 'slow':
      return [4000, 6000];
    case 'fast':
      return [1500, 3000];
    default:
      return [2500, 4500]; // "normal"
  }
};

const Emoji = ({ x, delay, active, shouldStop, globalOpacity, speed, emoji, emojis }) => {
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

  const chosenEmoji = getEmoji(emoji, emojis);

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
          fontSize: 24 + Math.random() * 10,
          color: chosenEmoji === "♥" ? randomColor() : undefined,
        }}
      >
        {chosenEmoji}
      </Text>
    </Animated.View>
  );
};

export default function EmojiConfetti({
  active = true,
  fadeDuration = 1000,
  speed = 'normal',
  count = 35,
  emoji = "♥",
  emojis = [],
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
        shouldStop.current = true; // stoppe la boucle après fade-out
      });
    }
  }, [active]);

  const items = Array.from({ length: count }).map((_, i) => ({
    x: Math.random() * width,
    delay: Math.random() * 1500,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {items.map((item, i) => (
        <Emoji
          key={i}
          x={item.x}
          delay={item.delay}
          active={active}
          shouldStop={shouldStop}
          globalOpacity={globalOpacity}
          speed={speed}
          emoji={emoji}
          emojis={emojis}
        />
      ))}
    </View>
  );
}
