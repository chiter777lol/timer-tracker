import { createSlice } from '@reduxjs/toolkit'

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    activeSession: null,
    elapsedTime: 0,
    isRunning: false,
  },
  reducers: {
    setActiveSession: (state, action) => {
      state.activeSession = action.payload
      if (action.payload) {
        const startTime = new Date(action.payload.startTime)
        state.elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        state.isRunning = true
      } else {
        state.elapsedTime = 0
        state.isRunning = false
      }
    },
    updateElapsedTime: (state) => {
      if (state.isRunning && state.activeSession) {
        const startTime = new Date(state.activeSession.startTime)
        state.elapsedTime = Math.floor((Date.now() - startTime) / 1000)
      }
    },
    stopTimer: (state) => {
      state.isRunning = false
      state.activeSession = null
      state.elapsedTime = 0
    },
  }
})

export const { setActiveSession, updateElapsedTime, stopTimer } = timerSlice.actions
export default timerSlice.reducer
