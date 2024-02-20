import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const uploadFile = () => {
    if (!file) {
      setFeedback("Please select a file to upload.");
      return;
    }
    // Example: Upload logic here
    console.log("Uploading", file);
    // Here you would typically use fetch or axios to send the file to your server
    setFeedback("File is being uploaded...");
    // Simulate an upload
    setTimeout(() => setFeedback("File uploaded successfully!"), 1500);
  };

  return (
    <MDBRow className="d-flex-justify-content-center align-items-center">
      <MDBCol col="12">
        <MDBCard
          className="bg-dark text-white my-5 mx-auto"
          style={{ borderRadius: "1rem", maxWidth: "400px" }}
        >
          <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
            <h2 className="fw-bold mb-2 text-uppercase">Upload</h2>
            <p className="text-white-50 mb-5">
              Please upload your file for processing.
            </p>
            {feedback && <div className="text-danger mb-3">{feedback}</div>}
            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              labelClass="text-white"
              label="Upload File"
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
              Upload
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default UploadFormSidebar;
