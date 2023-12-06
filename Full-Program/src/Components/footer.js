import React from 'react';

import { Card, Button, Container, Row, Col, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid className="text-white py-4" style={{ background: '#21262D' }}>
     
        
      
      <Row>
        <Col md={6} className="text-md-left">
          <div>
            &copy;{new Date().getFullYear()} Hajid Alkindi (21-0099)
          </div>
        </Col>
        <Col md={6} className="text-md-right">
          <div>
            Al Amerat, Born and Raised
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
