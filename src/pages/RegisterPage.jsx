import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, resetRegister } from '../features/auth/authSlice'

const schema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire").min(4, 'Minimum 4 caractères'),
  password: yup
    .string()
    .required('Le mot de passe est obligatoire')
    .min(8, 'Minimum 8 caractères')
    .matches(/[a-z]/, 'Il faut au moins une minuscule')
    .matches(/[A-Z]/, 'Il faut au moins une majuscule')
    .matches(/[0-9]/, 'Il faut au moins un chiffre')
    .matches(/[^a-zA-Z0-9]/, 'Il faut au moins un caractère spécial'),
  email: yup.string().required("L'email est obligatoire").email("L'email n'est pas valide"),
  firstname: yup.string().required('Le prénom est obligatoire'),
  lastname: yup.string().required('Le nom est obligatoire'),
  gender: yup.string(),
  avatar: yup.string().url("L'avatar doit être une url valide")
})

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, registered } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(resetRegister())
  }, [dispatch])

  useEffect(() => {
    if (registered) {
      dispatch(resetRegister())
      navigate('/login')
    }
  }, [registered, dispatch, navigate])

  const onSubmit = (data) => {
    let avatar = data.avatar
    if (!avatar) {
      avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.username}`
    }

    dispatch(registerUser({
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      gender: data.gender,
      avatar: avatar
    }))
  }

  return (
    <Row className='justify-content-center'>
      <Col md={8} lg={6}>
        <h1 className='mb-4'>Inscription</h1>

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

          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='text' {...register('email')} isInvalid={!!errors.email} />
            <Form.Control.Feedback type='invalid'>{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Prénom</Form.Label>
                <Form.Control type='text' {...register('firstname')} isInvalid={!!errors.firstname} />
                <Form.Control.Feedback type='invalid'>{errors.firstname?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Nom</Form.Label>
                <Form.Control type='text' {...register('lastname')} isInvalid={!!errors.lastname} />
                <Form.Control.Feedback type='invalid'>{errors.lastname?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className='mb-3'>
            <Form.Label>Genre (optionnel)</Form.Label>
            <Form.Select {...register('gender')}>
              <option value=''>Non précisé</option>
              <option value='homme'>Homme</option>
              <option value='femme'>Femme</option>
              <option value='autre'>Autre</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Avatar (optionnel)</Form.Label>
            <Form.Control type='text' placeholder='https://...' {...register('avatar')} isInvalid={!!errors.avatar} />
            <Form.Control.Feedback type='invalid'>{errors.avatar?.message}</Form.Control.Feedback>
            <Form.Text>Si vous ne mettez rien, un avatar sera créé automatiquement.</Form.Text>
          </Form.Group>

          <Button type='submit' variant='primary' disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </Form>
      </Col>
    </Row>
  )
}
