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
import AuthService from "../services/AuthService";
import { withRouter } from '../common/with-router';


/*
-PRENDRE UN RENDEZ VOUS QU UNE FOIS PAR SEMAINE?
-Coiffeur Sans préférence.. regarder comment faire 
-POUR LES CONGES D APPOINTMENT RECUPERE A L AVANCE DANS AGENDA
-AFFICHER LES RESERVATIONS QUI ARRIVENT
-ENVOYER UN MAIL
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
        services :  [],
        availability : {},
        date : this.props.date,
        hairdresser : this.props.hairdresser,
        startDay : "8:00",
        endDay : "20:00",
        customerId : null,
        timeChoosen : null,
        service : null,
        error : null,
        showProgress : false,
        disableRight : ( moment().add(2, 'months').format('L') === moment(this.props.date).format('L')) ? true : false ,
        disableLeft : ( moment().locale('en').format('L') === moment(this.props.date).locale('en').format('L')) ? true : false ,
      }
      this.handleCancel = this.handleCancel.bind(this);
      this.handleCloseDialog = this.handleCloseDialog.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
      this.addAppointmentBackend = this.addAppointmentBackend.bind(this);
      this.handleJsonReturn = this.handleJsonReturn.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);
      this.handleDataSchedule = this.handleDataSchedule.bind(this);
      this.handleServiceChoosen = this.handleServiceChoosen.bind(this);
    }

    handleDisabledRightArrow(date){
      if(moment().add(2, 'months').locale('en').format('L') === moment(date).locale('en').format('L')){
        console.log("TRUE;")
        return true;
      }else{
        var bool = false;
        var value = 1;
        var newDate = moment(date).add(value, 'days');
        var day = newDate.locale('en').format('dddd').toLowerCase();
        while(this.state.hairdresser.availability[day]==="day off" ){
          newDate = moment(newDate).add(value, 'days')
          day = newDate.locale('en').format('dddd').toLowerCase()
        }
        moment().startOf('day').add(2, 'months').diff(newDate, 'days')<0 ? bool = true :   bool = false ; 
        return bool;
      }
    }

    handleDisabledLeftArrow(date){
      if( moment().locale('en').format('L') === moment(date).locale('en').format('L')){
        return true;
      }else{
        var bool = false;
        var value = -1;
        var newDate = moment(date).add(value, 'days');
        var day = newDate.locale('en').format('dddd').toLowerCase();
        while(this.state.hairdresser.availability[day]==="day off" ){
          newDate = moment(newDate).add(value, 'days')
          day = newDate.locale('en').format('dddd').toLowerCase()
        }
        newDate.startOf('day').diff(moment().startOf('day'), 'days')<0 ? bool = true :   bool = false ; 
        return bool;
      }
    }

    componentDidMount() {
      //console.log("hairdresser",this.state.hairdresser);
      var user = AuthService.getCurrentUser();
      if(user.role.includes("CUSTOMER")){
        this.setState({customerId : user.id})
        //disable left arrox
        var boolLeft = this.handleDisabledLeftArrow(this.state.date);
        var boolRight = this.handleDisabledRightArrow(this.state.date);
        //this.handleDisabledRightArrow();
        //var boolRight = this.handleDisabledRightArrow(this.state.date);
        this.setState({disableLeft : boolLeft, disableRight : boolRight })
        var day = this.state.date.locale('en').format('dddd').toLowerCase();
        //FAIRE ATTENTION QUAND C EST DAY OFF
        fetch("http://localhost:8080/hairdresser/availibility/"+this.state.hairdresser.id).then((res) => res.json()).then((json) => {this.setState({availability : json , startDay : json[day].split("-")[0].trim(), endDay : json[day].split("-")[1].trim() }) ;});
        this.handleDataSchedule();                                   
        fetch("http://localhost:8080/customer/allServices").then((res) => res.json()).then((json) => this.setState({ services : json }) );
      }//REDIRECT 
    }

    handleDataSchedule(){
      var id = this.state.hairdresser.id;
      var timestamp = this.state.date.valueOf()/1000;
      fetch("http://localhost:8080/customer/byStartDate/"+timestamp+"/"+id).then((res) => res.json()).then( (json) => this.handleJsonReturn(json) );
    }

    handleJsonReturn(value){
      value.forEach( (element) =>{
          if( element.customer_id !== null ){
            if(element.customer_id.id === this.state.customerId ){
              element.title = "your appointment";
              element.type='own';
            }
          }else{
            element.title = "busy";
            element.type='all';
          }
      })
      this.setState({ schedulerData : value })
    }

    handleServiceChoosen(value){
      if(value !== null){
        this.setState({ service : value });
        this.handleCreneau(value.duration);
      }else{
        this.setState({service : value, listHours : [] })
      }
    }

    handleCreneau(duration){
      var startHour = moment(this.state.startDay, 'HH:mm');
      var endHour = moment(this.state.endDay, 'HH:mm');
      var unavailable = [];
      var st = moment(this.state.date.locale('en').format('L'));
      st.set({ hour: startHour.hour() , minute: startHour.minute()});
      var en = moment(this.state.date.locale('en').format('L'));
      en.set({ hour: endHour.hour() , minute: endHour.minute()});
      while(st < en){
        var test = moment(st);
        var testEnd = moment(test).add(duration, 'minutes');
        if(this.verificationCreneau(test, testEnd) && st > moment() && testEnd<en){
          unavailable.push(st.format('HH:mm'))
        }
        st.add(duration, 'minutes')
      }
      this.setState({listHours : unavailable })
    }

    verificationCreneau(start, end){
      var boulou = true;
      this.state.schedulerData.forEach( e => {
        if(  (moment(e.startDate) < start && start < moment(e.endDate))  || (moment(e.startDate) < end && end < moment(e.endDate)) 
          || (start.format('HH:mm') === moment(e.startDate).format('HH:mm'))  ){
          boulou = false;
        }
      })
      return boulou;
    }

    async handleChangeDate(value){
      var newDate = moment(this.state.date).add(value, 'days');
      var day = newDate.locale('en').format('dddd').toLowerCase();
      while(this.state.availability[day]==="day off"){
        newDate = moment(newDate).add(value, 'days')
        day = newDate.locale('en').format('dddd').toLowerCase()
      }
      var boolLeft = this.handleDisabledLeftArrow(newDate);
      var boolRight = this.handleDisabledRightArrow(newDate)
      await this.setState({  
          date : newDate,
          service : null,
          timeChoosen : null,
          error : null,
          showDialogConfirm : false,  
          startDay : this.state.availability[day].split("-")[0].trim(),
          endDay : this.state.availability[day].split("-")[1].trim(), 
          disableRight : boolRight,
          disableLeft : boolLeft
      });
      this.handleDataSchedule(); 
    }

    handleConfirm(){
      var service = this.state.service;
      var time = this.state.timeChoosen;
      var startTime = moment(this.state.date.locale('en').format('L')).set({ hour: parseInt(time.split(":")[0]) , minute: parseInt(time.split(":")[1]) });
      var endTime = moment(startTime).add(service.duration, 'minutes')
      this.setState({ schedulerData : [...this.state.schedulerData,{startDate: startTime ,endDate: endTime , title:"your appointment", type:'own'}]});
      var appt = this.addAppointmentBackend(startTime,endTime); 
      this.props.router.navigate("/list", {state:{appt}});
    }

    async addAppointmentBackend(start, end){
        var titre = this.state.service.name;
        var duree = this.state.service.duration;
        var json =  JSON.stringify({ title : titre , startDate : start, endDate : end,  duration : duree  ,  
           hairdresserId: this.state.hairdresser.id, customerId : this.state.customerId});
        const requestOptions = { method: 'POST',  headers: {  'Accept': 'application/json', 'Content-Type': 'application/json'   }, body: json };
        const response = await fetch( 'http://localhost:8080/customer/add',requestOptions);
        const data = await response.text();
        return data;
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
                      value = {this.state.service}
                      options={this.state.services}
                      getOptionLabel={(option) => option.name}
                      onChange={(event,newValue) => { this.handleServiceChoosen(newValue); }}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Choose the service" variant="outlined" />}
                    />
                    <Autocomplete
                      id="creneaux"
                      options={this.state.listHours}
                      value={this.state.timeChoosen}
                      onChange={(event,newValue) => { this.setState({timeChoosen : newValue});console.log(newValue); }}
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
                <Button variant="contained" color="success" disabled={this.state.timeChoosen ===null  || this.state.service===null}  onClick={() => { this.handleConfirm() ;}} >Confirm</Button>
                <Button variant="contained" color="error"  onClick={() => { this.handleCancel() ;}}  >Cancel</Button>
              </div>
              <Dialog onClose={this.handleCloseDialog}  open={this.state.error != null}><Alert variant="filled" severity="warning">{this.state.error}</Alert></Dialog>
            </div>
        )
    }
}
export default  withRouter(Schedule);