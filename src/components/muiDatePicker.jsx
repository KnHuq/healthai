import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs'; // Import dayjs
import { MDBCard } from 'mdb-react-ui-kit';






function BasicDatePicker({ selectedDate, onChange }) {
  // Ensure the date is a dayjs object
  const handleDateChange = (newDate) => {
    if (newDate && newDate.isValid()) {
      onChange(newDate.toDate()); // Convert back to JavaScript Date if needed elsewhere
    }
  };

  return (
   <MDBCard className='bg-datk text white'>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        
        value={dayjs(selectedDate)} // Ensure the value is a dayjs object
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>

   </MDBCard>
    
    
  );
}

export default BasicDatePicker;
