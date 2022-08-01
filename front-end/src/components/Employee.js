import * as React from "react";
import './Employee.css';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, CurrentTimeIndicator, Toolbar, DateNavigator, Appointments, TodayButton, } from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = new Date();
const views = ['week', 'timelineWeek'];

/*
Essayer avec le id d un coiffeur

*/

class Employee extends React.Component{

    //PAS OUBLIER DATA
    constructor(props){
        super(props);
        this.state = {
          currentDate: '2018-06-27',
        };
    }

    render(){
		return(
            <div className="Employee">
                <h1>Schedule</h1>
                <Scheduler  height={400}>
                    <ViewState currentDate={currentDate} onCurrentDateChange={this.currentDateChange} />
                    <WeekView startDayHour={9} endDayHour={19} />
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