
require("dotenv").config();

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
      to: to,
      from: process.env.SENDER_EMAIL, 
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


const saltRounds = 10; 

app.post('/admin-signup', (req, res) => {
    const { username, password, email } = req.body;

    
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error checking for existing user' });
        }

        if (results.length > 0) {
            // Username or email already exists
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hashing the password
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                console.error(hashErr);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Store admin user with hashed password
            db.query('INSERT INTO users (username, password, email, user_type) VALUES (?, ?, ?, "admin")', 
                     [username, hash, email], 
                     (insertErr, insertResults) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).json({ error: 'Error signing up' });
                }
                res.status(200).json({ message: 'Admin signup successful' });
            });
        });
    });
});


app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    // First, check if the username or email already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error checking for existing user' });
        }

        if (results.length > 0) {
            // Username or email already exists
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                console.error(hashErr);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Store user with hashed password
            db.query('INSERT INTO users (username, password, email, user_type) VALUES (?, ?, ?, "normal")', 
                     [username, hash, email], 
                     (insertErr, insertResults) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).json({ error: 'Error signing up' });
                }
                res.status(200).json({ message: 'Signup successful' });
            });
        });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

   
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error logging in' });
        }

       
        if (results.length > 0) {
            const user = results[0];

           
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
    const query = `
        SELECT j.job_id, j.title, j.type, j.salary, j.description, j.picture, j.created_at, j.updated_at, 
               GROUP_CONCAT(s.name SEPARATOR ', ') AS skills
        FROM jobs j
        LEFT JOIN job_skills js ON j.job_id = js.job_id
        LEFT JOIN skills s ON js.skill_id = s.skill_id
        GROUP BY j.job_id
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/updatejob/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    const { title, type, salary, description, picture, skills } = req.body;
  
    // Update the job details in the 'jobs' table
    const updateJobQuery = 'UPDATE jobs SET title = ?, type = ?, salary = ?, description = ?, picture = ? WHERE job_id = ?';
  
    db.query(updateJobQuery, [title, type, salary, description, picture, jobId], (jobUpdateError, jobUpdateResults) => {
      if (jobUpdateError) {
        console.error('Error updating job:', jobUpdateError);
        return res.status(500).json({ error: 'Error updating job' });
      }
  
      if (jobUpdateResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // Update the skills associated with the job
      const deleteSkillsQuery = 'DELETE FROM job_skills WHERE job_id = ?';
      db.query(deleteSkillsQuery, [jobId], (deleteSkillsError, deleteSkillsResults) => {
        if (deleteSkillsError) {
          console.error('Error deleting job skills:', deleteSkillsError);
          return res.status(500).json({ error: 'Error updating job skills' });
        }
  
        if (skills && skills.length) {
          const insertSkillsQuery = 'INSERT INTO job_skills (job_id, skill_id) VALUES ?';
          const skillsValues = skills.map(skillId => [jobId, skillId]);
          
          db.query(insertSkillsQuery, [skillsValues], (insertSkillsError, insertSkillsResults) => {
            if (insertSkillsError) {
              console.error('Error inserting job skills:', insertSkillsError);
              return res.status(500).json({ error: 'Error updating job skills' });
            }
            res.status(200).json({ message: 'Job updated successfully' });
          });
        } else {
          res.status(200).json({ message: 'Job updated successfully, no skills to update' });
        }
      });
    });
  });
  



app.delete('/deletejob/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    // First, delete entries from job_skills table
    const deleteJobSkillsQuery = 'DELETE FROM job_skills WHERE job_id = ?';

    db.query(deleteJobSkillsQuery, [jobId], (jobSkillsDeleteError, jobSkillsDeleteResults) => {
        if (jobSkillsDeleteError) {
            console.error('Error deleting job skills:', jobSkillsDeleteError);
            return res.status(500).json({ error: 'Error deleting job skills' });
        }

        // Then, delete the job from jobs table
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




app.post('/add-job', (req, res) => {
    const { user_id, title, type, salary, description, picture, skills } = req.body;
    const jobQuery = "INSERT INTO jobs (user_id, title, type, salary, description, picture) VALUES (?, ?, ?, ?, ?, ?)";

    // First, insert the job into the jobs table
    db.query(jobQuery, [user_id, title, type, salary, description, picture], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding job' });
        }

        const jobId = results.insertId;

        // Now, insert skills associated with the job
        if (skills && skills.length) {
            const skillQuery = "INSERT INTO job_skills (job_id, skill_id) VALUES ?";
            const skillValues = skills.map(skillId => [jobId, skillId]);

            db.query(skillQuery, [skillValues], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error adding job skills' });
                }
                res.status(200).json({ message: 'Job and job skills added successfully' });
            });
        } else {
            res.status(200).json({ message: 'Job added successfully, no skills to add' });
        }
    });
});

app.get('/skills', (req, res) => {
    const query = "SELECT skill_id, name FROM skills";

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});



app.get('/admin/jobs', (req, res) => {
    const adminId = req.query.adminId;
  
    db.query('SELECT * FROM jobs WHERE user_id = ?', [adminId], (err, jobs) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching jobs' });
      }
  
      const jobsWithSkillsPromises = jobs.map(job => {
        return new Promise((resolve, reject) => {
          db.query('SELECT skills.* FROM job_skills JOIN skills ON job_skills.skill_id = skills.skill_id WHERE job_skills.job_id = ?', [job.job_id], (err, skills) => {
            if (err) {
              return reject(err);
            }
            job.skills = skills.map(skill => ({ value: skill.skill_id, label: skill.name }));
            resolve(job);
          });
        });
      });
  
      Promise.all(jobsWithSkillsPromises)
        .then(jobsWithSkills => res.json(jobsWithSkills))
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Error fetching job skills' });
        });
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
