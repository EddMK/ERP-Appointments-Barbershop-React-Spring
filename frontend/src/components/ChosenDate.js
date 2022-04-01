import * as React from "react";
import './ChosenDate.css';
import moment from 'moment';
import DateAdapter from '@mui/lab/AdapterMoment';
import Button from '@mui/material/Button';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import Autocomplete from '@mui/material/Autocomplete';

const top100Films = ['Pas de préfèrence','The Godfather','Pirates des Caraibes' ,'Pulp Fiction', 'Harry Potter'];
class ChosenDate extends React.Component{

    constructor(props){
		super();
		var today = moment();
		var max = moment().add(2, 'months');
		this.state = { 
			today:  today,
			max : max,
			coiffeur : null,
            date : null
		};
		this.handleHairdressChange = this.handleHairdressChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

    handleHairdressChange(value) {
		//alert(value);
		this.setState({ coiffeur: value });
	}

	handleDateChange(value) {
		//alert(value );
		this.setState({ date: value });
	}

	handleClick() {
		if(this.state.coiffeur != null &&  this.state.date != null){
			this.props.click(this.state.date, this.state.coiffeur);
		}
	}


    render(){
		return(
			<div className="Agenda">
				<h1>Make an appointment</h1>
				<div className="Coiffeur">
				<Autocomplete
					disablePortal
					id="combo-box-demo"
					options={top100Films}
					sx={{ width: 300 }}
					onChange={(event,newValue) => {
						this.handleHairdressChange(newValue);
					}}
					renderInput={(params) => <TextField {...params} label="Movie" />}
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
			</div>
		)
    }
}

export default ChosenDate;