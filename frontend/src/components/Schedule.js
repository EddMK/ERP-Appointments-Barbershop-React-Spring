import * as React from "react";
import './Schedule.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  CurrentTimeIndicator
} from '@devexpress/dx-react-scheduler-material-ui';

const top100Films = ['coupe','barbe'];
const currentDate = '2022-03-31';
const schedulerData = [
  { startDate: '2022-03-31T10:20', endDate: '2022-03-31T11:00', title: 'taken' },
  { startDate: '2022-03-31T12:00', endDate: '2022-03-31T13:30', title: 'taken' },
];
const Appointment = ({
    children, style, isShaded, ...restProps
  }) => (
    <Appointments.Appointment
      {...restProps}
      
      style={{
        ...style,
        backgroundColor: '#939393',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );

class Schedule extends React.Component{
    render(){
        return(
            <div className="Schedule">
              <h1>Schedule</h1>
                <div className="hour">
                <Box
                  sx={{
                    width: 400,
                    height: 500,
                    marginLeft : 5,
                    display : "inline-block"
                  }}
                >
                  <Scheduler data={schedulerData} >
                      <ViewState currentDate={currentDate} />
                      <DayView
                          startDayHour={10}
                          endDayHour={20}
                      />
                      <Appointments
                          appointmentComponent={Appointment}
                      />
                      <CurrentTimeIndicator
                        shadePreviousCells={true}
                        shadePreviousAppointments={true}
                        updateInterval={true}
                      />
                    </Scheduler>
                  </Box>
                </div>
                <Box
                  component="div"
                  sx={{
                    width: 400,
                    height: 500,
                    marginLeft : 70,
                    marginTop : -50
                  }}
                >
                <div className="form">
                  <p>Choose service and time</p>
                  <Autocomplete
                    id="combo-box-demo"
                    options={top100Films}
                    
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                  />
                  <p>Time Picker</p>
                </div>
                </Box>
                <Button variant="contained" color="success">Confirm</Button>
                <Button variant="contained" color="error">Cancel</Button>
            </div>

        )
    }
}

export default Schedule;