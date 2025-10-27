
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

var config = require('../../../config.tsx');
var error = 'erreur';

export const SAVE_TO_DB_USERDOC = 'SAVE_TO_DB_USERDOC';
export const ERROR = 'USERS_ERROR'

export const writeUserDoc = (Userdoc) => ({
    type: 'WRITE_USERDOC',
    Userdoc,
});

export const changeUserDoc = (tutu) => ({
    type: 'CHANGE_USERDOC',
    tutu,
});

export const saveToDbUser = (Userdoc) => ({
type: 'SAVE_TO_DB_USERDOC',
Userdoc
});

export const removeUser = () => ({
    type: 'REMOVE_USERDOC',
});

export const loading = bool => ({
    type: 'LOADING',
    isLoading: bool,
});

export const user_error = error => ({
    type: 'USER_ERROR',
    error:true
});


// Get UserDoc from local storage & write Userdoc object
export const doUserDoc = () => dispatch => {
        AsyncStorage.getItem('userDetails')
            .then((data) => {
                dispatch(loading(false));
                //console.log("Enregistrement Userdoc dans REDUX", JSON.parse(data))
                dispatch(writeUserDoc(JSON.parse(data)));
            })
            .catch((err) => {
                dispatch(loading(false));
                dispatch(user_error(err.message || 'ERROR'));
            });

};

export const removeUserDoc = () => dispatch => {
    AsyncStorage.removeItem('userDetails')
        .then((data) => {
            dispatch(loading(false));
            //console.log("EFFACEMENT Userdoc dans REDUX", data)
            dispatch(removeUser(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        });

};

export const updateUserDoc = (Userdoc) => {
    return (dispatch) => {
        dispatch({ type: SAVE_TO_DB_USERDOC });
        dispatch(writeUserDoc(Userdoc));
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'users/userupdate',
            data: {
                userToken: Userdoc.userToken,
                appversion:Userdoc.appversion, 
                fname: Userdoc.fname,
                animals: Userdoc.animals,
                visitor: Userdoc.visitor,
                lname: Userdoc.lname,
                email: Userdoc.email,
                country: Userdoc.country,
                username: Userdoc.username,
                town: Userdoc.town,
                cp: Userdoc.cp,
                allow_geoloc: Userdoc.allow_geoloc,
                allow_notifs: Userdoc.allow_notifs,
                notificationtoken: Userdoc.notificationtoken,
                connect: Userdoc.connect,
                allow_legals: Userdoc.allow_legals,
                ispremium : Userdoc.ispremium,
            },
            
        })
        .then(response => console.log("Ok for axios"))   
        .catch(error => console.log("Erreur"))
    }
};