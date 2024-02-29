import React from "react";
import {MDBRow, MDBInput, MDBCard, MDBCardBody, MDBTextArea } from "mdb-react-ui-kit";

const TextInputArea = ({ onTextChange }) => {
  return (
    <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
      <MDBCard
        className="bg-dark text-white my-5 mx-auto"
        style={{ borderRadius: "1rem", minWidth: "500px", minHeight: '400px' }}
      >
        <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
          <h2 className="fw-bold mb-2 text-uppercase">Text Input</h2>
          <p className="text-white-50 mb-3">
            Please enter your text for processing.
          </p>
          <MDBTextArea
            textarea
            id="textInputArea"
            rows="7"
            className="form-control"
            style={{ backgroundColor: "#fff", color: "#000" }}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Type something..."
            contrast
          />
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default TextInputArea;
