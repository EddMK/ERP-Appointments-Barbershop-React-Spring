import * as React from "react";
import './Employee.css';
import AddDaysOff from './AddDaysOff';
import Absence from './Absence';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, Resources, AppointmentTooltip,WeekView, CurrentTimeIndicator, Toolbar, DateNavigator, Appointments, TodayButton, } from '@devexpress/dx-react-scheduler-material-ui';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import moment from "moment";



/*
Essayer avec le id d un coiffeur
id = 250 
Sebahat
*/

const resources = [{
    fieldName: 'type',
    title: 'Type',
    instances: [
      { id: 'present', text: 'Present', color: '#40EC46' },
      { id: 'absent', text: 'Absent', color: '#EC4040' },
      { id: 'dayOff', text: 'DayOff', color: '#ff8000' },
    ],
  }];


class Employee extends React.Component{

    //PAS OUBLIER DATA
    constructor(props){
        super(props);
        this.state = {
            data : [],
            currentDate : new Date().getTime(),
            showProgress : false,
            showDialog : false,
            showDialogAbsence : false
        };
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleJsonReturn = this.handleJsonReturn.bind(this)
        this.handleErrorButton = this.handleErrorButton.bind(this)
        this.handleSuccesButton = this.handleSuccesButton.bind(this)
        this.handleCloseDialog = this.handleCloseDialog.bind(this)
        this.handleCloseDialogAbsence = this.handleCloseDialogAbsence.bind(this)
        this.handleOpenDialog = this.handleOpenDialog.bind(this)
        this.handleOpenDialogAbsence = this.handleOpenDialogAbsence.bind(this)
        this.handleDataSchedule = this.handleDataSchedule.bind(this)
        this.handleAddAbsence = this.handleAddAbsence.bind(this)
        this.findAppointment = this.findAppointment.bind(this)
        this.dateIsAfter = this.dateIsAfter.bind(this)
    }

    handleContent = (  ({children, buttonError,  appointmentData, ...restProps}
      ) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData} >
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
        </AppointmentTooltip.Content>
      ));

    handleErrorButton(app){
        const newData = this.state.data.slice() //copy the array
        const ind = newData.findIndex(obj => obj.id === app.id);
        newData[ind].type="absent";
        this.setState({data: newData}) //set the new state
    }

    handleSuccesButton(id){
        const newData = this.state.data.slice() //copy the array
        const ind = newData.findIndex(obj => obj.id === id);
        newData[ind].type="present";
        this.setState({data: newData}) //set the new state
    }

    componentDidMount() {
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
            if(element.title !== "day off"){
                element.title = element.customer_id.lastName+" "+element.customer_id.firstName+" - "+element.title;
            }else{
                element.type='dayOff';
            }
            //element.type='all';
        })
        console.log("data",value);
        this.setState({ data : value })
      }

    handleCloseDialog(){
        this.setState({ showDialog: false })
    }

    handleCloseDialogAbsence(){
        console.log("CLOSE");
        this.setState({ showDialogAbsence: false })
    }

    handleOpenDialog(){
        this.setState({ showDialog: true })
    }

    handleOpenDialogAbsence(){
        this.setState({ showDialogAbsence: true })
    }

    async handleChangeDate(value){
        await this.setState({ showProgress : true, currentDate : value });
        this.handleDataSchedule();
        this.setState({ showProgress : false }); 
    }

    handleAddAbsence(e){
        console.log("add absence : ",e);
        e.type='absent'
        this.setState({  data: [...this.state.data, e] })
        //trouver les rdv dans cette période récupere leur id
        var arrayToDelete = this.findAppointment(e.startDate, e.endDate)
        //supprimer
        console.log(arrayToDelete);
        //envoyer des notifications
        //ajouter l absent
        //data
    }

    //utiliser la fonction .diff() pour comparer
    findAppointment(start, end){
        var array = []
        this.state.data.forEach( a =>{
            if( ( this.dateIsAfter(start,moment(a.startDate) ) && this.dateIsAfter(moment(a.startDate), end ) ) ||  (   this.dateIsAfter(start, moment(a.endDate) )  &&   this.dateIsAfter(moment(a.endDate), end) )    ){
                array.push(a)
            }else if (this.dateIsSame(start, moment(a.startDate))){
                array.push(a)
            }else if( this.dateIsAfter(moment(a.startDate), start) && this.dateIsAfter( end, moment(a.endDate))  ){
                array.push(a)
            }
        })
        console.log(array);
        return array;
    }

    dateIsAfter(avant, apres){
        return apres.diff(avant, "seconds") > 0
    }

    dateIsSame(avant, apres){
        return apres.diff(avant, "seconds") === 0
    }

    render(){
		return(
            <div className="Employee">
                <h1>Schedule</h1>
                { this.state.showProgress ? <CircularProgress />   :
                    <Scheduler data={this.state.data}  height={500} firstDayOfWeek={1} error={this.handleErrorButton}>
                        <ViewState currentDate={this.state.currentDate} onCurrentDateChange={this.handleChangeDate} />
                        <WeekView startDayHour={9} endDayHour={19} cellDuration={15} />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments/>
                        <AppointmentTooltip showCloseButton  contentComponent={this.handleContent} />
                        <Resources data={resources} />
                        <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true}  updateInterval={true} />
                    </Scheduler>
                }
                <Button variant="contained" onClick={this.handleOpenDialog} >Add day(s) off</Button>
                <Button variant="contained" onClick={this.handleOpenDialogAbsence} >Absence this week</Button>
                {this.state.showDialog ? <AddDaysOff  open={true}  close={this.handleCloseDialog} id={250} /> : null }
                {this.state.showDialogAbsence ? <Absence open={true} date={this.state.currentDate} absence={this.handleAddAbsence}  close={this.handleCloseDialogAbsence} id={250} /> : null }
            </div>
        )
    }
}

export default Employee