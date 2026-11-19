import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <Container as='main' className='py-4 flex-grow-1'>
        <Outlet />
      </Container>
      <footer className='bg-dark text-white text-center py-3'>
        Voyages - 2026
      </footer>
    </div>
  )
}
