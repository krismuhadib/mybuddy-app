// Get the user datas from actions and write it in oject

import { FadeOutToBottomAndroidSpec } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs";


const animalReducer = (state = { 
    Animaldoc: {},
    loading:true,
    error: null
}, action) => {
    switch (action.type) {
        case 'WRITE_ANIMALDOC':
            return { ...state,
                Animaldoc: action.Animaldoc,
            };
        case 'CHANGE_ANIMALDOC':
            return { ...state,
                Userdoc: action.tutu,
                
                //Userdoc: action.payload,
            };
            case 'REMOVE_ANIMALDOC':
                return { ...state,
                    Animaldoc: null,
                    islogin: null
                };
            
        case 'SAVE_TO_DB_ANIMALDOC':
            return { ...state,
                body: action.Animaldoc,
            };
        

            case 'GET_TO_DB_ANIMALDOC':
                return { ...state,
                    body: action.Animaldoc,
                };


        case 'LOADING':
            return { ...state, loading: action.isLoading };
        case 'ERROR':
            return { ...state, error: action.error };


        default:
            return state;
    }
};



export default animalReducer


