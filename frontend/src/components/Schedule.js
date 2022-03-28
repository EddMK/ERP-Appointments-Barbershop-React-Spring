import * as React from "react";
import './Schedule.css';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2022-03-21';
const schedulerData = [
  { startDate: '2022-03-21T10:20', endDate: '2022-03-21T11:00', title: 'Meeting' },
  { startDate: '2022-03-21T12:00', endDate: '2022-03-21T13:30', title: 'Go to a gym' },
];
const Appointment = ({
    children, style, isShaded, ...restProps
  }) => (
    <Appointments.Appointment
      {...restProps}
      
      style={{
        ...style,
        backgroundColor: '#B0F2B6',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );

class Schedule extends React.Component{
    render(){
        return(
            <div className="Schedule">
                <h1>Schedule</h1>
                <Scheduler data={schedulerData} >
                    <ViewState currentDate={currentDate} />
                    <DayView
                        startDayHour={10}
                        endDayHour={20}
                    />
                    <Appointments
                        appointmentComponent={Appointment}
                    />
				</Scheduler>
            </div>
        )
    }
}

export default Schedule;