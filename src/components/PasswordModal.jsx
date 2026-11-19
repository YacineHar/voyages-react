import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword, resetUsersMessage } from '../features/users/usersSlice'

const schema = yup.object({
  currentPassword: yup.string().required('Le mot de passe actuel est obligatoire'),
  newPassword: yup
    .string()
    .required('Le nouveau mot de passe est obligatoire')
    .min(8, 'Minimum 8 caractères')
    .matches(/[a-z]/, 'Il faut au moins une minuscule')
    .matches(/[A-Z]/, 'Il faut au moins une majuscule')
    .matches(/[0-9]/, 'Il faut au moins un chiffre')
    .matches(/[^a-zA-Z0-9]/, 'Il faut au moins un caractère spécial'),
  confirmPassword: yup
    .string()
    .required('La confirmation est obligatoire')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne sont pas identiques')
})

export default function PasswordModal({ onClose }) {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.users)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(resetUsersMessage())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      reset()
    }
  }, [success, reset])

  const onSubmit = (data) => {
    dispatch(changePassword(data))
  }

  return (
    <Modal show={true} onHide={onClose} centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer mon mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && <Alert variant='success'>{success}</Alert>}
          {error && <Alert variant='danger'>{error}</Alert>}

          <Form.Group className='mb-3'>
            <Form.Label>Mot de passe actuel</Form.Label>
            <Form.Control type='password' {...register('currentPassword')} isInvalid={!!errors.currentPassword} />
            <Form.Control.Feedback type='invalid'>{errors.currentPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control type='password' {...register('newPassword')} isInvalid={!!errors.newPassword} />
            <Form.Control.Feedback type='invalid'>{errors.newPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <Form.Control type='password' {...register('confirmPassword')} isInvalid={!!errors.confirmPassword} />
            <Form.Control.Feedback type='invalid'>{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>Fermer</Button>
          <Button type='submit' variant='primary' disabled={loading}>Modifier</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
