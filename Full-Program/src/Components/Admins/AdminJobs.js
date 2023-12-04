import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Button, Card, Container, Row, Col, Modal, Form, Spinner  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlanetBackground from '../../assets/imgass/PlanetBackground.png';
import Select from 'react-select';
function AdminJobs() {


  
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});
  const [skills, setSkills] = useState([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  const fetchJobs = () => {
    const adminId = user?.user_id;

    fetch(`http://localhost:3001/admin/jobs?adminId=${adminId}`)
      .then(response => response.json())
      .then(data => {
        setJobs(data.map(job => ({ ...job, skills: job.skills || [] })));
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchJobs();
    fetch('http://localhost:3001/skills')
      .then(response => response.json())
      .then(data => {
        setSkills(data.map(skill => ({ value: skill.skill_id, label: skill.name })));
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, [user?.user_id]);

  const viewApplications = (jobId) => {
    navigate(`/job-applications/${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = () => {
    fetch(`http://localhost:3001/deletejob/${jobToDelete}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setJobs(jobs.filter(job => job.job_id !== jobToDelete));
        setShowDeleteModal(false);
      })
      .catch(error => console.error('Error deleting job:', error));
  };

  const handleUpdateJobOpen = (jobId) => {
    const job = jobs.find(j => j.job_id === jobId);
    console.log(job.skills);
    // Ensure that skills are correctly formatted for react-select
    const formattedSkills = job.skills && job.skills.map(skill => ({
      value: skill.value, 
      label: skill.label
    }));
    console.log(formattedSkills);
  
    setSelectedJob({
      ...job,
      skills: formattedSkills || [] // Set to an empty array if no skills
    });
  
    setShowUpdateModal(true);
  };

  const handleUpdateJobChange = (e) => {
    setSelectedJob({ ...selectedJob, [e.target.name]: e.target.value });
  };

  const handleUpdateJobSubmit = (e) => {
    e.preventDefault();
    setShowLoadingModal(true); // Show loading modal

    const skillIds = selectedJob.skills.map(skill => skill.value);

    fetch(`http://localhost:3001/updatejob/${selectedJob.job_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: selectedJob.title,
        type: selectedJob.type,
        salary: selectedJob.salary,
        description: selectedJob.description,
        picture: selectedJob.picture,
        skills: skillIds 
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(() => {
      fetchJobs(); // Refresh jobs list after updating a job
      setShowLoadingModal(false); // Hide loading modal
      setShowUpdateModal(false); // Hide update modal
    })
    .catch(error => {
      console.error('Error updating job:', error);
      setShowLoadingModal(false); // Hide loading modal in case of error
    });
  };

  return (
    <Container fluid className="text-white py-4" style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center'}}>
         <Modal show={showLoadingModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Updating job...</p>
        </Modal.Body>
      </Modal>
      
      
      <Row style={{marginTop: 50}}>
        {jobs.map(job => (
          <Col md={6} lg={4} className="mb-4" key={job.job_id}>
            <Card style={{backgroundColor: "#282828"}} text="light">
              <Card.Img variant="top" src={job.picture} alt="Job" style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Text>{job.description}</Card.Text>
                <Button variant="outline-primary" style={{ marginRight: '10px' }} onClick={() => viewApplications(job.job_id)}>
                  View Applications
                </Button>
                <Button variant="outline-danger" style={{ marginRight: '10px' }} onClick={() => handleDeleteJob(job.job_id)}>
                  Delete Job
                </Button>
                <Button variant="outline-success" onClick={() => handleUpdateJobOpen(job.job_id)}>
                  Update
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteJob}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Job Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Update Job</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleUpdateJobSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          defaultValue={selectedJob.title}
          onChange={handleUpdateJobChange}
        />
      </Form.Group>

      <Form.Group controlId="formType">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          name="type"
          defaultValue={selectedJob.type}
          onChange={handleUpdateJobChange}
        >
          <option value="FullTime">FullTime</option>
          <option value="PartTime">PartTime</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formSalary">
        <Form.Label>Salary</Form.Label>
        <Form.Control
          type="text"
          name="salary"
          defaultValue={selectedJob.salary}
          onChange={handleUpdateJobChange}
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          rows={3}
          defaultValue={selectedJob.description}
          onChange={handleUpdateJobChange}
        />
      </Form.Group>

      <Form.Group controlId="formPicture">
        <Form.Label>Picture URL</Form.Label>
        <Form.Control
          type="text"
          name="picture"
          defaultValue={selectedJob.picture}
          onChange={handleUpdateJobChange}
        />
      </Form.Group>

      <Form.Group controlId="formSkills">
              <Form.Label>Skills</Form.Label>
              <Select
                isMulti
                name="skills"
                defaultValue={selectedJob.skills || []} // Set default value
                options={skills} // Use the skills state
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOptions) => {
                  setSelectedJob({ 
                    ...selectedJob, 
                    skills: selectedOptions || [] // Update the skills in the selected job
                  });
                }}
              />
            </Form.Group>

      <Button variant="success" type="submit">
        Update
      </Button>
    </Form>
  </Modal.Body>
</Modal>
    </Container>
  );
}

export default AdminJobs;
