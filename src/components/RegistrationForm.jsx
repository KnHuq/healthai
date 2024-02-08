import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginSignupPage.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,

}
from 'mdb-react-ui-kit';

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
    <MDBContainer fluid>

    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
      <MDBCol col='12'>

        <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
          <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

            <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
            <p className="text-white-50 mb-5">Please set your username and password!</p>

            {feedback && (
                <div className={`mb-3 ${feedbackStyle}`}>{feedback}</div>
              )}
            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label="Username" id="username" type="text" size="lg" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id="password" type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)}/>

            <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!"></a></p>
            <MDBBtn outline className='mx-2 px-5' color='white' size='lg' onClick={handleRegister}>
              Sign Up
            </MDBBtn>

            <div className='d-flex flex-row mt-3 mb-5'>
            
            </div>

            <div>
              <p className="mb-0">Have an account? <a href="#!" onClick={returnToLogin} class="text-white-50 fw-bold">Log In</a></p>

            </div>
          </MDBCardBody>
        </MDBCard>

      </MDBCol>
    </MDBRow>

  </MDBContainer>
  );
};

export default RegistrationForm;
