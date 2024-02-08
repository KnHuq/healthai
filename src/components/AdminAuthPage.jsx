import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginSignupPage.css"; // Reusing the same CSS for consistency
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

const AdminAuthPage = () => {
  const [adminPassword, setAdminPassword] = useState("");
  const [feedback, setFeedback] = useState(""); // Added state for feedback
  const SERVER_URL = "http://localhost:5000";
  const navigate = useNavigate();

  const handleAdminAuth = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/verify-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminPassword }),
      });
      const data = await response.json();
      if (data.success) {
        // Navigate to the registration form
        navigate("/register");
      } else {
        // Update to use inline feedback instead of alert
        setFeedback("Admin password is incorrect");
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
      // Optionally, provide feedback for network or server errors
      setFeedback("An error occurred during verification. Please try again.");
    }
  };

  const returnToLogin = () => {
    navigate("/"); // Assuming the login page route is '/'
  };

  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">ADMIN</h2>
              <p className="text-white-50 mb-5">Please enter your Admin password!</p>

              {feedback && <div className="text-danger mb-3">{feedback}</div>}{" "}
              {/* Inline feedback display */}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label="Admin Password" id="adminPassword" type='password' size="lg" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}/>

              <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
              <MDBBtn outline className='mx-2 px-5' color='white' size='lg' onClick={handleAdminAuth}>
                Varify Admin
              </MDBBtn>

              <div className='d-flex flex-row mt-3 mb-5'>
                
              </div>

              <div>
                <p className="mb-0">Have an account? <a href="#!" onClick={returnToLogin} class="text-white-50 fw-bold">Sign In</a></p>

              </div>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
};

export default AdminAuthPage;
