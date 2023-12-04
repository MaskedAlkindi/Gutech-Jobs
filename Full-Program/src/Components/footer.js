import React from 'react';

import { Card, Button, Container, Row, Col, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid className="text-white py-4" style={{ background: '#21262D' }}>
     
        
      
      <Row>
        <Col md={6} className="text-md-left">
          <div>
            &copy;{new Date().getFullYear()} Your Company Name. All Rights Reserved.
          </div>
        </Col>
        <Col md={6} className="text-md-right">
          <div>
            Address: 123 Example Street, City, Country
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
