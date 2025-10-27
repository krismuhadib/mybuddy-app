import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

export const animalSlice = createSlice({
  name: 'animal', 
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    SaveAnimal: (state, action) => {
      state.value =  action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { SaveAnimal } = animalSlice.actions;

// We export the reducer function so that it can be added to the store
export default animalSlice.reducer;