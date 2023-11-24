import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

function Landing() {
  return (
    <div className="card">
      <div className="landing-header">
        <h1>Welcome to BookMyNanny</h1>
        <p>Your Trusted Nanny Booking Service</p>
      </div>

      <div className="landing-content">
        <div className="feature">
          <h2>Find Experienced Nannies</h2>
          <p>Discover qualified and caring nannies for your children.</p>
        </div>

        <div className="feature">
          <h2>Easy Booking Process</h2>
          <p>Effortlessly book the perfect nanny for your needs.</p>
        </div>

        <div className="feature">
          <h2>Safe and Reliable</h2>
          <p>
            Our nannies undergo thorough background checks for your peace of
            mind.
          </p>
        </div>

        {/* "Sign Up" button using NavLink */}
        <div className="card">
          <NavLink to="/signup">
            <button className="button">Sign Up</button>
          </NavLink>
          <NavLink to="/signin">
            <button className="button">Sign In</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Landing;
