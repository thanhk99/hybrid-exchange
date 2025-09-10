import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage' 
import { persistReducer, persistStore } from 'redux-persist'
import authReducer from './authSlice'
import p2pReducer from './p2pSlice'

// gộp reducer
const rootReducer = combineReducers({
  auth: authReducer,
  p2p: p2pReducer,
})

const persistConfig = {
  key: 'root',        // tên key lưu trong localStorage
  storage,            // loại storage : localStorage
  whitelist: ['auth'] // slice cần lưu : auth
}

// persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // tránh warning khi redux-persist lưu non-serializable
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
