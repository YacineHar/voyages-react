import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import contactReducer from '../features/contact/contactSlice'
import destinationsReducer from '../features/destinations/destinationsSlice'
import commentsReducer from '../features/comments/commentsSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import usersReducer from '../features/users/usersSlice'
import searchReducer from '../features/search/searchSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    destinations: destinationsReducer,
    comments: commentsReducer,
    favorites: favoritesReducer,
    users: usersReducer,
    search: searchReducer,
    theme: themeReducer
  }
})
