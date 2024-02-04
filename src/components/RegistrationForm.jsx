// RegistrationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginSignupPage.css"; // Reusing the same CSS for consistency
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import backgroundImage from "./backgroundimage.png";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const SERVER_URL = "http://localhost:5000"; // Ensure this is your actual server URL
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        // Optionally, navigate to login page or show a success message
        alert("Registration successful. Please log in.");
        navigate("/"); // Assuming '/' is your login route
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const returnToLogin = () => {
    navigate("/"); // Navigate back to the login page
  };

  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src={backgroundImage}
              alt="Background"
              className="rounded-start w-100"
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <MDBIcon
                  fas
                  icon="user-plus fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-0">Register</span>
              </div>
              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Please Set A User Name and Password
              </h5>
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="username"
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="password"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn
                className="mb-4 px-5"
                color="dark"
                size="lg"
                onClick={handleRegister}
              >
                Register
              </MDBBtn>
              <MDBBtn
                className="mb-4 px-5"
                color="light"
                size="lg"
                onClick={returnToLogin}
              >
                Return to Login
              </MDBBtn>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default RegistrationForm;
