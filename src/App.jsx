import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router'
import { fetchMe } from './features/auth/authSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const mode = useSelector((state) => state.theme.mode)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe(token))
    }
  }, [token, user, dispatch])

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', mode)
  }, [mode])

  return <RouterProvider router={router} />
}

export default App
