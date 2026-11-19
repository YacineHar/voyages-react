import { useEffect } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestinations } from '../features/destinations/destinationsSlice'
import DestinationCard from '../components/DestinationCard'

export default function HomePage() {
  const dispatch = useDispatch()
  const destinations = useSelector((state) => state.destinations.list)

  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])

  const populaires = destinations.slice(0, 3)

  return (
    <>
      <Row className='align-items-center mb-5'>
        <Col md={6} className='mb-4'>
          <h1>Partez à la découverte du monde</h1>
          <p className='lead'>
            Voyages vous présente des destinations aux quatre coins de la planète.
          </p>
          <p>
            Pour chaque pays, vous trouverez sa région, sa capitale, une description et une carte.
            Créez un compte pour ajouter vos destinations préférées en favoris et laisser des commentaires.
          </p>
          <Button as={Link} to='/destinations' variant='primary' className='me-2'>Voir les destinations</Button>
          <Button as={Link} to='/about' variant='outline-primary'>En savoir plus</Button>
        </Col>
        <Col md={6}>
          <img
            src='https://cdn.pixabay.com/photo/2025/07/06/01/34/travel-9698815_1280.jpg'
            alt='Voyage'
            className='img-fluid rounded shadow'
          />
        </Col>
      </Row>

      <h2 className='mb-3'>Quelques destinations</h2>
      <Row>
        {populaires.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </Row>
    </>
  )
}
