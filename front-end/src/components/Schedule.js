import * as React from "react";
import './Schedule.css';
import Rendezvous  from '../model/Rendezvous';
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
import moment from 'moment';
import { blue } from "@mui/material/colors";

/*
VALIDATIONS QUAND ON CLIQUE SUR CONFIRMER
VERIFIER D AVOIR CHOISI LE SERVICE
AFFICHER LES MESSAGES D ERREURS 
-Il faut afficher l'horaire du client
-Utiliser une classe pour mettre dans les tableaux de schedulerData
-Afficher differentes couleurs(le rendez vous du client different des autres)
-Essayer de combler les trous 
-Analyser les temps libres
-Coiffeur Sans préférence.. regarder comment faire 
*/

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
          { startDate: '2022-04-09T10:20', endDate: '2022-04-09T11:10', title: 'taken' },
          { startDate: '2022-04-09T12:00', endDate: '2022-04-09T13:30', title: 'taken' },
          new Rendezvous('2022-04-09T14:00','2022-04-09T14:30','taken')
        ],
        date : this.props.date,
        hairdresser : this.props.hairdresser,
        services :  [],
        startAppointement : this.props.date,
        endAppointement : null
      }
      this.handleTimePicker = this.handleTimePicker.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
      this.validationAppointment = this.validationAppointment.bind(this);
      this.addAppointmentBackend = this.addAppointmentBackend.bind(this);
    }

    componentDidMount() {
      //UNE AUTRE METHODE 
      //OBTENIR LES RENDEZ VOUS DU JOURS CHOISI
      fetch("http://localhost:8080/appointment/all").then((res) => res.json())
                                                    .then((json) => {
                                                        console.log(json);
                                                        this.setState({
                                                          schedulerData: json
                                                        });
                                                        console.log("scheduler :",this.state.schedulerData);
      });
      fetch("http://localhost:8080/service/all").then((res) => res.json())
                                                .then((json) => this.setState({ services : json }) );

    }

    handleTimePicker(value){
      this.setState({
        startAppointement : value
      });
      console.log(value.hours(), value.minutes());
    }

    handleConfirm(){
      this.state.startAppointement.set('year', this.state.date.year());
      this.state.startAppointement.set('month', this.state.date.month());
      this.state.startAppointement.set('date', this.state.date.date());
      var temps = moment(this.state.startAppointement);
      var temps2 = moment(this.state.startAppointement, "hh:mm A").add(30, 'minutes');
      this.setState({
        startAppointement : moment(this.state.startAppointement), 
      });
      if(this.state.startAppointement != null){
        if(this.validationAppointment()){
          this.setState({
            schedulerData : [...this.state.schedulerData,{startDate: temps ,endDate: temps2 , title:"token"}]
          });
          //AJOUTER DANS LE BACKEND
          this.addAppointmentBackend(temps,temps2);
        }
      }
    }

    async addAppointmentBackend(start, end){
        var titre = "2emetest";
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ title : titre , startDate : start, endDate : end})
        };
        const response = await fetch( 'http://localhost:8080/appointment/add',requestOptions);
        const data = await response.text();
        console.log(response);
        console.log(data);
    }


    /*
    Il manque la validation quand le rendez vous se termine alors que il y en a deja un qui va commencer
    Attention pas rajouter un rendez vous a la fin de la journée
    AFFICHER DIALOGUE
    */
    validationAppointment(){
      var valid = true;
      console.log(this.state.startAppointement);
      var endingApp = moment(this.state.startAppointement, "hh:mm A").add(30, 'minutes');
      console.log("end : ", endingApp);
      this.state.schedulerData.forEach(element => {
        var tmpStart = moment(element.startDate)
        var tmpEnd = moment(element.endDate)
        if(tmpStart<this.state.startAppointement &&  tmpEnd>this.state.startAppointement){
          valid = false;
        }
        if(tmpStart<endingApp &&  tmpEnd>endingApp){
          valid = false;
        }
        if(tmpStart.isSame(this.state.startAppointement)){
          valid = false;
        }
      });
      return valid;

    }

    handleCancel(){
      this.props.click();
    }

    render(){
        return(
            <div className="Schedule">
              <h1>Schedule for {this.state.hairdresser} </h1>
              <table className="center">
              <tbody>
              <tr>
                <td>
              <Box sx={{ 
                
              }}  >
                  <p>To make an appointment, complete the followings input:</p>
                  <Autocomplete
                    id="combo-box-demo"
                    options={this.state.services}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                  />
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <TimePicker
                      onChange={(newValue) => {
                        this.handleTimePicker(newValue);
                        }}
                      renderInput={(params) => <TextField style={{ width: 300 }} {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                </td>
                <td>
                <Paper elevation={5}>
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
                </Paper>
                </td>
                </tr>
                </tbody>
            </table>
            <div className="buttons">
              <Button variant="contained" color="success"  onClick={() => { this.handleConfirm() ;}} >Confirm</Button>
              <Button variant="contained" color="error"  onClick={() => { this.handleCancel() ;}}  >Cancel</Button>
            </div>
            </div>

        )
    }
}

export default Schedule;