import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, Platform } from 'react-native';
import  { Marker, Circle } from 'react-native-maps';

const PulsingMarker = ({ location, imgUri, onMarkerPress }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  // Lancement de l’animation en boucle
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // 👈
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false, // 👈
        }),
      ])
    ).start();
  }, []);

  // Interpolations pour l’effet de pulsation
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });
  

  return (
    <>
      {/* Cercle map natif si tu veux une base */}
      

      {/* Marker avec effet pulsant */}
      <Marker
        coordinate={{
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        }}
       // onPress={onMarkerPress(location)}
        tracksViewChanges={true}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* Cercle animé */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 0, 0, 0.4)',
              transform: [{ scale }],
              opacity,
            }}
          />

          {/* Image au centre */}
          <Image
            source={imgUri}
            style={{
                position: 'relative',
              width: 50,
              height: 50,
              borderRadius: 20,
              borderWidth: 0,
              borderColor: '#fff',
            }}
            resizeMode="contain"
          />
        </View>
      </Marker>
    </>
  );
};

export default PulsingMarker;
