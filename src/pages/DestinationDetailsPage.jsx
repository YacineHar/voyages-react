import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Row, Col, Button, Badge, Form, Card, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestination } from '../features/destinations/destinationsSlice'
import { fetchCommentsByDestination, addComment } from '../features/comments/commentsSlice'
import { fetchFavorites, addFavorite, removeFavorite } from '../features/favorites/favoritesSlice'
import ConfirmModal from '../components/ConfirmModal'
import heart from '../assets/heart.svg'
import heartFill from '../assets/heart-fill.svg'

const schema = yup.object({
  content: yup.string().required('Le commentaire est obligatoire'),
  rating: yup.string()
})

export default function DestinationDetailsPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { current: destination, loading, error } = useSelector((state) => state.destinations)
  const token = useSelector((state) => state.auth.token)
  const favorites = useSelector((state) => state.favorites.list)
  const comments = useSelector((state) => state.comments.list)
  const commentError = useSelector((state) => state.comments.error)

  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(fetchDestination(slug))
  }, [slug, dispatch])

  useEffect(() => {
    if (destination) {
      dispatch(fetchCommentsByDestination(destination.id))
    }
  }, [destination, dispatch])

  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites())
    }
  }, [token, dispatch])

  if (loading) {
    return <p className='text-center'>Chargement...</p>
  }

  if (error || !destination) {
    return (
      <div className='text-center'>
        <h1>Destination introuvable</h1>
        <Button as={Link} to='/destinations' variant='primary'>Retour aux destinations</Button>
      </div>
    )
  }

  const isFavorite = favorites.some((favorite) => Number(favorite.destination_id) === destination.id)

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(destination.id))
    } else {
      dispatch(addFavorite({
        destinationId: destination.id,
        title: destination.name,
        image: destination.image
      }))
    }
    setShowModal(false)
  }

  const onSubmit = (data) => {
    const comment = {
      destination_id: destination.id,
      content: data.content
    }
    if (data.rating) {
      comment.rating = Number(data.rating)
    }
    dispatch(addComment(comment))
    reset()
  }

  const lat = Number(destination.lat)
  const lng = Number(destination.long)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 3},${lat - 3},${lng + 3},${lat + 3}&layer=mapnik&marker=${lat},${lng}`

  return (
    <>
      <Button as={Link} to='/destinations' variant='outline-primary' className='mb-4'>Retour</Button>
      <Row>
        <Col md={6} className='mb-4'>
          <img src={destination.image} alt={destination.name} className='img-fluid rounded' />
        </Col>
        <Col md={6}>
          <h1>{destination.name}</h1>
          <p>
            <Badge as={Link} to={`/region/${destination.region_slug}`} bg='info' className='text-decoration-none'>
              {destination.region_name}
            </Badge>
          </p>
          <p><strong>Capitale :</strong> {destination.capital}</p>
          <p>{destination.description}</p>
          <p className='text-muted'>Ajoutée par {destination.creator_username}</p>

          {token ? (
            <Button variant='outline-danger' onClick={() => setShowModal(true)}>
              <img src={isFavorite ? heartFill : heart} alt='' width='18' className='me-2 mb-1' />
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
          ) : (
            <>
              <Button variant='outline-danger' disabled>
                <img src={heart} alt='' width='18' className='me-2 mb-1' />
                Ajouter aux favoris
              </Button>
              <p className='mt-2'>
                <Link to='/login'>Connectez-vous</Link> pour ajouter cette destination à vos favoris.
              </p>
            </>
          )}
        </Col>
      </Row>

      <h2 className='mt-4 mb-3'>Carte</h2>
      <iframe title={'Carte ' + destination.name} src={mapUrl} width='100%' height='350' className='border rounded'></iframe>

      <h2 className='mt-4 mb-3'>Commentaires ({comments.length})</h2>

      {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}

      {comments.map((comment) => (
        <Card key={comment.id} className='mb-3'>
          <Card.Body>
            <div className='d-flex align-items-center mb-2'>
              <img src={comment.avatar} alt={comment.username} width='40' height='40' className='rounded-circle border me-2' />
              <strong>{comment.username}</strong>
              {comment.rating && <Badge bg='warning' text='dark' className='ms-2'>{comment.rating}/5</Badge>}
              <small className='text-muted ms-auto'>{comment.created_at}</small>
            </div>
            <Card.Text>{comment.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}

      {token ? (
        <Form onSubmit={handleSubmit(onSubmit)} className='border p-3 mt-3'>
          <h3 className='fs-5'>Laisser un commentaire</h3>
          {commentError && <Alert variant='danger'>{commentError}</Alert>}
          <Form.Group className='mb-3'>
            <Form.Label>Commentaire</Form.Label>
            <Form.Control as='textarea' rows={3} {...register('content')} isInvalid={!!errors.content} />
            <Form.Control.Feedback type='invalid'>{errors.content?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Note (optionnel)</Form.Label>
            <Form.Select {...register('rating')}>
              <option value=''>Pas de note</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </Form.Select>
          </Form.Group>
          <Button type='submit' variant='primary'>Envoyer</Button>
        </Form>
      ) : (
        <p><Link to='/login'>Connectez-vous</Link> pour laisser un commentaire.</p>
      )}

      <ConfirmModal
        show={showModal}
        title='Favoris'
        text={isFavorite ? `Retirer ${destination.name} de vos favoris ?` : `Ajouter ${destination.name} à vos favoris ?`}
        onConfirm={handleFavorite}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
