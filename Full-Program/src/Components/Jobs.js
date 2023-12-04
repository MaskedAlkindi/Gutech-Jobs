import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
function Jobs() {
  const [jobs, setJobs] = useState([]);
  console.log(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

   useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    fetch('http://localhost:3001/jobs', {
      headers: {
        'Authorization': token, // Include the token in the Authorization header
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setJobs(data))
    .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const defaultImage = "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

  const handleReadMore = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleApply = (jobId) => {
    navigate(`/job-application/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesType = filterType ? job.type === filterType : true;
    const matchesSearchTerm = searchTerm ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesType && matchesSearchTerm;
  });

  return (
    <Container fluid className="text-white py-4" style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh'}}>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <InputGroup style={{backgroundColor: '#282828'}}>
            <Form.Control
              type="text"
              placeholder="Search jobs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={filterType || "Filter by Type"}
              id="input-group-dropdown-2"
            >
              <Dropdown.Item onClick={() => setFilterType('')}>All Types</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterType('FullTime')}>FullTime</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterType('PartTime')}>PartTime</Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {filteredJobs.length === 0 ? (
          <Col md={6} className="text-center">
            <p>No jobs found.</p>
          </Col>
        ) : (
          filteredJobs.map(job => (
            <Col key={job.job_id} md={6} lg={4} className="mb-4">
              <Card  style={{ height: '100%', backgroundColor: "#282828", color: "white"}}>
                <Card.Img variant="top" src={job.picture || defaultImage} alt="Job" style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>
                    {job.description.substring(0, 100)}...<br />
                    Type: {job.type}<br />
                    Salary: {job.salary}<br />
                    Skills: {job.skills}<br />
                  </Card.Text>
                                  

                  
                 
                  <Button variant="outline-success" onClick={() => handleApply(job.job_id)}>Apply</Button>
                  
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
     
    </Container>
    
  );
}

export default Jobs;
