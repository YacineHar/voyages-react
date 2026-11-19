import { Nav } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'

export default function AdminPage() {
  return (
    <>
      <h1 className='mb-4'>Dashboard</h1>
      <Nav variant='tabs' className='mb-4'>
        <Nav.Link as={NavLink} to='/admin' end>Accueil</Nav.Link>
        <Nav.Link as={NavLink} to='/admin/contacts'>Contacts</Nav.Link>
        <Nav.Link as={NavLink} to='/admin/users'>Utilisateurs</Nav.Link>
        <Nav.Link as={NavLink} to='/admin/destinations'>Destinations</Nav.Link>
        <Nav.Link as={NavLink} to='/admin/comments'>Commentaires</Nav.Link>
      </Nav>
      <Outlet />
    </>
  )
}
