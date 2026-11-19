import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'
import { fetchMe } from '../auth/authSlice'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/users/index.php`, {
    headers: { 'X-Auth-Token': token }
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const adminChangePassword = createAsyncThunk('users/adminChangePassword', async (data, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/users/change-password.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const updateProfile = createAsyncThunk('users/updateProfile', async (data, { getState, dispatch, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/profile/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  dispatch(fetchMe(token))

  return result
})

export const changePassword = createAsyncThunk('users/changePassword', async (data, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/profile/change-password.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsersMessage: (state) => {
      state.error = null
      state.success = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(adminChangePassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(adminChangePassword.fulfilled, (state) => {
        state.loading = false
        state.success = 'Le mot de passe a bien été modifié'
      })
      .addCase(adminChangePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false
        state.success = 'Vos informations ont bien été modifiées'
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
        state.success = 'Votre mot de passe a bien été modifié'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetUsersMessage } = usersSlice.actions

export default usersSlice.reducer
