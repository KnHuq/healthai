import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Sidebar from "./Sidebar";
import TextInputArea from "./TextInputArea"; // Import the TextInputArea component
import DisplayText from "./DisplayText"; // Import the DisplayText component
import MiniDrawer from "./MuiSideBar";
import DraftTextInputArea from "./DraftTextInputArea";
import BackendTextInputArea from "./backendTextInputArea";
import DisplayTextTable from "./DisplayTextTable";
import "./loginSignupPage.css";


const TextDisplayFeaturePage = () => {
  //const [highlightedText, setHighlightedText] = useState([]);
  const [highlightedWords, setHighlightedWords] = useState([]);

  //const handleHighlightChange = (highlightedWords) => {
  //console.log('Received highlighted words:', highlightedWords);
  //setHighlightedText(highlightedWords);
  // };

  const handleHighlightUpdate = (highlightedwords) => {
    setHighlightedWords(highlightedwords);
  };

  return (
    <MDBContainer fluid>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "100vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <MDBRow className="flex">
          <MDBCol sm="2" className="p-0">
            <MiniDrawer />
          </MDBCol>
          <MDBCol sm='10' md="10" lg='10' className="p-0">
            <MDBRow className="align-items-center justify-content-left mt-100 vh-100 ">
              <MDBCol sm="6" md='6' lg='6' className="p-0 d-flex ">
                <BackendTextInputArea
                  //onHighlightChange={handleHighlightChange}
                  onHighlightUpdate={handleHighlightUpdate}
                />
              </MDBCol>
              <MDBCol sm="6" className="p-0 d-flex ">
                <DisplayTextTable 
                //highlightedWords={highlightedText}
                highlightedwords={highlightedWords} 
                />
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default TextDisplayFeaturePage;
