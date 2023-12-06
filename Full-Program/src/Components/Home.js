import React from 'react';
import "../assets/homepagestyle.css"
import Footer from './footer';
import Button from 'react-bootstrap/Button';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
import TeamBackground from '../assets/imgass/featured_bg.9b6eb15.png'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handlegetstarted = () => {
        navigate("/jobs");
  };

  return (
    <>
    <div className="" style={{backgroundColor: "#0D1117", minHeight: '100vh'}}>

    
          <section id="hero" className="d-flex align-items-center" style={{backgroundColor: "#0D1117", backgroundImage: `url(${PlanetBackground})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12 d-flex flex-column justify-content-center pt-4 pt-lg-0" data-aos="fade-up" data-aos-delay="200">
                <h1 style={{ textAlign: 'center' }}>Gutech Jobs</h1>
                <h2 style={{ textAlign: 'center' }}>Your Gateway to Career Success - Apply with Gutech Jobs Today!</h2>
                <div className="d-flex justify-content-center">
                <Button 
                    style={{ 
                        textAlign: 'center', 
                        minHeight: '80px',  // Increased from 50 to 80
                        fontSize: '26px',   // Added font size
                        padding: '10px 20px' // Optional: Adjust padding for better spacing
                    }} 
                    variant="outline-light" 
                    className="large-button"
                    onClick={handlegetstarted}
                >
                    Get Started
                </Button>
                </div>
              </div>
            </div>
          </div> 
        </section>
  {/* End Hero */}
  <section 
  id="team" 
  className="team section-bg" 
  style={{ 
    backgroundColor: "#0D1117", 
    color: "white", 
    background: `url(${TeamBackground}) no-repeat center center`, 
    backgroundSize: '50%',
    padding: '100px 0' // Adjust padding as needed to increase the size of the section
  }}
>
    <div className="container" data-aos="fade-up">
      <div className="section-title" style = {{ color: "white"}}>
        <h2>Team</h2>
        <p>
        Meet our dynamic team! Comprised of creative minds and dedicated professionals, our team members are the driving force behind our success. Each brings unique skills and a shared commitment to excellence. Get to know the people making a difference in our company.
        </p>
      </div>
      <div className="row" >
        <div className="col-lg-6"  data-aos="zoom-in" data-aos-delay={100}>
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://hajidalkindi.com/assets/img/profile-img.jpg"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info" >
              <h4>Hajid Alkindi</h4>
              <h7>Chief Executive Officer</h7>
              <p>Technology is a tool; its true power lies in how we use it to connect and create.</p>
              
            </div>
          </div>
        </div>
        <div
          className="col-lg-6 mt-4 mt-lg-0"
          data-aos="zoom-in"
          data-aos-delay={200}
        >
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://media.licdn.com/dms/image/D4D03AQHinWOBIBiriw/profile-displayphoto-shrink_200_200/0/1696209407137?e=1707350400&v=beta&t=EJ7DpIPK_Vd3IKIZFDr5Zx2M4zIWr-Ybb8DiW5erAxc"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>Mike Hanna</h4>
              <h7>Full-Stack Developer</h7>
  
        
              <p>
                   Adaptability and agility are not just market trends but survival traits.
              </p>
              
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={300}>
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://media.licdn.com/dms/image/D4D03AQFtNxZe1f9EaQ/profile-displayphoto-shrink_200_200/0/1694627909387?e=2147483647&v=beta&t=c-byhZ-j5YcaGltKyhm4rTTHr_FhM-0V313pb8Ycq6c"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>Abdullah Alriyami</h4>
              <h7>Ai Specialist</h7>
              <p>Data is the new oil, but without the right analytics, it's just crude.</p>
              
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={400}>
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://media.licdn.com/dms/image/D5603AQFZTY6c_eKvug/profile-displayphoto-shrink_200_200/0/1697055847963?e=2147483647&v=beta&t=rhkNVwEhFRb4R4BBcSFK4rsDkWy-Y52VTQUEQIGQqGc"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>Sameer Khalil</h4>
              <h7>Cyber Security Specialist</h7>
              <p>
                  Innovation distinguishes between a leader and a follower.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Team Section */}
  </div>
 
</>

  
  );
}

export default Home;
