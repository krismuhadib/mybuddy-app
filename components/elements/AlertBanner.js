import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';

const AlertBanner = ({ text }) => {
  const screenWidth = Dimensions.get('window').width;
  const animatedValue = useRef(new Animated.Value(screenWidth)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0) return; // attendre la mesure du texte

    const animate = () => {
      animatedValue.setValue(screenWidth);
      Animated.timing(animatedValue, {
        toValue: -textWidth,
        duration: 12000, // durée de l'animation (ajuster selon besoin)
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => animate(), 2000); // attendre 2 secondes avant de recommencer
      });
    };

    animate();
  }, [textWidth]);

  return (
    <View style={styles.banner}>
      <Animated.Text
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        style={[
          styles.text,
          { transform: [{ translateX: animatedValue }] },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 50,
    backgroundColor: 'red',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    position: 'absolute',
  },
});

export default AlertBanner