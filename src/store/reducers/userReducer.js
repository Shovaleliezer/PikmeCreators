import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    about: "",
    history: [],
    nickName: "",
    address: "",
    userBalance: "",
    isConnected:false
  },
  reducers: {
    setAbout: (state, action) => {
      state.about = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setNickName: (state, action) => {
      state.nickName = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.userBalance = action.payload;
    },
    setIsConnected:(state, action) => {
        state.isConnected = action.payload;
      },
    resetState: (state, action) => {
        console.log('he')
      state = {
        about: "",
        history: [],
        nickName: "",
        address: "",
        userBalance: "",
        isConnected:false,
      };
      console.log(state)
    },
  },
});

export const  {
    setAbout,
    setHistory,
    setNickName,
    setAddress,
    setBalance,
    setIsConnected,
    resetState
} = userSlice.actions;

export default userSlice.reducer;