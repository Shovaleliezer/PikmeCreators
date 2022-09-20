import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunk from "redux-thunk";
import  userReducer  from "./reducers/userReducer"
import { generalReducer } from "./reducers/general.reducer";
import { configureStore } from '@reduxjs/toolkit'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const reducers = combineReducers({
    user: userReducer,
    generalModule: generalReducer
  })

export const store = configureStore({
    reducer: persistReducer(
    {
      key: 'root',
      version: 1,
      storage
    },
    reducers
  ),
 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    // .concat(logger)
});

export const persistor = persistStore(store);
