import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

import { Button } from "@/components/ui/button";

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

        {/* "Sign Up" and "Sign In" buttons */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <NavLink to="/signup" className="w-full">
            <Button className="w-full">Sign Up</Button>
          </NavLink>
          <NavLink to="/signin" className="w-full">
            <Button variant="secondary" className="w-full">Sign In</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Landing;
