import * as React from "react";
import './Agenda.css';
import moment from 'moment';
import DateAdapter from '@mui/lab/AdapterMoment';
import Button from '@mui/material/Button';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
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

const top100Films = ['The Shawshank Redemption','The Godfather'];


class Agenda extends React.Component{
	constructor(){
		super();
		var today = moment();
		var max = moment().add(2, 'months');
		this.state = { 
			today:  today,
			max : max,
			coiffeur : null
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(value) {
		alert(value );
		//this.setState({ coiffeur: e.target.value });
	}

	handleDateChange(value) {
		alert(value );
		//this.setState({ coiffeur: e.target.value });
	}

	handleClick() {
		alert("clicked !");
		//this.setState({ coiffeur: e.target.value });
	}

	render(){
		return(
			<div className="Agenda">
				<h1>Make an appointment</h1>
				<div className="Coiffeur">
					<Autocomplete
						disablePortal
						id="combo-box-demo"
						onChange={(event, newValue) => {
							this.handleChange(newValue);
						  }}
						defaultValue="pas de preference"
            			value={this.state.coiffeur}
						options={top100Films}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Choisissez un coiffeur" />}
					/>
				</div>
				<LocalizationProvider dateAdapter={DateAdapter}>
						<StaticDatePicker
							displayStaticWrapperAs="desktop"
							openTo="day"
							minDate={this.state.today}
							maxDate = {this.state.max}
							defaultCalendarMonth={null}
							
							onChange={(newValue) => {
								this.handleDateChange(newValue);
							}}
							orientation = "portrait"
							renderInput={(params) => <TextField {...params} />}
						/>
				</LocalizationProvider>
				<div className="Bouton">
					<Button variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
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

/*

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
					</LocalizationProvider>

*/
