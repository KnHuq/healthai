import React, { useEffect, useState ,PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { MDBCard, MDBCardBody} from "mdb-react-ui-kit";

/*const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];*/

const BarChatComponent = ({selectedDate, bardata}) => {
  
  //const [data, setData] = useState([]);

  /*useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/barchart_data');
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);*/

    return (
      <MDBCard
        className="bg-dark text-white my-3 "
        
      >
        <MDBCardBody>
          <h4 className="text-center mb-4">Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={bardata}
          
         
        >
          console.log('Fetching data for:', date);
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#2575fc" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="uv" fill="#dadce0" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
      </MDBCardBody>
    </MDBCard>
  );
};


export default BarChatComponent