import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseapp from '../Firebase/firebase';
import { useAuth } from '../AuthContext';
import Footer from './footer';
function AddJobs() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'FullTime',
    salary: '',
    description: '',
    picture: null, // Change to null for file data
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth(); // Get the user from AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };
  const uploadFile = async (file) => {
    const storage = getStorage(firebaseapp);
    const storageRef = ref(storage, 'folder_name/' + file.name);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Upload the picture if it's selected
    let pictureURL = '';
    if (formData.picture) {
      pictureURL = await uploadFile(formData.picture);
    }
  
    const jobDataWithUserIdAndPicture = {
      ...formData,
      user_id: user?.user_id,
      picture: pictureURL // Replace with the URL from Firebase
    };
  
    // Post data to the server
    fetch('http://localhost:3001/add-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobDataWithUserIdAndPicture),
    })
  

  };

  const successMessageStyle = {
    backgroundColor: '#28a745', // Success color
    color: 'white',
    padding: '10px',
    marginBottom: '15px',
    textAlign: 'center',
    borderRadius: '5px',
  };

  const submitButtonStyle = {
    backgroundColor: '#007bff',
    borderColor: '#007bff'
  };

  return (
    <Container fluid data-theme={"dark"} className="text-white py-4" style={{ background: '#121212', minHeight: '100vh', color: 'white' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          {showSuccessMessage && <div style={successMessageStyle}>Job added successfully!</div>}
          
         
         
          <div className='container341'>

         
          <Form onSubmit={handleSubmit}>
            {/* Form groups remain the same */}
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formType">
              <Form.Label>Typee</Form.Label>
              <Form.Control as="select" name="type" value={formData.type} onChange={handleChange}>
                <option>FullTime</option>
                <option>PartTime</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formSalary">
              <Form.Label>Salary</Form.Label>
              <Form.Control type="text" name="salary" value={formData.salary} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formPicture">
              <Form.Label>Picture</Form.Label>
              <Form.Control type="file" name="picture" onChange={handleFileChange} />
            </Form.Group>

            <Button type="submit" style={{marginTop: 30}}>
              Add Job
            </Button>
          </Form>
          </div>

        
        
        
        </Col>
      </Row>
     
    </Container>
  );
}

export default AddJobs;
