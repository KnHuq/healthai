import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";
import Sidebar from "./Sidebar"; // Ensure this is pointing to your custom Sidebar component
import UploadFormSidebar from "./UploadForm";
import LineChartComponent from "./LineChart";
import BarChatComponent from "./BarChart";
import SimpleTable from "./SimpleTable";
import TaskTableComponent from "./TaskTable";
import MiniDrawer from "./MuiSideBar";
import "./loginSignupPage.css";
import BasicDatePicker from "./muiDatePicker";
import ControlledDateRangePicker from "./muidateRangePicker";
import dayjs from "dayjs";
import FormulationBar from "./formulationBar";
import FormulationTable from "./formulationTable";
import FormulationLine from "./formulationLine";
import FormulationLineChart2 from "./firmukationLineChart2";
import FormulationBarChart2 from "./FormulatedBarChart2";

const TableBarAnalysis = () => {
  return (
    <MDBContainer className="fluid">
      <div
        style={{
          overflowY: "auto",
          maxHeight: "100vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div> <MiniDrawer/> </div>
        <div> <FormulationTable/>  </div>
        <div>  <FormulationBarChart2/> </div>
        <div> <FormulationLineChart2/> </div>

          
       
      </div>
    </MDBContainer>
  );
};

export default TableBarAnalysis;
