import React, { useState, useEffect } from "react";
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
import { MDBCard, MDBCardBody, MDBBtn, MDBCheckbox } from "mdb-react-ui-kit";

const FormulationLine = () => {
  const [data, setData] = useState({ percentage: [], number: [] });
  const [displayMode, setDisplayMode] = useState("percentage");
  const [showFebMar2021, setShowFebMar2021] = useState(true);
  const [showAugSept2021, setShowAugSept2021] = useState(true);
  

  useEffect(() => {
    fetch("http://localhost:8080/api/formulation_data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === "percentage" ? "number" : "percentage");
  };

  const chartData = displayMode === "percentage" ? data.percentage : data.number;

  return (
    <MDBCard className="bg-dark text-white my-3">
      <MDBCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Formulation Line</h4>
          <div>
            <MDBCheckbox
              name="FebMar2021Checkbox"
              label="FebMar2021"
              checked={showFebMar2021}
              onChange={(e) => setShowFebMar2021(e.target.checked)}
              inline
            />
            <MDBCheckbox
              name="AugSept2021Checkbox"
              label="AugSept2021"
              checked={showAugSept2021}
              onChange={(e) => setShowAugSept2021(e.target.checked)}
              inline
            />
            <MDBBtn className="bg-white text-dark" onClick={toggleDisplayMode}>
              Switch to {displayMode === "percentage" ? "Number" : "Percentage"}
            </MDBBtn>
          </div>
        </div>
        <div style={{ width: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ minWidth: 800 }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} padding={{ left: 110, right: 120 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                {showFebMar2021 && (
                  <Line type="monotone" dataKey="FebMar2021" stroke="#8884d8" activeDot={{ r: 8 }} />
                )}
                {showAugSept2021 && (
                  <Line type="monotone" dataKey="AugSept2021" stroke="#82ca9d" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default FormulationLine;
