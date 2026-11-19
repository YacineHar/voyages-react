import { useEffect } from 'react'
import { Row, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestinations } from '../features/destinations/destinationsSlice'
import DestinationCard from '../components/DestinationCard'

export default function DestinationsPage() {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.destinations)

  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])

  return (
    <>
      <h1 className='mb-4'>Toutes les destinations</h1>

      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}

      <Row>
        {list.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </Row>
    </>
  )
}
