import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../../api/apiClient'

export const fetchCommentsByDestination = createAsyncThunk('comments/fetchByDestination', async (destinationId, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/comments/by-destination.php?destination_id=${destinationId}`)
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchMyComments = createAsyncThunk('comments/fetchMine', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/comments/by-user.php`, {
    headers: { 'X-Auth-Token': token }
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  return result
})

export const fetchAllComments = createAsyncThunk('comments/fetchAll', async (_, { rejectWithValue }) => {
  const response = await fetch(`${API_URL}/destinations/index.php`)
  const destinations = await response.json()

  if (!response.ok) {
    return rejectWithValue(destinations.message)
  }

  let comments = []

  for (const destination of destinations) {
    const res = await fetch(`${API_URL}/comments/by-destination.php?destination_id=${destination.id}`)
    const data = await res.json()

    for (const comment of data) {
      comments.push({ ...comment, destination_name: destination.name })
    }
  }

  return comments
})

export const addComment = createAsyncThunk('comments/add', async (data, { getState, dispatch, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/comments/store.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(data)
  })
  const result = await response.json()

  if (!response.ok) {
    return rejectWithValue(result.message)
  }

  dispatch(fetchCommentsByDestination(data.destination_id))

  return result
})

export const deleteComment = createAsyncThunk('comments/delete', async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token

  const response = await fetch(`${API_URL}/comments/delete.php`, {
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
  mine: [],
  all: [],
  loading: false,
  error: null
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByDestination.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(fetchMyComments.fulfilled, (state, action) => {
        state.mine = action.payload
      })
      .addCase(fetchAllComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.loading = false
        state.all = action.payload
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addComment.pending, (state) => {
        state.error = null
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.all = state.all.filter((comment) => comment.id !== action.payload)
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export default commentsSlice.reducer
