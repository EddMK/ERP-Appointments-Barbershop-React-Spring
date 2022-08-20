import * as React from "react";
import './ChosenDate.css';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import Button from '@mui/material/Button';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import PickersDay, {
	PickersDayProps,
	pickersDayClasses
  } from "@mui/lab/PickersDay";


const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
	  prop !== 'free' && prop !== 'halfFilled' && prop !== 'full',
  })(({ theme, free, halfFilled, full }) => ({
	...(free && {
		background: '#6CB590',
	}),
	...(halfFilled && {
		background: '#B59B6C',
	}),
	...(full && {
		background: '#B5746C',
	}),
  }));

class ChosenDate extends React.Component{

    constructor(){
		super();
		var today = moment();
		var max = moment().add(2, 'months');
		this.state = { 
			today:  today,
			max : max,
			localisation : null,
			employee : null,
            date : null,
			barbershops : [],
			hairdressers : [],//ATTENTION NE PAS OUBLIER LE PAS DE PREFERENCE,
			showDialogConfirm : false
		};
		this.handleHairdressChange = this.handleHairdressChange.bind(this);
		this.handleBarbershopChange = this.handleBarbershopChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleCloseDialog = this.handleCloseDialog.bind(this);
		this.setHairdresserList = this.setHairdresserList.bind(this);
		this.renderWeekPickerDay = this.renderWeekPickerDay.bind(this)
	}

	componentDidMount() {
		// get all entities - GET
		fetch('http://localhost:8080/barbershop/all')
        .then(response => response.json())
        .then(data => this.setState({barbershops : data}));
	}

	handleBarbershopChange(value) {
		//alert(value);
		this.setState({localisation : value});
		//console.log(value.id);
		this.setHairdresserList(value.id);
	}

	setHairdresserList(id){
		//console.log("GET THE HAIRDRESSERS FROM ");
		fetch('http://localhost:8080/user/hairdressByBarbershop/'+id)
        .then(response => response.json())
        .then(data => this.setState({hairdressers : data}));
	}

    handleHairdressChange(value) {
		this.setState({ employee: value });
		//console.log("coiffeur : ",value);
	}

	handleDateChange(value) {
		this.setState({ date: value });
	}

	handleCloseDialog(){
		this.setState({showDialogConfirm : false});
	}

	handleClick() {
		if(this.state.localisation != null &&  this.state.date != null && this.state.employee != null){
			this.props.click(this.state.date, this.state.employee);
		}else{
			this.setState({showDialogConfirm : true});
		}
	}

	// IL MANQUE L APPEL AU BACKEND
	// TENIR COMPTE DU MOIS, DU COIFFEUR, 
	renderWeekPickerDay(date, selectedDates, pickersDayProps){
		/*
		cette méthode fait les tours des dates du mois
		pour chaque jour tester si c est rempli ou pas
		*/
		var test = moment().add(1, 'days');
		//moment().format('L');
		var test2 = moment().add(2, 'days');
		var free;//les booleans
		var halfFilled;
		var full;
		if(date.format('L') === test.format('L')){
			free = true;
		}else{
			full = true;
		}
		return (
		  <CustomPickersDay
			{...pickersDayProps}
			//disableMargin
			free = {free}
			halfFilled = {null}
			full = {full}
		  />
		);
		
	  };


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
						options={this.state.hairdressers}
						getOptionLabel={(option) => option.lastName+" "+option.firstName}
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
							onChange={(newValue) => { this.handleDateChange(newValue); }}
							orientation = "portrait"
							renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => this.renderWeekPickerDay(day, selectedDate, isInCurrentMonth, dayComponent)}
							renderInput={(params) => <TextField {...params}  />}
						/>
				</LocalizationProvider>
				<div className="Button">
					<Button variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
				<Dialog onClose={this.handleCloseDialog} open={this.state.showDialogConfirm}><Alert variant="filled" severity="warning">You have to complete the inputs and choose a date to continue</Alert></Dialog> 
			</div>
		)
    }
}
/*
renderDay={this.renderDay}
renderInput={(params) => <TextField {...params} />}

*/

export default ChosenDate;