
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios'
var config = require('../../../config.tsx');

var error = 'erreur';
export const WRITE_ANIMALDOC = 'WRITE_ANIMALDOC';
export const SAVE_TO_DB_ANIMALDOC = 'SAVE_TO_DB_ANIMALDOC';
export const GET_TO_DB_ANIMALDOC = 'GET_TO_DB_ANIMALDOC';

export const ERROR = 'ANIMALS_ERROR'

export const writeAnimalDoc = (Animaldoc) => ({
    type: 'WRITE_ANIMALDOC',
    Animaldoc,
});

export const changeAnimalDoc = (tutu) => ({
    type: 'CHANGE_ANIMALDOC',
    tutu,
});

export const saveToDbAnimal = (Animaldoc) => ({
type: 'SAVE_TO_DB_ANIMALDOC',
Animaldoc
});

export const getToDbAnimal = (Animaldoc) => ({
    type: 'GET_TO_DB_ANIMALDOC',
    Animaldoc
    });


export const removeAnimal = () => ({
    type: 'REMOVE_ANIMALDOC',
});

export const loading = bool => ({
    type: 'LOADING',
    isLoading: bool,
});

export const user_error = error => ({
    type: 'USER_ERROR',
    error:true
});


// Get AnimalDoc from local storage & write Animaldoc object for Redux
export const doAnimalDoc  = () => dispatch => {
    AsyncStorage.getItem('animalDetails')
            .then((data) => {
                dispatch(loading(false));
                console.log("Enregistrement Animaldoc dans REDUX", JSON.parse(data))
                dispatch(writeAnimalDoc(JSON.parse(data)));
            })
            .catch((err) => {
                dispatch(loading(false));
                dispatch(user_error(err.message || 'ERROR'));
            }) 

}

export const removeAnimalDoc = () => dispatch => {
    AsyncStorage.removeItem('animalDetails')
        .then((data) => {
            dispatch(loading(false));
            console.log("EFFACEMENT Animaldoc dans REDUX", data)
            dispatch(removeAnimal(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        })

}

export const updateAnimalDoc = (Animaldoc) => {
    return (dispatch) => {
        dispatch({ type: SAVE_TO_DB_ANIMALDOC });
        dispatch(writeAnimalDoc(Animaldoc));
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'animals/updateanimal',
            data: {
                _id: Animaldoc._id,
                user_id: Animaldoc.user_id,
                name: Animaldoc.name,
                typeof: Animaldoc.typeof,
                genre: Animaldoc.genre,
                breed: Animaldoc.breed,
                age: Animaldoc.age,
                sterilisation: Animaldoc.sterilisation,
                height: Animaldoc.height,
                weight: Animaldoc.weight,
                dynamic: Animaldoc.dynamic,
                player: Animaldoc.player,
                usertoken: Animaldoc.usertoken,
                animalfood: Animaldoc.animalfood,
                typehouse: Animaldoc.typehouse,
                description: Animaldoc.description,
                private: Animaldoc.private,
                animallof: Animaldoc.animallof,
                wantchild: Animaldoc.wantchild,
                adoption: Animaldoc.adoption,
                sociability: Animaldoc.sociability,
                latitude: Animaldoc.latitude,
                latitudeDelta: Animaldoc.latitudeDelta,
                longitudeDelta: Animaldoc.longitudeDelta,
                longitude: Animaldoc.longitude,
                friends: Animaldoc.friends,
                groups: Animaldoc.groups,
                notif_message: Animaldoc.notif_message,
                connect: Animaldoc.connect,
                avatars: Animaldoc.avatars,
                carouselstatut: Animaldoc.carouselstatut,
                swap_distance: Animaldoc.swap_distance,
                allow_international: Animaldoc.allow_international,
                lovebreed: Animaldoc.lovebreed,
                lovetypeof: Animaldoc.lovetypeof,
                lovebreedname: Animaldoc.lovebreedname,
                lovetypeofname: Animaldoc.lovetypeofname,
                lovegenre: Animaldoc.lovegenre,
                allow_notifs: Animaldoc.allow_notifs,
                allow_geoloc: Animaldoc.allow_geoloc,
                allow_loveswap: Animaldoc.allow_loveswap,
                bday: Animaldoc.bday,
                bmonth: Animaldoc.bmonth,
                byear: Animaldoc.byear,
                typeofname: Animaldoc.typeofname,
                breedname: Animaldoc.breedname,
                followers: Animaldoc.followers,
                status: Animaldoc.status,
                loveadoption: Animaldoc.loveadoption,
                lovereproduction: Animaldoc.lovereproduction,
            },
            
        })
        .then(response => console.log("Ok Update for Animal axios"))
        .catch(error => console.log("Erreur"))
    }
}

