import React from "react";
import { MDBRow, MDBCard, MDBCardBody } from "mdb-react-ui-kit";

const DisplayText = ({ highlightedwords }) => {
  console.log('DisplayText received:', highlightedwords);
  return (
    <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
      <MDBCard
        className="bg-dark text-white my-5 mx-0 "
        style={{ borderRadius: "1rem", minWidth: "42.90vw", minHeight: "48.80vh" }}
      >
        <MDBCardBody className=" d-flex flex-column align-items-center  mx-auto w-100 ">
          <h2 className="fw-bold mb-2 text-uppercase Text-center">
            Highlighted Text
          </h2>
          <br />
          {highlightedwords && highlightedwords.length > 0 ? (
            <div
              className="text-light-50 mb-5 p-3"
              style={{
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                minHeight: "29.63vh",
                maxHeight: "29.63vh",
                //maxWidth: "100%",
                minwidth: "20rem",
                maxWidth: '45rem',
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                
              }}
            >
              {/* Map through the highlightedWords array and display each word */}
              {highlightedwords.map((word, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#2575fc",
                    color: "white",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginRight: "5px",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-white-50 mb-3">No highlighted text.</p>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default DisplayText;
