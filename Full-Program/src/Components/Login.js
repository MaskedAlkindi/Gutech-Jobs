import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Modal } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './logins.css'
function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth(); // Use the login function from context
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation after login

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const [theme, setTheme] = useState('theme' ? 'dark' : 'light')
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      console.log(data);
      if(data.token) {
        localStorage.setItem('token', data.token);
        login(data.user);
        navigate('/');
      } else {
        console.log(data.message);
      }
    })
    .catch(error => {
      setLoading(false);
      console.error('Error:', error);
    });
  };

  const handleSignUp = () => {
    navigate('/signup');
  
  };
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      login(JSON.parse(storedUserData));
    }
  }, []);


  return (
    <div className="app" data-theme={theme} >
      <div className="container342" >
      <div style= {{marginBottom:20}}>
      <Modal show={loading} centered>
        <Modal.Body>Loading...</Modal.Body>
      </Modal>
      <img
            src="https://rio-heritage.org/wp-content/uploads/2019/02/logo-gutech-white.png"
            alt="Logo"
            height="90"
        />

      </div>
     
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Enter Your Username" required />
        
        <label>Password</label>
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Enter Your Password" required />
        <button type="submit">Login</button>
        <p className="divider" ><span>Or</span></p>
        <button onClick={() => handleSignUp()}>Sign Up</button>
     
      </form>
    </div>
    

    </div>
    
  );
}

export default Login;
