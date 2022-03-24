import * as React from "react";
import DateAdapter from '@mui/lab/AdapterMoment';
import Paper from '@mui/material/Paper';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

//const [value, setValue] = React.useState(new Date());
const currentDate = '2022-03-21';
const schedulerData = [
  { startDate: '2018-11-01T09:40', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];


class Agenda extends React.Component{
	render(){
		return(
			<div className="Agenda">
				<h1>Agenda</h1>
				<LocalizationProvider dateAdapter={DateAdapter}>
					<StaticDatePicker
						displayStaticWrapperAs="desktop"
						openTo="day"
						defaultCalendarMonth={null}
						value={null}
						onChange= {new Date()}
						orientation = "portrait"
						renderInput={(params) => <TextField {...params} />}
					/>
					<CalendarPicker />
				</LocalizationProvider>
			</div>
		)
	}
}

export default Agenda;

/*

<Paper  elevation={3}>
				<Scheduler data={schedulerData}>
				<ViewState currentDate={currentDate} />
				<DayView
					startDayHour={10}
					endDayHour={20}
				/>
				<Appointments />
				</Scheduler>
				</Paper>

*/
