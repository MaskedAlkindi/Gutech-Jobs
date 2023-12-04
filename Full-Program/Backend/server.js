
require("dotenv").config();
console.log(process.env.TESTAPI);
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');


const sgMail = require('@sendgrid/mail');
const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        next();
    });
};


app.post('/sendemail', async (req, res) => {
    const { to, subject, text } = req.body;
  
    const msg = {
      to: to, // recipient
      from: process.env.SENDER_EMAIL, // verified sender
      subject: subject,
      text: text,
    };
  
    try {
      await sgMail.send(msg);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
      res.status(500).send('Error in sending email');
    }
  });






// Signup Endpoint


const saltRounds = 10; // or another number you prefer

app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Store user with hashed password
        db.query('INSERT INTO users (username, password, email, user_type) VALUES (?, ?, ?, "normal")', 
                 [username, hash, email], 
                 (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error signing up' });
            }
            res.status(200).json({ message: 'Signup successful' });
        });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query to find the user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error logging in' });
        }

        // Check if user exists
        if (results.length > 0) {
            const user = results[0];

            // Compare provided password with stored hashed password
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error checking password' });
                }

                if (isMatch) {
                    // Passwords match, create a token
                    const token = jwt.sign(
                        { id: user.id, username: user.username }, 
                        process.env.JWT_SECRET, 
                        { expiresIn: '24h' } // Token expires in 24 hours
                    );

                    // Remove the password from the user object before sending
                    const { password, ...userWithoutPassword } = user;

                    res.status(200).json({
                        message: 'Login successful',
                        token,
                        user: userWithoutPassword
                    });
                } else {
                    // Passwords do not match
                    res.status(400).json({ message: 'Username or password is incorrect' });
                }
            });
        } else {
            // User not found
            res.status(400).json({ message: 'Username or password is incorrect' });
        }
    });
});



// Example endpoint




app.get('/jobs', verifyToken, (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



// Delete a job by ID along with associated applications
app.delete('/deletejob/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    const deleteJobQuery = 'DELETE FROM jobs WHERE job_id = ?';

    db.query(deleteJobQuery, [jobId], (jobDeleteError, jobDeleteResults) => {
        if (jobDeleteError) {
            console.error('Error deleting job:', jobDeleteError);
            return res.status(500).json({ error: 'Error deleting job' });
        }

        // Check if any job was deleted
        if (jobDeleteResults.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Job was deleted successfully
        res.status(200).json({ message: 'Job deleted successfully' });
    });
});




app.put('/update-application-status/:applicationId/:newStatus', (req, res) => {
    const { applicationId, newStatus } = req.params;
  
    // Check if the new status is valid ('rejected' or 'accepted')
    if (newStatus !== 'rejected' && newStatus !== 'accepted') {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  
    const query = 'UPDATE applications SET status = ? WHERE application_id = ?';
  
    db.query(query, [newStatus, applicationId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error updating status' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.status(200).json({ message: 'Status updated successfully' });
    });
  });
app.get('/user-applications', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    db.query('SELECT * FROM applications WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching applications' });
        }
        res.json(results);
    });
});


// Endpoint to submit a job application
app.post('/apply', (req, res) => {
    console.log(req.body);
    const { userId, jobId, name, email, personalPhoto, cv } = req.body;
    const query = "INSERT INTO applications (user_id, job_id, name, email, personal_photo, cv) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(query, [userId, jobId, name, email, personalPhoto, cv], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error submitting application' });
        }
        res.status(200).json({ message: 'Application submitted successfully' });
    });
});

// Existing code...


app.post('/add-job', (req, res) => {
    const { user_id, title, type, salary, description, picture } = req.body;
    const query = "INSERT INTO jobs (user_id, title, type, salary, description, picture) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(query, [user_id, title, type, salary, description, picture], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding job' });
        }
        res.status(200).json({ message: 'Job added successfully' });
    });
});



app.get('/admin/jobs', (req, res) => {
    // Assuming you pass admin's user_id as a query parameter
    const adminId = req.query.adminId;

    db.query('SELECT * FROM jobs WHERE user_id = ?', [adminId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching jobs' });
        }
        res.json(results);
    });
});

app.get('/job/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    db.query('SELECT * FROM jobs WHERE job_id = ?', [jobId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching job details' });
        }
        // Send back the first result (assuming job_id is unique)
        res.json(results[0]);
    });
});

app.get('/job-applications', (req, res) => {
    const jobId = req.query.jobId;

    // Check if jobId is provided
    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
    }

    const query = 'SELECT * FROM applications WHERE job_id = ?';
    db.query(query, [jobId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no applications are found, return an empty array
        res.json(results.length > 0 ? results : []);
    });
});

// Add this code after your existing routes
app.delete('/delete-application/:applicationId', (req, res) => {
    const applicationId = req.params.applicationId;

    // Check if applicationId is provided
    if (!applicationId) {
        return res.status(400).json({ error: 'Application ID is required' });
    }

    const deleteQuery = 'DELETE FROM applications WHERE application_id = ?';

    db.query(deleteQuery, [applicationId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any rows were deleted (results.affectedRows will be 1 if successful)
        if (results.affectedRows === 1) {
            res.json({ message: 'Application deleted successfully' });
        } else {
            res.status(404).json({ error: 'Application not found' });
        }
    });
});












const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
