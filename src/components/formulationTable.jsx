import React, { useState, useEffect } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

const FormulationTable = () => {
  const [data, setData] = useState({ headers: [], percentage: [], number: [] });

  useEffect(() => {
    fetch("http://localhost:8080/api/formulationtable_data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <MDBCard
      className="bg-dark text-white my-3" /*style={{
        minWidth: '50%', // Adjust this width as necessary
      }}*/
    >
      <MDBCardBody>
        <h4 className="bg-dark text-white text-center mb-4">
          Formulation Table
        </h4>
        <div
        /*style={{
            width: '80%',
            overflow: 'auto',
            maxHeight: '418px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}*/
        >
          <MDBTable responsive>
            <MDBTableHead>
              <tr>
                {data.headers.map((header, index) => (
                  <th key={index} className="bg-dark text-white text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {data.number.map((item, index) => (
                <tr key={index}>
                  <td className="bg-dark text-white text-center">
                    {item.name}
                  </td>
                  <td className="bg-dark text-white text-center">
                    {item.FebMar2021}
                  </td>
                  <td className="bg-dark text-white text-center">
                    {data.percentage[index]?.FebMar2021}%
                  </td>
                  <td className="bg-dark text-white text-center">
                    {item.AugSept2021}
                  </td>
                  <td className="bg-dark text-white text-center">
                    {data.percentage[index]?.AugSept2021}%
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default FormulationTable;
