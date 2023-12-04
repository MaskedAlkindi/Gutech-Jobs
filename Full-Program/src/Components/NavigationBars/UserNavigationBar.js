import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../AuthContext';
function UserNavigationBar() {
  const { logout } = useAuth(); // Use the logout function from the AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
    // Add any additional actions needed for logout, like redirecting
  };
  return (
    <Navbar style={{ backgroundColor: '#0D1117' }} variant="dark" expand="lg">
      <LinkContainer  style = {{ color: '#040D12' }}  to="/">
      <Navbar.Brand>
          <img
            src="https://rio-heritage.org/wp-content/uploads/2019/02/logo-gutech-white.png"
            alt="Logo"
            height="60"
          />
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse style = {{marginLeft: 10}} id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Jobs" id="basic-nav-dropdown">
    
            <LinkContainer  style = {{ color: '#040D12' }}  to="/Jobs">
              <NavDropdown.Item>View</NavDropdown.Item>
            </LinkContainer>

          </NavDropdown>
          <LinkContainer  to="/my-applications">
            <Nav.Link>My Applications</Nav.Link>
          </LinkContainer>
          <LinkContainer   to="/contactUs">
            <Nav.Link>Contact Us</Nav.Link>
          </LinkContainer>
        </Nav>
        
      </Navbar.Collapse>
      <Button style = {{marginRight:40}}variant="outline-danger" onClick={handleLogout}>Logout</Button> {/* Logout Button */}
    </Navbar>
  );
}

export default UserNavigationBar;
