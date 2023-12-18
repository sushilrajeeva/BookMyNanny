import React ,{useState, useContext} from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";

function Landing() {

  const { currentUser } = useContext(AuthContext);
  const FeatureCard = ({ title, description }) => (
    <Card className="mb-4 transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to BookMyNanny</h1>
        <p className="text-lg">Your Trusted Nanny Booking Service</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          title="Find Experienced Nannies"
          description="Discover qualified and caring nannies for your children."
        />
        <FeatureCard
          title="Easy Booking Process"
          description="Effortlessly book the perfect nanny for your needs."
        />
        <FeatureCard
          title="Safe and Reliable"
          description="Our nannies undergo thorough background checks for your peace of mind."
        />
        <FeatureCard
          title="Secure Payments"
          description="Enjoy safe and secure payment methods for your bookings."
        />
      </div>

      {currentUser?<></>:<div className="flex justify-center gap-4 mt-8">
        <NavLink to="/signup" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto px-4 py-2">Sign Up</Button>
        </NavLink>
        <NavLink to="/signin" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto px-4 py-2">Sign In</Button>
        </NavLink>
      </div>}
    </div>
  );
}

export default Landing;
