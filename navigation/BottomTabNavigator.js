import React, { useEffect, useState, useReducer } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, Octicons, AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { i18n } from "../constants/Localization"
import TabBarIcon from '../components/TabBarIcon';
import MessageScreen from '../screens/secured/message';
import ProfilesScreen from '../screens/secured/animalsProfile/index.js';
import DashboardScreen from '../screens/secured/dashboard';
import Colors from '../constants/Colors';
import WallScreen from '../screens/secured/home/';
import WelcomeScreen from '../screens/secured/animal/Welcome';
import SpeciesScreen from '../screens/secured/animal/Species';
import BreedsScreen from '../screens/secured/animal/Breeds';
import AnimalProfileScreen from '../screens/secured/animal/AnimalProfile';
import AddPictureScreen from '../screens/secured/animal/AddPictureScreen';
import MediasScreen from '../screens/secured/animal/MediaScreen';
import UserMediasScreen from '../screens/secured/user/MediaScreen';

import UserScreen from '../screens/secured/user/UserScreen';
import ProfileScreen from '../screens/secured/user/ProfileScreen';
import NewAnimalProfileScreen from '../screens/secured/user/NewAnimalProfile';
import UserActivityScreen from '../screens/secured/user/UserActivity';
import LegalScreen from '../screens/secured/user/Legal';
import IsGeoLocalisationScreen from '../screens/secured/user/IsGeolocalisation';
import IsNotificationScreen from '../screens/secured/user/IsNotification';
import LogOutScreen from '../screens/secured/user/LogOut';

import MediaPostScreen from '../screens/secured/home/MediaPost';
import AddPostScreen from '../screens/secured/home/AddPost';
import LegendScreen from '../screens/secured/home/Legend';
import AddCommentScreen from '../screens/secured/home/AddComment';
import AnimalDetailsScreen from '../screens/secured/home/AnimalDetails';
import PostListScreen from '../screens/secured/home/PostList';
import LikerListScreen from '../screens/secured/home/LikerList';
import EditPost from '../screens/secured/user/EditPost';
import SignalmentScreen from '../screens/secured/home/Signalment';
import FriendListScreen from '../screens/secured/home/FriendList';
import FollowerListScreen from '../screens/secured/home/FollowerList';
import VideoCaptureScreen from '../screens/secured/home/VideoCapture';
import SharePostScreen from '../screens/secured/home/SharePost';
import ChatMessageScreen from '../screens/secured/home/ChatMessage';
import SearchScreen from '../screens/secured/search';
import FavoriteListScreen from '../screens/secured/user/FavoriteList';
import BookmarkListScreen from '../screens/secured/user/BookmarkList';
import CreateChatRoomScreen from '../screens/secured/message/CreateChatRoom';
import ChatMessageNoPostScreen from '../screens/secured/message/ChatMessageNoPost';
import MapScreen from '../screens/secured/map';
import MarkerDetailsScreen from '../screens/secured/map/MarkerDetails';
import MarkerListScreen from '../screens/secured/map/MarkerList';
import SendPostMessage from '../screens/secured/home/SendPostMessage';
import BlokerList from '../screens/secured/user/BlokerList';
import AvatarFullSize from '../screens/secured/user/AvatarFullSize';
import UserSettingsScreen from '../screens/secured/user/UserSettings';
import ChangeEmailScreen from '../screens/secured/user/ChangeEmail';
import ModalMenuSettings from '../components/modal/ModalMenuSettings';
import ChangeUserInfosScreen from '../screens/secured/user/ChangeUserInfos';
import ChangePwdScreen from '../screens/secured/user/ChangePwd';
import DeleteAccountScreen from '../screens/secured/user/DeleteAccount';
import PremiumAccountScreen from '../screens/secured/user/PremiumAccount';

import NotificationListScreen from '../screens/secured/home/NotificationList';

import LoveSwapScreen from '../screens/secured/loveSwap';
import LoveSwapSettingScreen from '../screens/secured/loveSwap/LoveSwapSetting.js';
import LoveSpeciesScreen from '../screens/secured/loveSwap/LoveSpecies';
import LoveBreedsScreen from '../screens/secured/loveSwap/LoveBreeds';
import LoveMatchScreen from '../screens/secured/loveSwap/LoveMatch';
import LikersScreen from '../screens/secured/loveSwap/Likers';
import { useModal } from '../components/modal/modalContext';
import CountryScreen from '../screens/secured/animal/Country';

