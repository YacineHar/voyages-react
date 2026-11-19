import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/auth/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchMe = createAsyncThunk('auth/me', async (token, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/auth/me.php`, {
    headers: { 'X-Auth-Token': token }
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/auth/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  localStorage.setItem('token', result.accessToken)

  return result
})

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  registered: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    resetRegister: (state) => {
      state.registered = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.registered = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.registered = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.accessToken
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })
  }
})

export const { logout, resetRegister } = authSlice.actions

export default authSlice.reducer
