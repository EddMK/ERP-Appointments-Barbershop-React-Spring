import * as React from "react";
import './Employee.css';
import AddDaysOff from './AddDaysOff';
import Absence from './Absence';
import Delay from './Delay';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, Resources, AppointmentTooltip,WeekView, CurrentTimeIndicator, Toolbar, DateNavigator, Appointments, TodayButton, } from '@devexpress/dx-react-scheduler-material-ui';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import {Dialog,Alert, DialogContent, Grid, Button, IconButton, CircularProgress} from '@mui/material/';
import { styled, alpha } from '@mui/material/styles';
import Forward10Icon from '@mui/icons-material/Forward10';
import LinearProgress from '@mui/material/LinearProgress';




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
            hairdresserId : 250,
            data : [],
            availability : {},
            currentDate : new Date().getTime(),
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
        this.handleContentTest = this.handleContentTest.bind(this);
        //console.log(this.state.availability);
    }

    handleContentTest(children, buttonError,  appointmentData, ...restProps){
        console.log(appointmentData)
        console.log(children)
        return (<AppointmentTooltip.Content {...restProps} appointmentData={children.appointmentData} >
                    <Grid container alignItems="center">
                        <p>{children}</p>
                        <Grid sx={{ m: 2 }}>
                            <QuestionMarkIcon />
                        </Grid>
                        <Grid item xs={10}>
                            <p>Did the customer come ?
                                <IconButton color="success" onClick={() => this.handleSuccesButton(appointmentData)} >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => this.handleErrorButton(appointmentData)}  >
                                    <ClearIcon />
                                </IconButton>
                            </p>
                        </Grid>
                    </Grid>
                </AppointmentTooltip.Content>)
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
                    <Grid sx={{ m: 2 }}>
                        <Forward10Icon />
                    </Grid>
                    <Grid item xs={10}>
                        <p>Did the customer come late?
                            <IconButton color="success" onClick={() => this.handleSuccesButton(appointmentData)} >
                                    <CheckIcon />
                            </IconButton>
                        </p>
                    </Grid>
                </Grid>
            : null }
        </AppointmentTooltip.Content>
      ));

    handleErrorButton(id){
        const newData = this.state.data.slice() //copy the array
        const ind = newData.findIndex(obj => obj.id === id);
        newData[ind].type="absent";
        this.setState({data: newData}) //set the new state
        ///absenceCustomer/{appointmentId}
        fetch('http://localhost:8080/appointment/absencecustomer/'+id, { method: 'DELETE' }).then(() => console.log("success"));
    }

    handleSuccesButton(id){
        // PAS UTILISER
        console.log(id);
        const newData = this.state.data.slice() //copy the array
        const ind = newData.findIndex(obj => obj.id === id);
        newData[ind].type="present";
        this.setState({data: newData}) //set the new state
    }

    componentDidMount() {
        fetch('http://localhost:8080/hairdresser/availibility/250').then(response => response.json()).then(data => this.setState({availability : data}) ); //this.setState({availability : data})                                 
        this.handleDataSchedule();
    }

    handleDataSchedule(){
        var idHairdresser = 250;
        var timestamp = this.state.currentDate;
        var date = new Date(timestamp); 
        var long = date.getTime();
        fetch("http://localhost:8080/appointment/weekWorks/"+long+"/"+idHairdresser).then((res) => res.json()).then( (json) => this.handleJsonReturn(json) );
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

    async handleChangeDate(value){
        await this.setState({ showProgress : true, currentDate : value });
        this.handleDataSchedule();
        this.setState({ showProgress : false }); 
    }

    handleAddAbsence(e){
        console.log("add absence : ",e);
        e.type='absent'
        e.hairdresserId = this.state.hairdresserId
        var arrayToDelete = this.findAppointment(e.startDate, e.endDate)
        console.log(arrayToDelete);
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
        //console.log(array);
        if(array.length !== 0){
            array.forEach( (e)  =>{
                fetch('http://localhost:8080/appointment/delete/'+e.id, { method: 'DELETE'})
                this.addNotificationBackend(e, absence);
            })
        }
    }

    async addNotificationBackend(e, absence){
        //METTRE LE ID DU HAIRDRESSER
        var json =  JSON.stringify({"fromid": 250, "toid": 255, "message": "Your hairdresser will be absent on "+ absence.startDate.format('dddd') +" from "+absence.startDate.format('HH:mm')+" to "+absence.endDate.format('HH:mm')+". Cause : "+absence.reason});
        const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: json };
        const response = await fetch( 'http://localhost:8080/notification/add',requestOptions);
        const data = await response.text();
    }

    async addAbsenceBackend(e){
        //METTRE LE ID DU HAIRDRESSER
        var json =  JSON.stringify(e);
        const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: json };
        const response = await fetch( 'http://localhost:8080/appointment/addAbsence',requestOptions);
        const data = await response.text();
    }
    
    handleDelay(e){
        var delay = parseInt(e.delay)
        var arrayBackend = this.findAppointmentDay(e.date, delay)
        this.addDelayBackend(arrayBackend.map((e) => e.id), delay )
    }

    findAppointmentDay(date, delayMinute){
        var array = []
        var arrayBackend = []
        this.state.data.forEach( a =>{
            if(moment(a.startDate).format('L') === date.format('L')){
                var nv = a;
                nv.startDate = moment(nv.startDate).add(delayMinute, 'minutes');
                nv.endDate = moment(nv.endDate).add(delayMinute, 'minutes');
                array.push(nv)
                arrayBackend.push(nv)
            }else{
                array.push(a)
            }
        })
        this.setState({ data : array})
        //array.sort(function(a, b){return(moment(a.startDate)-moment(b.startDate))});
        //adapter avec l absence
        return arrayBackend
    }

    addDelayBackend(array, delay){
        //console.log(array);
        if(array.length !== 0){
            fetch('http://localhost:8080/appointment/delay/'+delay+'/?ids='+array, { method: 'DELETE' });
        }
    }

    //utiliser la fonction .diff() pour comparer
    findAppointment(start, end){
        var array = []
        this.state.data.forEach( a =>{
            //console.log("title : "+a.title);
            if( ( this.dateIsAfter(start,moment(a.startDate) ) && this.dateIsAfter(moment(a.startDate), end ) ) ||  (   this.dateIsAfter(start, moment(a.endDate) )  &&   this.dateIsAfter(moment(a.endDate), end) )    ){
                array.push(a)
            }else if (this.dateIsSame(start, moment(a.startDate))){
                array.push(a)
            }else if( this.dateIsAfter(moment(a.startDate), start) && this.dateIsAfter( end, moment(a.endDate))  ){
                array.push(a)
            }else if( this.dateIsAfter(moment(a.startDate), start) && this.dateIsSame( end, moment(a.endDate))  ){
                array.push(a)
            }
        })
        //console.log("findappointment ",array);
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
        const date = new Date(startDate);

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
                        <Button variant="contained" onClick={this.handleOpenDialog} >Add day(s) off</Button>
                        <Button variant="contained" onClick={this.handleOpenDialogAbsence} >Absence this week</Button>
                        <Button variant="contained" onClick={this.handleOpenDialogDelay}>A delay today</Button>
                    </>
                }
                {this.state.showDialog ? <AddDaysOff  open={true}  close={this.handleCloseDialog} id={250} /> : null }
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