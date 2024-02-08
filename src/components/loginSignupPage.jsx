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
} from "mdb-react-ui-kit";

const LoginSignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFeedback, setLoginFeedback] = useState(""); // New state variable for login feedback
  const SERVER_URL = "http://localhost:5000";
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      if (data.success) {
        navigate("/welcome"); // Navigate to the welcome page upon successful login
      } else {
        setLoginFeedback("Login failed: " + data.message); // Update the feedback state instead of using alert
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginFeedback("Error during login attempt."); // Optionally provide more detailed error feedback
    }
  };

  const handleNavigateToAdminAuth = () => {
    navigate("/admin-auth");
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-dark text-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "400px" }}
          >
            <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">
                Please enter your login and password!
              </p>

              {loginFeedback && (
                <div className="text-danger mb-3">{loginFeedback}</div>
              )}
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                label="Username"
                id="formControlLg"
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p className="small mb-3 pb-lg-2">
                <a class="text-white-50" href="#!">
                 
                </a>
              </p>
              <MDBBtn outline className="mx-2 px-5" color="white" size="lg" onClick={handleLogin}>
                Login
              </MDBBtn>

              <div className="d-flex flex-row mt-3 mb-5">
                <div className='m-3' size="lg"></div>
                <div className='m-3' size="lg"></div>
                <div className='m-3' size="lg"></div>
              </div>

              <div>
                <p className="mb-0">
                  Don't have an account?{" "}
                  <a href="#!" onClick={handleNavigateToAdminAuth} class="text-white-50 fw-bold">
                    Sign Up
                  </a>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default LoginSignupPage;
