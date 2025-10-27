import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

const AnimatedSwipeHint = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -100, // Simule un swipe vers la gauche
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0, // Retourne à la position initiale
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.item, { transform: [{ translateX }] }]}>
      <Text style={styles.itemText}>Item avec animation de swipe</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AnimatedSwipeHint;