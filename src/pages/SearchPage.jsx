import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegions } from '../features/destinations/destinationsSlice'
import { searchDestinations } from '../features/search/searchSlice'
import DestinationCard from '../components/DestinationCard'

const schema = yup.object({
  keyword: yup
    .string()
    .test('min', 'Minimum 2 caractères', (value) => !value || value.trim().length >= 2),
  region: yup
    .string()
    .test('un-des-deux', 'Veuillez remplir au moins un des deux champs', function (value) {
      return !!value || !!this.parent.keyword
    })
})

export default function SearchPage() {
  const dispatch = useDispatch()
  const regions = useSelector((state) => state.destinations.regions)
  const { results, loading, error } = useSelector((state) => state.search)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(fetchRegions())
  }, [dispatch])

  const onSubmit = (data) => {
    dispatch(searchDestinations({
      keyword: data.keyword.trim(),
      region: data.region
    }))
  }

  return (
    <>
      <h1 className='mb-4'>Rechercher une destination</h1>

      <Form onSubmit={handleSubmit(onSubmit)} className='border p-3 mb-4'>
        {errors.region && <Alert variant='danger'>{errors.region.message}</Alert>}
        <Row>
          <Col md={7} className='mb-3'>
            <Form.Label>Mot clé</Form.Label>
            <Form.Control type='text' placeholder='Exemple : Japon, Tokyo...' {...register('keyword')} isInvalid={!!errors.keyword} />
            <Form.Control.Feedback type='invalid'>{errors.keyword?.message}</Form.Control.Feedback>
          </Col>
          <Col md={5} className='mb-3'>
            <Form.Label>Région</Form.Label>
            <Form.Select {...register('region')}>
              <option value=''>Toutes les régions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.slug}>{region.name}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Button type='submit' variant='primary'>Rechercher</Button>
      </Form>

      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}

      {results && !loading && (
        <>
          <p>{results.length} résultat(s)</p>
          <Row>
            {results.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </Row>
        </>
      )}
    </>
  )
}
