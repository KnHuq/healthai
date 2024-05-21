import React, { useEffect, useState } from "react";
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
import { MDBCard, MDBCardBody, MDBCheckbox } from "mdb-react-ui-kit";

/*const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];*/

const LineChartComponent = ({ linedata }) => {
  const [showUv, setShowUv] = useState(true);
  const [showPv, setShowPv] = useState(true);

  //const [data, setData] = useState([]);

  /*useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5000/api/linechart_data${selectedDate ? `?date=${selectedDate.toISOString().split('T')[0]}` : ''}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Optionally set some state here to show an error message
      }
    };

    fetchData();
  }, [selectedDate]);*/

  return (
    <>
      <MDBCard className="bg-dark text-white my-3 ">
        <MDBCardBody>
          <h4 className="text-center mb-4">Line Chart</h4>
          <div className="d-flex justify-content-center mb-3">
            <MDBCheckbox
              name="uvCheckbox"
              label="UV"
              checked={showUv}
              onChange={(e) => setShowUv(e.target.checked)}
              inline
            />
            <MDBCheckbox
              name="pvCheckbox"
              label="PV"
              checked={showPv}
              onChange={(e) => setShowPv(e.target.checked)}
              inline
            />
          </div>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              scrollbarWidth: "thin" /* Firefox */,
              scrollbarColor: "inherit",
              msOverflowStyle: "-ms-autohiding-scrollbar" /* IE and Edge */,
            }}
          >
            <div style={{ minWidth: "100vw" }}>
              {" "}
              {/* Adjust the width as needed */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={linedata} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {showPv && (
                    <Line
                      type="monotone"
                      dataKey="pv"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  )}
                  {showUv && (
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default LineChartComponent;
