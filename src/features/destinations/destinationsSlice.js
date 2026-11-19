import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const fetchDestinations = createAsyncThunk('destinations/fetchAll', async (_, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/destinations/index.php`)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchDestination = createAsyncThunk('destinations/fetchOne', async (slug, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/destinations/show.php?slug=${slug}`)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchDestinationsByRegion = createAsyncThunk('destinations/fetchByRegion', async (region, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/destinations/by-region.php?region=${region}`)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchRegions = createAsyncThunk('destinations/fetchRegions', async (_, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/regions/index.php`)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const createDestination = createAsyncThunk('destinations/create', async (data, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/destinations/store.php`, {
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

export const deleteDestination = createAsyncThunk('destinations/delete', async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/destinations/delete.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify({ id: id })
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return id
})

const initialState = {
  list: [],
  current: null,
  byRegion: [],
  regions: [],
  loading: false,
  error: null,
  created: false
}

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    resetCreated: (state) => {
      state.created = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchDestination.pending, (state) => {
        state.loading = true
        state.error = null
        state.current = null
      })
      .addCase(fetchDestination.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchDestination.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchDestinationsByRegion.pending, (state) => {
        state.loading = true
        state.error = null
        state.byRegion = []
      })
      .addCase(fetchDestinationsByRegion.fulfilled, (state, action) => {
        state.loading = false
        state.byRegion = action.payload
      })
      .addCase(fetchDestinationsByRegion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload
      })
      .addCase(createDestination.pending, (state) => {
        state.loading = true
        state.error = null
        state.created = false
      })
      .addCase(createDestination.fulfilled, (state) => {
        state.loading = false
        state.created = true
      })
      .addCase(createDestination.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.list = state.list.filter((destination) => destination.id !== action.payload)
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { resetCreated } = destinationsSlice.actions

export default destinationsSlice.reducer
