import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

// Create Client

const apiClient = axios.create({
  baseURL: config.uri,
  headers: {
    'Content-Type': 'application/json', 
  },   
});  

// No valable Server ubuntu
// const apiClient = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_API_URL,
//   headers: {
//     'Content-Type': 'application/json', 
//   },   
// });    



// Api Routes to Backend

export const ApiRoutes = {

  // Auth
  login: '/auth/login',
  getText: '/users/gettext',
  signup: '/auth/signup',
  code: '/auth/check/code',
  complete: '/auth/signup/complete',
  forgot: '/auth/forgot',
  change: '/auth/change/password',

  // User
  userMe: '/user/me',
  userEdit: '/user/edit',
  changeEmail: 'user/email',
  changePwd: 'user/pwd',
  //UpdateUser: '/user/EditUser',

  // Animal
  animalMe:'/animal/me',
  create: '/animal/create',
  animalEdit: '/animal/edit',
  validate: '/animal/validate',
  animalDelete: '/animal/delete',
  saveAvatar: '/animal/saveAvatar',
  deleteAvatar: '/animal/deleteAvatar',
  AnimalUserList: '/animals/getuseranimals',
  animalGet:'/animal/getAnimal',
  friendList:'/animal/getAllFriends',
  followerList:'/animal/getAllFollowers',

  // Species
  listSpecies: '/species/list',

  // Breeds
  listBreeds: '/breeds/list',

  // Posts
  deletePost: '/post/delete',
  getAnimalPost: '/post/getanimalpost',
  getOnePost: '/post/getonepost',
  addCommentNumber: '/post/addcommentnumber',

  // Notifications
  notificationList : '/notification/list',
  notificationView : '/notification/view',
  notificationAddToken : '/notification/device/token',
  notificationDelToken : '/notification/device/token/delete',

  // Comments
  commentList : '/comment/list',



};

// Set token

export const setToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
 
// get token

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  } catch(e) {
    // read error
  }
};

// Remove token

export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Init token

export const loadToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    await setToken(token);
  }
};

// GET Method

export const Get = async (url, options = {}) => {
  try {
    const response = await apiClient.get(url, options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;   
  }
};

// POST Method

export const Post = async (url, data, options = {}) => {
  try {    
    console.log("General Post datas :",url,data);
    const token = await getToken();
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    apiClient.defaults.headers.common['Content-Type'] = "application/json";
    apiClient.defaults.headers['Content-Type'] = "application/json";
    const response = await apiClient.post(url, data, options);
    if (!response.data) {
      return {error: ["badresponse"]};
    }
    return response.data;
  } catch (error) {
    //throw error;
    return {error: ["badresponse"]};
  }
};