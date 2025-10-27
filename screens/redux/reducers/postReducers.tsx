// Get the user datas from actions and write it in oject

import { FadeOutToBottomAndroidSpec } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs";


const postReducer = (state = { 
    Postdoc: {},
    loading:true,
    error: null
}, action) => {
    switch (action.type) {
        case 'WRITE_POSTDOC':
            return { ...state,
                Postdoc: action.Postdoc,
            };
        case 'CHANGE_POSTDOC':
            return { ...state,
                Userdoc: action.tutu,
                
                //Userdoc: action.payload,
            };

            case 'REMOVE_POSTDOC':
                return { ...state,
                    Postdoc: null,
                };
            
        case 'SAVE_TO_DB_POSTDOC':
            return { ...state,
                body: action.Postdoc,
            };
        

            case 'GET_TO_DB_POSTDOC':
                return { ...state,
                    body: action.Postdoc,
                };


        case 'LOADING':
            return { ...state, loading: action.isLoading };
        case 'ERROR':
            return { ...state, error: action.error };


        default:
            return state;
    }
};



export default postReducer


