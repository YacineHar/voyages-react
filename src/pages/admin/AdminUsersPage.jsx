import { useEffect, useState } from 'react'
import { Table, Alert, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../../features/users/usersSlice'
import AdminPasswordModal from '../../components/AdminPasswordModal'

export default function AdminUsersPage() {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.users)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <>
      <h2 className='fs-4 mb-3'>Utilisateurs</h2>
      {loading && <p>Chargement...</p>}
      {error && !selectedUser && <Alert variant='danger'>{error}</Alert>}
      {list.length > 0 && (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nom d'utilisateur</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr key={user.id}>
                <td><img src={user.avatar} alt={user.username} width='40' height='40' className='rounded-circle' /></td>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant='outline-primary' size='sm' onClick={() => setSelectedUser(user)}>
                    Mot de passe
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedUser && <AdminPasswordModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>
  )
}
