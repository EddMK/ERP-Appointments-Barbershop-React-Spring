import * as React from "react";
import './Employee.css';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, CurrentTimeIndicator, Toolbar, DateNavigator, Appointments, TodayButton, } from '@devexpress/dx-react-scheduler-material-ui';
import moment from "moment";

//const views = ['week', 'timelineWeek'];

/*
Essayer avec le id d un coiffeur
id = 250 
Sebahat

*/

class Employee extends React.Component{

    //PAS OUBLIER DATA
    constructor(props){
        super(props);
        this.state = {
            data : [],
            currentDate : moment().format()
        };
        this.handleChangeDate = this.handleChangeDate.bind(this)
    }

    componentDidMount() {
        //OBTENIR LE RENDEZ VOUS DU COIFFEUR
        this.handleDataSchedule();                                   
    }

    handleDataSchedule(){
        var idHairdresser = 250;
        var timestamp = this.state.currentDate
        console.log(timestamp)
        fetch("http://localhost:8080/appointment/weekWorks/"+timestamp+"/"+idHairdresser).then((res) => res.json()).then( (json) => this.setState({data : json}) );
    }

    handleChangeDate(value){
        this.setState({
            currentDate : value
        });
    }

    render(){
		return(
            <div className="Employee">
                <h1>Schedule</h1>
                <Scheduler data={this.state.data}  height={500} firstDayOfWeek={1}>
                    <ViewState currentDate={this.state.currentDate} onCurrentDateChange={this.handleChangeDate} />
                    <WeekView startDayHour={9} endDayHour={19} cellDuration={15} />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <Appointments />
                    <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true}  updateInterval={true} />
                </Scheduler>
            </div>
        )
    }
}

export default Employee