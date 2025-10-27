import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import animalReducer from '../slices/animalSlice';
import tokenReducer from '../slices/tokenSlice';


export const store = configureStore({
    reducer: {
        user: userReducer,
        animal: animalReducer,
        token: tokenReducer
      },
});