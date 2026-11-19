import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const sendContact = createAsyncThunk('contact/send', async (data, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const user = getState().auth.user

  const headers = { 'Content-Type': 'application/json' }
  let body = data

  if (token) {
    headers['X-Auth-Token'] = token
  }
  if (user) {
    body = { ...data, user_id: user.id }
  }

  const response = await fetch(`${API_URL}/contact/store.php`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchContacts = createAsyncThunk('contact/fetchAll', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/contact/index.php`, {
    headers: { 'X-Auth-Token': token }
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

const initialState = {
  messages: [],
  loading: false,
  error: null,
  sent: false
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContact: (state) => {
      state.sent = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending, (state) => {
        state.loading = true
        state.error = null
        state.sent = false
      })
      .addCase(sendContact.fulfilled, (state) => {
        state.loading = false
        state.sent = true
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetContact } = contactSlice.actions

export default contactSlice.reducer
