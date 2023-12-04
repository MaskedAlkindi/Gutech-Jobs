import React from 'react';
import "../assets/homepagestyle.css"
import Footer from './footer';

function Home() {
  return (
    <>
  <section id="hero" className="d-flex align-items-center" style = {{backgroundColor: "#2f2b3a"}}>
    <div className="container">
      <div className="row">
        <div
          className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
          data-aos="fade-up"
          data-aos-delay={200}
        >
          <h1>Better Solutions For Your Business</h1>
          <h2>
            We are team of talented designers making websites with Bootstrap
          </h2>
          <div className="d-flex justify-content-center justify-content-lg-start">
            <a href="#about" className="btn-get-started scrollto">
              Get Started
            </a>
            <a
              href="https://www.youtube.com/watch?v=jDDaplaOz7Q"
              className="glightbox btn-watch-video"
            >
              <i className="bi bi-play-circle" />
              <h7>Watch Video</h7>
            </a>
          </div>
        </div>
        <div
          className="col-lg-6 order-1 order-lg-2 hero-img"
          data-aos="zoom-in"
          data-aos-delay={200}
        >
          <img
            src="../assets/img/hero-img.png"
            className="img-fluid animated"
            alt=""
          />
        </div>
      </div>
    </div>
  </section>
  {/* End Hero */}
  <section id="team" className="team section-bg" style = {{backgroundColor: "#1a1625", color: "white"}}>
    <div className="container" data-aos="fade-up">
      <div className="section-title" style = {{ color: "white"}}>
        <h2>Team</h2>
        <p>
          Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex
          aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
          quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia
          fugiat sit in iste officiis commodi quidem hic quas.
        </p>
      </div>
      <div className="row" >
        <div className="col-lg-6"  data-aos="zoom-in" data-aos-delay={100}>
          <div style = {{backgroundColor: "#46424f"}} className="member d-flex align-items-start">
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
              <div className="social">
                <a href="">
                  <i className="ri-twitter-fill" />
                </a>
                <a href="">
                  <i className="ri-facebook-fill" />
                </a>
                <a href="">
                  <i className="ri-instagram-fill" />
                </a>
                <a href="">
                  {" "}
                  <i className="ri-linkedin-box-fill" />{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-lg-6 mt-4 mt-lg-0"
          data-aos="zoom-in"
          data-aos-delay={200}
        >
          <div style = {{backgroundColor: "#46424f"}} className="member d-flex align-items-start">
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
              <div className="social">
                <a href="">
                  <i className="ri-twitter-fill" />
                </a>
                <a href="">
                  <i className="ri-facebook-fill" />
                </a>
                <a href="">
                  <i className="ri-instagram-fill" />
                </a>
                <a href="">
                  {" "}
                  <i className="ri-linkedin-box-fill" />{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={300}>
          <div style = {{backgroundColor: "#46424f"}} className="member d-flex align-items-start">
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
              <div className="social">
                <a href="">
                  <i className="ri-twitter-fill" />
                </a>
                <a href="">
                  <i className="ri-facebook-fill" />
                </a>
                <a href="">
                  <i className="ri-instagram-fill" />
                </a>
                <a href="">
                  {" "}
                  <i className="ri-linkedin-box-fill" />{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mt-4" data-aos="zoom-in" data-aos-delay={400}>
          <div style = {{backgroundColor: "#46424f"}} className="member d-flex align-items-start">
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
              <div className="social">
                <a href="">
                  <i className="ri-twitter-fill" />
                </a>
                <a href="">
                  <i className="ri-facebook-fill" />
                </a>
                <a href="">
                  <i className="ri-instagram-fill" />
                </a>
                <a href="">
                  {" "}
                  <i className="ri-linkedin-box-fill" />{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Team Section */}
 
</>

  
  );
}

export default Home;
