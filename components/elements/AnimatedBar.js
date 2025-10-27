import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimatedBar = ({ barColor, ScreenWidth, weight = "100" }) => {
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetWidth = Math.min(500, parseInt(weight, 10) * 3.3);

    // Démarrer l'animation de la largeur
    Animated.timing(barWidth, {
      toValue: targetWidth,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [weight]);

  // Interpoler la couleur en fonction de la largeur
  // const barColor = barWidth.interpolate({
  //   inputRange: [0, 250, 500], // Étapes de largeur
  //   outputRange: ['violet', 'yellow', 'green'], // Couleurs correspondantes
  // });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: barWidth,
            backgroundColor: barColor, // Appliquer la couleur interpolée
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  bar: {
    height: 15,
    borderRadius: 8,
  },
});

export default AnimatedBar;