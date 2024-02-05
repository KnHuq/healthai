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
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-0">QueensLand Health AI</span>
              </div>
              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Sign into your account
              </h5>
              {loginFeedback && (
                <div className="text-danger mb-3">{loginFeedback}</div>
              )}
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="formControlLg"
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn
                className="mb-4 px-5"
                color="dark"
                size="lg"
                onClick={handleLogin}
              >
                Login
              </MDBBtn>
              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                Don't have an account?{" "}
                <a
                  href="#!"
                  onClick={handleNavigateToAdminAuth}
                  style={{ color: "#393f81" }}
                >
                  Create New Account
                </a>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default LoginSignupPage;
