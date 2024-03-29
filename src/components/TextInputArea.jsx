import React, { useState, useEffect } from "react";
import {MDBRow, MDBInput, MDBCard, MDBCardBody, MDBTextArea, MDBContainer } from "mdb-react-ui-kit";

const TextInputArea = ({ onTextChange }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const handleTextareaInput = () => {
      let highlightedText = text;
      const wordsToHighlight = ["happy", "sad", "depressed", "angry", "delighted"];

      // Iterate through each word to highlight
      wordsToHighlight.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi"); // Create a case-insensitive RegExp for word matching
        highlightedText = highlightedText.replace(regex, `<span style="background-color: yellow;">$&</span>`);
      });

      // Call the onTextChange callback with the updated text value and apply HTML highlighting
      onTextChange(highlightedText);
    };

    const textarea = document.getElementById("textInputArea");
    textarea.addEventListener('input', handleTextareaInput);

    return () => {
      textarea.removeEventListener('input', handleTextareaInput);
    };
  }, [text]);
  
  return (
    <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
      <MDBCard
        className="bg-dark text-white my-5 mx-auto"
        style={{  minWidth: "750px", minHeight: '400px', maxHeight: '400px' }}
      >
        <MDBCardBody className=" d-flex flex-column align-items-center mx-auto w-100">
          <h2 className="fw-bold mb-2 text-uppercase">Text Input</h2>
          <p className="text-white-50 mb-3">
            Please enter your text for processing.
          </p>
          <MDBTextArea
            textarea
            id="textInputArea"
            rows="10"
            className="form-control mx-0"
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
