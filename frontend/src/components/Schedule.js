import * as React from "react";
import './Schedule.css';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
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
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';

const top100Films = ['coupe','barbe'];
//const currentDate = '2022-04-01';
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

    constructor(props){
      super(props);
      this.state={
        schedulerData : [
          { startDate: '2022-04-09T10:20', endDate: '2022-04-09T11:00', title: 'taken' },
          { startDate: '2022-04-09T12:00', endDate: '2022-04-09T13:30', title: 'taken' },
        ],
        date : this.props.date,
        hairdresser : this.props.hairdresser,
        service : null,
        startAppointement : null,
        endAppointement : null
      }
      this.handleTimePicker = this.handleTimePicker.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleTimePicker(value){
      this.setState({
        startAppointement : value
      });
      //schedulerData.concat({startDate:"2022-04-01T15:20",endDate:"2022-04-01T16:20", title:"token"});
      console.log(value.hours(), value.minutes());
    }

    handleConfirm(){
      //schedulerData(...{startDate:"2022-04-01T15:20",endDate:"2022-04-01T16:20", title:"token"});
      //if(this.state.startAppointement != null &&  this.state.service != null){
      if(this.state.startAppointement != null){
        this.state.startAppointement.set('year', this.state.date.year());
        this.state.startAppointement.set('month', this.state.date.month());
        this.state.startAppointement.set('date', this.state.date.date());
        console.log(this.state.startAppointement);
        console.log(this.state.startAppointement.add(30, 'minutes').calendar());
        this.setState({
          schedulerData : [...this.state.schedulerData,{startDate: this.state.startAppointement ,endDate: this.state.startAppointement.add(30, 'minutes'), title:"token"}]
        });
      }
      /*
      this.setState({
        schedulerData : [...this.state.schedulerData,{startDate:"2022-04-01T15:20",endDate:"2022-04-01T16:20", title:"token"}]
      });*/
    }

    handleCancel(){
      this.props.click();
    }

    render(){
        return(
            <div className="Schedule">
              <h1>Schedule</h1>
              <div className="form">
                  {this.state.hairdresser}
                  <Autocomplete
                    id="combo-box-demo"
                    options={top100Films}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                  />
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <TimePicker
                      label="Basic example"
                      onChange={(newValue) => {
                        this.handleTimePicker(newValue);
                        }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="hour">
                <Box
                  sx={{
                    width: 400,
                    height: 500,
                  }}
                >
                  <Scheduler data={this.state.schedulerData} >
                      <ViewState currentDate={this.state.date} />
                      <DayView startDayHour={10} endDayHour={20} />
                      <Appointments appointmentComponent={Appointment} />
                      <CurrentTimeIndicator
                        shadePreviousCells={true}
                        shadePreviousAppointments={true}
                        updateInterval={true}
                      />
                  </Scheduler>
                </Box>
                </div>
                
                <div className="buttons">
                  <Button variant="contained" color="success"  onClick={() => { this.handleConfirm() ;}} >Confirm</Button>
                  <Button variant="contained" color="error"  onClick={() => { this.handleCancel() ;}}  >Cancel</Button>
                </div>
            </div>

        )
    }
}

export default Schedule;