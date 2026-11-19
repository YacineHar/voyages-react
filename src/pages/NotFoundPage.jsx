import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Container className='text-center py-5'>
      <h1 className='display-1'>404</h1>
      <p className='lead'>Oups, cette page n'existe pas.</p>
      <p>La page que vous cherchez a peut-être été déplacée ou n'a jamais existé.</p>
      <Button as={Link} to='/' variant='primary' className='me-2'>Retour à l'accueil</Button>
      <Button as={Link} to='/destinations' variant='outline-primary'>Voir les destinations</Button>
    </Container>
  )
}
