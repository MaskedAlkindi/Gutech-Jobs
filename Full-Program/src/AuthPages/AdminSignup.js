import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './logins.css';
import { useNavigate } from 'react-router-dom';

function AdminSignup() {
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:3001/admin-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      if (data.error) {
        setModalMessage(data.error);
        setShowModal(true);
      } else {
        console.log(data.message);
        navigate('/login');
      }
    })
    .catch(error => {
      setLoading(false);
      console.error('Error:', error);
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };
  const handleUserSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="app" data-theme="dark">
      <div className="container342">
        <Modal show={loading || showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body>{loading ? "Loading..." : modalMessage}</Modal.Body>
          {!loading && (
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        <div style={{ marginBottom: 20 }}>
          <img
            src="https://rio-heritage.org/wp-content/uploads/2019/02/logo-gutech-white.png"
            alt="Logo"
            height="90"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Please Enter your Username" required />
          <label>Email</label>
          <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Please Enter your Email" required />
          <label>Password</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Please Enter your Password" required />
          <Button style = {{marginTop: 20}} variant="outline-success" type="submit">Sign up</Button>
          <p className="divider"><span>Or</span></p>
          <Button variant="outline-light" type="button" onClick={handleLogin}>Login In</Button>
          <Button style = {{marginTop: 20}} variant="outline-light" type="button" onClick={handleUserSignup}>User Signup</Button>
        </form>

      </div>
    </div>
  );
}

export default AdminSignup;
