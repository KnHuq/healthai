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
import Sidebar from "./Sidebar"; // Ensure this is pointing to your custom Sidebar component
import UploadFormSidebar from "./UploadForm";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      {" "}
      {/* Wrap content in a flexbox container */}
      <div className="row">
        <div className="col">
          <Sidebar />
        </div>
        <div className="col-12" >
            <UploadFormSidebar />
          </div>
          
      </div>
        {/* Sidebar component */}
      </div>
      
        
      

    
  );
};

export default WelcomePage;
