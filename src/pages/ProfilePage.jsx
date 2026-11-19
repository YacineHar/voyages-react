import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, ListGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites, removeFavorite } from '../features/favorites/favoritesSlice'
import { fetchMyComments } from '../features/comments/commentsSlice'
import { fetchDestinations } from '../features/destinations/destinationsSlice'
import EditProfileModal from '../components/EditProfileModal'
import PasswordModal from '../components/PasswordModal'
import ConfirmModal from '../components/ConfirmModal'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const favorites = useSelector((state) => state.favorites.list)
  const comments = useSelector((state) => state.comments.mine)
  const destinations = useSelector((state) => state.destinations.list)

  const [showEdit, setShowEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [favoriteToRemove, setFavoriteToRemove] = useState(null)

  useEffect(() => {
    dispatch(fetchFavorites())
    dispatch(fetchMyComments())
    dispatch(fetchDestinations())
  }, [dispatch])

  const getDestination = (id) => {
    return destinations.find((destination) => destination.id === Number(id))
  }

  const handleRemove = () => {
    dispatch(removeFavorite(Number(favoriteToRemove.destination_id)))
    setFavoriteToRemove(null)
  }

  return (
    <>
      <h1 className='mb-4'>Mon profil</h1>
      <Row>
        <Col lg={4} className='mb-4'>
          <Card>
            <Card.Body className='text-center'>
              <img src={user.avatar} alt={user.username} width='120' height='120' className='rounded-circle border mb-3' />
              <h2>{user.username}</h2>
              <Badge bg={user.role === 'admin' ? 'danger' : 'secondary'}>{user.role}</Badge>
            </Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item><strong>Prénom :</strong> {user.firstName}</ListGroup.Item>
              <ListGroup.Item><strong>Nom :</strong> {user.lastName}</ListGroup.Item>
              <ListGroup.Item><strong>Email :</strong> {user.email}</ListGroup.Item>
              <ListGroup.Item><strong>Genre :</strong> {user.gender ? user.gender : 'Non précisé'}</ListGroup.Item>
            </ListGroup>
            <Card.Body className='d-grid gap-2'>
              <Button variant='primary' onClick={() => setShowEdit(true)}>Modifier mes informations</Button>
              <Button variant='outline-primary' onClick={() => setShowPassword(true)}>Changer mon mot de passe</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <h2 className='fs-4 mb-3'>Mes favoris</h2>
          {favorites.length === 0 && <p>Vous n'avez pas encore de favoris.</p>}
          <Row>
            {favorites.map((favorite) => {
              const destination = getDestination(favorite.destination_id)
              return (
                <Col sm={6} key={favorite.id} className='mb-3'>
                  <Card className='h-100'>
                    <Card.Img variant='top' src={favorite.destination_image} alt={favorite.destination_title} style={{ height: '140px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{favorite.destination_title}</Card.Title>
                      {destination && (
                        <Button as={Link} to={`/destinations/${destination.slug}`} variant='primary' size='sm' className='me-2'>Voir</Button>
                      )}
                      <Button variant='outline-danger' size='sm' onClick={() => setFavoriteToRemove(favorite)}>Retirer</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>

          <h2 className='fs-4 mt-4 mb-3'>Mes commentaires</h2>
          {comments.length === 0 && <p>Vous n'avez pas encore laissé de commentaire.</p>}
          {comments.map((comment) => {
            const destination = getDestination(comment.destination_id)
            return (
              <Card key={comment.id} className='mb-2'>
                <Card.Body>
                  <div className='d-flex mb-1'>
                    {destination ? (
                      <Link to={`/destinations/${destination.slug}`}><strong>{destination.name}</strong></Link>
                    ) : (
                      <strong>Destination {comment.destination_id}</strong>
                    )}
                    {comment.rating && <Badge bg='warning' text='dark' className='ms-2'>{comment.rating}/5</Badge>}
                    <small className='text-muted ms-auto'>{comment.created_at}</small>
                  </div>
                  <Card.Text>{comment.content}</Card.Text>
                </Card.Body>
              </Card>
            )
          })}
        </Col>
      </Row>

      {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
      {showPassword && <PasswordModal onClose={() => setShowPassword(false)} />}

      <ConfirmModal
        show={favoriteToRemove !== null}
        title='Retirer un favori'
        text={favoriteToRemove ? `Retirer ${favoriteToRemove.destination_title} de vos favoris ?` : ''}
        onConfirm={handleRemove}
        onClose={() => setFavoriteToRemove(null)}
      />
    </>
  )
}
