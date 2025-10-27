import React, { useMemo, useState, useEffect, useReducer } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from "react-redux";
import { SaveUser } from '../redux/slices/userSlice';
import { SaveAnimal } from '../redux/slices/animalSlice';
import { SaveToken } from '../redux/slices/tokenSlice';
import { AuthContext, AuthState, AuthReducer } from '../contexts/AuthContext';
import BottomTabNavigator from './BottomTabNavigator';
import { i18n } from "../constants/Localization";
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCode';
import SetPasswordScreen from '../screens/auth/SetPassword';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoadingScreen from '../screens/Loading';
import LandingScreen from '../screens/Landing';
import Toast from 'react-native-toast-message';
import { CheckBackendErrors } from '../utils/helpers';
import Colors from '../constants/Colors';
import { ToastConfig } from '../utils/helpers';
import { RegisterForPushNotifications } from '../services/notification';
import { FontAwesome } from '@expo/vector-icons';
import { ApiRoutes, Post, setToken, getToken, removeToken } from '../services/api';
import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';


// Modal
import modalSettingScreen from '../screens/secured/user/modalSetting';
import ModalMenuSettings from '../components/modal/ModalMenuSettings';
import ModalScreen from '../screens/secured/modal';
import WelcomeScreen from '../screens/secured/animal/Welcome';
import SpeciesScreen from '../screens/secured/animal/Species';
import AnimalProfileScreen from '../screens/secured/animal/AnimalProfile';
import BreedsScreen from '../screens/secured/animal/Breeds';
import MediasScreen from '../screens/secured/animal/MediaScreen';
import AddPictureScreen from '../screens/secured/animal/AddPictureScreen';
import AnimalsProfileScreen from '../screens/secured/animalsProfile/index.js';
import { ModalProvider } from '../components/modal/modalContext';
import LegalScreen from '../screens/secured/user/Legal';
import CountryScreen from '../screens/secured/animal/Country';



