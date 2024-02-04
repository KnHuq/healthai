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

const AdminAuthPage = () => {
  const [adminPassword, setAdminPassword] = useState("");
  const SERVER_URL = "http://localhost:5000"; // Ensure this is your actual server URL
  const navigate = useNavigate();


  const handleAdminAuth = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/verify-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminPassword: adminPassword }),
      });
      const data = await response.json();
      if (data.success) {
        // Navigate to the registration form
        navigate("/register");
      } else {
        alert("Admin password is incorrect");
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
    }
  };

  const returnToLogin = () => {
    navigate("/"); // Assuming the login page route is '/'
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
                  icon="user-shield fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-0">Admin Authentication</span>
              </div>
              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >Please Enter Admin Password</h5>
              <MDBInput
                wrapperClass="mb-4"
                label="Admin Password"
                id="adminPassword"
                type="password"
                size="lg"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <MDBBtn
                className="mb-4 px-5"
                color="dark"
                size="lg"
                onClick={handleAdminAuth}
              >
                Verify Admin
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

export default AdminAuthPage;
