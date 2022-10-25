import * as React from "react";
import './Employee.css';
import Absence from './Absence';
import Delay from './Delay';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, Resources, AppointmentTooltip,WeekView, CurrentTimeIndicator, Toolbar, DateNavigator, Appointments, TodayButton, } from '@devexpress/dx-react-scheduler-material-ui';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ClearIcon from '@mui/icons-material/Clear';
import {Dialog,Alert, DialogContent, Grid, Button, IconButton} from '@mui/material/';
import { styled, alpha } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import AuthService from "../services/AuthService";
import moment from "moment";
import { Navigate } from "react-router-dom";




/*
Essayer avec le id d un coiffeur
id = 250 
Sebahat
un moyen d afficher la raison de l'absence dans la notification
*/

const PREFIX = 'Demo';

const classes = {
  todayCell: `${PREFIX}-todayCell`,
  weekendCell: `${PREFIX}-weekendCell`,
  today: `${PREFIX}-today`,
  weekend: `${PREFIX}-weekend`,
};

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
  [`&.${classes.todayCell}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  },
  [`&.${classes.weekendCell}`]: {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    },
  },
}));

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
  [`&.${classes.today}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.16),
  },
  [`&.${classes.weekend}`]: {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
  },
}));

const resources = [{
    fieldName: 'type',
    title: 'Type',
    instances: [
      { id: 'present', text: 'Present', color: '#40EC46' },
      { id: 'absent', text: 'Absent', color: '#EC4040' },
      { id: 'dayOff', text: 'DayOff', color: '#ff8000' },
    ],
  }];
/*
Pas fait de validaiton pour les retards , tenir compte des absence 
*/

class Employee extends React.Component{

    //PAS OUBLIER DATA
    constructor(props){
        super(props);
        this.state = {
            hairdresserId : 0,
            data : [],
            availability : {},
            currentDate : new Date().getTime(),
            show : true,
            showProgress : false,
            showDialog : false,
            showDialogAbsence : false,
            showDialogDelay : false,
            showDialogValidationAbsence : false
        };
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleJsonReturn = this.handleJsonReturn.bind(this)
        this.handleErrorButton = this.handleErrorButton.bind(this)
        this.handleSuccesButton = this.handleSuccesButton.bind(this)
        this.handleCloseDialog = this.handleCloseDialog.bind(this)
        this.handleCloseDialogAbsence = this.handleCloseDialogAbsence.bind(this)
        this.handleCloseDialogDelay = this.handleCloseDialogDelay.bind(this)
        this.handleOpenDialog = this.handleOpenDialog.bind(this)
        this.handleOpenDialogAbsence = this.handleOpenDialogAbsence.bind(this)
        this.handleDataSchedule = this.handleDataSchedule.bind(this)
        this.handleAddAbsence = this.handleAddAbsence.bind(this)
        this.handleDelay = this.handleDelay.bind(this);
        this.handleCloseDialogValidation = this.handleCloseDialogValidation.bind(this)
        this.findAppointment = this.findAppointment.bind(this)
        this.dateIsAfter = this.dateIsAfter.bind(this)
        this.handleOpenDialogDelay = this.handleOpenDialogDelay.bind(this)
        this.timeTableCell = this.timeTableCell.bind(this);
        this.dayScaleCell = this.dayScaleCell.bind(this);
        this.handleContent = this.handleContent.bind(this);
    }

