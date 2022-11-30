import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    address: "",
    isConnected: false,
    creator:false
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setCreator: (state, action) => {
      state.creator = action.payload
    },
    resetState: (state) => {
      state.address = ""
      state.isConnected = false
      state.creator = false
    },
  },
})

export const {
  setAddress,
  setIsConnected,
  setCreator,
  resetState,
} = userSlice.actions

export default userSlice.reducer
