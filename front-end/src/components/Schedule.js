import * as React from "react";
import './Schedule.css';
import Rendezvous  from '../model/Rendezvous';
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
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';

/*
-PRENDRE UN RENDEZ VOUS QU UNE FOIS PAR SEMAINE
-ADAPETER LE BACKEND APPOINTMENT
-OBTENIR LES RENDEZ VOUS DU JOURS CHOISI
-Ajouter des flèches à droite et à gauche pour changer de jours
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
        schedulerData : [],//{startDate: "2022-05-10T11:30:00+02:00" ,endDate: "2022-05-10T11:45:00+02:00" , title:"ESAI"}
        date : this.props.date,
        hairdresser : this.props.hairdresser,
        services :  [],
        service : null,
        error : null,
        showDialogConfirm : false,
        startAppointement : this.props.date,
        endAppointement : null
      }
      this.handleTimePicker = this.handleTimePicker.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleCloseDialog = this.handleCloseDialog.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
      this.validationAppointment = this.validationAppointment.bind(this);
      this.addAppointmentBackend = this.addAppointmentBackend.bind(this);
    }

    componentDidMount() {
      //UNE AUTRE METHODE 
      //OBTENIR LES RENDEZ VOUS DU JOURS CHOISI
      fetch("http://localhost:8080/appointment/all").then((res) => res.json())
                                                    .then((json) => this.setState({ schedulerData: json }) );
      fetch("http://localhost:8080/service/all").then((res) => res.json())
                                                .then((json) => this.setState({ services : json }) );

    }

    handleTimePicker(value){
      this.setState({
        startAppointement : value
      });
    }

    handleServiceChoosen(value){
      this.setState({ service : value });
    }

    handleConfirm(){
      this.state.startAppointement.set('year', this.state.date.year());
      this.state.startAppointement.set('month', this.state.date.month());
      this.state.startAppointement.set('date', this.state.date.date());
      if(this.validationAppointment()){
        var temps = moment(this.state.startAppointement);
        console.log("minutes : "+this.state.service.duration);
        var temps2 = moment(this.state.startAppointement, "hh:mm A").add(this.state.service.duration, 'minutes');//AJOUTER LA DURER DU SERVICE
        this.setState({ startAppointement : moment(this.state.startAppointement) });
        this.setState({
          schedulerData : [...this.state.schedulerData,{startDate: temps ,endDate: temps2 , title:"token"}]
        });
        //AJOUTER DANS LE BACKEND
        this.addAppointmentBackend(temps,temps2);
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
        //AFFICHER LA REPONSE
    }


    /*
    Il manque la validation quand le rendez vous se termine alors que il y en a deja un qui va commencer
    Attention pas rajouter un rendez vous a la fin de la journée et faut voir pour le debut de journée
    */
    validationAppointment(){
      var valid = true;
      if(this.state.service != null ){
        var endingApp = moment(this.state.startAppointement, "hh:mm A").add(this.state.service.duration, 'minutes');
        console.log("DEBUT : "+moment(this.state.startAppointement).format());
        console.log("FIN : "+moment(endingApp).format());
        this.state.schedulerData.forEach(element => {
          var tmpStart = moment(element.startDate)
          var tmpEnd = moment(element.endDate)
          console.log("rendez-vous debut : "+moment(tmpStart).format());
          console.log("rendez-vous fin : "+moment(tmpEnd).format());
          if(tmpStart<this.state.startAppointement &&  tmpEnd>this.state.startAppointement){
            valid = false;
            this.setState({error : "You cannot make an appointment when an other has already start."});
          }
          if(tmpStart<endingApp &&  tmpEnd>endingApp){
            valid = false;
            this.setState({error : "The appointment cannot encroach on the next."});
          }
          if(tmpStart.isSame(this.state.startAppointement)){
            valid = false;
            this.setState({error : "There is already an appointment at this time."});
          }
        });
      }else{
        valid = false;
        this.setState({error : "You have to choose a service to confirm the appointment."});
      }
      return valid;
    }

    handleCancel(){
      this.props.click();
    }

    handleCloseDialog(){
      this.setState({error : null});
    }

    render(){
        return(
            <div className="Schedule">
              <h1>Schedule</h1>
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
                    onChange={(event,newValue) => {
                      this.handleServiceChoosen(newValue);
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                  />
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <TimePicker
                      onChange={(newValue) => { this.handleTimePicker(newValue); }}
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
                      <DayView startDayHour={10} endDayHour={20} cellDuration={15} />
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
              <Dialog onClose={this.handleCloseDialog}  open={this.state.error != null}><Alert variant="filled" severity="warning">{this.state.error}</Alert></Dialog>
            </div>

        )
    }
}

export default Schedule;