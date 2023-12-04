import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
import sendEmail from '../Functions/SendEmail';

function ContactUs() {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showModal, setShowModal] = useState(false); 
  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the email body
    const emailBody = `Dear Admin,
    \nYou have received a feedback from sender ${contactData.name} (${contactData.email}) stating the following message: ${contactData.message}
    \n\nBest regards,\nGutech Jobs`;

    // Send the email
    await sendEmail('Feedback', 'hajidalkindii@gmail.com', emailBody);

    console.log('Form submitted:', contactData);
    setContactData({ name: '', email: '', subject: '', message: '' }); // Reset form data
    setShowModal(true); // Show success modal
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formStyle = {
    backgroundColor: "#21262D",
    borderRadius: "10px",
    padding: "50px",
    color: "white",
    marginTop: 50 
  };

  const inputStyle = {
    backgroundColor: "#343A40",
    color: "white",
    borderColor: "#495057",
    marginBottom: 25 
  };

  return (
    <Container fluid style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Row className="justify-content-center align-items-center" >
        <Col md={8}>
          <Form onSubmit={handleSubmit} style={formStyle}>
            <h2 className="text-center mb-4">Contact Us</h2>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName">
                
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={contactData.name} onChange={handleChange} style={inputStyle} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={contactData.email} onChange={handleChange} style={inputStyle} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" name="subject" value={contactData.subject} onChange={handleChange} style={inputStyle} required />
            </Form.Group>

            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} name="message" value={contactData.message} onChange={handleChange} style={inputStyle} required />
            </Form.Group>

            <Button  variant="outline-light" type="submit" className="mt-3">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback received</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your message has been sent successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ContactUs;
