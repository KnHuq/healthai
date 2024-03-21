import React, { useState } from "react";
import {
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";

//import "./UploadFormSidebar.css"; // Import the new CSS file here

const UploadFormSidebar = () => {
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [feedback, setFeedback] = useState(""); // Placeholder for feedback
  const SERVER_URL = "http://localhost:5000/upload";

  const uploadFile = () => {
    if (!file) {
      setFeedback("Please select a file to upload.");
      return;
    }
    // Create FormData object
  const formData = new FormData();
  formData.append("file", file);

  // Fetch request to send the file to the backend
  fetch(SERVER_URL, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      return response.json(); // Assuming backend returns JSON response
    })
    .then((data) => {
      // Handle successful upload response
      console.log("File uploaded successfully:", data);
      setFeedback("File uploaded successfully!");
    })
    .catch((error) => {
      // Handle error
      console.error("Error uploading file:", error.message);
      setFeedback("Failed to upload file. Please try again later.");
    });
  };

  return (
    <MDBRow className="d-flex text-center-justify-content-center align-items-center vh-100">
      <MDBCol col="12">
        <MDBCard
          className="bg-dark text-white my-5 mx-auto"
          style={{ borderRadius: "1rem", maxWidth: "400px" }}
        >
          <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
            <h2 className="fw-bold mb-2 text-uppercase">Analyse</h2>
            <p className="text-white-50 mb-5">
              Please upload your file for processing.
            </p>
            {feedback && <div className="text-danger mb-3">{feedback}</div>}
            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              labelClass="text-white"
              label="Browse File"
              id="fileUpload"
              type="file"
              size="lg"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFeedback(""); // Reset feedback message on file change
              }}
            />
            <MDBBtn
              outline
              className="mx-2 px-5"
              color="white"
              size="lg"
              onClick={uploadFile}
            >
              Analyse
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default UploadFormSidebar;
