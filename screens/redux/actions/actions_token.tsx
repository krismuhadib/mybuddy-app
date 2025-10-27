import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = (token) => ({
    type: 'GET_TOKEN',
    token,
});

export const saveToken = (token) => ({
    type: 'SAVE_TOKEN',
    token,
});
export const removeToken = () => ({
    type: 'REMOVE_TOKEN',
});

export const getUser = (Userdoc) => ({
    type: 'GET_USER',
    Userdoc,
});

export const saveUser = (Userdoc) => ({
    type: 'SAVE_USERDOC',
    Userdoc
})

export const loading = bool => ({
    type: 'LOADING',
    isLoading: bool,
});

export const error = error => ({
    type: 'ERROR',
    error,
});

export const getUserToken = () => dispatch =>
    AsyncStorage.getItem('@storage_Key')
        .then((data) => {
            dispatch(loading(false));
            dispatch(getToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        });

export const saveUserToken = () => dispatch =>
    AsyncStorage.getItem('@storage_Key')
        .then((data) => {
            dispatch(loading(false));
            dispatch(saveToken('token saved'));
            //console.log("REDUX DATA", data)
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        });

export const removeUserToken = () => dispatch =>
    AsyncStorage.removeItem('@storage_Key')
        .then((data) => {
            dispatch(loading(false));
            dispatch(removeToken(data));
        })
        .catch((err) => {
            dispatch(loading(false));
            dispatch(error(err.message || 'ERROR'));
        });