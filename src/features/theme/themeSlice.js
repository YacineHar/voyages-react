import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mode: localStorage.getItem('theme') || 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.mode === 'light') {
        state.mode = 'dark'
      } else {
        state.mode = 'light'
      }
      localStorage.setItem('theme', state.mode)
    }
  }
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer
