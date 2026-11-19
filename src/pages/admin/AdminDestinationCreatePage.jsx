import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createDestination, fetchRegions, resetCreated } from '../../features/destinations/destinationsSlice'

const schema = yup.object({
  name: yup.string().required('Le nom est obligatoire'),
  slug: yup.string().required('Le slug est obligatoire').matches(/^[a-z0-9-]+$/, 'Seulement des minuscules, chiffres et tirets'),
  region_id: yup.string().required('La région est obligatoire'),
  capital: yup.string().required('La capitale est obligatoire'),
  description: yup.string().required('La description est obligatoire'),
  image: yup.string().required("L'image est obligatoire").url("L'image doit être une url valide"),
  lat: yup.string().required('La latitude est obligatoire'),
  long: yup.string().required('La longitude est obligatoire')
})

export default function AdminDestinationCreatePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { regions, loading, error, created } = useSelector((state) => state.destinations)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(resetCreated())
    dispatch(fetchRegions())
  }, [dispatch])

  useEffect(() => {
    if (created) {
      dispatch(resetCreated())
      navigate('/admin/destinations')
    }
  }, [created, dispatch, navigate])

  const onSubmit = (data) => {
    dispatch(createDestination({ ...data, region_id: Number(data.region_id) }))
  }

  return (
    <>
      <h2 className='fs-4 mb-3'>Ajouter une destination</h2>
      {error && <Alert variant='danger'>{error}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)} className='border p-3'>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Nom</Form.Label>
              <Form.Control type='text' placeholder='France' {...register('name')} isInvalid={!!errors.name} />
              <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Slug</Form.Label>
              <Form.Control type='text' placeholder='france' {...register('slug')} isInvalid={!!errors.slug} />
              <Form.Control.Feedback type='invalid'>{errors.slug?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Région</Form.Label>
              <Form.Select {...register('region_id')} isInvalid={!!errors.region_id}>
                <option value=''>Choisir une région</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>{errors.region_id?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Capitale</Form.Label>
              <Form.Control type='text' placeholder='Paris' {...register('capital')} isInvalid={!!errors.capital} />
              <Form.Control.Feedback type='invalid'>{errors.capital?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className='mb-3'>
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' rows={3} {...register('description')} isInvalid={!!errors.description} />
          <Form.Control.Feedback type='invalid'>{errors.description?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Image (url)</Form.Label>
          <Form.Control type='text' placeholder='https://cdn.pixabay.com/...' {...register('image')} isInvalid={!!errors.image} />
          <Form.Control.Feedback type='invalid'>{errors.image?.message}</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Latitude</Form.Label>
              <Form.Control type='text' placeholder='46.2276' {...register('lat')} isInvalid={!!errors.lat} />
              <Form.Control.Feedback type='invalid'>{errors.lat?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Longitude</Form.Label>
              <Form.Control type='text' placeholder='2.2137' {...register('long')} isInvalid={!!errors.long} />
              <Form.Control.Feedback type='invalid'>{errors.long?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button type='submit' variant='primary' disabled={loading}>Ajouter</Button>
      </Form>
    </>
  )
}
