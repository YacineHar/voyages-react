import { Container, Nav, Navbar as BsNavbar, Button } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { toggleTheme } from '../features/theme/themeSlice'
import sun from '../assets/sun.svg'
import moon from '../assets/moon.svg'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const mode = useSelector((state) => state.theme.mode)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <BsNavbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <BsNavbar.Brand as={Link} to='/'>Voyages</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls='menu' />
        <BsNavbar.Collapse id='menu'>
          <Nav className='me-auto'>
            <Nav.Link as={NavLink} to='/' end>Accueil</Nav.Link>
            <Nav.Link as={NavLink} to='/destinations'>Destinations</Nav.Link>
            <Nav.Link as={NavLink} to='/search'>Recherche</Nav.Link>
            <Nav.Link as={NavLink} to='/about'>À propos</Nav.Link>
            <Nav.Link as={NavLink} to='/contact'>Contact</Nav.Link>
          </Nav>
          <Nav className='align-items-lg-center'>
            {!token && (
              <>
                <Nav.Link as={NavLink} to='/login'>Connexion</Nav.Link>
                <Nav.Link as={NavLink} to='/register'>Inscription</Nav.Link>
              </>
            )}
            {token && user && user.role === 'admin' && (
              <Nav.Link as={NavLink} to='/admin'>Dashboard</Nav.Link>
            )}
            {token && (
              <>
                <Nav.Link as={NavLink} to='/profile'>Profil</Nav.Link>
                <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
              </>
            )}
            <Button variant='outline-light' size='sm' className='ms-lg-3 mt-2 mt-lg-0' onClick={() => dispatch(toggleTheme())}>
              <img src={mode === 'light' ? moon : sun} alt='' width='16' className='me-1 mb-1' />
              {mode === 'light' ? 'Sombre' : 'Clair'}
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
