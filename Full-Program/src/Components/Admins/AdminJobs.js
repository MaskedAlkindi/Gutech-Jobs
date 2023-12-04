import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const adminId = user?.user_id;
    fetch(`http://localhost:3001/admin/jobs?adminId=${adminId}`)
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error:', error));
  }, [user?.user_id]);

  const viewApplications = (jobId) => {
    navigate(`/job-applications/${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = () => {
    if (jobToDelete) {
      // Make a DELETE request to delete the job
      fetch(`http://localhost:3001/deletejob/${jobToDelete}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message); // Log the response message
          // You can also update the jobs state to remove the deleted job
          setJobs(prevJobs => prevJobs.filter(job => job.job_id !== jobToDelete));
        })
        .catch(error => console.error('Error deleting job:', error));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const cancelDeleteJob = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };
  const HandleUpdateJob = (jobId) => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  return (
    <Container fluid className="text-white py-4" style={{ background: '#121212', minHeight: '100vh', color: 'white' }}>
     
      <Row>
        {jobs.map(job => (
          <Col md={6} lg={4} className="mb-4" key={job.job_id}>
            <Card style={{backgroundColor: "#282828"}} text="light">
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Text>{job.description}</Card.Text>
                <Button variant="outline-primary" style={{ marginRight: '10px' }} onClick={() => viewApplications(job.job_id)}>
                  View Applications
                </Button>
                <Button variant="outline-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteJob(job.job_id)}>
                  Delete Job
                </Button>
                <Button variant="outline-success" onClick={() => HandleUpdateJob(job.job_id)}>
                  Update
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDeleteJob}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteJob}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteJob}>
            Delete
          </Button>
         
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminJobs;
