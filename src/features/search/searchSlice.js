import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const searchDestinations = createAsyncThunk('search/destinations', async (data, { rejectWithValue }) => {
  let url = `${API_URL}/destinations/search.php?`

  if (data.keyword) {
    url += `keyword=${data.keyword}&`
  }
  if (data.region) {
    url += `region=${data.region}`
  }

  const response = await fetch(url)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

const initialState = {
  results: null,
  loading: false,
  error: null
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchDestinations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchDestinations.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
      })
      .addCase(searchDestinations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default searchSlice.reducer
