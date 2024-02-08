import React from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleLogout = () => {
    navigate("/");
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
              <h2 className="fw-bold mb-2 text-uppercase">Welcome</h2>
              <p className="text-white-50 mb-5">
                Welcome to QueensLand Health AI!
              </p>

              <MDBBtn
                outline
                className="mx-2 px-5"
                color="white"
                size="lg"
                onClick={handleLogout}
              >
                Log Out
              </MDBBtn>

              <div className="d-flex flex-row mt-3 mb-5"></div>

              <div></div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default WelcomePage;
