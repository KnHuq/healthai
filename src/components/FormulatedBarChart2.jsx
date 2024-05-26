import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MDBCard, MDBCardBody, MDBCheckbox } from "mdb-react-ui-kit";
import { styled } from "@mui/material/styles";
import * as d3 from "d3";

const DarkCheckbox = styled(MDBCheckbox)({
  color: "white",
  "& .form-check-input": {
    backgroundColor: "#212529",
    borderColor: "white",
  },
  "& .form-check-label": {
    color: "white",
  },
});

const CheckboxContainer = styled("div")({
  marginRight: "15px",
  marginBottom: "10px",
});

const dataKeys = [
  "Absent 5 P's Formulation",
  "Inclusive 5 P's Formulation",
  "Limited 5 P's Formulation",
  "Inclusive Integrated Formulation",
  "Limited Integrated Formulation",
];

const CustomLegend = ({ payload }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} style={{ margin: '0 10px', color: entry.color }}>
          <span style={{ backgroundColor: entry.color, padding: '5px', borderRadius: '5px' }}></span>
          <span style={{ marginLeft: '5px' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );


const FormulationBarChart2 = () => {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(dataKeys);

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      const url = `http://localhost:8080/api/formulation_data`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
        const parsedData = jsonData.map((item) => ({
          ...item,
          month: parseDate(item.month),
        }));
        setData(parsedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (key) => {
    setSelectedKeys((prevSelectedKeys) =>
      prevSelectedKeys.includes(key)
        ? prevSelectedKeys.filter((k) => k !== key)
        : [...prevSelectedKeys, key]
    );
  };

  return (
    <MDBCard className="bg-dark text-white my-3">
      <MDBCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Formulation Bar Chart</h4>
        </div>
        <div className="d-flex flex-wrap justify-content-start align-items-center mb-4">
          {dataKeys.map((key) => (
            <CheckboxContainer key={key}>
              <DarkCheckbox
                label={key}
                checked={selectedKeys.includes(key)}
                onChange={() => handleCheckboxChange(key)}
              />
            </CheckboxContainer>
          ))}
        </div>
        <div
          style={{ width: "100%", overflowX: "auto", scrollbarWidth: "none" }}
        >
          <div style={{ minWidth: 800 }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={d3.timeFormat("%b")} // Format ticks as abbreviated month names
                />
                <YAxis />
                <Tooltip
                  labelFormatter={d3.timeFormat("%B %d, %Y")} // Format tooltips as full date
                />
                <Legend content={<CustomLegend />} />
                {selectedKeys.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={d3.schemeCategory10[dataKeys.indexOf(key)]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default FormulationBarChart2;
