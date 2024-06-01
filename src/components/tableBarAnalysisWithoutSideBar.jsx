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
import MiniDrawer from "./MuiSideBar";

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

const colors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', 
  '#8e44ad', '#e74c3c', '#3498db', '#2ecc71', '#e67e22'
];

const DataVisualization = ({ title, data }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    // Preselect top 5 keys based on the total value over all months
    const keysWithTotals = Object.keys(data[0])
      .filter(key => key.endsWith(' (%)'))
      .map(key => {
        const total = data.reduce((sum, item) => sum + (item[key] || 0), 0);
        return { key, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(item => item.key);

    setSelectedKeys(keysWithTotals);
  }, [data]);

  const handleCheckboxChange = (key) => {
    setSelectedKeys(prevKeys =>
      prevKeys.includes(key) ? prevKeys.filter(k => k !== key) : [...prevKeys, key]
    );
  };

  const renderCheckboxes = () => {
    const keys = Object.keys(data[0]).filter(key => key.endsWith(' (%)'));
    return (
      <div className="d-flex justify-content-center flex-wrap mb-3">
        {keys.map(key => (
          <div key={key} className="form-check form-check-inline text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id={key}
              checked={selectedKeys.includes(key)}
              onChange={() => handleCheckboxChange(key)}
            />
            <label className="form-check-label" htmlFor={key}>
              {key.replace(' (%)', '')}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderTableHeaders = (data) => {
    const keys = Object.keys(data[0]).filter(key => !key.endsWith(' (%)') && key !== 'month').sort();
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
    return data.map((row, index) => {
      const keys = Object.keys(row).filter(key => !key.endsWith(' (%)') && key !== 'month').sort();
      return (
        <tr key={index}>
          <td className="bg-dark text-white text-center">
            {d3.timeFormat("%B %Y")(new Date(row.month))}
          </td>
          {keys.map(key => (
            <td key={key} className="bg-dark text-white text-center">
              {row[key]} ({row[key + ' (%)']}%)
            </td>
          ))}
        </tr>
      );
    });
  };

  const renderLineChartLines = (data) => {
    return selectedKeys.map((key, index) => (
      <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={3} />
    ));
  };

  return (
    <MDBRow>
      <MDBCol md="12" className="p-2">
        <MDBCard className="bg-dark text-white my-3">
          <MDBCardBody>
            <h4 className="bg-dark text-white text-center mb-4">{title} Line Chart</h4>
            {renderCheckboxes()}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={(tick) => d3.timeFormat("%b")(new Date(tick))}>
                  <Label value="Month" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${value}%`}>
                  <Label value="Percentage" angle={-90} position="insideLeft" offset={0} />
                </YAxis>
                <Tooltip labelFormatter={(label) => d3.timeFormat("%B %d, %Y")(new Date(label))} />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                {data.length > 0 && renderLineChartLines(data)}
              </LineChart>
            </ResponsiveContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="12" className="p-2">
        <MDBCard className="bg-dark text-white my-3">
          <MDBCardBody>
            <h4 className="bg-dark text-white text-center mb-4">{title}</h4>
            <MDBTable responsive>
              <MDBTableHead>
                {data.length > 0 && renderTableHeaders(data)}
              </MDBTableHead>
              <MDBTableBody>
                {renderTableRows(data)}
              </MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

const TableBarAnalysis = () => {
  const [datasets, setDatasets] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2018-03-15'));
  const [endDate, setEndDate] = useState(new Date('2018-07-15'));

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
      setDatasets(jsonData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
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
      {datasets.map((dataset, index) => (
        <DataVisualization key={index} title={dataset.title} data={dataset.data} />
      ))}
    </MDBContainer>
  );
};

export default TableBarAnalysis;
