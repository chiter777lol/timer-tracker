import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import timerReducer from './timerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timer: timerReducer,
  },
})
