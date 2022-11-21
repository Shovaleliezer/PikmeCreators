import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    about: "",
    history: [],
    nickName: "",
    address: "",
    userBalance: "",
    isConnected: false,
    image: '',
    events:[77,77],
    stats:{stat1:77},
    creator:false
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
    setImage: (state, action) => {
      state.image = action.payload
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setEvents: (state, action) => {
      state.events = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setCreator: (state, action) => {
      state.creator = action.payload
    },
    resetState: (state, action) => {
      state.address = ""
      state.nickName = ""
      state.isConnected = false
      state.image = ""
      state.userBalance = ""
      state.about = ""
      state.history = []
      state.creator = false
    },
  },
})

export const {
  setAbout,
  setHistory,
  setNickName,
  setAddress,
  setBalance,
  setImage,
  setIsConnected,
  resetState,
  setEvents,
  setStats,
  setCreator,
} = userSlice.actions

export default userSlice.reducer
