import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { sendContact, resetContact } from '../features/contact/contactSlice'

const schema = yup.object({
  name: yup.string().required('Le nom est obligatoire'),
  email: yup.string().required("L'email est obligatoire").email("L'email n'est pas valide"),
  subject: yup.string().required('Le sujet est obligatoire').min(5, 'Le sujet doit faire au moins 5 caractères'),
  message: yup.string().required('Le message est obligatoire').min(10, 'Le message doit faire au moins 10 caractères')
})

export default function ContactPage() {
  const dispatch = useDispatch()
  const { loading, error, sent } = useSelector((state) => state.contact)
  const user = useSelector((state) => state.auth.user)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(resetContact())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setValue('name', user.firstName + ' ' + user.lastName)
      setValue('email', user.email)
    }
  }, [user, setValue])

  useEffect(() => {
    if (sent) {
      reset({
        name: user ? user.firstName + ' ' + user.lastName : '',
        email: user ? user.email : '',
        subject: '',
        message: ''
      })
    }
  }, [sent, reset, user])

  const onSubmit = (data) => {
    dispatch(sendContact(data))
  }

  return (
    <Row className='justify-content-center'>
      <Col md={8} lg={6}>
        <h1 className='mb-4'>Contact</h1>

        {sent && <Alert variant='success'>Votre message a bien été envoyé, merci !</Alert>}
        {error && <Alert variant='danger'>{error}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)} className='border p-3'>
          <Form.Group className='mb-3'>
            <Form.Label>Nom</Form.Label>
            <Form.Control type='text' {...register('name')} isInvalid={!!errors.name} />
            <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='text' {...register('email')} isInvalid={!!errors.email} />
            <Form.Control.Feedback type='invalid'>{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Sujet</Form.Label>
            <Form.Control type='text' {...register('subject')} isInvalid={!!errors.subject} />
            <Form.Control.Feedback type='invalid'>{errors.subject?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Message</Form.Label>
            <Form.Control as='textarea' rows={5} {...register('message')} isInvalid={!!errors.message} />
            <Form.Control.Feedback type='invalid'>{errors.message?.message}</Form.Control.Feedback>
          </Form.Group>

          <Button type='submit' variant='primary' disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </Form>
      </Col>
    </Row>
  )
}
