// Get the user datas from actions and write it in oject

import { FadeOutToBottomAndroidSpec } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs";


const userReducer = (state = { 
    Userdoc: {},
    loading:true,
    error: null
}, action) => {
    switch (action.type) {

        case 'GET_USERDOC':
            return {...state,
            Userdoc: action.Userdoc
        };   
        case 'WRITE_USERDOC':
            return { ...state,
                Userdoc: action.Userdoc,
            };
        case 'CHANGE_USERDOC':
            return { ...state,
                Userdoc: action.tutu,
                
                //Userdoc: action.payload,
            };

            case 'REMOVE_USERDOC':
                return { ...state,
                    Userdoc: null,
                };
            
        case 'SAVE_TO_DB_USERDOC':
            return { ...state,
                body: action.Userdoc,
            };
        
        case 'LOADING':
            return { ...state, loading: action.isLoading };
        case 'ERROR':
            return { ...state, error: action.error };


        default:
            return state;
    }
};



export default userReducer


