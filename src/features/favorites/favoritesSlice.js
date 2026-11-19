import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/favorites/index.php`, {
    headers: { 'X-Auth-Token': token }
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const addFavorite = createAsyncThunk('favorites/add', async (data, { getState, dispatch, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/favorites/store.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  dispatch(fetchFavorites())

  return result
})

export const removeFavorite = createAsyncThunk('favorites/remove', async (destinationId, { getState, dispatch, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/favorites/delete.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify({ destinationId: destinationId })
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  dispatch(fetchFavorites())

  return result
})

const initialState = {
  list: [],
  error: null
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(addFavorite.pending, (state) => {
        state.error = null
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeFavorite.pending, (state) => {
        state.error = null
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export default favoritesSlice.reducer
