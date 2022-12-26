import { combineReducers } from "redux"
import  userReducer  from "./reducers/userReducer"
import { generalReducer } from "./reducers/general.reducer"
import { tutorialReducer } from "./reducers/tutorial.reducer"
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
    generalModule: generalReducer,
    tutorialModule: tutorialReducer
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
