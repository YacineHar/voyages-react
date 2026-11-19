import { useEffect, useState } from 'react'
import { Table, Alert, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllComments, deleteComment } from '../../features/comments/commentsSlice'
import ConfirmModal from '../../components/ConfirmModal'

export default function AdminCommentsPage() {
  const dispatch = useDispatch()
  const { all, loading, error } = useSelector((state) => state.comments)
  const [commentToDelete, setCommentToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchAllComments())
  }, [dispatch])

  const handleDelete = () => {
    dispatch(deleteComment(commentToDelete.id))
    setCommentToDelete(null)
  }

  return (
    <>
      <h2 className='fs-4 mb-3'>Commentaires</h2>
      {loading && <p>Chargement...</p>}
      {error && <Alert variant='danger'>{error}</Alert>}
      {!loading && all.length === 0 && <p>Aucun commentaire.</p>}
      {all.length > 0 && (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Destination</th>
              <th>Utilisateur</th>
              <th>Commentaire</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {all.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.created_at}</td>
                <td>{comment.destination_name}</td>
                <td>{comment.username}</td>
                <td>{comment.content}</td>
                <td>{comment.rating ? comment.rating + '/5' : '-'}</td>
                <td>
                  <Button variant='danger' size='sm' onClick={() => setCommentToDelete(comment)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmModal
        show={commentToDelete !== null}
        title='Supprimer un commentaire'
        text='Voulez-vous vraiment supprimer ce commentaire ?'
        onConfirm={handleDelete}
        onClose={() => setCommentToDelete(null)}
      />
    </>
  )
}