const MainNavigation = () => {

  const [isAnimal, setIsAnimal] = useState(false);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 255, 255)',
    },
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  const Stack = createNativeStackNavigator();

  const storeDispatch = useDispatch();

  // Load Auth Reducer Logic
  const [state, authDispatch] = useReducer(AuthReducer, AuthState); // Use imported initialState

  const authMethods = useMemo(() => ({

      // LOGIN METHOD     

      signIn: async (data) => {
        const res = await Post(ApiRoutes.login, data);
        console.log("Login Result User", res);

        if (res.success && res.value && res.value.token && res.value.user) {
          setToken(res.value.token);
          authDispatch({ type: 'SIGN_IN', token: res.value.token });
          storeDispatch(SaveUser(res.value.user));
          storeDispatch(SaveToken(res.value.token));

          if (res.value.user.animals && res.value.user.animals.length) {
            const resultAnimal = await Post(ApiRoutes.animalMe, { _id: res.value.user.animals[0] });
            console.log(" Login Result Animal", resultAnimal);
            if (resultAnimal) {
              setIsAnimal(true);
              storeDispatch(SaveAnimal(resultAnimal));
            }
          }

          // Ask For Push notiifcation permission here & store expo notif token in db
          const resPush = await RegisterForPushNotifications(res.value.user);
          if (resPush.success && resPush.value) {
            storeDispatch(SaveUser(res.value.user));
          } else {
            storeDispatch(SaveUser(res.value.user));
          }

        } else {
          showToast('error', i18n.t('form.error.error'), CheckBackendErrors(res.error));
          console.log('Bad login');
        }
      },

      // LOGOUT METHOD

      signOut: () => {
        removeToken('token');
        authDispatch({ type: 'SIGN_OUT' });
        storeDispatch(SaveUser(null));
        storeDispatch(SaveAnimal(null));
      },

      // SIGNUP METHOD 

      signUp: async (data) => {
        // affter the signup logic is done we do this : 
        setToken(res.userToken);
        authDispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );



  useEffect(() => {
    // Used when Reload or App comeback to Front
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await getToken('token')
        console.log("Main Nav userToken", userToken)
      } catch (e) {
        Alert('APP Token Failed');
      }
      if (userToken !== null && userToken !== '') {
        const res = await Post(ApiRoutes.userMe, {});
        //console.log("RELOAD USER", res.value.user)
        if (res.success && res.value && res.value.user) {
          storeDispatch(SaveUser(res.value.user));
          storeDispatch(SaveToken(res.value.token));

          if (res.value.user.animals && res.value.user.animals.length) {
            const resultAnimal = await Post(ApiRoutes.animalMe, { _id: res.value.user.animals[0] });
            //console.log(" RELOAD ANIMAL", resultAnimal);
            if (resultAnimal) {
              setIsAnimal(true);
              storeDispatch(SaveAnimal(resultAnimal.value));
            }
          }

        } else {
          // Delete token
          userToken = null;
          removeToken('token');
        }
      }
      authDispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  }, []);

  useEffect(() => {
  // Écouter les notifications reçues quand l'app est en foreground
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("Notification reçue :", notification);
    // Tu peux afficher un toast ou autre ici
    Toast.show({
      type: 'info',
      text1: notification.request.content.title,
      text2: notification.request.content.body,
    });
  });

  // Écouter les clics sur les notifications (pour redirection)
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;
    console.log("Notification cliquée, URL :", url);
    if (url) {
      Linking.openURL(url); // Redirection vers l'URL
    }
  });

  return () => {
    // Nettoyage des écouteurs
    notificationListener.remove();
    responseListener.remove();
  };
}, []);


  // Modal Setting
  const ModalSettingStack = createNativeStackNavigator();
  const ModalSettingStackView = () => (
    <>
      <ModalSettingStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>

        <ModalSettingStack.Screen
          name="ModalMenuSetting"
          component={ModalMenuSettings}
          options={{
            headerShown: true, headerTitle: "Modal Setting",
            presentation: 'modal',
            headerStyle: {
              backgroundColor: Colors.red,
            },
          }}
        />
      </ModalSettingStack.Navigator>
    </>
  );


  // Modal Animal
  const ModalStack = createNativeStackNavigator();
  const ModalStackView = () => (
    <>

      <ModalStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>

        <ModalStack.Screen
          name="modal"
          component={ModalScreen}
          options={{
            headerShown: false, headerTitle: "ee",
            presentation: 'modal',
            headerStyle: {
              backgroundColor: Colors.black,
            },
          }}
        />
        <ModalStack.Screen
          name="ModalUserActivity"
          component={WelcomeScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('settings.changePassword'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.black,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />
        <ModalStack.Screen
          name="ModalSpecies"
          component={SpeciesScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('species.title'),
            headerBackVisible: false,
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />

        <ModalStack.Screen
          name="ModalBreeds"
          component={BreedsScreen}
          options={{
            headerTitleAlign: 'center',
            headerLeft: () => null,
            headerBackVisible: false,
            headerShown: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('breeds.title'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }

          }}
        />


        <ModalStack.Screen
          name="ModalAnimalProfile"
          component={AnimalProfileScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerLeft: () => null,
            headerBackVisible: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('animalProfile.title'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />

        <ModalStack.Screen
          name="ModalAddPicture"
          component={AddPictureScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: true,
            headerLeft: () => null,
            headerBackVisible: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('addPicture.title'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />

<ModalStack.Screen
          name="ModalMedias"
          component={MediasScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerLeft: () => null,
            headerBackVisible: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('addPicture.title'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />

        <ModalStack.Screen
          name="ModalCountry"
          component={CountryScreen}
          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            headerLeft: () => null,
            headerBackVisible: false,
            headerTintColor: Colors.greyL,
            headerTitle: i18n.t('animalProfile.country'),
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontWeight: "normal",
              fontSize: 20,
              color: Colors.greyH,
            }
          }}
        />




      </ModalStack.Navigator>
      <Toast config={ToastConfig} />
    </>
  );


  return (

    <AuthContext.Provider value={authMethods}>
      <ModalProvider>
        <NavigationContainer theme={MyTheme}

        linking={{
                  config: {
                    // Configuration for linking
                  },
        
                  async getInitialURL() {
                    // First, you may want to do the default deep link handling
                    // Check if app was opened from a deep link
                    const url = await Linking.getInitialURL();
        
                    if (url != null) {
                      return url;
                    }
        
                    // Handle URL from expo push notifications
                    const response = await Notifications.getLastNotificationResponseAsync();
        
                    return response?.notification.request.content.data.url;
                  },
        
                  subscribe(listener) {
                    const onReceiveURL = ({ url }: { url: string }) => listener(url);
        
                    // Listen to incoming links from deep linking
                    const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);
        
                    // Listen to expo push notifications
                    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                      const url = response.notification.request.content.data.url;
        
                      // Any custom logic to see whether the URL needs to be handled
                      //...
        
                      // Let React Navigation handle the URL
                      listener(url);
                    });
        
                    return () => {
                      // Clean up the event listeners
                      eventListenerSubscription.remove();
                      subscription.remove();
                    };
                  },
                }
                }




        >

          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading ? (
              <Stack.Screen name="Loading" component={LoadingScreen} />
            ) : state.userToken == null ? (
              <>
                {/* <Stack.Screen name="Landing" component={LandingScreen}/> */}

                
                {/* SignIn */}
                <Stack.Screen
                  name="SignIn"
                  component={SignInScreen}
                  options={{
                    title: i18n.t('auth.login.name'),
                    // When logging out, a pop animation feels intuitive
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                  }}
                />

                {/* SignUp */}
                <Stack.Screen name="SignUp" component={SignUpScreen}
                  options={({ navigation }) => ({
                    headerTitleAlign: 'center',
                    headerShown: false,
                    headerLeft: () => (
                      <TouchableOpacity>
                        <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.goBack()} />
                      </TouchableOpacity>
                    ),
                    //headerBackVisible: true,
                    headerTintColor: Colors.greyL,
                    headerTitle: i18n.t('auth.signup.title'),
                    //presentation: 'card',
                    headerStyle: {
                      backgroundColor: Colors.background,
                    },
                    headerTitleStyle: {
                      fontWeight: "normal",
                      fontSize: 20,
                      color: Colors.greyH,
                    }
                  })}
                />

                {/* VerifyCode */}
                <Stack.Screen name="VerifyCode" component={VerifyCodeScreen}
                 options={({ navigation }) => ({
                  headerTitleAlign: 'center',
                  headerShown: false,
                  headerLeft: () => (null
                  ),
                  headerBackVisible: false,
                  headerTintColor: Colors.greyL,
                  headerTitle: i18n.t('auth.verifyCode.title'),
                  //presentation: 'card',
                  headerStyle: {
                    backgroundColor: Colors.background,
                  },
                  headerTitleStyle: {
                    fontWeight: "normal",
                    fontSize: 20,
                    color: Colors.greyH,
                  }
                })}
                />

                <Stack.Screen name="SetPassword" component={SetPasswordScreen}
                options={({ navigation }) => ({
                  headerTitleAlign: 'center',
                  headerShown: false,
                  headerLeft: () => (null
                  ),
                  headerBackVisible: false,
                  headerTintColor: Colors.greyL,
                  headerTitle: i18n.t('auth.setPassword.title'),
                  //presentation: 'card',
                  headerStyle: {
                    backgroundColor: Colors.background,
                  },
                  headerTitleStyle: {
                    fontWeight: "normal",
                    fontSize: 20,
                    color: Colors.greyH,
                  }
                })}
                />

                 <Stack.Screen name="Legals" component={LegalScreen}
                options={({ navigation }) => ({
                  headerTitleAlign: 'center',
                  headerShown: false,
                  headerLeft: () => (null
                  ),
                  headerBackVisible: false,
                  headerTintColor: Colors.greyL,
                  headerTitle: "Legals",
                  //presentation: 'card',
                  headerStyle: {
                    backgroundColor: Colors.background,
                  },
                  headerTitleStyle: {
                    fontWeight: "normal",
                    fontSize: 20,
                    color: Colors.greyH,
                  }
                })}
                />



                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
                options={({ navigation }) => ({
                    headerTitleAlign: 'center',
                    headerShown: false,
                    headerLeft: () => (
                      <TouchableOpacity>
                        <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.goBack()} />
                      </TouchableOpacity>
                    ),
                    //headerBackVisible: true,
                    headerTintColor: Colors.greyL,
                    headerTitle: i18n.t('auth.forgot.title'),
                    //presentation: 'card',
                    headerStyle: {
                      backgroundColor: Colors.background,
                    },
                    headerTitleStyle: {
                      fontWeight: "normal",
                      fontSize: 20,
                      color: Colors.greyH,
                    }
                  })}
                
                />

              </>
            ) : (

              // Here User is securely Connected :)

              <>
                {isAnimal ? (
                  // Stack for users with isanimal == true
                  <>
                    <Stack.Screen name="Profiles" component={AnimalsProfileScreen} options={{
                      headerTitleAlign: 'center',
                      headerStyle: {
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                      },
                      headerShown: true,
                      presentation: 'card',
                      headerLeft: () => null,
                      headerBackVisible: false,
                      headerTitle: i18n.t('profiles.title'),

                    }} />

                    <Stack.Screen name="Root" component={BottomTabNavigator} />

                    {/* <Stack.Screen
                    name="ModalMenuSetting"
                    component={ModalMenuSettings}
                    options={{
                      headerShown: false,
                      presentation: 'modal',
                    }}
                  /> */}
                  </>
                ) : (
                  // Stack for users with isanimal == false or undefined
                  <>



                    {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{
                    headerShown: false,
                    presentation: 'card',
                  }} />
               
                  <Stack.Screen name="Species" component={SpeciesScreen}
                    options={({ navigation }) => ({
                      headerShown: true,
                      presentation: 'card',
                      headerLeft: () =>
                        <TouchableOpacity>
                          <Feather name="chevron-left" size={30} color={Colors.greyM} onPress={() => navigation.goBack()} />
                        </TouchableOpacity>,
                      headerBackVisible: false,
                      headerTintColor: Colors.greyM,
                      headerTitle: i18n.t('species.chooseSpecies'),
                    })} />

               
                  <Stack.Screen name="Breeds" component={BreedsScreen}
                  options={{
                    headerShown: true,
                    presentation: 'card',
                    headerLeft: () => null,
                    headerBackVisible: false,
                    headerTitle: i18n.t('breeds.title'),
                  }} />
                  <Stack.Screen name="AnimalProfile" component={AnimalProfileScreen}
                  options={{
                    headerShown: true,
                    presentation: 'card',
                    headerLeft: () => null,
                    headerBackVisible: false,
                    headerTitle: i18n.t('animalProfile.title'),
                  }} />

                  <Stack.Screen name="AddPicture" component={AddPictureScreen}
                  options={{
                    headerShown: true,
                    presentation: 'card',
                    headerLeft: () => null,
                    headerBackVisible: false,
                    headerTitle: i18n.t('addPicture.title'),
                  }} />

                  <Stack.Screen name="Medias" component={MediasScreen}
                  options={{
                    headerShown: true,
                    presentation: 'card',
                    headerLeft: () => null,
                    headerBackVisible: false,
                    headerTitle: i18n.t('medias.title'),
                  }} /> */}




                    <Stack.Screen name="modalStack"
                      component={ModalStackView}
                      options={{
                        headerShown: false,
                        presentation: 'modal',
                      }}
                    />


                    <Stack.Screen name="Root" component={BottomTabNavigator} />

                  </>
                )}
              </>


              // // Check if user includes animal && visitor

              // <>
              // <Stack.Screen name="Root" component={BottomTabNavigator} />
              // <Stack.Screen name="modalStack"
              // component={ModalStackView}
              // options={{
              //     headerShown: false,
              //     presentation: 'modal',
              // }}

              // />
              // </>
            )}
          </Stack.Navigator>

        </NavigationContainer>
      </ModalProvider>
    </AuthContext.Provider>
  );
};

export default MainNavigation;