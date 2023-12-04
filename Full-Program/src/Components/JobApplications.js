import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
import sendEmail from '../Functions/SendEmail';


function JobApplications() {
  const [jobDetails, setJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const defaultImage =
    'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=';

  useEffect(() => {
    fetch(`http://localhost:3001/job/${jobId}`)
      .then(response => response.json())
      .then(data => setJobDetails(data))
      .catch(error => console.error('Error fetching job details:', error));

    fetch(`http://localhost:3001/job-applications?jobId=${jobId}`)
      .then(response => response.json())
      .then(data => setApplications(data))
      .catch(error => console.error('Error fetching applications:', error));
  }, [jobId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [confirmUpdateModalShow, setConfirmUpdateModalShow] = useState(false);

  const handleDeleteClick = (appId) => {
    setSelectedApplicationId(appId);
    setShowDeleteModal(true);
  };

  const handleUpdateClick = (appId) => {
    setSelectedApplicationId(appId);
    setShowStatusModal(true);
  };

  const handleConfirmUpdateStatus = () => {
    
    setShowStatusModal(false);
    setConfirmUpdateModalShow(true);
  };

  const handleFinalizeUpdateStatus = async () => {
    if (selectedApplicationId && selectedStatus) {
      const application = applications.find(app => app.application_id === selectedApplicationId);
      if (!application) {
        console.error('Application not found');
        setConfirmUpdateModalShow(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/update-application-status/${selectedApplicationId}/${selectedStatus}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const emailSubject = `Application ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`;
        const emailBody = `Dear User, your application has been ${selectedStatus} for the job title: ${jobDetails ? jobDetails.title : ''}.\n\nBest regards,\nGutech Jobs`;
        await sendEmail(emailSubject, application.email, emailBody);

        setApplications(prevApplications =>
          prevApplications.map(app =>
            app.application_id === selectedApplicationId
              ? { ...app, status: selectedStatus }
              : app
          )
        );
      } else {
        const data = await response.json();
        console.error('Error updating status:', data.message);
      }

      setConfirmUpdateModalShow(false);
      setSelectedApplicationId(null);
    }
  };

  const handleCancelUpdateStatus = () => {
    setShowStatusModal(false);
    setSelectedApplicationId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedApplicationId) {
      fetch(`http://localhost:3001/delete-application/${selectedApplicationId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          setApplications(prevApplications =>
            prevApplications.filter(app => app.application_id !== selectedApplicationId)
          );
        })
        .catch(error => console.error('Error deleting application:', error));
      setShowDeleteModal(false);
      setSelectedApplicationId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedApplicationId(null);
  };


  return (
    <Container fluid style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
      <Modal show={confirmUpdateModalShow} onHide={() => setConfirmUpdateModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Application Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to update the application status to {selectedStatus}? This action will notify the applicant.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setConfirmUpdateModalShow(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleFinalizeUpdateStatus}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
      
      
      {/* Title with centered and white text */}
      <h1 style={{ textAlign: 'center', color: 'white' }}>
                Applications for Job: {jobDetails ? jobDetails.title : 'Loading...'}
            </h1>

            <Row>
                {applications.map(app => (
                    // Adjust column width for tighter card layout
                    <Col md={3} key={app.application_id} style={{ padding: '5px' }}> 
                        <Card bg="dark" text="light">
                            <Card.Img
                                variant="top"
                                src={app.personal_photo || defaultImage}
                                style={{ height: '300px', objectFit: 'cover' }}
                                onError={e => { e.target.src = defaultImage; }}
                            />
                            <Card.Body>
                                <Card.Title>{app.name}</Card.Title>
                                <Card.Text>Email: {app.email}</Card.Text>
                                <Button variant="outline-primary" href={app.cv} target="_blank">View CV</Button>
                                <Button variant="outline-success" onClick={() => handleUpdateClick(app.application_id)}>Update</Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteClick(app.application_id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {applications.length === 0 && <p style={{ color: 'white', textAlign: 'center' }}>No applications found.</p>}

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