import AlertScreen from '../screens/secured/map/Alert';
import LaunchAlertScreen from '../screens/secured/map/LaunchAlert';
import AlertDetailsScreen from '../screens/secured/map/AlertDetails';
import AlertListScreen from '../screens/secured/map/AlertList';
import AddAlertPictureScreen from '../screens/secured/map/AddAlertPicture';
import AlertMapScreen from '../screens/secured/map/AlertMap';
//import UserAddPictureScreen from '../screens/secured/user/AddPictureScreen';

import { Keyboard } from "react-native";


const logo_small = require('../assets/images/logo_page.png');
const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // const config = Platform.select({
  //   web: { headerMode: 'screen' },
  //   default: {},
  // });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <BottomTab.Navigator
    initialRouteName="Wall"
    screenOptions={{
      tabBarActiveTintColor: "red",
      tabBarShowLabel: false,
      tabBarStyle: isKeyboardVisible ? { display: "none" } : { display: "flex" },
    }}
  >
      <BottomTab.Screen
        name="Wall"
        component={TabHomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home-search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Loveswap"
        component={LoveSwapNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="cards-playing-heart-multiple-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="MapScreen"
        component={MapNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Message"
        component={MessageNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="send" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="UserProfile"
        component={UserNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="account" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

///////////////////////////////////////////////////////////
// TAB HOME STACK
///////////////////////////////////////////////////////////
const TabHomeStack = createNativeStackNavigator();
function TabHomeNavigator({ navigation }) {
  return (

    <TabHomeStack.Navigator>

      <TabHomeStack.Screen
        name="Home"
        component={WallScreen}
        options={{
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="notifications-outline" style={{}} size={25} color={Colors.black}  />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() =>
            navigation.navigate('NotificationListScreen', { screen: '', from:'Home' })}>
              <Feather name="camera" style={{ marginLeft: 10 }} size={25} color={Colors.black} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="MediaPost"
        component={MediaPostScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('medias.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

       <TabHomeStack.Screen
        name="NotificationListScreen"
        component={NotificationListScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('medias.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <TabHomeStack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addPost.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <TabHomeStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="LikerList"
        component={LikerListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('likerList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <TabHomeStack.Screen
        name="VideoCapture"
        component={VideoCaptureScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('videoScreen.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="ChatMessage"
        component={ChatMessageScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('chatMessage.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="SendPostMessage"
        component={SendPostMessage}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('chatMessage.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <TabHomeStack.Screen
        name="FriendList"
        component={FriendListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('friendList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />
      <TabHomeStack.Screen
        name="FollowerList"
        component={FollowerListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('followerList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="SharePost"
        component={SharePostScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('sharePost.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="LegendScreen"
        component={LegendScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('legends.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <TabHomeStack.Screen
        name="SignalmentScreen"
        component={SignalmentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('signalment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

       <TabHomeStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

    </TabHomeStack.Navigator>
  );
};

///////////////////////////////////////////////////////////
// SEARCH STACK
///////////////////////////////////////////////////////////
const SearchStack = createNativeStackNavigator();
function SearchNavigator({ navigation }) {
  return (

    <SearchStack.Navigator>

      <SearchStack.Screen
        name="Home"
        component={SearchScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),

          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="MediaPost"
        component={MediaPostScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('medias.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addPost.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('animalDetails.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <SearchStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />



    </SearchStack.Navigator>
  );
};

///////////////////////////////////////////////////////////
// LOVE STACK
///////////////////////////////////////////////////////////
const LoveSwapStack = createNativeStackNavigator();
function LoveSwapNavigator({ navigation }) {
  return (

    <LoveSwapStack.Navigator>

      <LoveSwapStack.Screen
        name="LoveSwap"
        component={LoveSwapScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="AnimalDetailsLove"
        component={AnimalDetailsScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="LoveSwapSetting"
        component={LoveSwapSettingScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="LoveSpecies"
        component={LoveSpeciesScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="LoveBreeds"
        component={LoveBreedsScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <LoveSwapStack.Screen
        name="LoveMatch"
        component={LoveMatchScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="LoveLikers"
        component={LikersScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <LoveSwapStack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('animalDetails.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />
            <LoveSwapStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

            <LoveSwapStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

            <LoveSwapStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />



      


      



    </LoveSwapStack.Navigator>
  );
};

///////////////////////////////////////////////////////////
// MAP STACK
///////////////////////////////////////////////////////////
const MapStack = createNativeStackNavigator();
function MapNavigator({ navigation }) {
  return (

    <MapStack.Navigator>

      <MapStack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),

          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MapStack.Screen
        name="AnimalDetailsMap"
        component={AnimalDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="MarkerDetails"
        component={MarkerDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="MarkerList"
        component={MarkerListScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,
          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}

      />

      <MapStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MapStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MapStack.Screen
        name="FriendList"
        component={FriendListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('friendList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />
      <MapStack.Screen
        name="FollowerList"
        component={FollowerListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('followerList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MapStack.Screen
        name="SharePost"
        component={SharePostScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('sharePost.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MapStack.Screen
        name="LegendScreen"
        component={LegendScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('legends.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />






      <MapStack.Screen
        name="SignalmentMapScreen"
        component={SignalmentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('signalment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

                  <MapStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="AlertScreen"
        component={AlertScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("alert.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <MapStack.Screen
        name="AlertMapScreen"
        component={AlertMapScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("launchAlert.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<MapStack.Screen
        name="AlertDetails"
        component={AlertDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="AlertList"
        component={AlertListScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="AddAlertPicture"
        component={AddAlertPictureScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('AlertDetails', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <MapStack.Screen
        name="UserMedias"
        component={MediasScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('AlertDetails', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />







    </MapStack.Navigator>
  );
};

///////////////////////////////////////////////////////////
// TAB MESSAGES STACK
///////////////////////////////////////////////////////////
const MessageStack = createNativeStackNavigator();
function MessageNavigator({ navigation }) {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen
        name="MessageListScreen"
        component={MessageScreen}
        options={{
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="add" size={30} style={{ top: 0, }} color={Colors.greyH} onPress={() => navigation.navigate('CreateChatRoom', { from: "message" })} />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          // headerLeft: () => (
          //   /* <Button
          //       onPress={() => alert('This is a button!')}
          //       title="Info"
          //       color="#fff"/> */
          //   //color={Colors.white} onPress={() => navigation.navigate('modalStack', {screen: ''})} />
          //   <TouchableOpacity onPress={() => navigation.navigate('modalStack', { screen: '' })}>
          //     <Ionicons name="pricetag-outline" style={{ marginLeft: 10, top:0, }} size={25} color={Colors.greyH} />
          //   </TouchableOpacity>
          // ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MessageStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MessageStack.Screen
        name="CreateChatRoom"
        component={CreateChatRoomScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          
          headerTitle: i18n.t('chatRoom.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MessageStack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('animalDetails.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MessageStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />
      <MessageStack.Screen
        name="ChatMessageNoPosts"
        component={ChatMessageNoPostScreen}
        options={({ route }) => ({
          headerTitle: route.params?.title || route.name,
          // headerTintColor: Colors.greyM,
          headerShown: false,
          // headerBackButtonMenuEnabled: true,
          // headerBackVisible: true,
          // headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          //headerTitle: i18n.t('chatMessage.title'),
          headerLeft: () => (
            <TouchableOpacity onPress={() =>
            navigation.navigate('AddComment')}>
              <FontAwesome name="angle-left" style={{ marginLeft: 0 }} size={30} color={Colors.greyM} />
            </TouchableOpacity>
          ),


  
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />
      <MessageStack.Screen
        name="VideoCapture"
        component={VideoCaptureScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <MessageStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

    </MessageStack.Navigator>


  );
};

///////////////////////////////////////////////////////////
// TAB USER STACK
///////////////////////////////////////////////////////////
const UserStack = createNativeStackNavigator();
function UserNavigator({ navigation }) {
  const { modalVisible, setModalVisible } = useModal();

  return (

    <UserStack.Navigator>

      <UserStack.Screen
        name="User"
        component={UserScreen}
        options={{
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity
            onPress={() => setModalVisible(true)}>
              {/* <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"/> */}
              <Ionicons name="ellipsis-vertical-sharp" size={25} style={{ top: 0, }} color={Colors.greyH}  />
              {/* <AntDesign name="bars" size={26} style={{ marginRight: 10 }} color="red" />
              <FontAwesome onPress={() => navigation.navigate('MenuSettings')} name="user" size={35} color="white" /> */}
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Image
              source={logo_small} // Remplacez par le chemin de votre logo
              style={{ top: -2, width: 192, height: 45, resizeMode: 'contain' }}
            />
          ),
          headerLeft: () => (
            /* <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"/> */
            //color={Colors.white} onPress={() => navigation.navigate('modalStack', {screen: ''})} />
            <TouchableOpacity onPress={() => navigation.navigate('BookmarkList', { screen: '' })}>
              <Ionicons name="pricetag-outline" style={{ marginLeft: 10, top: 0, }} size={25} color={Colors.greyH} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      {/* <UserStack.Screen
        name="Profile"
        component={AnimalProfileScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('User',{
                from: "User",
              })} />
            </TouchableOpacity>
          ),
          //presentation:"containedModal",
          headerShown: true,
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle:  i18n.t('animalProfile.title'),
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      /> */}

      <UserStack.Screen
        name="ChangeProfile"
        component={AnimalProfileScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('User', {
                from: "User",
              })} />
            </TouchableOpacity>
          ),
          //presentation:"containedModal",
          headerShown: false,
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('animalProfile.title'),
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="ChangeSpecies"
        component={SpeciesScreen}
        options={{
          headerTitle: i18n.t('species.title'),
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('ChangeProfile', {
                from: "change",
              })} />
            </TouchableOpacity>
          ),

          headerShown: false,
          headerBackTitleVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="ChangeBreeds"
        component={BreedsScreen}
        options={{
          headerShown: true, headerTitle:  i18n.t('breeds.title'),
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="ChangeMedias"
        component={MediasScreen}
        options={{
          //presentation:"containedModal",
          headerShown: true, headerTitle: 'Medias',
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />


      <UserStack.Screen
        name="ModalStack"
        component={ModalMenuSettings}
        options={{
          headerShown: true,
          presentation: 'modal',
          //headerBackVisible: false,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: 'ModalMenuSettings',
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="UserProfileScreen"
        component={ProfileScreen}
        options={{
          // presentation:'containedModal',
          headerShown: false,
          headerTintColor: Colors.greyM,

          //headerBackVisible: false,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: true,
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="add" size={30} color={Colors.greyM} onPress={() => navigation.navigate('WelcomeUser', {

                from: "User",
              })} />
            </TouchableOpacity>
          ),
          headerTitle: i18n.t("profile.chooseProfile"),
          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="WelcomeUser"
        component={WelcomeScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('ProfileScreen', {

                from: "User",
              })} />
            </TouchableOpacity>
          ),
          presentation: "fullScreenModal",
          headerShown: false,

          headerTintColor: Colors.greyL,
          headerTitle: 'WelcomeScreen',

          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: true,
          headerTintColor: Colors.greyM,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      {/* Speciescreen */}
      <UserStack.Screen
        name="UserSpecies"
        component={SpeciesScreen}
        options={{
          presentation: "fullScreenModal",
          headerTitle: i18n.t('species.title'),
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('WelcomeUser', {

                from: "User",
              })} />
            </TouchableOpacity>
          ),

          headerShown: false,
          headerBackTitleVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="AnimalDetails"
        component={AnimalDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <UserStack.Screen
        name="AvatarFullSize"
        component={AvatarFullSize}
        options={({ route }) => ({
          headerTintColor: Colors.greyM,
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />


      <UserStack.Screen
        name="FriendList"
        component={FriendListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('friendList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />
      <UserStack.Screen
        name="FollowerList"
        component={FollowerListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('followerList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <UserStack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('postList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <UserStack.Screen
        name="FavoriteList"
        component={FavoriteListScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('favoriteList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <UserStack.Screen
        name="BookmarkList"
        component={BookmarkListScreen}
        options={{
          headerTintColor: Colors.greyM,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('bookmarksList.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

      <UserStack.Screen
        name="AddComment"
        component={AddCommentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addComment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <UserStack.Screen
        name="SignalmentScreen"
        component={SignalmentScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('signalment.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />

<UserStack.Screen
        name="UserSettingScreen"
        component={UserSettingsScreen}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('userSetting.title'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />





      {/* <UserStack.Screen
    name="WelcomeScreen"
    component={WelcomeScreen}
    options={{
      headerLeft: () => (
        <TouchableOpacity>
           <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('ProfileScreen',{
            
            from: "User",
          })} />
        </TouchableOpacity>
      ),
      presentation:"fullScreenModal",
      headerShown: false,
      
      headerTintColor: Colors.greyL,
      headerTitle: 'WelcomeScreen',

      headerBackVisible: true,
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: true,
    headerTintColor: Colors.greyM,
      headerStyle: {
        color: Colors.black,
        backgroundColor: Colors.background,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: Colors.greyM
      }
    }}
  /> */}

      <UserStack.Screen
        name="NewAnimalProfileScreen"
        component={NewAnimalProfileScreen}
        options={{
          presentation: "containedModal",
          headerShown: true, headerTitle: 'UserActivity',
          headerBackTitleVisible: false,
          headerTintColor: Colors.greyM,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.black
          }
        }}
      />


      <UserStack.Screen
        name="UserBreeds"
        component={BreedsScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false, headerTitle:  i18n.t('breeds.title'),
          headerBackTitleVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="UserCountry"
        component={CountryScreen}
        options={{
          headerShown: false, headerTitle: i18n.t('countries.title'),
          headerBackTitleVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />



      <UserStack.Screen
        name="UserAnimalProfile"
        component={AnimalProfileScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('User', {

                from: "User",
              })} />
            </TouchableOpacity>
          ),

          presentation: "fullScreenModal",
          headerShown: false,
          headerBackVisible: true,
          headerBackTitleVisible: true,
          headerBackButtonMenuEnabled: true,
          headerTitle: i18n.t('animalProfile.title'),
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }

        }}
      />

      <UserStack.Screen
        name="UserAddPicture"
        component={AddPictureScreen}
        options={{

          presentation: "containedModal",
          headerShown: true, headerTitle: 'Add Picture',
          headerBackTitleVisible: false,
          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="UserMedias"
        component={UserMediasScreen}
        options={{
          presentation: "containedModal",
          headerShown: true, headerTitle: 'Medias',
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.black,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="UserPostList"
        component={PostListScreen}
        options={({ route }) => ({
          headerTintColor: Colors.greyH,
          headerShown: false,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name + i18n.t('user.published'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <UserStack.Screen
        name="EditPost"
        component={EditPost}
        options={{
          headerTintColor: Colors.greyM,

          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: i18n.t('addPost.editPost'),
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        }}
      />


      <UserStack.Screen
        name="LegalScreen"
        component={LegalScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("legal.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="Geolocalisation"
        component={IsGeoLocalisationScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("modalSettings.geolocalisation"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="Notification"
        component={IsNotificationScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("notifications.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="LogOut"
        component={LogOutScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("logOut.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="BlokerList"
        component={BlokerList}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="ChangeEmailScreen"
        component={ChangeEmailScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="ChangePwdScreen"
        component={ChangePwdScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="PremiumAccountScreen"
        component={PremiumAccountScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />



<UserStack.Screen
        name="ChangeUserInfosScreen"
        component={ChangeUserInfosScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("bloker.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />



      <UserStack.Screen
        name="AlertScreen"
        component={AlertScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("alert.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

      <UserStack.Screen
        name="LaunchAlertScreen"
        component={LaunchAlertScreen}
        options={{
          headerTintColor: Colors.greyM,
          // presentation:"containedModal",
          headerShown: false,
          headerTitle: i18n.t("launchAlert.title"),
          headerBackTitleVisible: false,

          headerStyle: {
            color: Colors.greyM,
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.greyM
          }
        }}
      />

<UserStack.Screen
        name="AlertDetails"
        component={AlertDetailsScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <UserStack.Screen
        name="AlertList"
        component={AlertListScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: false,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('Map', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      <UserStack.Screen
        name="AddAlertPicture"
        component={AddAlertPictureScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: true,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('AlertDetails', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      />

      {/* <UserStack.Screen
        name="UserAddPicture"
        component={AddPictureScreen}
        options={({ route }) => ({
          headerTintColor: Colors.black,

          headerShown: true,
          //headerBackButtonMenuEnabled: true,
          //headerBackVisible: true,
          //headerBackTitleVisible: false,
          // headerBackButtonMenuEnabled: false,
          headerTitle: route.params?.title || route.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity>
              <FontAwesome name="angle-left" size={30} color={Colors.greyM} onPress={() => navigation.navigate('AlertDetails', {
                from: "User",
                reload: true,
              })} />
            </TouchableOpacity>
          ),

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "500",
            color: Colors.accent
          }
        })}
      /> */}








    </UserStack.Navigator>
  );
};





// TAB DASHBOARD STACK

const DashboardStack = createNativeStackNavigator();
function DashboardNavigator({ navigation }) {
  return (

    <DashboardStack.Navigator>

      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerShown: true, headerTitle: "",
          headerRight: () => (
            <TouchableOpacity>
              {/* <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"/> */}
              <Ionicons name="ellipsis-vertical-sharp" size={25} color={Colors.red} onPress={() => navigation.navigate('MenuSettings')} />
              {/* <AntDesign name="bars" size={26} style={{ marginRight: 10 }} color="red" />
              <FontAwesome onPress={() => navigation.navigate('MenuSettings')} name="user" size={35} color="white" /> */}
            </TouchableOpacity>
          ),
          headerLeft: () => (
            /* <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"/> */
            <TouchableOpacity>
              <Octicons name="bell" style={{ marginLeft: 10 }} size={25} color="white" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.black,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 500,
            color: Colors.accent

          }
        }}
      />
    </DashboardStack.Navigator>
  );
};




export default BottomTabNavigator;