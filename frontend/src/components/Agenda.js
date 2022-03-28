import * as React from "react";
import './Agenda.css';
import Schedule from './Schedule'
import moment from 'moment';
import DateAdapter from '@mui/lab/AdapterMoment';
import Button from '@mui/material/Button';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';


const currentDate = '2022-03-21';
const schedulerData = [
  { startDate: '2018-11-01T09:40', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

const top100Films = ['Rachid','Jean'];


class Agenda extends React.Component{
	constructor(){
		super();
		var today = moment();//diminiuer d un jour
		var max = moment().add(2, 'months');
		this.state = { 
			today:  today,
			max : max,
			coiffeur : null,
			showSchedule : false
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
		this.setState({showSchedule : true});
		//alert("clicked !");
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
						onChange={(newValue) => {
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
							value = {null}
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
				{ this.state.showSchedule ? <Schedule/> : null }
			</div>
		)
	}
}

export default Agenda;