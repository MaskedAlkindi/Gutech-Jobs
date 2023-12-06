import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Container, Form, Button, Modal, Card } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import firebaseapp from '../Firebase/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import sendEmail from '../Functions/SendEmail';

function JobApplication() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [job, setJob] = useState(''); // New state for job title

    
    const [application, setApplication] = useState({
      name: '',
      email: '',
      personalPhoto: null,
      cv: null         
    });
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
  
    const handleFileChange = (e) => {
      setApplication({ ...application, [e.target.name]: e.target.files[0] });
    };
    const handleChange = (e) => {
      setApplication({ ...application, [e.target.name]: e.target.value });
    };
    const uploadFile = async (file) => {
      const storage = getStorage(firebaseapp);
      const storageRef = ref(storage, 'folder_name/' + file.name);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    };
    useEffect(() => {
      // Fetch job title
      fetch(`http://localhost:3001/job/${jobId}`)
        .then(response => response.json())
       
        .then(data => setJob(data)) // Assuming the title is a property of the returned object
        .catch(error => console.error('Error fetching job title:', error));
    }, [jobId]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Ensure user is logged in
      if (!user) {
        console.error('User is not logged in');
        return; // Optionally, redirect to login or show an error message
      }
    
      setLoading(true); // Start loading
    
      try {
        // Upload files and get their URLs
        const photoURL = application.personalPhoto ? await uploadFile(application.personalPhoto) : '';
        const cvURL = application.cv ? await uploadFile(application.cv) : '';
    
        // Prepare the application data with file URLs
        const applicationData = {
          ...application,
          userId: user.user_id,
          jobId: jobId,
          personalPhoto: photoURL,
          cv: cvURL
        };
    
        // Send the application data to your API
        const response = await fetch('http://localhost:3001/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData)
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Handle success - Navigate to /jobs
          
          const emailBody = `Dear Mr/Mrs ${application.name},
          \nYou have successfully applied for the job: ${job.title}.
          \n\nBest regards,\nGutech Jobs`;

          await sendEmail('Successful Application', application.email, emailBody);

          navigate('/jobs');
          
        } else {
          // Handle non-successful response
          setResponseMessage('Error: ' + data.message); // Customize this message based on your API response
          // Optionally, show an error modal or message to the user
        }
      } catch (error) {
        console.error('Error:', error);
        setResponseMessage('Error: ' + error.message); // Customize this message
        // Optionally, show an error modal or message to the user
      } finally {
        setLoading(false); // End loading
      }
    };
    const defaultImage = "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

  return (
    <Container fluid data-theme={"dark"} className="text-white py-4" style={{ background: '#0D1117', minHeight: '100vh', color: 'white' }}>
      <div className='container341' style = {{width: 750}}>
      <h1>Apply for Job: {job.title || 'Loading...'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter your name" value={application.name} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter your email" value={application.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formPersonalPhoto">
            <Form.Label>Personal Photo</Form.Label>
            <Form.Control type="file" name="personalPhoto" onChange={handleFileChange} />
          </Form.Group>

          <Form.Group controlId="formCV">
            <Form.Label>CV</Form.Label>
            <Form.Control type="file" name="cv" onChange={handleFileChange} />
          </Form.Group>

        <Button variant="outline-light" type="submit" style = {{marginTop: 30}}>
          Submit Application
        </Button>
      </Form>
      
















      <Modal show={loading} onHide={() => {}} centered>
          <Modal.Header>
            <Modal.Title>{loading ? 'Submitting Application...' : 'Response'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? 'Please wait while we are processing your application.' : responseMessage}
          </Modal.Body>
          <Modal.Footer>
            {!loading && <Button variant="secondary" onClick={() => setLoading(false)}>Close</Button>}
          </Modal.Footer>
        </Modal>
        <Card  style={{ height: '100%', width: "100%", marginTop: 20, backgroundColor: "#282828", color: "white"}}>
                
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>
                    {job.description} ...<br />
                    Type: {job.type}<br />
                    Salary: {job.salary}<br />
                    Skills: {job.skills}<br />
                  </Card.Text>
                                  

                  
                 
                
                  
                </Card.Body>
      </Card>
      </div>
      
          
    </Container>
  );
}

export default JobApplication;
