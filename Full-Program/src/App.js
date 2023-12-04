import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import AdminNavigationBar from './Components/NavigationBars/AdminNavigationBar';
import UserNavigationBar from './Components/NavigationBars/UserNavigationBar';
import Home from './Components/Home';
import Jobs from './Components/Jobs';
import ContactUs from './Components/Contactus';
import AddJobs from './Components/AddJobs';

import Login from './AuthPages/Login';
import Signup from './AuthPages/Signup';
import AdminJobs from './Components/Admins/AdminJobs';
import JobApplications from './Components/JobApplications';
import JobApplication from './Users/JobApplication';
import JobDetails from './Users/JobDetails';
import MyApplications from './Users/MyApplications';
import Footer from './Components/footer';
import AdminSignup from './AuthPages/AdminSignup';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <AuthRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AuthRoutes() {
  const { user } = useAuth();
  console.log(user?.user_type)
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      {user?.user_type === 'admin' ? <AdminNavigationBar /> : <UserNavigationBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        
        <Route path="/add" element={<AddJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
       
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/login" element={<Navigate replace to="/" />} />
        <Route path="/signup" element={<Navigate replace to="/" />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/job-applications/:jobId" element={<JobApplications />} />
        <Route path="/job-details/:jobId" element={<JobDetails />} />
        <Route path="/job-application/:jobId" element={<JobApplication />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
