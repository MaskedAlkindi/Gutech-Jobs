import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

function JobDetails() {
  const [job, setJob] = useState(null);
  const { jobId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/job/${jobId}`)
      .then(response => response.json())
      .then(data => setJob(data))
      .catch(error => console.error('Error:', error));
  }, [jobId]);

  return (
    <Container className="mt-3">
      {job ? (
        <Card>
          <Card.Img variant="top" src={job.picture} />
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Text>{job.description}</Card.Text>
            <p>Salary: {job.salary}</p>
            <p>Type: {job.type}</p>
            {/* Add more job details */}
          </Card.Body>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}

export default JobDetails;
