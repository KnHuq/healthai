import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MDBCard, MDBCardBody, MDBBtn } from "mdb-react-ui-kit";
import TextField from "@mui/material/TextField";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

const CustomLegend = ({ payload }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "10px", // Increase the gap between legend items
    }}
  >
    {payload.map((entry, index) => (
      <div
        key={`item-${index}`}
        style={{ color: entry.color, fontSize: "16px" }}
      >
        <span
          style={{
            backgroundColor: entry.color,
            padding: "8px",
            borderRadius: "5px",
            display: "inline-block",
            width: "20px",
            height: "20px",
          }}
        ></span>
        <span style={{ marginLeft: "10px" }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

const FormulationLineChart2 = () => {
  const [data, setData] = useState([]);
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
      console.log("API response data:", jsonData); // Debug log

      // Parse the date strings to Date objects using d3.timeParse
      const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
      const parsedData = jsonData.map((item) => {
        const parsedMonth = parseDate(item.month);
        console.log("Parsed month:", parsedMonth); // Debug log
        return {
          ...item,
          month: parsedMonth,
        };
      });

      console.log("Parsed data:", parsedData); // Debug log
      setData(parsedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <MDBCard className="bg-dark text-white my-3">
      <MDBCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Formulation Line</h4>
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
        </div>
        <div
          style={{ width: "100%", overflowX: "auto", scrollbarWidth: "none" }}
        >
          <div style={{ minWidth: 800 }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={d3.timeFormat("%b")} // Format ticks as abbreviated month names
                />
                <YAxis />
                <Tooltip
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
                />
                <Line
                  type="monotone"
                  dataKey="Limited 5 P's Formulation"
                  stroke="#82ca9d"
                />
                <Line
                  type="monotone"
                  dataKey="Inclusive 5 P's Formulation"
                  stroke="#ffc658"
                />
                <Line
                  type="monotone"
                  dataKey="Limited Integrated Formulation"
                  stroke="#ff7300"
                />
                <Line
                  type="monotone"
                  dataKey="Inclusive Integrated Formulation"
                  stroke="#387908"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default FormulationLineChart2;
