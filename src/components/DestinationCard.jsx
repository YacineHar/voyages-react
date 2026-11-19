import { Card, Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  return (
    <Col sm={6} lg={4} className='mb-4'>
      <Card className='h-100 shadow-sm'>
        <Card.Img variant='top' src={destination.image} alt={destination.name} style={{ height: '200px', objectFit: 'cover' }} />
        <Card.Body className='d-flex flex-column'>
          <Card.Title>{destination.name}</Card.Title>
          <Card.Text>
            <strong>Région :</strong> {destination.region_name}
            <br />
            <strong>Capitale :</strong> {destination.capital}
          </Card.Text>
          <Button as={Link} to={`/destinations/${destination.slug}`} variant='primary' className='mt-auto'>
            Voir le détail
          </Button>
        </Card.Body>
      </Card>
    </Col>
  )
}
