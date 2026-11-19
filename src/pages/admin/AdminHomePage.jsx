import { useSelector } from 'react-redux'

export default function AdminHomePage() {
  const user = useSelector((state) => state.auth.user)

  return (
    <>
      <h2 className='fs-4'>Bonjour {user.firstName}</h2>
      <p>Bienvenue dans l'administration. Choisissez une section dans le menu ci-dessus.</p>
    </>
  )
}
