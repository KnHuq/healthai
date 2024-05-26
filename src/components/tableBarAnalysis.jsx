import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
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
import ControlledDateRangePicker from "./muidateRangePicker";
import dayjs from "dayjs";
import FormulationBar from "./formulationBar";
import FormulationTable from "./formulationTable";
import FormulationLine from "./formulationLine";
import FormulationLineChart2 from "./firmukationLineChart2";
import FormulationBarChart2 from "./FormulatedBarChart2";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import TextField from "@mui/material/TextField";
import * as d3 from "d3";

const DarkTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "white",
    backgroundColor: "#212529",
  },
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiInputAdornment-root": {
    color: "white",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-selected": {
            backgroundColor: "#8884d8",
          },
        },
      },
    },
    MuiPickersYear: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-selected": {
            backgroundColor: "#8884d8",
          },
        },
      },
    },
    MuiPickersMonth: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-selected": {
            backgroundColor: "#8884d8",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#212529",
          color: "white",
        },
      },
    },
  },
});

const TableBarAnalysis = () => {
  const [Linedata, setLineData] = useState([]);
  const [tabledata, setTableData] = useState({
    headers: [],
    percentage: [],
    number: [],
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchTableData = async () => {
    const url = "http://localhost:8080/api/formulationtable_data";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setTableData(jsonData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchFormulateLineData = async () => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    const url = `http://localhost:8080/api/formulation_data?start_date=${start}&end_date=${end}`;
    try {
      const response = await fetch(url);
      console.log("fetching data");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log("API response data:", jsonData);

      const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
      const parsedData = jsonData.map((item) => {
        const parsedMonth = parseDate(item.month);
        console.log("Parsed month:", parsedMonth);
        return {
          ...item,
          month: parsedMonth,
        };
      });

      console.log("Parsed data:", parsedData);
      setLineData(parsedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleClick = () => {
    fetchFormulateLineData();
    fetchTableData();
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
            <ThemeProvider theme={darkTheme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div
                  className="bg-dark text-white d-flex align-items-center"
                  style={{ gap: "8px" }}
                >
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <DarkTextField {...params} />}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <DarkTextField {...params} />}
                  />
                  <MDBBtn color="light" onClick={handleClick}>
                    Fetch Data
                  </MDBBtn>
                </div>
              </LocalizationProvider>
            </ThemeProvider>
          </MDBCol>
        </MDBRow>
        <MDBRow className="flex">
          <MDBCol sm="2" className="p-0">
            <MiniDrawer />
          </MDBCol>
          <MDBCol md="10" className="p-0">
            <MDBRow>
              <MDBCol md="12" className="p-2">
                <MDBCard className="bg-dark text-white my-3">
                  <MDBCardBody>
                    <h4 className="bg-dark text-white text-center mb-4">
                      Formulation Table
                    </h4>
                    <div>
                      <MDBTable responsive>
                        <MDBTableHead>
                          <tr>
                            {tabledata.headers.map((header, index) => (
                              <th
                                key={index}
                                className="bg-dark text-white text-center"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {tabledata.number.map((item, index) => (
                            <tr key={index}>
                              <td className="bg-dark text-white text-center">
                                {item.name}
                              </td>
                              <td className="bg-dark text-white text-center">
                                {item.FebMar2021}
                              </td>
                              <td className="bg-dark text-white text-center">
                                {tabledata.percentage[index]?.FebMar2021}%
                              </td>
                              <td className="bg-dark text-white text-center">
                                {item.AugSept2021}
                              </td>
                              <td className="bg-dark text-white text-center">
                                {tabledata.percentage[index]?.AugSept2021}%
                              </td>
                            </tr>
                          ))}
                        </MDBTableBody>
                      </MDBTable>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCard className="bg-dark text-white my-3">
                <MDBCardBody>
                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <h4 className="mb-0">Formulation Line</h4>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      overflowX: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    <div style={{ minWidth: 800 }}>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={Linedata} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tickFormatter={d3.timeFormat("%b")} // Format ticks as abbreviated month names
                          >
                            <Label
                              value="Date"
                              offset={-10}
                              position="insideBottom"
                            />
                          </XAxis>
                          <YAxis tickFormatter={(value) => `${value}%`}>
                            <Label value="Percentage" angle={-90} position="insideLeft" offset={1} style={{ textAnchor: 'middle' }} />
                          </YAxis>
                          <Tooltip
                            formatter={(value) => `${value}%`}
                            labelFormatter={d3.timeFormat("%B %d, %Y")} // Format tooltips as full date
                          />
                          <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            wrapperStyle={{ paddingLeft: "20px" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Absent 5 P's Formulation"
                            stroke="#8884d8"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="Limited 5 P's Formulation"
                            stroke="#82ca9d"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="Inclusive 5 P's Formulation"
                            stroke="#ffc658"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="Limited Integrated Formulation"
                            stroke="#ff7300"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="Inclusive Integrated Formulation"
                            stroke="#387908"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default TableBarAnalysis;
