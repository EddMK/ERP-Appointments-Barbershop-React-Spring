import * as React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogContentText from '@mui/material/DialogContentText';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
	  prop !== 'dayoffownPast' && prop !== 'dayoffownFutur' && prop !== 'unavailable',
  })(({ theme, dayoffownPast, dayoffownFutur, unavailable }) => ({
	...(dayoffownPast && {
		background: '#196F3D',
	}),
	...(dayoffownFutur && {
		background: '#7DCEA0',
	}),
	...(unavailable && {
		background: '#943126',
	}),
  }));

//METTRE A JOUR LE ID HAIRDRESSER ET BARBERSHOP
//les inputs des dates formats => francais pas use kfr
//recupere de la base de donnees : les congés du coiffeur courant, de l'autre coiffeur
//recuperer les jours de rendez-vous, pas libre pour un rendez-vous
// VALIDATION QD ON AJOUTE
export default class AddDaysOff extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id : this.props.id, 
            showDialog : this.props.open,
            checked : true,
            from : moment(),
            dayAgenda : moment(),
            database : [],
            dayoffCount : [],
            unavailable : []
        };
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleDateFirst = this.handleDateFirst.bind(this);
        this.handleDateLast = this.handleDateLast.bind(this);
        this.addDayOffBackend = this.addDayOffBackend.bind(this);
        this.handleColorAgenda = this.handleColorAgenda.bind(this);
    }

    componentDidMount() {
		// get all entities - GET
		fetch('http://localhost:8080/appointment/daysoff/'+245+'/'+250)
        .then(response => response.json())
        .then(data => { var unv = new Set(data.filter(e => e.title !=='day off' || e.hairdresser_id.id !== 250).map(e=>moment(e.startDate).format('L'))); 
                        var dof = data.filter(e => e.title ==='day off' && e.hairdresser_id.id === 250).map(e=>moment(e.startDate).format('L'));
                        this.setState({database : data, unavailable : unv, dayoffCount : dof}); });
	}


    handleColorAgenda(date, selectedDates, pickersDayProps){
		var dayoffownPast = false;
        var dayoffownFutur = false;
        var unavailable = false;
        //hairdresser_id  => test 250
        //compare avec today
        this.state.database.forEach(e => {  
            if(date.format('L') === moment(e.startDate).format('L')){
                if(e.title ==='day off'){
                    if(e.hairdresser_id.id === 250){
                        if(moment()> moment(e.startDate)){
                            dayoffownPast = true;
                        }else{
                            dayoffownFutur = true;
                        }                    
                    }else{
                        unavailable = true;
                    }
                }else{
                    unavailable = true;
                }
            }
        })
        
        return (
		  <CustomPickersDay
			{...pickersDayProps}
			//disableMargin
			dayoffownPast = {dayoffownPast}
            dayoffownFutur = {dayoffownFutur}
            unavailable = {unavailable}
		  />
		);
    };

    handleDateFirst(e){
        //console.log("change date : ",e.set({hour:0,minute:0,second:0,millisecond:0}));
        var start = {};
        start.startDate = e.set({hour:0,minute:0,second:0,millisecond:0});
        start.hairdresser_id = {};
        start.hairdresser_id.id = 250
        this.setState({ from : start})
        console.log(this.state.database);
    }

    handleDateLast(e){

    }

    handleCloseDialog(){
        this.setState({
            showDialog: false
        })
    }

    handleChangeCheck(e){
        var bool = ! this.state.checked
        this.setState({checked : bool })
    }

    handleConfirm(){
        this.setState({database: [...this.state.database, this.state.from]});
        this.addDayOffBackend()
        console.log(this.state.database);
    }

    async addDayOffBackend(){
        //title = day off
        //start and end depend on day choosen
        //customer ==> null
        //hairdresser ==> id
        var a = moment(this.state.from);
        var b = moment(a);
        a.set({hour:23,minute:59,second:0,millisecond:0})
        var json =  JSON.stringify({ title : "conge", startDate : b, endDate : a});
        console.log(json);
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: json
        };
        const response = await fetch( 'http://localhost:8080/appointment/addDayOff',requestOptions);
        const data = await response.text();
        console.log('data add backend : '+data)
        //AFFICHER LA REPONSE
    }

    render(){
        return(
            <Dialog onClose={this.props.close} open={this.state.showDialog}>
                    <DialogTitle sx={{ textAlign : "center"}} >Days Off</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" sx={{ mb : 2 }}>
                            In order to add day off, the coworker must not be on vacation, pas de rendez-vous dans la journée et avoir des jours disponible
                        </DialogContentText>
                        <TextField
                            id="outlined-read-only-input"
                            label="Number of days available for this year"
                            variant="filled"
                            defaultValue="20 days"
                            InputProps={{ readOnly: true, }}
                            sx={{ width: "100%", mb : 2 }}
                        />
                        <FormControlLabel  sx={{ width: "100%", mb : 2 }} control={<Checkbox  checked={this.state.checked} onChange={this.handleChangeCheck} />} label="One day" />
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <DatePicker
                                label= {this.state.checked ? "Choose a day" : "From"}
                                value={this.state.from}
                                minDate={moment()}
                                onChange={(newValue) => { this.handleDateFirst(newValue) }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        { this.state.checked ? null : 
                            <LocalizationProvider  dateAdapter={DateAdapter}>
                                <DatePicker
                                    label="To"
                                    value={moment()}
                                    minDate={moment()}
                                    onChange={(newValue) => { console.log(newValue); }}
                                    renderInput={(params) => <TextField {...params} sx={{ml : 5}} />}
                                />
                            </LocalizationProvider>
                        }
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                openTo="day"
                                minDate={moment().startOf('year')}
                                maxDate={moment().endOf('year')}
                                defaultCalendarMonth={null}
                                value={this.state.dayAgenda}
                                disableHighlightToday={true}
                                onChange={(newValue) => { this.setState({dayAgenda : newValue}) }}
                                renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => this.handleColorAgenda(day, selectedDate, isInCurrentMonth, dayComponent)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent : "center"}} >
                        <Button variant="contained" onClick={() => { this.handleConfirm()}}>Add</Button>
                    </DialogActions>
                </Dialog>
        )
    }

}
//renderDay={this.handleColorAgenda}
