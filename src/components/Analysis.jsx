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

const Analysis = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [linechartData, setLineChartData] = useState([]);
  const [barchartData, setBarChartData] = useState([]);
  const [simpletableData, setSimpleTableData] = useState([]);
  const [simpletableColumn, setSimpleTableColumn] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Update to use dayjs for formatting dates
  const fetchData = async () => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    // await fetchLinechartData(startDate, endDate);
    // await fetchBarchartData(startDate, endDate);
    console.log("fetching data");
    await fetchSimpletableData(startDate, endDate);
    console.log("fetching data");
  };

  const fetchLinechartData = async (start, end) => {
    const formattedStartDate = start.toISOString().split("T")[0];
    const formattedEndDate = end.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost:8080/api/linechart_data?start=${formattedStartDate}&end=${formattedEndDate}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      setLineChartData(jsonData);
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };

  const fetchBarchartData = async (start, end) => {
    const formattedStartDate = start.toISOString().split("T")[0];
    const formattedEndDate = end.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost:8080/api/barchart_data?start=${formattedStartDate}&end=${formattedEndDate}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      setBarChartData(jsonData);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchSimpletableData = async (start, end) => {
    const formattedStartDate = start.toISOString().split("T")[0];
    const formattedEndDate = end.toISOString().split("T")[0];
    try {

      console.log("fetching data start!!!");
      const response = await fetch(
        `http://localhost:8080/api/simpletable_data?start=${formattedStartDate}&end=${formattedEndDate}`
      );
      console.log("fetching data done!!!");
      console.log(response);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      setSimpleTableData(jsonData.tabledata);
      setSimpleTableColumn(jsonData.columns);
    } catch (error) {
      console.error("Error fetching simple table data:", error);
    }
  };

  return (
    <MDBContainer>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "100vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <MDBRow className="align-items-center justify-content-end">
          <MDBCol md="6" className="p-2 d-flex justify-content-center">
            <ControlledDateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <MDBBtn
              className="bg-dark text-white"
              color="primary"
              onClick={fetchData}
            >
              Analyse
            </MDBBtn>
          </MDBCol>
        </MDBRow>
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

            <MDBRow>
              <MDBCol md="6" className="p-2">
                <SimpleTable
                  simpletabledata={simpletableData}
                  simpletableColumn={simpletableColumn}
                />
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
