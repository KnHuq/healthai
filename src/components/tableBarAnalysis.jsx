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
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const DatePickerContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
});

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

  const renderTableHeaders = (data) => {
    const keys = Object.keys(data[0]).filter(key => !key.endsWith(' (%)') && key !== 'month');
    return (
      <tr>
        <th className="bg-dark text-white text-center">Month</th>
        {keys.map(key => (
          <th key={key} className="bg-dark text-white text-center">{key}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = (data) => {
    return data.map((row, index) => (
      <tr key={index}>
        <td className="bg-dark text-white text-center">
          {d3.timeFormat("%B %Y")(new Date(row.month))}
        </td>
        {Object.keys(row).filter(key => !key.endsWith(' (%)') && key !== 'month').map(key => (
          <td key={key} className="bg-dark text-white text-center">
            {row[key]} ({row[key + ' (%)']}%)
          </td>
        ))}
      </tr>
    ));
  };

  const renderLineChartLines = (data) => {
    const keys = Object.keys(data[0]).filter(key => key.endsWith(' (%)'));
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', 
      '#8e44ad', '#e74c3c', '#3498db', '#2ecc71', '#e67e22'
    ];
    return keys.map((key, index) => (
      <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={3} />
    ));
  };

  return (
    <MDBContainer>
      <MDBRow className="align-items-center justify-content-center mb-4">
        <MDBCol md="8" className="p-2">
          <MDBCard className="bg-dark text-white">
            <MDBCardBody>
              <DatePickerContainer>
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  </LocalizationProvider>
                </ThemeProvider>
                <MDBBtn color="light" onClick={fetchData} style={{ marginLeft: '10px' }}>
                  Fetch Data
                </MDBBtn>
              </DatePickerContainer>
            </MDBCardBody>
          </MDBCard>
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
                  {tableData.length > 0 && renderTableHeaders(tableData)}
                </MDBTableHead>
                <MDBTableBody>
                  {renderTableRows(tableData)}
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
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                {lineData.length > 0 && renderLineChartLines(lineData)}
              </LineChart>
            </ResponsiveContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
};

export default TableBarAnalysis;
