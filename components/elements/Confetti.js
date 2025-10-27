import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { StyleSheet, Button, View } from 'react-native';

const Confetti = () => {
  const confettiRef = useRef<LottieView>(null);

  function triggerConfetti() {
    confettiRef.current?.play(0);
  }

  return (
    <>
      <View style={styles.container}>
        <Button title='Trigger' onPress={triggerConfetti} />
      </View>
      <LottieView
        ref={confettiRef}
        source={require('../../assets/animated/confetti.json')}
        autoPlay={false}
        loop={false}
        style={styles.lottie}
        resizeMode='cover'
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
});

export default Confetti