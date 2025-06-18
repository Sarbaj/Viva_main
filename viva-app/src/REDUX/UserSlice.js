import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    UserInfo:[],
    ResultQ:[] 
  },
  reducers: {
    // Auth
    login: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
    },

    addBasicInfo: (state, action) => {
      state.UserInfo = [action.payload]; // storing user as array with 1 object
    },
    addstudentresult: (state, action) => {
      state.ResultQ = [action.payload]; // storing user as array with 1 object
    }
  },
});

export const {
  login,
  logout,
  addBasicInfo,addstudentresult
} = userSlice.actions;

export default userSlice.reducer;
