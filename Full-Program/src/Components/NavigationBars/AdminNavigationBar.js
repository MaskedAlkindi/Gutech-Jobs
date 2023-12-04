import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../AuthContext';
function AdminNavigationBar() {
  const { logout } = useAuth(); // Use the logout function from the AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
    // Add any additional actions needed for logout, like redirecting
  };
  return (
    <Navbar style={{ backgroundColor: '#0D1117' }} variant="dark" expand="lg">
      <LinkContainer to="/">
        {/* Replace "Job Portal" with the logo */}
        <Navbar.Brand >
          <img
            src="https://rio-heritage.org/wp-content/uploads/2019/02/logo-gutech-white.png"
            alt="Logo"
            height="60"
            style = {{marginRight:40}}
          />
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown  style = {{marginRight:40}} title="Jobs" id="jobs-nav-dropdown">
            <LinkContainer style = {{color: '#040D12' }} to="/jobs">
              <NavDropdown.Item style = {{ color: '#040D12' }} >View</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer style = {{ color: '#040D12' }} to="/add">
              <NavDropdown.Item style = {{ color: '#040D12' }} >Add</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>

          {/* New "Admin" dropdown menu */}
          <NavDropdown title="Admin" id="admin-nav-dropdown" >
            <LinkContainer  style = {{ color: '#040D12' }} to="/admin/jobs">
              <NavDropdown.Item style = {{ color: '#040D12' }} >My Jobs</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        
      </Navbar.Collapse>
      <Button style = {{marginRight:40}}variant="outline-danger" onClick={handleLogout}>Logout</Button> {/* Logout Button */}
    </Navbar>
  );
}

export default AdminNavigationBar;
