import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './logins.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
function Signup() {
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation after login
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const [theme, setTheme] = useState('theme' ? 'dark' : 'light')
 

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      console.log(data.message);
      navigate('/login');
    })
    .catch(error => {
      setLoading(false);
      console.error('Error:', error);
    });
  };


  const handleLogin = () => {
    navigate('/login');
  
  };

  return (
    <div className="app" data-theme={theme} >
    <div className="container342" >
    <Modal show={loading} centered>
      <Modal.Body>Loading...</Modal.Body>
    </Modal>
    <div style= {{marginBottom:20}}>
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
        <button type="submit">Sign up</button>
        <p className="divider" ><span>Or</span></p>
        <button onClick={() => handleLogin()}>Login In</button>
      </form>
      

    </div>
     
    </div>
  );
}

export default Signup;
