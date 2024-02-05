import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginSignupPage.css";
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
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "success" or "error"
  const SERVER_URL = "http://localhost:5000";
  const navigate = useNavigate();

  // Validation function for the password
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    // Check if the password is valid
    if (!validatePassword(password)) {
      setFeedback(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character."
      );
      setFeedbackType("error");
      return; // Stop the registration process
    }

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
        setFeedback("Registration successful. Please log in.");
        setFeedbackType("success");
        // Optionally, navigate to login page or show a success message
        setTimeout(() => navigate("/"), 3000); // Assuming '/' is your login route
      } else {
        setFeedback("Registration failed: " + data.message);
        setFeedbackType("error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setFeedback("Error during registration: " + error.message);
      setFeedbackType("error");
    }
  };

  const returnToLogin = () => {
    navigate("/"); // Navigate back to the login page
  };

  const feedbackStyle =
    feedbackType === "success" ? "text-success" : "text-danger";

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
              {feedback && (
                <div className={`mb-3 ${feedbackStyle}`}>{feedback}</div>
              )}
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
