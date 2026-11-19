import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, resetUsersMessage } from '../features/users/usersSlice'

const schema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire").min(4, 'Minimum 4 caractères'),
  email: yup.string().required("L'email est obligatoire").email("L'email n'est pas valide"),
  firstName: yup.string().required('Le prénom est obligatoire'),
  lastName: yup.string().required('Le nom est obligatoire'),
  gender: yup.string(),
  avatar: yup.string().url("L'avatar doit être une url valide")
})

export default function EditProfileModal({ onClose }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { loading, error, success } = useSelector((state) => state.users)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender || '',
      avatar: user.avatar || ''
    }
  })

  useEffect(() => {
    dispatch(resetUsersMessage())
  }, [dispatch])

  const onSubmit = (data) => {
    dispatch(updateProfile(data))
  }

  return (
    <Modal show={true} onHide={onClose} centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier mes informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && <Alert variant='success'>{success}</Alert>}
          {error && <Alert variant='danger'>{error}</Alert>}

          <Form.Group className='mb-3'>
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control type='text' {...register('username')} isInvalid={!!errors.username} />
            <Form.Control.Feedback type='invalid'>{errors.username?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='text' {...register('email')} isInvalid={!!errors.email} />
            <Form.Control.Feedback type='invalid'>{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Prénom</Form.Label>
            <Form.Control type='text' {...register('firstName')} isInvalid={!!errors.firstName} />
            <Form.Control.Feedback type='invalid'>{errors.firstName?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Nom</Form.Label>
            <Form.Control type='text' {...register('lastName')} isInvalid={!!errors.lastName} />
            <Form.Control.Feedback type='invalid'>{errors.lastName?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Genre</Form.Label>
            <Form.Select {...register('gender')}>
              <option value=''>Non précisé</option>
              <option value='homme'>Homme</option>
              <option value='femme'>Femme</option>
              <option value='autre'>Autre</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Avatar</Form.Label>
            <Form.Control type='text' {...register('avatar')} isInvalid={!!errors.avatar} />
            <Form.Control.Feedback type='invalid'>{errors.avatar?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>Fermer</Button>
          <Button type='submit' variant='primary' disabled={loading}>Enregistrer</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
