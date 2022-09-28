import * as React from "react";
import './Schedule.css';
import {TextField , Alert, Dialog,  Button, Autocomplete , IconButton, Paper, Box}from '@mui/material/';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, Resources, Appointments, CurrentTimeIndicator } from '@devexpress/dx-react-scheduler-material-ui';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import moment from 'moment';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CircularProgress from '@mui/material/CircularProgress';


/*
-AFFICHER LE RENDEZ VOUS D UN CLIENT ET LE METTRE EN EVIDENCE
-PRENDRE UN RENDEZ VOUS QU UNE FOIS PAR SEMAINE
-ADAPETER LE BACKEND APPOINTMENT
-Il faut afficher l'horaire du client
-Utiliser une classe pour mettre dans les tableaux de schedulerData
-Analyser les temps libres, Essayer de combler les trous 
-Coiffeur Sans préférence.. regarder comment faire 
*/

const resources = [{
    fieldName: 'type',
    title: 'Type',
    instances: [
      { id: 'own', text: 'Own', color: '#EC407A' },
      { id: 'all', text: 'All', color: '#6B6B6B' },
    ],
  }];

class Schedule extends React.Component{
  
    constructor(props){
      super(props);
      this.state={
        schedulerData : [],
        listHours : [],
        date : this.props.date,
        hairdresser : this.props.hairdresser,
        startDay : 10,
        endDay : "20:30",
        services :  [],
        service : null,
        error : null,
        showDialogConfirm : false,
        showProgress : false,
        startAppointement : this.props.date,
        endAppointement : null,
        disableRight : ( moment().add(2, 'months').format('L') === moment(this.props.date).format('L')) ? true : false ,
        disableLeft : ( moment().format('L') === moment(this.props.date).format('L')) ? true : false ,
      }
      this.handleTimePicker = this.handleTimePicker.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleCloseDialog = this.handleCloseDialog.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
      this.validationAppointment = this.validationAppointment.bind(this);
      this.addAppointmentBackend = this.addAppointmentBackend.bind(this);
      this.handleJsonReturn = this.handleJsonReturn.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);
      this.handleDataSchedule = this.handleDataSchedule.bind(this);
      this.validationSchedule = this.validationSchedule.bind(this)
    }

    componentDidMount() {
      //POUR LES AUTRES RENDEZ VOUS METTRE Token Pour le connecte Votre rendez-vous
      //OBTENIR LE RENDEZ VOUS DU CLIENT ET LE METTRE EN EVIDENCE
      this.handleDataSchedule();                                   
      fetch("http://localhost:8080/service/all").then((res) => res.json()).then((json) => this.setState({ services : json }) );
    }

    handleDataSchedule(){
      var id = this.state.hairdresser.id;
      var timestamp = this.state.date.valueOf()/1000;
      fetch("http://localhost:8080/appointment/byStartDate/"+timestamp+"/"+id).then((res) => res.json()).then( (json) => this.handleJsonReturn(json) );
    }

    handleJsonReturn(value){
      this.handleCreneau(value)
      value.forEach( (element) =>{
          element.title = "busy";
          element.type='all';
      })
      this.setState({ schedulerData : value })
    }

    //DEPEND DU SERVICE
    //minutes
    handleCreneau(value){
      //exemple couper par 30 minutes 
      console.log(value);
      var unavailable = [];
      var st = moment(this.state.date.locale('en').format('L'));
      st.set({ hour: 10 , minute: 30});
      //console.log(st)
      var en = moment(this.state.date.locale('en').format('L'));
      en.set({ hour: 20 , minute: 0});
      //console.log(en)
      //console.log(this.verificationCreneau(null,null))
      while(st < en){
        //console.log(start.format('HH:mm'))
        //CONDITION LE TEMPO DOIT PAS ETRE DEJA OCCUPE
        var test = moment(st);
        var testEnd = moment(test).add(30, 'minutes');
        //this.verificationCreneau(test, testEnd)
        //console.log(this.verificationCreneau(test, testEnd))
        if(this.verificationCreneau(test, testEnd)){
          unavailable.push(st.format('HH:mm'))
        }
        st.add(30, 'minutes')
        //unavailable.push(st.format('HH:mm'))
      }
      //listHours
      this.setState({listHours : unavailable })
    }

    verificationCreneau(start, end){
      var boulou = true;
      this.state.schedulerData.forEach( e => {
        if(  (moment(e.startDate) < start && start < moment(e.endDate))  || (moment(e.startDate) < end && end < moment(e.endDate)) || (start.format('HH:mm') === moment(e.startDate).format('HH:mm'))  ){
          //console.log(e);
          console.log(start);
          boulou = false;
        }
      })
      return boulou;
    }

    async handleChangeDate(value){
      this.setState({showProgress : true});
      var newDate = moment(this.state.date).add(value, 'days');
      var newDateFormat = newDate.format('L');
      await this.setState({  
          date : newDate,
          service : null,
          error : null,
          showDialogConfirm : false,  
          startAppointement : newDate,
          endAppointement : null,
          disableRight : ( moment().add(2, 'months').format('L') === newDateFormat ) ? true : false ,
          disableLeft : ( moment().format('L') === newDateFormat  ) ? true : false
      });
      this.handleDataSchedule(); 
      this.setState({showProgress : false});
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
        var temps2 = moment(this.state.startAppointement, "hh:mm A").add(this.state.service.duration, 'minutes');//AJOUTER LA DURER DU SERVICE
        this.setState({ startAppointement : moment(this.state.startAppointement) });
        this.setState({
          schedulerData : [...this.state.schedulerData,{startDate: temps ,endDate: temps2 , title:"token", type:'own'}]//type:'all',
        });
        //AJOUTER DANS LE BACKEND
        this.addAppointmentBackend(temps,temps2);
      }      
    }

    async addAppointmentBackend(start, end){
        var titre = this.state.service.name;
        var json =  JSON.stringify({ title : titre , startDate : start, endDate : end, hairdresser_id : this.state.hairdresser});
        //console.log(json);
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: json
        };
        const response = await fetch( 'http://localhost:8080/appointment/add',requestOptions);
        const data = await response.text();
        //console.log('data add backend : '+data)
        //AFFICHER LA REPONSE
    }

    validationAppointment(){
      var valid = true;
      if(this.state.service != null ){
        var endingApp = moment(this.state.startAppointement, "hh:mm A").add(this.state.service.duration, 'minutes');
        //console.log("VALIDATION SCHEDULE",this.validationSchedule());
        if(this.validationSchedule()){
          this.state.schedulerData.forEach(element => {
            var tmpStart = moment(element.startDate)
            var tmpEnd = moment(element.endDate)
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
        }
      }else{
        valid = false;
        this.setState({error : "You have to choose a service to confirm the appointment."});
      }
      return valid;
    }

    validationSchedule(){
      var valid = true;
      //console.log("START APPOINTMENT", this.state.startAppointement)
      if(moment().format('L') === moment(this.state.startAppointement).format('L')){
        if(moment(this.state.startAppointement) <= moment()){
          valid = false;
          this.setState({error : "You cannot make an appointment in the past"});
        }
      }else{
        if( this.state.startAppointement.hour() <= this.state.startDay){
          valid = false;
          this.setState({error : "You cannot make an appointment when we do not work"});
        }
      }
      if(  (this.state.endDay  <=  this.state.startAppointement.hour()) || (this.state.startAppointement.hour() == this.state.endDay-1 && this.state.startAppointement.minute()>30 ) ){
          valid = false;
          this.setState({error : "You cannot make an appointment when we are gonna finish the job day"}); 
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
                  <IconButton size="large" onClick={() => this.handleChangeDate(-1) } disabled={this.state.disableLeft} >
                    <ArrowCircleLeftIcon/>
                  </IconButton>
                </td>
                <td>
                  <Box>
                    <p>To make an appointment, complete the followings input:</p>
                    <Autocomplete
                      id="service"
                      options={this.state.services}
                      getOptionLabel={(option) => option.name}
                      onChange={(event,newValue) => { this.handleServiceChoosen(newValue); }}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                    />
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <TimePicker
                        onChange={(newValue) => { this.handleTimePicker(newValue); }}
                        renderInput={(params) => <TextField style={{ width: 300 }} {...params} />}
                      />
                    </LocalizationProvider>
                    <Autocomplete
                      id="creneaux"
                      options={this.state.listHours}
                      //getOptionLabel={(option) => option.name}
                      onChange={(event,newValue) => { console.log(newValue); }}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Choose the hour" variant="outlined" />}
                    />
                  </Box>
                </td>
                <td>
                  <Paper elevation={5}>
                    <Box sx={{ width: 400, height: 500, }} >
                    { this.state.showProgress ? <CircularProgress />   :
                      <Scheduler data={this.state.schedulerData} >
                          <ViewState currentDate={this.state.date} />
                          <DayView startDayHour={this.state.startDay} endDayHour={this.state.endDay} cellDuration={15} />
                          <Appointments />
                          <Resources data={resources} />
                          <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true} updateInterval={true} />
                      </Scheduler>
                     }
                    </Box>
                  </Paper>
                </td>
                <td>
                  <IconButton size="large" onClick={() => this.handleChangeDate(1) }   disabled={this.state.disableRight} >
                    <ArrowCircleRightIcon/>
                  </IconButton>
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