export const createNewAnimalDoc = (Animaldoc) => {
    return (dispatch) => {
        dispatch({ type: SAVE_TO_DB_ANIMALDOC });
        dispatch(writeAnimalDoc(Animaldoc));
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'animals/saveanimal',
            data: {
                //_id: Animaldoc._id,
                user_id: Animaldoc.user_id,
                name: Animaldoc.name,
                typeof: Animaldoc.typeof,
                genre: Animaldoc.genre,
                breed: Animaldoc.breed,
                age: Animaldoc.age,
                sterilisation: Animaldoc.sterilisation,
                height: Animaldoc.height,
                weight: Animaldoc.weight,
                dynamic: Animaldoc.dynamic,
                player: Animaldoc.player,
                usertoken: Animaldoc.usertoken,
                animalfood: Animaldoc.animalfood,
                typehouse: Animaldoc.typehouse,
                description: Animaldoc.description,
                private: Animaldoc.private,
                animallof: Animaldoc.animallof,
                wantchild: Animaldoc.wantchild,
                sociability: Animaldoc.sociability,
                latitude: Animaldoc.latitude,
                latitudeDelta: Animaldoc.latitudeDelta,
                longitudeDelta: Animaldoc.longitudeDelta,
                longitude: Animaldoc.longitude,
                friends: Animaldoc.friends,
                groups: Animaldoc.groups,
                notif_message: Animaldoc.notif_message,
                connect: Animaldoc.connect,
                avatars: Animaldoc.avatars,
                carouselstatut: Animaldoc.carouselstatut,
                swap_distance: Animaldoc.swap_distance,
                allow_international: Animaldoc.allow_international,
                lovebreed: Animaldoc.lovebreed,
                lovetypeof: Animaldoc.lovetypeof,
                lovebreedname: Animaldoc.lovebreedname,
                lovetypeofname: Animaldoc.lovetypeofname,
                lovegenre: Animaldoc.lovegenre,
                allow_notifs: Animaldoc.allow_notifs,
                allow_geoloc: Animaldoc.allow_geoloc,
                allow_loveswap: Animaldoc.allow_loveswap,
                bday: Animaldoc.bday,
                bmonth: Animaldoc.bmonth,
                byear: Animaldoc.byear,
                typeofname: Animaldoc.typeofname,
                breedname: Animaldoc.breedname,
                followers: Animaldoc.followers,
                adoption: Animaldoc.adoption,
                loveadoption: Animaldoc.loveadoption,
                lovereproduction: Animaldoc.lovereproduction,
            },
            
        })
        .then(response => console.log("Ok for Animal Visitor axios"))
        .catch(error => console.log("Erreur"))
    }
}



export const getAnimalDoc = (Animaldoc) => {
    return (dispatch) => {
        dispatch({ type: GET_TO_DB_ANIMALDOC });
        axios({
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            
            url : config.uri+'animals/getdatas',
            data: {
                _id: Animaldoc._id,
                usertoken: Animaldoc.usertoken
                
                
            },
            
        })
        .then(response => console.log("Ok for axios du GET DATAS ANIMALS"))
        
        
        .catch(error => console.log("Erreur"))

    }
}
  