    handleContent = (  ({children, buttonError,  appointmentData, ...restProps}
      ) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData} >
            {moment(appointmentData.startDate) < moment() && moment().format('L') === moment(appointmentData.startDate).format('L') ? 
                <Grid container alignItems="center">
                    <Grid sx={{ m: 2 }}>
                        <QuestionMarkIcon />
                    </Grid>
                    <Grid item xs={10}>
                        <p>Did the customer come ?
                            <IconButton color="error" onClick={() => this.handleErrorButton(appointmentData.id)}  >
                                <ClearIcon />
                            </IconButton>
                        </p>
                    </Grid>
                </Grid>
            : null }
        </AppointmentTooltip.Content>
      ));

    handleErrorButton(id){
        //SUPPRIMER A LA PLACE DE LE METTRE EN COULEUR
        var newData = this.state.data.slice() 
        const ind = newData.findIndex(obj => obj.id === id);
        newData[ind].type="absent";
        console.log(newData[ind].customer_id.absence)
        if(newData[ind].customer_id.absence === 2){
            var idDelete = newData[ind].customer_id.id
            newData = newData.filter(d =>  !(d.customer_id.id === idDelete && moment(d.startDate)>moment())   )//!(d.customer_id.id === idDelete && moment(d.customer_id.startDate)>moment())
        }
        this.setState({data: newData}) 
        fetch('http://localhost:8080/hairdresser/absencecustomer/'+id, { method: 'DELETE' }).then(() => console.log("success"));
    }

    // PAS UTILISER
    handleSuccesButton(id){
        console.log(id);
        const newData = this.state.data.slice() //copy the array
        const ind = newData.findIndex(obj => obj.id === id);
        newData[ind].type="present";
        this.setState({data: newData}) //set the new state
    }

    componentDidMount() {
        var user = AuthService.getCurrentUser();
		if(user !== null){
			if(user.role.includes("EMPLOYEE")){
                this.setState({ hairdresserId : user.id})
                fetch('http://localhost:8080/hairdresser/availibility/'+user.id).then(response => response.json()).then(data => this.setState({availability : data}) );
                this.handleDataSchedule(user.id);                                
			}else{
                this.setState({ show : false });
            }
		}else{
			this.setState({ show : false });
		}
    }

    handleDataSchedule(idHairdresser){
        var timestamp = this.state.currentDate;
        var date = new Date(timestamp); 
        var long = date.getTime();
        fetch("http://localhost:8080/hairdresser/weekWorks/"+long+"/"+idHairdresser).then((res) => res.json()).then( (json) => this.handleJsonReturn(json) );
    }

    handleJsonReturn(value){
        value.forEach( (element) =>{
            //console.log(element);
            if(element.title === "day off"){
                element.type='dayOff';
            }else if(element.title === "absence"){
                element.type='absent';
            }else{
                element.title = element.customer_id.lastName+" "+element.customer_id.firstName+" - "+element.title;
            }
            //element.type='all';
        })
        //console.log("data",value);
        this.setState({ data : value })
      }

    handleCloseDialog(){
        this.setState({ showDialog: false })
    }

    handleCloseDialogAbsence(){
        console.log("CLOSE");
        this.setState({ showDialogAbsence: false })
    }

    handleCloseDialogDelay(){
        this.setState({ showDialogDelay: false })
    }

    handleCloseDialogValidation(){
        this.setState({ showDialogValidationAbsence: false })
    }

    handleOpenDialog(){
        this.setState({ showDialog: true })
    }

    handleOpenDialogAbsence(){
        this.setState({ showDialogAbsence: true })
    }

    handleOpenDialogDelay(){
        this.setState({ showDialogDelay: true })
    }
    // ATTENTION LA METHODE ENVOYER LE ID DU COIFFEUR
    async handleChangeDate(value){
        await this.setState({ showProgress : true, currentDate : value });
        this.handleDataSchedule(this.state.hairdresserId);
        this.setState({ showProgress : false }); 
    }

    handleAddAbsence(e){
        e.type='absent'
        e.hairdresserId = this.state.hairdresserId
        var arrayToDelete = this.findAppointment(e.startDate, e.endDate)
        if(arrayToDelete.some(a => a.title === 'day off' ||  a.title === 'absence')){
            this.setState({showDialogValidationAbsence : true})
        }else{
            var data = this.state.data.filter(d => ! arrayToDelete.some( s => s.id ===d.id)).concat(e);       
            this.setState({ data : data})
            this.deleteAppointmentBackend(arrayToDelete, e)
            this.addAbsenceBackend(e)
        }
    }

    deleteAppointmentBackend(array, absence){
        if(array.length !== 0){
            array.forEach( (e)  =>{
                fetch('http://localhost:8080/hairdresser/delete/'+e.id, { method: 'DELETE'})
                this.addNotificationBackend(e, absence);
            })
        }
    }

    async addNotificationBackend(e, absence){
        console.log("ABSENCE ASYNC", e);
        var json =  JSON.stringify({"sender": this.state.hairdresserId, "receiver": e.customer_id.id, 
        "message": "Your hairdresser will be absent on "+ moment(absence.startDate).format('dddd') +" from "+moment(absence.startDate).format('HH:mm')
        +" to "+moment(absence.endDate).format('HH:mm')+". Cause : "+absence.reason});
        const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: json };
        await fetch( 'http://localhost:8080/hairdresser/notificateAbsence',requestOptions);
    }

    async addAbsenceBackend(e){
        console.log("absence",e);
        e.hairdresser_id = this.state.hairdresserId;
        var json =  JSON.stringify(e);
        const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: json };
        await fetch( 'http://localhost:8080/hairdresser/addAbsence',requestOptions);
    }
    
    handleDelay(e){
        var delay = parseInt(e.delay)
        var arrayBackend = this.findAppointmentDay(e.date, delay)
        arrayBackend.forEach( (element) =>{
            console.log(element);
            this.putDelayAppointment(element, delay);
        })
    }

    putDelayAppointment(appointment,delay){
        const requestOptions = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(appointment)};
        fetch('http://localhost:8080/hairdresser/putDelay/'+delay, requestOptions).then(response => response.text()).then(data => console.log(data));
    }

    findAppointmentDay(date, delayMinute){
        var array = []
        var arrayBackend = []
        var data = this.state.data;
        var absenceOfDay = this.findAbsenceDay(date);
        data.sort(function(a,b){ return moment(a) - moment(b);  });
        data.forEach( (element, index)  =>{
            if(moment(element.startDate).format('L') === date.format('L')){
                if(moment(absenceOfDay).isValid() && moment(absenceOfDay)<moment(element.startDate)){
                    array.push(element)
                }else{
                    var deleteAppoitment = false;
                    var next = data[index+1];
                    if(next !== undefined){
                        if(next.title === "absence"){
                            if(  moment(element.endDate).add(delayMinute, 'minutes') > moment(next.startDate) ){
                                deleteAppoitment = true;
                                fetch('http://localhost:8080/hairdresser/delete/'+element.id, { method: 'DELETE'})
                                this.addNotificationBackend(element, next);
                            }
                        }
                    }
                    if(deleteAppoitment === false){
                        if(element.title !== "absence"){
                            var nv = element;
                            nv.startDate = moment(nv.startDate).add(delayMinute, 'minutes');
                            nv.endDate = moment(nv.endDate).add(delayMinute, 'minutes');
                            array.push(nv)
                            arrayBackend.push(nv)
                        }else{
                            array.push(element)
                        }
                    }
                }
            }else{
                array.push(element)
            }
        })
        this.setState({ data : array})
        return arrayBackend
    }

    findAbsenceDay(date){
        var absence = null;
        this.state.data.forEach( (element)  =>{
            if(moment(element.startDate).format('L') === date.format('L')){
                if(element.title==="absence"){
                    absence = element.startDate;
                }
            }
        })
        return absence;
    }

    //utiliser la fonction .diff() pour comparer
    findAppointment(start, end){
        var array = []
        this.state.data.forEach( a =>{
            if( ( this.dateIsAfter(start,moment(a.startDate) ) && this.dateIsAfter(moment(a.startDate), end ) ) 
            ||  (   this.dateIsAfter(start, moment(a.endDate) )  &&   this.dateIsAfter(moment(a.endDate), end) )    ){
                array.push(a)
            }else if (this.dateIsSame(start, moment(a.startDate))){
                array.push(a)
            }else if( this.dateIsAfter(moment(a.startDate), start) && this.dateIsAfter( end, moment(a.endDate))  ){
                array.push(a)
            }else if( this.dateIsAfter(moment(a.startDate), start) && this.dateIsSame( end, moment(a.endDate))  ){
                array.push(a)
            }
        })
        return array;
    }

    dateIsAfter(avant, apres){
        return apres.diff(avant, "seconds") > 0
    }

    dateIsSame(avant, apres){
        return apres.diff(avant, "seconds") === 0
    }

    dayScaleCell(props){
        const { startDate, today } = props;
        var dayoff;
        const dateStr = moment(props.startDate).locale("en").format('dddd').toLowerCase();//email.toLowerCase();
        var minAndMax = this.state.availability[dateStr];
        minAndMax === "day off" ? dayoff = true : dayoff = false
      
        if (today) {
          return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
        } if (dayoff) {
          return <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />;
        } return <StyledWeekViewDayScaleCell {...props} />;
    };

    timeTableCell(props){
        var unavailable;
        const { startDate } = props;
        var start_date = moment(props.startDate, 'HH:mm')
        const dateStr = moment(props.startDate).locale("en").format('dddd').toLowerCase();//email.toLowerCase();
        var minAndMax = this.state.availability[dateStr];
        if(minAndMax !== "day off"){
            var minimum = moment(minAndMax.split("-")[0],'HH:mm')
            var maximum = moment(minAndMax.split("-")[1],'HH:mm')
            if( (start_date.hours()*60+ start_date.minutes() )< (minimum.hours()*60+ minimum.minutes() )){
                unavailable = true;
            }
            if( (maximum.hours()*60+ maximum.minutes() )   <=  (start_date.hours()*60+ start_date.minutes() ) ){
                unavailable = true;
            }
        }else{
            unavailable = true
        }
        
        /*if (date.getDate() === new Date().getDate()) {
          return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
        }*/ if (unavailable) {
          return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
        } return <StyledWeekViewTimeTableCell {...props} />;
      };

    render(){

        if(this.state.show === false){
            return <Navigate to='/' />
        }

		return(
            <div className="Employee">
                <h1>Schedule</h1>
                { Object.keys(this.state.availability).length === 0  ? <LinearProgress />   :
                    <>
                        <Scheduler data={this.state.data}  height={500} firstDayOfWeek={1} error={this.handleErrorButton}>
                            <ViewState currentDate={this.state.currentDate} onCurrentDateChange={this.handleChangeDate} />
                            <WeekView startDayHour={9} endDayHour={21} cellDuration={15} dayScaleCellComponent={this.dayScaleCell} timeTableCellComponent={this.timeTableCell} />
                            <Toolbar />
                            <DateNavigator />
                            <TodayButton />
                            <Appointments/>
                            <AppointmentTooltip showCloseButton  contentComponent={ this.handleContent} />
                            <Resources data={resources} />
                            <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true}  updateInterval={true} />
                        </Scheduler>
                        <>
                        <Button variant="contained" onClick={this.handleOpenDialogAbsence}>Absence this week</Button>
                        <Button variant="contained" onClick={this.handleOpenDialogDelay}>A delay today</Button>
                        </>
                    </>
                }
                {this.state.showDialogAbsence ? <Absence open={true} date={this.state.currentDate} availability={this.state.availability} absence={this.handleAddAbsence}  close={this.handleCloseDialogAbsence} id={250} /> : null }
                {this.state.showDialogDelay ? <Delay open={true} date={this.state.currentDate} delay={this.handleDelay}   close={this.handleCloseDialogDelay} id={250} /> : null }
                {this.state.showDialogValidationAbsence ?
                    <Dialog open={this.state.showDialogValidationAbsence} onClose={this.handleCloseDialogValidation}  >
                        <DialogContent>
                            <Alert severity="warning">You can not add an absence when there is already one</Alert>
                        </DialogContent>
                    </Dialog>
                :null } 
            </div>
        )
    }
}
export default Employee