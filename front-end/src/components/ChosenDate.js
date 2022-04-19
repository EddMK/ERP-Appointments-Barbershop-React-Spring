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

    constructor(){
		super();
		var today = moment();
		var max = moment().add(2, 'months');
		this.state = { 
			today:  today,
			max : max,
			coiffeur : null,
            date : null,
			barbershops : null,
			hairdressers : null
		};
		this.handleHairdressChange = this.handleHairdressChange.bind(this);
		this.handleBarbershopChange = this.handleBarbershopChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.setHairdresserList = this.setHairdresserList.bind(this);
	}

	componentDidMount() {
		// get all entities - GET
		fetch('http://localhost:8080/barbershop/all')
        .then(response => response.json())
        .then(data => this.setState({barbershops : data}));
	  }

	handleBarbershopChange(value) {
		//alert(value);
		console.log(value.id);
		this.setHairdresserList(value.id);
	}

	setHairdresserList(id){
		console.log("GET THE HAIRDRESSERS FROM ");
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
				<div className="Input">
					<Autocomplete
						disablePortal
						id="barbershop"
						options={this.state.barbershops}
						getOptionLabel={(option) => option.name}
						sx={{ width: 300, marginTop : 2 }}
						onChange={(event,newValue) => {
							this.handleBarbershopChange(newValue);
						}}
						renderInput={(params) => <TextField {...params} label="Choose a barbershop" />}
					/>
					<Autocomplete
						disablePortal
						id="hairdresser"
						options={top100Films}
						sx={{ width: 300 , marginTop : 2 }}
						onChange={(event,newValue) => {
							this.handleHairdressChange(newValue);
						}}
						renderInput={(params) => <TextField {...params} label="Choose a hairdresser" />}
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
				<div className="Button">
					<Button variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
			</div>
		)
    }
}

export default ChosenDate;