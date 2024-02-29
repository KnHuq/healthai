import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import Sidebar from "./Sidebar";
import TextInputArea from "./TextInputArea"; // Import the TextInputArea component
import DisplayText from "./DisplayText"; // Import the DisplayText component
import MiniDrawer from "./MuiSideBar";
import "./loginSignupPage.css";

const TextDisplayFeaturePage = () => {
  const [text, setText] = useState(""); // State to hold the text input

  return (
    <MDBContainer>
      <div style={{ overflowY: 'auto', maxHeight: '100vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <MDBRow className="flex">
          <MDBCol sm="2" className="p-0">
            <MiniDrawer />
          </MDBCol>
          <MDBCol md="10" className="p-0">
            <MDBRow className="align-items-center justify-content-center mt-100">
              <MDBCol md="6" className="p-2 d-flex justify-content-center">
                <TextInputArea onTextChange={setText} />
              </MDBCol>
              <MDBCol md="6" className="p-2 d-flex justify-content-center">
                <DisplayText text={text} />
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default TextDisplayFeaturePage;
