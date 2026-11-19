import { useEffect } from 'react'
import { Table, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContacts } from '../../features/contact/contactSlice'

export default function AdminContactsPage() {
  const dispatch = useDispatch()
  const { messages, loading, error } = useSelector((state) => state.contact)

  useEffect(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  return (
    <>
      <h2 className='fs-4 mb-3'>Demandes de contact</h2>
      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}
      {!loading && !error && messages.length === 0 && <p>Aucune demande de contact.</p>}
      {messages.length > 0 && (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Sujet</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.created_at}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.subject}</td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
