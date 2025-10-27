
const tokenReducer = (state = {
    token: null,
    loading: true,
    error: null,
    islogin: null,
}, action) => {
    switch (action.type) {
        case 'GET_TOKEN':
            return { ...state,
                token: action.token
            };
        case 'SAVE_TOKEN':
            return { ...state,
                id: Math.random(),
                token: action.token,
                islogin: action.token
            };
        case 'REMOVE_TOKEN':
            return { ...state,
                token: action.token,
                islogin: null
            };
        case 'LOADING':
            return { ...state,
                loading: action.isLoading
            };
        case 'ERROR':
            return { ...state,
                error: action.error
            };
        default:
            return state;
    }
};

export default tokenReducer


