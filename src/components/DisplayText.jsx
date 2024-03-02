import React from "react";
import { MDBRow, MDBCard, MDBCardBody } from "mdb-react-ui-kit";

const DisplayText = ({ text }) => {
    // Define the keywords array
  const keywords = ["happy", "sad", "angry", "depressed", "delighted"];

  // Function to check if the text contains any of the keywords
  const containsKeywords = (text) => {
    const textLower = text.toLowerCase();
    return keywords.some(keyword => textLower.includes(keyword));
  };

  // Determine if the text should be displayed based on the keywords
  const shouldDisplayText = containsKeywords(text);

  return (
    <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
      <MDBCard
        className="bg-dark text-white my-5 mx-auto"
        style={{ borderRadius: "1rem", minWidth: "600px", minHeight: "400px" }}
      >
        <MDBCardBody className="p-5 d-flex flex-column align-items-center mt-100 mx-auto w-100 mt-100 ">
          <h2 className="fw-bold mb-2 text-uppercase Text-center">Your Text</h2>
          <p
            className="text-light-50 mb-5"
            style={{
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              maxHeight: "300px",
              maxWidth: "400px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {shouldDisplayText ? (
            <h2>{text}</h2>
          ) : (
            <h5>Text does not contain specified keywords.</h5> // Or simply return null or any placeholder message
          )}
          </p>
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default DisplayText;
