import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MDBCard } from 'mdb-react-ui-kit'; // Import MDBCard

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input": {
            color: "white",
          },
          "& label": {
            color: "white",
          },
          "& label.Mui-focused": {
            color: "dark",
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "purple",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "red",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "pink",
            },
            "&:hover fieldset": {
              borderColor: "yellow",
            },
            "&.Mui-focused fieldset": {
              borderColor: "orange",
            },
          },
        },
      },
    },
  },
});

export default function ControlledDateRangePicker({ value, onChange }) {
  const handleDateChange = (newValue) => {
    if (newValue[0] && newValue[0].isValid() && newValue[1] && newValue[1].isValid()) {
      onChange([newValue[0].toDate(), newValue[1].toDate()]); // Convert dayjs objects to Date objects
    } else {
      onChange([null, null]); // Handle invalid or cleared dates
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MDBCard className='bg-dark text-white'> {/* Use MDBCard with appropriate classes */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            startText="Start date"
            endText="End date"
            value={value.map(date => dayjs(date))} // Ensure the value is always a dayjs object
            onChange={handleDateChange}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <TextField {...endProps} style={{ marginLeft: 8 }} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      </MDBCard>
    </ThemeProvider>
  );
}
