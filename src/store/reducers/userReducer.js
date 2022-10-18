import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    about: "",
    history: [],
    nickName: "",
    address: "",
    userBalance: "",
    isConnected:false,
    image:''
  },
  reducers: {
    setAbout: (state, action) => {
      state.about = action.payload
    },
    setHistory: (state, action) => {
      state.history = action.payload
    },
    setNickName: (state, action) => {
      state.nickName = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setBalance: (state, action) => {
      state.userBalance = action.payload
    },
    setImage: (state,action) =>{
      state.image = action.payload
    },
    setIsConnected:(state, action) => {
        state.isConnected = action.payload
      },
    resetState: (state, action) => {
      state = {
        about: "",
        history: [],
        nickName: "",
        image:"",
        address: "",
        userBalance: "",
        isConnected:false,
      }
    },
  },
})

export const  {
    setAbout,
    setHistory,
    setNickName,
    setAddress,
    setBalance,
    setImage,
    setIsConnected,
    resetState
} = userSlice.actions

export default userSlice.reducer
