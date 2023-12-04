import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
function MyApplications() {
  const { user } = useAuth(); // Get the current user from AuthContext
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user && user.user_id) {
      fetch(`http://localhost:3001/user-applications?userId=${user.user_id}`)
        .then(response => response.json())
        .then(data => setApplications(data))
        .catch(error => console.error('Error fetching applications:', error));
    }
  }, [user]); // Dependency on user object
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const handleDeleteClick = (appId) => {
    setSelectedApplicationId(appId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedApplicationId) {
      // Make a DELETE request to delete the application
      fetch(`http://localhost:3001/delete-application/${selectedApplicationId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message); // Log the response message
          // You can also update the applications state to remove the deleted application
          setApplications(prevApplications =>
            prevApplications.filter(app => app.application_id !== selectedApplicationId)
          );
        })
        .catch(error => console.error('Error deleting application:', error));
      setShowDeleteModal(false); // Close the modal after deletion
      setSelectedApplicationId(null); // Reset the selected application ID
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close the modal
    setSelectedApplicationId(null); // Reset the selected application ID
  };
  return (
    <Container fluid style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Row>
        {applications.length > 0 ? (
          applications.map(app => (
            <Col style = {{marginTop: 50}} key={app.application_id} md={4}>
              <Card className="mb-4" bg="dark" text="light" style={{ width: '20rem' }}>
                <Card.Img variant="top" src={app.personal_photo || 'default-image-url'} alt="Applicant" />
                <Card.Body>
                  <Card.Title>{app.name}</Card.Title>
                  <Card.Text>
                    Email: {app.email}
                    <br />
                    Status: {app.status}
                  </Card.Text>
                  <Button style = {{marginRight: 20}} variant="outline-primary" href={app.cv} target="_blank">
                  View CV
                </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteClick(app.application_id)}>
                  Delete
                </Button>
                
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </Row>
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this application?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default MyApplications;
