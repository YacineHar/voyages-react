import { useEffect, useState } from 'react'
import { Table, Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestinations, deleteDestination } from '../../features/destinations/destinationsSlice'
import ConfirmModal from '../../components/ConfirmModal'

export default function AdminDestinationsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { list, loading, error } = useSelector((state) => state.destinations)
  const [destinationToDelete, setDestinationToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])

  const handleDelete = () => {
    dispatch(deleteDestination(destinationToDelete.id))
    setDestinationToDelete(null)
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className='fs-4 mb-0'>Destinations</h2>
        <Button as={Link} to='/admin/destinations/new' variant='primary'>Ajouter une destination</Button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Région</th>
            <th>Capitale</th>
            <th>Créateur</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((destination) => (
            <tr key={destination.id}>
              <td><img src={destination.image} alt={destination.name} width='80' className='rounded' /></td>
              <td><Link to={`/destinations/${destination.slug}`}>{destination.name}</Link></td>
              <td>{destination.region_name}</td>
              <td>{destination.capital}</td>
              <td>{destination.creator_username}</td>
              <td>
                {Number(destination.creator_id) === user.id && (
                  <Button variant='danger' size='sm' onClick={() => setDestinationToDelete(destination)}>
                    Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmModal
        show={destinationToDelete !== null}
        title='Supprimer une destination'
        text={destinationToDelete ? `Voulez-vous vraiment supprimer ${destinationToDelete.name} ?` : ''}
        onConfirm={handleDelete}
        onClose={() => setDestinationToDelete(null)}
      />
    </>
  )
}
