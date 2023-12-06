import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseapp from '../Firebase/firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import PlanetBackground from '../assets/imgass/PlanetBackground.png';
import sendEmail from '../Functions/SendEmail';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#0D1117',
    color: 'white',
    borderColor: '#30363d',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#0D1117',
    color: 'white',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#30363d' : '#0D1117',
    color: 'white',
  }),
  
};
const formControlStyles = {
  backgroundColor: '#21262D', // Dark background color
  color: 'white',             // White text color
  borderColor: '#30363d',     // Dark border color
};

function AddJobs() {
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: 'FullTime',
    salary: '',
    description: '',
    picture: null,
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const { user } = useAuth(); // Get the user from AuthContext

  // Load skills from your database or API
  useEffect(() => {
    fetch('http://localhost:3001/skills') 
      .then(response => response.json())
      .then(data => {
        const formattedSkills = data.map(skill => ({ value: skill.skill_id, label: skill.name }));
        setSkills(formattedSkills);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'salary' && e.target.value < 0) {
      alert('Salary cannot be less than 0.');
      return;
    }
    if (e.target.name === 'salary') {
      // Regular expression to check if the input is numeric
      const re = /^[0-9\b]+$/;
  
      // If the value is not numeric and not empty, return without updating
      if (e.target.value  !== '' && !re.test(e.target.value )) {
        alert('Salary must be a numeric value.');
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const uploadFile = async (file) => {
    const storage = getStorage(firebaseapp);
    const storageRef = ref(storage, 'folder_name/' + file.name);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);

    let pictureURL = '';
    if (formData.picture) {
      pictureURL = await uploadFile(formData.picture);
    }

    const jobDataWithUserIdAndPicture = {
      ...formData,
      user_id: user?.user_id,
      picture: pictureURL,
      skills: selectedSkills.map(skill => skill.value)
    };

    const response = await fetch('http://localhost:3001/add-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobDataWithUserIdAndPicture),
    });

    if (response.ok) {
      // Prepare the email body
      const emailBody = `Dear Admin, You have successfully created the following job:
      \nJob Title: ${formData.title}
      \nJob Description: ${formData.description}
      \nJob Type: ${formData.type}
      \nJob Salary: ${formData.salary}
      \n\nBest regards,\nGutech Jobs`;

      // Send the email to the logged-in admin's email
      await sendEmail('Added Job Successfully', user.email, emailBody);
      setShowModal(false);
      navigate('/jobs');
    }

    
  };

  return (
    <Container fluid data-theme={"dark"} className="text-white py-4" style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Modal show={showModal} centered>
        <Modal.Body>Loading...</Modal.Body>
      </Modal>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className='container341' style={{backgroundColor: "#21262D", minHeight: '600px'}}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control  style={formControlStyles}  type="text" name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>

              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control  style={formControlStyles}  as="select" name="type" value={formData.type} onChange={handleChange}>
                  <option>FullTime</option>
                  <option>PartTime</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formSalary">
                <Form.Label>Salary</Form.Label>
                <Form.Control  style={formControlStyles}  type="text" name="salary" value={formData.salary} onChange={handleChange} required />
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control  style={formControlStyles}  as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
              </Form.Group>

              <Form.Group controlId="formPicture">
                <Form.Label >Picture</Form.Label>
                <Form.Control  style={formControlStyles}  type="file" name="picture" onChange={handleFileChange} />
              </Form.Group>

              <Form.Group controlId="formSkills">
                <Form.Label>Skills</Form.Label>
                <Select
                    isMulti
                    name="skills"
                    options={skills}
                    styles={customStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleSkillChange}
                  />
              </Form.Group>

              <Button variant="outline-light" type="submit" style={{marginTop: 30, minHeight: 50}}>
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
