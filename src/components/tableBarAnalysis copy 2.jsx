import React, { useState } from "react";
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
import * as d3 from "d3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

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
  const [lineData, setLineData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchData = async () => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    const url = `http://localhost:8080/api/formulation_data?start_date=${start}&end_date=${end}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();

      const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
      const parsedLineData = jsonData.line_data.map((item) => {
        const parsedMonth = parseDate(item.month);
        return {
          ...item,
          month: parsedMonth,
        };
      });

      setTableData(jsonData.bar_data);
      setLineData(parsedLineData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <MDBContainer>
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
                <MDBBtn color="light" onClick={fetchData}>
                  Fetch Data
                </MDBBtn>
              </div>
            </LocalizationProvider>
          </ThemeProvider>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="12" className="p-2">
          <MDBCard className="bg-dark text-white my-3">
            <MDBCardBody>
              <h4 className="bg-dark text-white text-center mb-4">
                Formulation Table
              </h4>
              <MDBTable responsive>
                <MDBTableHead>
                  <tr>
                    <th className="bg-dark text-white text-center">Month</th>
                    <th className="bg-dark text-white text-center">Absent 5 P's Formulation</th>
                    <th className="bg-dark text-white text-center">Limited 5 P's Formulation</th>
                    <th className="bg-dark text-white text-center">Inclusive 5 P's Formulation</th>
                    <th className="bg-dark text-white text-center">Limited Integrated Formulation</th>
                    <th className="bg-dark text-white text-center">Inclusive Integrated Formulation</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="bg-dark text-white text-center">
                        {d3.timeFormat("%B %Y")(new Date(row.month))}
                      </td>
                      <td className="bg-dark text-white text-center">
                        {row["Absent 5 P's Formulation"]} ({row["Absent 5 P's Formulation (%)"]}%)
                      </td>
                      <td className="bg-dark text-white text-center">
                        {row["Limited 5 P's Formulation"]} ({row["Limited 5 P's Formulation (%)"]}%)
                      </td>
                      <td className="bg-dark text-white text-center">
                        {row["Inclusive 5 P's Formulation"]} ({row["Inclusive 5 P's Formulation (%)"]}%)
                      </td>
                      <td className="bg-dark text-white text-center">
                        {row["Limited Integrated Formulation"]} ({row["Limited Integrated Formulation (%)"]}%)
                      </td>
                      <td className="bg-dark text-white text-center">
                        {row["Inclusive Integrated Formulation"]} ({row["Inclusive Integrated Formulation (%)"]}%)
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
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
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={d3.timeFormat("%b")}>
                  <Label value="Month" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${value}%`}>
                  <Label value="Percentage" angle={-90} position="insideLeft" offset={0} />
                </YAxis>
                <Tooltip labelFormatter={d3.timeFormat("%B %d, %Y")} />
                <Legend />
                <Line type="monotone" dataKey="Absent 5 P's Formulation (%)" stroke="#8884d8" />
                <Line type="monotone" dataKey="Limited 5 P's Formulation (%)" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Inclusive 5 P's Formulation (%)" stroke="#ffc658" />
                <Line type="monotone" dataKey="Limited Integrated Formulation (%)" stroke="#ff7300" />
                <Line type="monotone" dataKey="Inclusive Integrated Formulation (%)" stroke="#387908" />
              </LineChart>
            </ResponsiveContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
};

export default TableBarAnalysis;
