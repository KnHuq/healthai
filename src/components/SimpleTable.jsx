import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

function SimpleTable() {
  return (
    <MDBCard className="bg-dark text-white my-3">
      <MDBCardBody>
        <h4 className="bg-dark text-white text-center mb-4">Simple Table</h4>
        <div style={{ overflowY: 'auto', maxHeight: '300px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <MDBTable hover responsive>
            <MDBTableHead dark>
              <tr>
                <th className="bg-dark text-white text-center">Name</th>
                <th className="bg-dark text-white text-center">UV</th>
                <th className="bg-dark text-white text-center">PV</th>
                <th className="text-center">AMT</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody >
              {/* Map your data to table rows */}
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="bg-dark text-white text-center">{row.name}</td>
                  <td className="bg-dark text-white text-center">{row.uv}</td>
                  <td className="bg-dark text-white text-center">{row.pv}</td>
                  <td className="bg-dark text-white text-center">{row.amt}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

export default SimpleTable;
