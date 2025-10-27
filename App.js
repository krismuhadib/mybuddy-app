import React, { useRef, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { Image,StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from "react-redux";
import { store } from './redux/store/index';
import MainNavigation from './navigation/MainNavigation'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ToastConfig } from './utils/helpers';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


SplashScreen.preventAutoHideAsync(); 

export default function App({ navigation }) { 
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current; // valeur d'opacité (1 = visible)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // Affiche une notif système même quand app en foreground
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

useEffect(() => {
  async function prepare() {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        // ... autres polices
      });
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync(); // 👈 cache directement la splash ici
    }
  }

  prepare();
}, []);

  
  useEffect(() => {

    // Load fonts and Images here 
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!

        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),

        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();

  }, []);

  



  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
      // Démarre l’animation du fondu (fade-out)
      Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 2000,
    useNativeDriver: true,
  }),
  Animated.timing(scaleAnim, {
    toValue: 1.2,
    duration: 2000,
    useNativeDriver: true,
  })
]).start(() => setShowSplash(false));
    
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}  onLayout={onLayoutRootView}>

        {showSplash && (
  <Animated.View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFillObject,
      {
        backgroundColor: '#fff',
        opacity: fadeAnim,
        alignItems: 'center',
        justifyContent: 'center',
      },
    ]}
  >
    <Animated.Image
      source={require('./assets/icon.png')}
      style={{
        width: 150,
        height: 150,
        transform: [{ scale: scaleAnim }],
      }}
      resizeMode="contain"
    />
  </Animated.View>
)}
  <SafeAreaProvider>
    <StoreProvider store={store}>
      <MainNavigation />
    </StoreProvider>
  </SafeAreaProvider>
  <Toast config={ToastConfig} />
  <StatusBar style="auto" />
  

</GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});