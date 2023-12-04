import React from 'react';
import "../assets/homepagestyle.css"
import Footer from './footer';
import Button from 'react-bootstrap/Button';
import PlanetBackground from '../assets/imgass/PlanetBackground.png'
import TeamBackground from '../assets/imgass/featured_bg.9b6eb15.png'
function Home() {
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
              <h4>Walter White</h4>
              <h7>Chief Executive Officer</h7>
              <p>Explicabo voluptatem mollitia et repellat qui dolorum quasi</p>
              
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
                src="https://i1.sndcdn.com/artworks-4UMq2ND9JhqcIVNs-a3OkjQ-t500x500.jpg"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>Sarah Jhonson</h4>
              <h7>Product Manager</h7>
  
        
              <p>
                Aut maiores voluptates amet et quis praesentium qui senda para
              </p>
              
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={300}>
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://i.pinimg.com/736x/3f/87/c5/3f87c551e0abb19b09eae73236a56af6.jpg"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>William Anderson</h4>
              <h7>CTO</h7>
              <p>Quisquam facilis cum velit laborum corrupti fuga rerum quia</p>
              
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={400}>
          <div style = {{backgroundColor: "#21262D"}} className="member d-flex align-items-start">
            <div className="pic">
              <img
                src="https://i.pinimg.com/originals/2e/4f/f8/2e4ff89ea628446edb6f39d30f298875.jpg"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="member-info">
              <h4>Amanda Jepson</h4>
              <h7>Accountant</h7>
              <p>
                Dolorum tempora officiis odit laborum officiis et et accusamus
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
