import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

function JobApplications() {
  const [jobDetails, setJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const defaultImage =
    'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=';

  useEffect(() => {
    // Fetch job details
    fetch(`http://localhost:3001/job/${jobId}`)
      .then(response => response.json())
      .then(data => setJobDetails(data))
      .catch(error => console.error('Error fetching job details:', error));
    
    // Fetch applications for the job
    fetch(`http://localhost:3001/job-applications?jobId=${jobId}`)
      .then(response => response.json())
      .then(data => setApplications(data))
      .catch(error => console.error('Error fetching applications:', error));
  }, [jobId]);

  

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default status is 'pending'
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleDeleteClick = (appId) => {
    setSelectedApplicationId(appId);
    setShowDeleteModal(true);
  };
  const handleUpdateClick = (appId) => {
    setSelectedApplicationId(appId);
    setShowStatusModal(true);
  };
  const handleConfirmUpdateStatus = () => {
    if (selectedApplicationId && selectedStatus) {
      // Make a PUT request to update the application status
      fetch(`http://localhost:3001/update-application-status/${selectedApplicationId}/${selectedStatus}`, {
        method: 'PUT',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message); // Log the response message
          // You can also update the applications state to reflect the updated status
          // Update the applications array with the updated status
          setApplications(prevApplications =>
            prevApplications.map(app =>
              app.application_id === selectedApplicationId
                ? { ...app, status: selectedStatus }
                : app
            )
          );
        })
        .catch(error => console.error('Error updating status:', error));
  
      setShowStatusModal(false); // Close the modal after updating
      setSelectedApplicationId(null); // Reset the selected application ID
    }
  };
  
  const handleCancelUpdateStatus = () => {
    setShowStatusModal(false); // Close the modal
    setSelectedApplicationId(null); // Reset the selected application ID
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
    <Container fluid style={{ background: '#222', minHeight: '100vh', color: 'white' }}>
      <h1>Applications for Job: {jobDetails ? jobDetails.title : 'Loading...'}</h1>
      <Row>
        {applications.map(app => (
          <Col md={4} key={app.application_id}>
            <Card className="mb-4" bg="dark" text="light" style={{ width: '20rem' }}>
              <Card.Img
                variant="top"
                src={app.personal_photo || defaultImage}
                style={{ height: '300px', objectFit: 'cover' }}
                onError={e => {
                  e.target.src = defaultImage; // Use the default image if the user's image fails to load
                }}
              />
              <Card.Body>
                <Card.Title>{app.name}</Card.Title>
                <Card.Text>Email: {app.email}</Card.Text>
                <Button style={{ marginLeft:10, marginRight: '10px' }} variant="outline-primary" href={app.cv} target="_blank">
                  View CV
                </Button>
                <Button
                  variant="outline-success"
                  style={{ marginRight: '8px' }}
                  onClick={() => handleUpdateClick(app.application_id)}
                >
                  Update
                </Button>
                <Button variant="outline-danger" onClick={() => handleDeleteClick(app.application_id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {applications.length === 0 && <p>No applications found.</p>}

      {/* Delete Confirmation Modal */}
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
      <Modal show={showStatusModal} onHide={handleCancelUpdateStatus}>
  <Modal.Header closeButton>
    <Modal.Title>Update Status</Modal.Title>
  </Modal.Header>
        <Modal.Body>
          <label>Select Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelUpdateStatus}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default JobApplications;
