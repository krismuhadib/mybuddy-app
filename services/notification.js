import { Post, ApiRoutes } from './api';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux'; 

const ShowToast = (type, text1, text2,handlerMethod=null) => {
  let toastProps = { type, text1, text2 };
  if (handlerMethod) toastProps = {...toastProps, ...{ onPress: handlerMethod }};
  Toast.show(toastProps);
};   

const ViewNotification = async (data) => {
    try {

        let resultList = [];
        //console.log('ViewNotification POSTDATA',data);
        const res = await Post(ApiRoutes.notificationView,data);
        if (res.success && res.value) {    
            resultList = res.value;            
        }
        return resultList;
    } catch (err) {
      console.error('Notification resultList',err);
    }
};

const SendToken = async (data) => {
    try {
        return await Post(ApiRoutes.notificationAddToken,data);
    } catch (err) {
      console.error('Notification resultList',err);
    }
};

const DeleteToken = async (data) => {
  try {
      console.log('DeleteToken',data);
      return await Post(ApiRoutes.notificationDelToken,data);
      // console.log("Delete Token", res)
      // if (res.success && res.value){
      //   const storeDispatch = useDispatch();
      //   storeDispatch(SaveUser(res.value));
      // }
      // return res.success;
  } catch (err) {
    console.error('Notification resultList',err);
  }
};

const GetPushToken = async () =>{
  try {
    const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error) {
    console.error('Error GetPushToken:', error);
  }
};

const RegisterForPushNotifications = async (user) => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }
    const projectId = "9f79f752-81c4-4a4d-b8bd-ee4da5b13c32";
    // Constants?.expoConfig?.extra?.eas?.projectId ??
    // Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
      });
    }
    if (user && user.devices && user.devices.includes(token)) {
      return true;
    }
    return await SendToken({token});
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
};

export {
  RegisterForPushNotifications,
  ShowToast,
  GetPushToken,
  SendToken,
  DeleteToken,
  ViewNotification
};