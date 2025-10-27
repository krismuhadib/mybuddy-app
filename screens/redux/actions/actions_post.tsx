
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios'
var config = require('../../../config.tsx');

var error = 'erreur';
export const WRITE_POSTDOC = 'WRITE_POSTDOC';
export const SAVE_TO_DB_POSTDOC = 'SAVE_TO_DB_POSTDOC';
export const GET_TO_DB_POSTDOC = 'GET_TO_DB_POSTDOC';

export const ERROR = 'POST_ERROR'

export const writePostDoc = (Postdoc) => ({
    type: 'WRITE_POSTDOC',
    Postdoc,
});

export const changePostDoc = (tutu) => ({
    type: 'CHANGE_POSTDOC',
    tutu,
});

export const saveToDbPost = (Postdoc) => ({
type: 'SAVE_TO_DB_POSTDOC',
Postdoc
});

export const getToDbPost = (Postdoc) => ({
    type: 'GET_TO_DB_POSTDOC',
    Postdoc
    });


export const removePost = () => ({
    type: 'REMOVE_POSTDOC',
});

export const loading = bool => ({
    type: 'LOADING',
    isLoading: bool,
});

export const user_error = error => ({
    type: 'USER_ERROR',
    error:true
});


// Get PostDoc from local storage & write Animaldoc object for Redux
export const doPostDoc  = () => dispatch => {
    AsyncStorage.getItem('postDetails')
            .then((data) => {
                dispatch(loading(false));
                console.log("Enregistrement Postdoc dans REDUX", JSON.parse(data))
                dispatch(writePostDoc(JSON.parse(data)));
            })
            .catch((err) => {
                dispatch(loading(false));
                dispatch(user_error(err.message || 'ERROR'));
            }) 

}

export const removePostDoc = () => dispatch => {
    AsyncStorage.removeItem('postDetails')
        .then((data) => {
            dispatch(loading(false));
            console.log("EFFACEMENT Postdoc dans REDUX", data)
            dispatch(removePost(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })

}

export const updatePostDoc = (Postdoc) => {
    return (dispatch) => {
        dispatch({ type: SAVE_TO_DB_POSTDOC });
        dispatch(writePostDoc(Postdoc));
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'posts/updateuserpost',
            data: {
                _id: Postdoc._id,
                user_id: Postdoc.user_id,
                comment: Postdoc.comment,
                favorites: Postdoc.favorites,
               
            },
            
        })
        .then(response => console.log("Ok for Postdoc axios"))
        
        
        .catch(error => console.log("Erreur"))

    }
}


export const getPostDoc = (Postdoc) => {
    return (dispatch) => {
        dispatch({ type: GET_TO_DB_POSTDOC });
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'posts/getdatas',
            data: {
                user_id: Postdoc.user_id,
                usertoken: Postdoc.usertoken,
                
            },
            
        })
        .then(response => console.log("Ok foe axios du GET DATAS PostdocPostdocPostdocPostdocPostdocPostdocPostdoc"))
        
        
        .catch(error => console.log("Erreur"))

    }
}
  

