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
import PickersDay, { PickersDayProps, pickersDayClasses } from "@mui/lab/PickersDay";


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
			hoursByDay : [],
			barbershops : [],
			hairdressers : [],
			dayoffHairdresser : [],
			showDialogConfirm : false
		};
		this.handleHairdressChange = this.handleHairdressChange.bind(this);
		this.handleBarbershopChange = this.handleBarbershopChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleCloseDialog = this.handleCloseDialog.bind(this);
		this.setHairdresserList = this.setHairdresserList.bind(this);
		this.renderWeekPickerDay = this.renderWeekPickerDay.bind(this);
		this.disableDays = this.disableDays.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8080/barbershop/all').then(response => response.json()).then(data => this.setState({barbershops : data}));
	}

	handleBarbershopChange(value) {
		if(value !== null){
			this.setState({localisation : value});
			this.setHairdresserList(value.id);
		}else{
			this.setState({localisation : null, hairdressers : [], employee : null });
		}
	}

	setHairdresserList(id){
		//console.log("GET THE HAIRDRESSERS FROM ");
		fetch('http://localhost:8080/customer/hairdressByBarbershop/'+id)
        .then(response => response.json())
        .then(data => this.setState({hairdressers : data}));
	}

    handleHairdressChange(value) {
		this.setState({ employee: value });
		console.log("coiffeur : ",value);
		if(value !== null){
			//ON CHECK DANS LA BASE DE DONNEES
			fetch('http://localhost:8080/customer/hours/'+value.id).then(response => response.json()).then(data => this.setState({hoursByDay : data}));//array1.map(x => x * 2);
			fetch('http://localhost:8080/customer/dayoff/'+value.id).then(response => response.json()).then(data => this.setState({dayoffHairdresser : data.map(d => moment(d).locale('en').format('L')) }));//this.setState({dayoffHairdresser : data})
		}
	}

	handleDateChange(value) {
		this.setState({ date: value });
	}

	handleCloseDialog(){
		this.setState({showDialogConfirm : false});
	}

	handleClick() {
		this.props.click(this.state.date, this.state.employee);
	}

	renderWeekPickerDay(date, selectedDates, pickersDayProps){
		var free;
		var halfFilled;
		var full;
		//console.log(date.format('L'));

		var format = date.locale('en').format('L');

		if(this.state.dayoffHairdresser.includes(format) ){
			console.log(format)
		}

		if( ( format === moment().locale('en').format('L')) || (moment() < date)  ){
			//console.log(date);
			if(!this.state.dayoffHairdresser.includes(format)){
				//AVOIR LES HEURES DE TRAVAIL
				if(this.state.employee !== null){
					var heureStr = this.state.employee.availability[date.locale('en').format('dddd').toLowerCase()];
					if( heureStr !== "day off"){
						var duree = moment.duration(moment(heureStr.split("-")[1], "HH:mm").diff(moment(heureStr.split("-")[0], "HH:mm"))).as('minutes');
						//AVOIR LES MINUTES
						if(this.state.hoursByDay.length !== 0){
							var work = this.contains(date)
							if(work === null){
								free = true;
							}else{
								var division = work/duree;
								if(division === 1){
									full= true;
								}else if(division > 0.7){
									halfFilled = true;
								}else{
									free = true;
								}
							}
						}else{
							free = true;
						}
					}else{
						//console.log(format)
						full= true;
					}
				}
			}else{
				full= true;
			}
		}

		return (
			<CustomPickersDay
				{...pickersDayProps}
				//disableMargin
				free = {free}
				halfFilled = {halfFilled}
				full = {full}
			/>
		);
	};

	contains(date){
		var reponse = null;
		this.state.hoursByDay.forEach((row) => {
			if(moment(row[0]).locale('en').format('L') === date.locale('en').format('L')){
				reponse = row[1];
			}
		})
		return reponse;
	}

	disableDays(date){
		if( (date.locale('en').format('L') === moment().locale('en').format('L')) || (moment() < date)  ){
			if(this.state.employee !== null){
				var heureStr = this.state.employee.availability[date.locale('en').format('dddd').toLowerCase()];
				if(heureStr === "day off"){
					return true;
				}else{
					return false;
				}
			}
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
						value = {this.state.localisation}
						options={this.state.barbershops}
						getOptionLabel={(option) => option.name}
						sx={{ width: 300, marginTop : 2 }}
						onChange={(event,newValue) => { this.handleBarbershopChange(newValue); }}
						renderInput={(params) => <TextField {...params} label="Choose a barbershop" />}
					/>
					<Autocomplete
						disablePortal
						id="hairdresser"
						value = {this.state.employee}
						options={this.state.hairdressers}
						getOptionLabel={(option) => option.lastName+" "+option.firstName}
						sx={{ width: 300 , marginTop : 2 }}
						onChange={(event,newValue) => { this.handleHairdressChange(newValue); }}
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
							renderDay={ this.state.employee!==null? this.renderWeekPickerDay : null}
							shouldDisableDate={this.disableDays}
							renderInput={(params) => <TextField {...params}  />}
						/>
				</LocalizationProvider>
				<div className="Button">
					<Button variant="contained" disabled={this.state.localisation == null ||  this.state.date == null || this.state.employee == null} onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
				<Dialog onClose={this.handleCloseDialog} open={this.state.showDialogConfirm}><Alert variant="filled" severity="warning">You have to complete the inputs and choose a date to continue</Alert></Dialog> 
			</div>
		)
    }
}

export default ChosenDate;