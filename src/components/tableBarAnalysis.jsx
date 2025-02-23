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
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
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
  BarChart,
  Bar,
} from "recharts";
import * as d3 from "d3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider, styled as muiStyled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import API_CONFIG from '../config/api.js';
import { format } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';  // Import British English locale for dd/MM/yyyy format

const DatePickerContainer = muiStyled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  flexWrap: "wrap",
});

const DarkTextField = muiStyled(TextField)({
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
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#387908",
  "#8e44ad",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#e67e22",
];

const CustomDropdownItem = styled.div`
  padding: 0.5rem 1rem;
  color: white;
  background-color: #0d6efd; /* Match button background color */
  border: none;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  margin: 0.25rem 0;
  text-align: center;
  
  &:hover {
    background-color: #0b5ed7; /* Darker shade on hover */
    color: white;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(11, 94, 215, 0.5); /* Match button hover effect */
  }
`;

const DataVisualization = ({ title, data, customColors }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // Preselect top 5 keys based on the total value over all months
    const keysWithTotals = Object.keys(data[0])
      .filter((key) => key.endsWith(" (%)"))
      .map((key) => {
        const total = data.reduce((sum, item) => sum + (item[key] || 0), 0);
        return { key, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((item) => item.key);

    setSelectedKeys(keysWithTotals);
  }, [data]);

  const handleCheckboxChange = (key) => {
    setSelectedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const renderCheckboxes = () => {
    const keys = Object.keys(data[0]).filter((key) => key.endsWith(" (%)"));
    return (
      <div className="d-flex justify-content-center flex-wrap mb-3">
        {keys.map((key) => (
          <div key={key} className="form-check form-check-inline text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id={key}
              checked={selectedKeys.includes(key)}
              onChange={() => handleCheckboxChange(key)}
            />
            <label className="form-check-label" htmlFor={key}>
              {key.replace(" (%)", "")}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderTableHeaders = (data) => {
    const keys = Object.keys(data[0])
      .filter((key) => !key.endsWith(" (%)") && key !== "month")
      .sort();
    return (
      <tr>
        <th className="bg-dark text-white text-center">Month</th>
        {keys.map((key) => (
          <th key={key} className="bg-dark text-white text-center">
            {key}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableRows = (data) => {
    return data.map((row, index) => {
      const keys = Object.keys(row)
        .filter((key) => !key.endsWith(" (%)") && key !== "month")
        .sort();
      return (
        <tr key={index}>
          <td className="bg-dark text-white text-center">
            {d3.timeFormat("%B %Y")(new Date(row.month))}
          </td>
          {keys.map((key) => (
            <td key={key} className="bg-dark text-white text-center">
              {row[key]} ({row[key + " (%)"]}%)
            </td>
          ))}
        </tr>
      );
    });
  };

  const renderLineChartLines = (data) => {
    return selectedKeys.map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colors[index % colors.length]}
        strokeWidth={3}
      />
    ));
  };

  return (
    <MDBRow className="align-items-start">
      <MDBCol md={showTable ? "5" : "12"} className="p-2">
        <MDBCard className={`${customColors.cardBackground} ${customColors.textColor} my-3`}>
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <h4 className="mb-0" style={{ fontSize: showTable ? '1.2rem' : '1.5rem' }}>{title} Line Chart</h4>
              <MDBBtn 
                color="light" 
                size="sm" 
                style={{ 
                  whiteSpace: 'nowrap',
                  minWidth: '100px',
                  padding: '0.5rem 1rem'
                }}
                onClick={() => setShowTable(!showTable)}
              >
                {showTable ? 'Hide Table' : 'Show Table'}
              </MDBBtn>
            </div>
            {renderCheckboxes()}
            <ResponsiveContainer width="100%" height={showTable ? 300 : 400}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(tick) => d3.timeFormat("%b")(new Date(tick))}
                >
                  <Label value="Month" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${value}%`}>
                  <Label
                    value="Percentage"
                    angle={-90}
                    position="insideLeft"
                    offset={0}
                  />
                </YAxis>
                <Tooltip
                  labelFormatter={(label) =>
                    d3.timeFormat("%B %d, %Y")(new Date(label))
                  }
                />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                {data.length > 0 && renderLineChartLines(data)}
              </LineChart>
            </ResponsiveContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      
      {showTable && (
        <MDBCol md="7" className="p-2">
          <MDBCard className={`${customColors.cardBackground} ${customColors.textColor} my-3`}>
            <MDBCardBody>
              <h4 className="text-center mb-4">{title} Data</h4>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <MDBTable responsive>
                  <MDBTableHead>
                    {data.length > 0 && renderTableHeaders(data)}
                  </MDBTableHead>
                  <MDBTableBody>{renderTableRows(data)}</MDBTableBody>
                </MDBTable>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      )}
    </MDBRow>
  );
};

const DropdownSearch = ({ label, searchTerm, setSearchTerm, selectedOption, setSelectedOption, options }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm("");
  };

  return (
    <div className="p-2">
      <DarkTextField
        label={label}
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: "100%" }}
      />
      {searchTerm && filteredOptions.map((option, index) => (
        <CustomDropdownItem
          key={index}
          onClick={() => handleSelect(option)}
        >
          {option}
        </CustomDropdownItem>
      ))}
    </div>
  );
};

const CombinedComparison = ({ wordSearchData, nlpData, customColors }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeBarColor, setActiveBarColor] = useState(null);
  const [colorPairs, setColorPairs] = useState({
    "Absent 5 P's Formulation": ['#8884d8', '#82ca9d'],
    "Inclusive 5 P's Formulation": ['#ffc658', '#ff7300'],
    "Inclusive Integrated Formulation": ['#e74c3c', '#3498db'],
    "Limited 5 P's Formulation": ['#2ecc71', '#8e44ad'],
    "Limited Integrated Formulation": ['#e67e22', '#387908']
  });

  useEffect(() => {
    // Preselect first metric
    const availableKeys = Object.keys(wordSearchData[0])
      .filter((key) => key.endsWith(" (%)"))
      .map(key => key.replace(" (%)", ""));
    setSelectedKeys([availableKeys[0]]);
  }, [wordSearchData]);

  // Combine the data for the selected metrics
  const combinedData = wordSearchData.map((wordItem, index) => {
    const nlpItem = nlpData[index];
    const result = {
      month: wordItem.month,
    };
    
    selectedKeys.forEach(key => {
      result[`${key} (Word Search)`] = wordItem[`${key} (%)`];
      result[`${key} (NLP)`] = nlpItem[`${key} (%)`];
    });
    
    return result;
  });

  const renderCheckboxes = () => {
    const keys = Object.keys(wordSearchData[0])
      .filter((key) => key.endsWith(" (%)"))
      .map(key => key.replace(" (%)", ""));

    return (
      <div className="d-flex justify-content-center flex-wrap mb-3">
        {keys.map((key) => (
          <div key={key} className="form-check form-check-inline text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id={key}
              checked={selectedKeys.includes(key)}
              onChange={() => {
                setSelectedKeys(prev => 
                  prev.includes(key) 
                    ? prev.filter(k => k !== key)
                    : [...prev, key]
                );
              }}
            />
            <label className="form-check-label" htmlFor={key}>
              {key}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderBars = () => {
    return selectedKeys.flatMap((key) => [
      <Bar
        key={`${key}-word`}
        dataKey={`${key} (Word Search)`}
        fill={colorPairs[key][0]}
        name={`${key} (Word Search)`}
        stroke={colorPairs[key][0]}
        strokeWidth={1}
      />,
      <Bar
        key={`${key}-nlp`}
        dataKey={`${key} (NLP)`}
        fill={colorPairs[key][1]}
        name={`${key} (NLP)`}
        stroke={colorPairs[key][1]}
        strokeWidth={1}
      />
    ]);
  };

  const renderTableHeaders = () => {
    return (
      <tr>
        <th className="bg-dark text-white text-center">Month</th>
        {selectedKeys.map(key => (
          <React.Fragment key={key}>
            <th className="bg-dark text-white text-center">{`${key} (Word Search)`}</th>
            <th className="bg-dark text-white text-center">{`${key} (NLP)`}</th>
          </React.Fragment>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return combinedData.map((row, index) => (
      <tr key={index}>
        <td className="bg-dark text-white text-center">
          {d3.timeFormat("%B %Y")(new Date(row.month))}
        </td>
        {selectedKeys.map(key => (
          <React.Fragment key={key}>
            <td className="bg-dark text-white text-center">
              {row[`${key} (Word Search)`].toFixed(2)}%
            </td>
            <td className="bg-dark text-white text-center">
              {row[`${key} (NLP)`].toFixed(2)}%
            </td>
          </React.Fragment>
        ))}
      </tr>
    ));
  };

  return (
    <MDBRow className="align-items-start">
      <MDBCol md={showTable ? "5" : "12"} className="p-2">
        <MDBCard className={`${customColors.cardBackground} ${customColors.textColor} my-3`}>
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <h4 className="mb-0" style={{ fontSize: showTable ? '1.2rem' : '1.5rem' }}>
                Comparison of Word Search vs NLP Methods
              </h4>
              <div className="d-flex gap-2">
                <MDBBtn 
                  color="info" 
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <MDBIcon fas icon="palette" className="me-2" />
                  Bar Colors
                </MDBBtn>
                <MDBBtn 
                  color="light" 
                  size="sm" 
                  onClick={() => setShowTable(!showTable)}
                >
                  {showTable ? 'Hide Table' : 'Show Table'}
                </MDBBtn>
              </div>
            </div>

            {showColorPicker && (
              <div className="mb-4 p-3 border rounded">
                <h6 className="mb-3">Customize Bar Colors</h6>
                {selectedKeys.map(key => (
                  <div key={key} className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">{key}:</span>
                    </div>
                    <div className="d-flex gap-3 mb-2">
                      <div>
                        <small>Word Search</small>
                        <button
                          className="d-block mt-1"
                          style={{
                            width: '30px',
                            height: '30px',
                            background: colorPairs[key][0],
                            border: '2px solid white',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setActiveBarColor([key, 0])}
                        />
                      </div>
                      <div>
                        <small>NLP</small>
                        <button
                          className="d-block mt-1"
                          style={{
                            width: '30px',
                            height: '30px',
                            background: colorPairs[key][1],
                            border: '2px solid white',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setActiveBarColor([key, 1])}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {activeBarColor && (
                  <div className="mt-3">
                    <HexColorPicker
                      color={colorPairs[activeBarColor[0]][activeBarColor[1]]}
                      onChange={(color) => {
                        setColorPairs(prev => ({
                          ...prev,
                          [activeBarColor[0]]: activeBarColor[1] === 0 ? 
                            [color, prev[activeBarColor[0]][1]] : 
                            [prev[activeBarColor[0]][0], color]
                        }));
                      }}
                    />
                    <MDBBtn 
                      color="light" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setActiveBarColor(null)}
                    >
                      Done
                    </MDBBtn>
                  </div>
                )}
              </div>
            )}

            {renderCheckboxes()}
            <div className="text-center mb-2" style={{ fontSize: '0.9rem' }}>
              {selectedKeys.map(key => (
                <div key={key} className="mb-1">
                  <span className="me-3">
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: colorPairs[key][0],
                      marginRight: '5px'
                    }}></span>
                    {key} (Word Search)
                  </span>
                  <span>
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: colorPairs[key][1],
                      marginRight: '5px'
                    }}></span>
                    {key} (NLP)
                  </span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={showTable ? 300 : 400}>
              <BarChart
                data={combinedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(tick) => d3.timeFormat("%b")(new Date(tick))}
                >
                  <Label value="Month" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${value}%`}>
                  <Label
                    value="Percentage"
                    angle={-90}
                    position="insideLeft"
                    offset={0}
                  />
                </YAxis>
                <Tooltip
                  labelFormatter={(label) =>
                    d3.timeFormat("%B %Y")(new Date(label))
                  }
                  formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => {
                    const baseName = value.replace(" (Word Search)", "").replace(" (NLP)", "");
                    return value.includes("Word Search") ? 
                      `${baseName} (Word Search)` : 
                      `${baseName} (NLP)`;
                  }}
                />
                {renderBars()}
              </BarChart>
            </ResponsiveContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      
      {showTable && (
        <MDBCol md="7" className="p-2">
          <MDBCard className={`${customColors.cardBackground} ${customColors.textColor} my-3`}>
            <MDBCardBody>
              <h4 className="text-center mb-4">Comparison Data</h4>
              <div style={{ 
                maxHeight: '600px', 
                overflowY: 'auto',
                overflowX: 'auto'  // Add horizontal scroll
              }}>
                <MDBTable responsive className="table-responsive">
                  <MDBTableHead>
                    {renderTableHeaders()}
                  </MDBTableHead>
                  <MDBTableBody>
                    {renderTableRows()}
                  </MDBTableBody>
                </MDBTable>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      )}
    </MDBRow>
  );
};

// Add this CSS at the top of your file or in a separate CSS file
const loadingStyles = `
  @keyframes dnaRotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) translateX(20px);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) translateX(20px);
    }
  }

  @keyframes dnaRotateReverse {
    0% {
      transform: translate(-50%, -50%) rotate(360deg) translateX(20px);
    }
    100% {
      transform: translate(-50%, -50%) rotate(0deg) translateX(20px);
    }
  }

  .dna-loader {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dna-loader div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #8884d8;
    box-shadow: 0 0 10px #8884d8;
    left: 50%;
    top: 50%;
  }

  .dna-loader div:nth-child(odd) {
    animation: dnaRotate 3s linear infinite;
  }

  .dna-loader div:nth-child(even) {
    background: #82ca9d;
    box-shadow: 0 0 10px #82ca9d;
    animation: dnaRotateReverse 3s linear infinite;
  }

  .dna-loader div:nth-child(1) { animation-delay: -0.3s; }
  .dna-loader div:nth-child(2) { animation-delay: -0.6s; }
  .dna-loader div:nth-child(3) { animation-delay: -0.9s; }
  .dna-loader div:nth-child(4) { animation-delay: -1.2s; }
  .dna-loader div:nth-child(5) { animation-delay: -1.5s; }
  .dna-loader div:nth-child(6) { animation-delay: -1.8s; }
  .dna-loader div:nth-child(7) { animation-delay: -2.1s; }
  .dna-loader div:nth-child(8) { animation-delay: -2.4s; }
  .dna-loader div:nth-child(9) { animation-delay: -2.7s; }
  .dna-loader div:nth-child(10) { animation-delay: -3.0s; }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  .loading-text {
    animation: pulse 1.5s ease-in-out infinite;
    color: #8884d8;
    text-shadow: 0 0 10px rgba(136, 132, 216, 0.5);
  }
`;

const TableBarAnalysis = () => {
  const [datasets, setDatasets] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2018-03-15"));
  const [endDate, setEndDate] = useState(new Date("2018-07-15"));
  const [facilityMapping, setFacilityMapping] = useState({});
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [facilitySearchTerm, setFacilitySearchTerm] = useState("");
  const [facilityDateRanges, setFacilityDateRanges] = useState({});
  const [settingsModal, setSettingsModal] = useState(false);
  const [customColors, setCustomColors] = useState({
    background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
    cardBackground: 'bg-dark',
    textColor: 'text-white',
    chartColors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908']
  });
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialState = async () => {
      const headers = new Headers();
      headers.append("ngrok-skip-browser-warning", "true");

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INITIAL_STATE}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setFacilityMapping(jsonData.facilityMapping);
        setFacilityDateRanges(jsonData.facilityDateRanges);
      } catch (error) {
        console.error("Failed to fetch initial state:", error);
      }
    };

    fetchInitialState();
  }, []);

  // Set date range when facility is selected
  useEffect(() => {
    if (selectedFacilityId && facilityDateRanges[selectedFacilityId]) {
      const facilityRange = facilityDateRanges[selectedFacilityId];
      setStartDate(new Date(facilityRange.minDate));
      setEndDate(new Date(facilityRange.maxDate));
    }
  }, [selectedFacilityId]);

  const fetchData = async () => {
    setIsLoading(true);  // Start loading
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORMULATION_DATA}?start_date=${start}&end_date=${end}&facility=${selectedFacilityId}`;

    const headers = new Headers();
    headers.append("ngrok-skip-browser-warning", "true");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setDatasets(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);  // Stop loading regardless of success/failure
    }
  };

  const toggleSettings = () => {
    setSettingsModal(!settingsModal);
  };

  const handleColorChange = (key, value) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <style>{loadingStyles}</style>
      <MDBContainer 
        fluid 
        style={{ 
          minHeight: '100vh',
          background: customColors.background
        }}
      >
        {/* Settings Button */}
        <MDBBtn
          floating
          className='position-fixed'
          style={{ top: '20px', right: '20px', zIndex: 1000 }}
          color='light'
          onClick={toggleSettings}
        >
          <MDBIcon fas icon='cog' />
        </MDBBtn>

        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBRow className="align-items-center justify-content-center mb-4">
              <MDBCol md="8" className="p-2">
                <MDBCard className="bg-dark text-white">
                  <MDBCardBody>
                    {/* Facility Selection First */}
                    <DropdownSearch
                      label="Search Facilities"
                      searchTerm={facilitySearchTerm}
                      setSearchTerm={setFacilitySearchTerm}
                      selectedOption={selectedFacilityId ? facilityMapping[selectedFacilityId] : ""}
                      setSelectedOption={(facilityName) => {
                        // Find the ID for this facility name
                        const id = Object.entries(facilityMapping)
                          .find(([_, name]) => name === facilityName)?.[0];
                        setSelectedFacilityId(id ? parseInt(id) : null);
                      }}
                      options={Object.values(facilityMapping)}
                    />
                    {selectedFacilityId && (
                      <>
                        <p className="mt-3 mb-2">
                          Selected Facility: {facilityMapping[selectedFacilityId]}
                          <br />
                          <small className="text-muted">
                            Available date range: {
                              format(new Date(facilityDateRanges[selectedFacilityId].minDate), 'dd/MM/yyyy', { locale: enGB })
                            } to {
                              format(new Date(facilityDateRanges[selectedFacilityId].maxDate), 'dd/MM/yyyy', { locale: enGB })
                            }
                          </small>
                        </p>
                        
                        {/* Date Pickers only shown after facility selection */}
                        <DatePickerContainer>
                          <ThemeProvider theme={darkTheme}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                              <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                minDate={new Date(facilityDateRanges[selectedFacilityId].minDate)}
                                maxDate={new Date(facilityDateRanges[selectedFacilityId].maxDate)}
                                renderInput={(params) => <DarkTextField {...params} />}
                                inputFormat="dd/MM/yyyy"
                              />
                              <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                minDate={new Date(facilityDateRanges[selectedFacilityId].minDate)}
                                maxDate={new Date(facilityDateRanges[selectedFacilityId].maxDate)}
                                renderInput={(params) => <DarkTextField {...params} />}
                                inputFormat="dd/MM/yyyy"
                              />
                            </LocalizationProvider>
                          </ThemeProvider>
                        </DatePickerContainer>

                        {/* Fetch button only shown when facility is selected */}
                        <div className="d-flex justify-content-center mt-3">
                          <MDBBtn 
                            color="light" 
                            onClick={fetchData}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                Fetching Data...
                              </>
                            ) : (
                              'Fetch Data'
                            )}
                          </MDBBtn>
                        </div>
                      </>
                    )}
                    
                    {!selectedFacilityId && (
                      <p className="text-center mt-3 text-muted">
                        Please select a facility to view available date ranges
                      </p>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            
            {/* Updated loading overlay */}
            {isLoading && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999,
                  backdropFilter: 'blur(5px)',
                }}
              >
                <div className="text-center text-white">
                  <div className="dna-loader mb-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} />
                    ))}
                  </div>
                  <h4 className="mt-3 loading-text" style={{ color: '#8884d8' }}>
                    Processing Clinical Data
                  </h4>
                  <p className="text-muted">
                    Analyzing formulations and patterns...
                  </p>
                </div>
              </div>
            )}
            
            {/* Show charts only when not loading and data exists */}
            {!isLoading && datasets.length >= 2 && (
              <CombinedComparison 
                wordSearchData={datasets[0].data} 
                nlpData={datasets[1].data}
                customColors={customColors}
              />
            )}
            
            {!isLoading && datasets
              .filter(dataset => ![
                "Comparison of Formulations in Selected Clinical Notes Over Time (Word Search)",
                "Comparison of Formulations in Selected Clinical Notes Over Time (NLP)",
                "Comparison of Formulations in Selected Clinical Notes Over Time (NLP+ Word Search)"
              ].includes(dataset.title))
              .map((dataset, index) => (
                <DataVisualization 
                  key={index} 
                  title={dataset.title} 
                  data={dataset.data} 
                  customColors={customColors} 
                />
              ))}
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Settings Modal */}
      <MDBModal open={settingsModal} tabIndex='-1' staticBackdrop>
        <MDBModalDialog>
          <MDBModalContent className={`${customColors.cardBackground} ${customColors.textColor}`}>
            <MDBModalHeader>
              <MDBModalTitle>Appearance Settings</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleSettings}></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody>
              <div className="mb-4">
                <label className="form-label">Background Gradient</label>
                <div className="mt-3 p-3 border rounded">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <label className="form-label">Start Color</label>
                      <button
                        className="d-block"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: customColors.gradientStart,
                          border: '2px solid white',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveColorPicker('gradientStart')}
                      />
                    </div>
                    <div>
                      <label className="form-label">End Color</label>
                      <button
                        className="d-block"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: customColors.gradientEnd,
                          border: '2px solid white',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveColorPicker('gradientEnd')}
                      />
                    </div>
                  </div>
                  
                  {activeColorPicker && (activeColorPicker === 'gradientStart' || activeColorPicker === 'gradientEnd') && (
                    <div className="mt-3">
                      <HexColorPicker
                        color={customColors[activeColorPicker]}
                        onChange={(color) => {
                          setCustomColors(prev => ({
                            ...prev,
                            [activeColorPicker]: color,
                            background: `linear-gradient(to right, ${activeColorPicker === 'gradientStart' ? color : prev.gradientStart}, ${activeColorPicker === 'gradientEnd' ? color : prev.gradientEnd})`
                          }));
                        }}
                      />
                      <MDBBtn 
                        color="light" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setActiveColorPicker(null)}
                      >
                        Done
                      </MDBBtn>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Card Background</label>
                <div className="d-flex align-items-center gap-3">
                  <select 
                    className="form-select"
                    value={customColors.cardBackground}
                    onChange={(e) => handleColorChange('cardBackground', e.target.value)}
                  >
                    <option value="bg-dark">Dark</option>
                    <option value="bg-primary">Primary</option>
                    <option value="bg-secondary">Secondary</option>
                  </select>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setActiveColorPicker('cardBackground')}
                  >
                    Custom Color
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Text Color</label>
                <div className="d-flex align-items-center gap-3">
                  <select 
                    className="form-select"
                    value={customColors.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                  >
                    <option value="text-white">White</option>
                    <option value="text-dark">Dark</option>
                    <option value="text-primary">Primary</option>
                  </select>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setActiveColorPicker('textColor')}
                  >
                    Custom Color
                  </button>
                </div>
              </div>

              {/* Color Picker */}
              {activeColorPicker && (
                <div className="mt-4">
                  <HexColorPicker
                    color={customColors[activeColorPicker]}
                    onChange={(color) => handleColorChange(activeColorPicker, color)}
                  />
                  <MDBBtn 
                    color='light' 
                    size='sm' 
                    className="mt-2"
                    onClick={() => setActiveColorPicker(null)}
                  >
                    Done
                  </MDBBtn>
                </div>
              )}
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='light' onClick={toggleSettings}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default TableBarAnalysis;
