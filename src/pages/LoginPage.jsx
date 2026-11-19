import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'

const schema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire"),
  password: yup.string().required('Le mot de passe est obligatoire')
})

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (token) {
      navigate('/profile')
    }
  }, [token, navigate])

  const onSubmit = (data) => {
    dispatch(loginUser(data))
  }

  return (
    <Row className='justify-content-center'>
      <Col md={6} lg={5}>
        <h1 className='mb-4'>Connexion</h1>

        {error && <Alert variant='danger'>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)} className='border p-3'>
          <Form.Group className='mb-3'>
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control type='text' {...register('username')} isInvalid={!!errors.username} />
            <Form.Control.Feedback type='invalid'>{errors.username?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type='password' {...register('password')} isInvalid={!!errors.password} />
            <Form.Control.Feedback type='invalid'>{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Button type='submit' variant='primary' disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Form>

        <p className='mt-3'>
          Pas encore de compte ? <Link to='/register'>Inscrivez-vous</Link>
        </p>
      </Col>
    </Row>
  )
}
