import { useEffect } from 'react'
import { Row, Button, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestinationsByRegion } from '../features/destinations/destinationsSlice'
import DestinationCard from '../components/DestinationCard'

export default function RegionPage() {
  const { region } = useParams()
  const dispatch = useDispatch()
  const { byRegion, loading, error } = useSelector((state) => state.destinations)

  useEffect(() => {
    dispatch(fetchDestinationsByRegion(region))
  }, [region, dispatch])

  return (
    <>
      <h1 className='mb-4'>
        Destinations : {byRegion.length > 0 ? byRegion[0].region_name : region}
      </h1>

      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && byRegion.length === 0 && (
        <>
          <p>Aucune destination pour cette région.</p>
          <Button as={Link} to='/destinations' variant='primary'>Voir toutes les destinations</Button>
        </>
      )}

      <Row>
        {byRegion.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </Row>
    </>
  )
}
