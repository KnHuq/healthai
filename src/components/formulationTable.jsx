import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';

const FormulationTable = () => {
  const [data, setData] = useState({ percentage: [], number: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/formulation_data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <MDBCard className="bg-dark text-white my-3" /*style={{
        minWidth: '50%', // Adjust this width as necessary
      }}*/>
      <MDBCardBody>
        <h4 className="bg-dark text-white text-center mb-4">Formulation Table</h4>
        <div
          /*style={{
            width: '80%',
            overflow: 'auto',
            maxHeight: '418px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}*/        >
          <MDBTable 
            
            responsive
          >
            <MDBTableHead>
              <tr>
                <th className="bg-dark text-white text-center">Groupings of Key Formulation Words</th>
                <th className="bg-dark text-white text-center">Number of Formulations (FebMar 2021)</th>
                <th className="bg-dark text-white text-center">% of Formulations with Key Word Groupings (FebMar 2021)</th>
                <th className="bg-dark text-white text-center">Number of Formulations (AugSept 2021)</th>
                <th className="bg-dark text-white text-center">% of Formulations with Key Word Groupings (AugSept 2021)</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {data.number.map((item, index) => (
                <tr key={index}>
                  <td className="bg-dark text-white text-center">{item.name}</td>
                  <td className="bg-dark text-white text-center">{item.FebMar2021}</td>
                  <td className="bg-dark text-white text-center">{data.percentage[index]?.FebMar2021}%</td>
                  <td className="bg-dark text-white text-center">{item.AugSept2021}</td>
                  <td className="bg-dark text-white text-center">{data.percentage[index]?.AugSept2021}%</td>
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
