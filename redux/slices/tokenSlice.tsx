import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

export const tokenSlice = createSlice({
  name: 'token', 
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    SaveToken: (state, action) => {
      state.value =  action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { SaveToken } = tokenSlice.actions;

// We export the reducer function so that it can be added to the store
export default tokenSlice.reducer;