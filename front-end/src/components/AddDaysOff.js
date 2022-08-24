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
// VALIDATION QD ON AJOUTE MAIS PAS POUR PLUSIEURS JOURS
// LE NOMBRE DE JOUR DISPO => lien avec le button
// DERNIER AGENDA ENLEVER LA COULEUR BLEU DU CLICK
// DELETE A DAY OFF
// LE DAY OFF DU COLLEGUE ON S EN FOUT QUE CE SOIT PASSE SAL ZEBE ?
//REGARDER COMMENT FAIRE POUR LE JOUR MEME
export default class AddDaysOff extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id : this.props.id, 
            showDialog : this.props.open,
            checked : true,
            from : moment(),
            lastDate : moment().add(1,'day'),
            dayAgenda : moment(),
            database : [],
            dayoffCount : [],
            unavailable : [], 
            btwTwoDates : [], 
            error : true,
            errorLast : false,
        };
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleDateFirst = this.handleDateFirst.bind(this);
        this.handleDateLast = this.handleDateLast.bind(this);
        this.betweenTwoDates = this.betweenTwoDates.bind(this);
        this.addDayOffBackend = this.addDayOffBackend.bind(this);
        this.handleColorAgenda = this.handleColorAgenda.bind(this);
        this.addArrayFrontend =this.addArrayFrontend.bind(this);
        this.notValidDayoff = this.notValidDayoff.bind(this);
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
			dayoffownPast = {dayoffownPast}
            dayoffownFutur = {dayoffownFutur}
            unavailable = {unavailable}
		  />
		);
    };

    handleDateFirst(e){
        this.notValidDayoff(e) ? this.setState({error : true}) : this.setState({error : false})
        var start ;
        start = e.set({hour:0,minute:0,second:0,millisecond:0});
        if(!this.state.checked){
            var array = [];
            if(start>this.state.lastDate || moment(start).format('L') === moment(this.state.lastDate).format('L') ){
                //console.log(" PLUS GRAND QUE LE DERNIER")
                this.setState({ lastDate : moment(start).add(1,'day')})
                var lastDate = moment(start).add(1,'day')
                array = this.betweenTwoDates(start, lastDate)
            }else{
                array = this.betweenTwoDates(start, this.state.lastDate)
            }
            console.log("VALABLE : "+array.some(e => this.notValidDayoff(e)))
            array.some(e => this.notValidDayoff(e)) ? this.setState({errorLast : true}) : this.setState({errorLast : false})
            //false
            //VERIFIER ERROR
            //this.setState({ lastDate : start})
        }
        this.setState({ from : start})
    }

    notValidDayoff(e){
        var stringFormat = moment(e).format('L');
        return this.state.unavailable.has(stringFormat) || this.state.dayoffCount.some(v => v === stringFormat); 
    }
    
    betweenTwoDates(dateStart, dateEnd){
        var str = moment(dateStart);
        var strLast = moment(dateEnd).format('L');
        var str2 = moment(str)
        var arrayDate = [str2]
        while (str.format('L') !== strLast) {
            str.add(1, 'day');
            arrayDate.push(moment(str))
        }
        //console.log(arrayDate);
        this.setState({ btwTwoDates : arrayDate})
        return arrayDate
    }

    handleDateLast(e){
        this.setState({lastDate : e})
        var array = [];
        array = this.betweenTwoDates(this.state.from, e)
        console.log("VALABLE : "+array.some(e => this.notValidDayoff(e)))
        array.some(e => this.notValidDayoff(e)) ? this.setState({errorLast : true}) : this.setState({errorLast : false})
        //this.setState({ btwTwoDates : array})        
    }

    handleCloseDialog(){
        this.setState({ showDialog: false })
    }

    handleChangeCheck(e){
        var bool = ! this.state.checked
        this.setState({checked : bool, lastDate : this.state.from })
    }

    handleConfirm(){
        if(this.state.checked){
            var start = {};
            start.title = 'day off'; 
            start.startDate = moment(this.state.from).set({hour:0,minute:0,second:0,millisecond:0});
            start.hairdresser_id = {};
            start.hairdresser_id.id = 250;
            this.setState({database: [...this.state.database, start]});
        }else{
            console.log("NOT CHECKED");
            this.addArrayFrontend();
        }
        this.addDayOffBackend();
    }

    

    addArrayFrontend(){
        var newArray = []
        this.state.btwTwoDates.forEach(e => {
            var start = {};
            start.title = 'day off'; 
            start.startDate = moment(e);
            start.hairdresser_id = {};
            start.hairdresser_id.id = 250;
            newArray.push(start);
        })
        this.setState({database: [...this.state.database, ...newArray]});
    }

    async addDayOffBackend(){
        //title = day off
        //start and end depend on day choosen
        //customer ==> null
        //hairdresser ==> id
        if(this.state.checked){
            var a = moment(this.state.from);
            var b = moment(a);
            a.set({hour:23,minute:59,second:0,millisecond:0})
        }else{
            var b = moment(this.state.from);
            var a = moment(this.state.lastDate);
        }
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
                        <FormControlLabel  sx={{ pr : 35, mb : 2 }} control={<Checkbox  checked={this.state.checked} onChange={this.handleChangeCheck} />} label="One day" />
                        <LocalizationProvider dateAdapter={DateAdapter} >
                        { this.state.error ?
                            <DatePicker
                                label= {this.state.checked ? "Choose a day" : "From"}
                                value={this.state.from}
                                minDate={moment()}
                                onChange={(newValue) => { this.handleDateFirst(newValue) }}
                                renderInput={ (params) => <TextField {...params}  error helperText="You can't take time off this day."/>} 
                            />
                            :
                            <DatePicker
                                label= {this.state.checked ? "Choose a day" : "From"}
                                value={this.state.from}
                                minDate={moment()}
                                onChange={(newValue) => { this.handleDateFirst(newValue) }}
                                renderInput={ (params) => <TextField {...params}  />} 
                            />
                        }
                        </LocalizationProvider>
                        { ! this.state.checked ? 
                            this.state.errorLast ? 
                                <LocalizationProvider  dateAdapter={DateAdapter}>
                                    <DatePicker
                                        label="To"
                                        value={this.state.lastDate}
                                        minDate={moment(this.state.from).add(1, 'day')}
                                        onChange={(newValue) => { this.handleDateLast(newValue); }}
                                        renderInput={(params) => <TextField {...params} sx={{ml : 5}} error helperText="You can't take time off theses days."/>}
                                    />
                                </LocalizationProvider>
                            :
                            <LocalizationProvider  dateAdapter={DateAdapter}>
                                <DatePicker
                                    label="To"
                                    value={this.state.lastDate}
                                    minDate={moment(this.state.from).add(1, 'day')}
                                    onChange={(newValue) => { this.handleDateLast(newValue); }}
                                    renderInput={(params) => <TextField {...params} sx={{ml : 5}} />}
                                />
                            </LocalizationProvider>
                        :null
                        }
                        <p>Here you can see your days off</p>
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
                        <Button disabled={this.state.error || this.state.errorLast} variant="contained" onClick={() => { this.handleConfirm()}}>Add</Button>
                    </DialogActions>
                </Dialog>
        )
    }

}