import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Sidebar from "./Sidebar"; // Ensure this is pointing to your custom Sidebar component
import UploadFormSidebar from "./UploadForm";
import LineChartComponent from "./LineChart";
import BarChatComponent from "./BarChart";
import SimpleTable from "./SimpleTable";
import TaskTableComponent from "./TaskTable";
import MiniDrawer from "./MuiSideBar";
import "./loginSignupPage.css";
import BasicDatePicker from "./muiDatePicker";


const Analysis = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [linechartData, setLineChartData] = useState([]); // State to hold fetched data
  const [barchartData, setBarChartData] = useState([]);
  const [simpletableData, setSimpleTableData] = useState([]);
  const [simpletableColumn, setSimpleTableColumn] = useState([]);

  const fetchLinechartData = async (date) => {
    console.log('Fetching data for:', date);  // Verify this gets called
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    try {
      const response = await fetch(`http://localhost:5000/api/linechart_data?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setLineChartData(jsonData); // Set fetched data to state
      console.log('data recieved in analysis component')
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const fetchBarchartData = async (date) => {
    console.log('Fetching bar data for:', date);  // Verify this gets called
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    try {
      const response = await fetch(`http://localhost:5000/api/barchart_data?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setBarChartData(jsonData); // Set fetched data to state
      console.log('bar data recieved in analysis component')
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };



  const fetchSimpletableData = async (date) => {
    console.log('Fetching table data for:', date);  // Verify this gets called
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    try {
      const response = await fetch(`http://localhost:5000/api/simpletable_data?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setSimpleTableData(jsonData.tabledata); // Set fetched data to state
      setSimpleTableColumn(jsonData.columns);
      console.log('table data recieved in analysis component for simple table')
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <MDBContainer >
      <div style={{ overflowY: 'auto', maxHeight: '100vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <MDBRow className="flex">
          <MDBCol sm="2" className="p-0">
            <MiniDrawer />
          </MDBCol>
          <MDBCol md="10" className="p-0">
            <MDBRow>
              <MDBCol md="6" className="p-2">
                <LineChartComponent linedata={linechartData} />
              </MDBCol>
              <MDBCol md="6" className="p-2">
                <BarChatComponent bardata={barchartData} />
              </MDBCol>
            </MDBRow>
            <MDBRow className="align-items-center justify-content-center">
              <MDBCol md="6" className="p-2 d-flex justify-content-center ">
              <BasicDatePicker 
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    fetchLinechartData(date); // Trigger data fetch on date change
                    fetchBarchartData(date);
                    fetchSimpletableData(date);
                  }}
                />

              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6" className="p-2">
                <SimpleTable simpletabledata={simpletableData} simpletableColumn={simpletableColumn} />
              </MDBCol>
              <MDBCol md="6" className="p-2">
                <TaskTableComponent />
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default Analysis;
