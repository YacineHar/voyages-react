import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  if (!token) {
    return <Navigate to='/login' />
  }

  if (!user) {
    return <p className='text-center'>Chargement...</p>
  }

  return children
}
