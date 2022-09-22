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
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
	  prop !== 'dayoffownPast' && prop !== 'dayoffownFutur' && prop !== 'unavailable',
  })(({ theme, dayoffownPast, dayoffownFutur, unavailable }) => ({
	...(dayoffownPast && {
		background: '#3B9216',
	}),
	...(dayoffownFutur && {
		background: '#7DCEA0',
	}),
	...(unavailable && {
		background: '#943126',
	}),
    "& .Mui-selected": {
        color: '#FFFFFF'
      },
  }));

// CHANGER LE DIALOG A LA PLACE D UN ONGLET PSK CA A RIEN A VOIR AVEC LA SEMAINE C EST GLOBAL
//METTRE A JOUR LE ID HAIRDRESSER ET BARBERSHOP
//les inputs des dates formats => francais pas use en
// DERNIER AGENDA ENLEVER LA COULEUR BLEU DU CLICK
// REGARDER COMMENT FAIRE POUR LE JOUR AUJOURD HUI AVEC LE LENDEMAIN MEME VALIDATION
// ESSAYER DE METTRE EN EVIDENCE LES ERREURS Y EN A BCP 
// QUAND ON COMMENCE UN DAY OFF A 1H DU MAT => ON COMMENCE à 00:00 et termine à 23:59
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
            dayAvailable : 20,
            unavailable : [], 
            btwTwoDates : [], 
            error : true,
            errorLast : false,
            showButton : false,
            alertAvailable : null
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
        this.handleClickAgenda = this.handleClickAgenda.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
    }

    handleLeave(){
        var str  = moment(this.state.dayAgenda).format('L')
        var dayoff = this.state.database.find(e => e.title==='day off' && e.hairdresser_id.id === 250 && moment(e.startDate).format('L') === str)
        this.setState({ database: this.state.database.filter( data => data !== dayoff) , 
            dayoffCount: this.state.dayoffCount.filter( data => data !== str), showButton : false});
        fetch('http://localhost:8080/appointment/delete/'+dayoff.id, { method: 'DELETE' });
    }

    componentDidMount() {
		fetch('http://localhost:8080/appointment/daysoff/'+245+'/'+250)
        .then(response => response.json())
        .then(data => { var unv = new Set(data.filter(e => e.title !=='day off' || e.hairdresser_id.id !== 250).map(e=>moment(e.startDate).format('L'))); 
                        var dof = data.filter(e => e.title ==='day off' && e.hairdresser_id.id === 250).map(e=>moment(e.startDate).format('L'));
                        this.setState({database : data, unavailable : unv, dayoffCount : dof}); });
	}

    handleColorAgenda(date, selectedDates, pickersDayProps){
        //console.log(selectedDates);
        //console.log(pickersDayProps)
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
                        if(moment() < moment(e.startDate)){
                            unavailable = true;
                        }
                    }
                }else{
                    unavailable = true;
                }
            }
        })
        //disableHighlightToday
        //pickersDayProps.selected = false
        //console.log(pickersDayProps.selected)
        return (
		  <CustomPickersDay
			{...pickersDayProps}
			dayoffownPast = {dayoffownPast}
            dayoffownFutur = {dayoffownFutur}
            unavailable = {unavailable}
		  />
		);
    };

    handleClickAgenda(e){
        var selection = moment(e)
        var strSelect = selection.format('L')
        if(selection > moment()){
            this.state.dayoffCount.some(e => e === strSelect) ? this.setState({showButton : true}) : this.setState({showButton : false})
        }else{
            this.setState({showButton : false})
        }
        this.setState({dayAgenda : e})
    }

    handleDateFirst(e){
        console.log(this.state.dayoffCount);
        this.notValidDayoff(e) ? this.setState({error : true}) : this.setState({error : false})
        var start ;
        start = e.set({hour:0,minute:0,second:0,millisecond:0});
        if(!this.state.checked){
            var array = [];
            if(start>this.state.lastDate || moment(start).format('L') === moment(this.state.lastDate).format('L') ){
                this.setState({ lastDate : moment(start).add(1,'day')})
                var lastDate = moment(start).add(1,'day')
                array = this.betweenTwoDates(start, lastDate)
            }else{
                array = this.betweenTwoDates(start, this.state.lastDate)
            }
            array.some(e => this.notValidDayoff(e)) ? this.setState({errorLast : true}) : this.setState({errorLast : false})
            20-this.state.dayoffCount.length-array.length < 0 ? this.setState({alertAvailable : true}) : this.setState({alertAvailable : false})
        }else{
            20-this.state.dayoffCount.length-1 < 0 ? this.setState({alertAvailable : true}) : this.setState({alertAvailable : false})
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
        this.setState({ btwTwoDates : arrayDate})
        return arrayDate
    }

    handleDateLast(e){
        this.setState({lastDate : e})
        var array = [];
        array = this.betweenTwoDates(this.state.from, e)
        array.some(e => this.notValidDayoff(e)) ? this.setState({errorLast : true}) : this.setState({errorLast : false})
        20-this.state.dayoffCount.length-array.length < 0 ? this.setState({alertAvailable : true}) : this.setState({alertAvailable : false})
    }

    handleCloseDialog(){
        this.setState({ showDialog: false })
    }

    handleChangeCheck(e){
        var bool = ! this.state.checked;
        if(this.state.alertAvailable &&  bool ){
            this.setState({alertAvailable : false})
        }
        this.setState({checked : bool, lastDate : this.state.from });
    }

    handleConfirm(){
        if(this.state.checked){
            var start = {};
            start.title = 'day off'; 
            start.startDate = moment(this.state.from).set({hour:0,minute:0,second:0,millisecond:0});
            start.hairdresser_id = {};
            start.hairdresser_id.id = 250;
            this.setState({database: [...this.state.database, start], dayoffCount : [...this.state.dayoffCount, moment(start.startDate).format('L')]  });
        }else{
            this.addArrayFrontend();
        }
        this.addDayOffBackend();
        console.log(this.state.dayoffCount)
    }

    addArrayFrontend(){
        var newArray = []
        var newArrayFormat = []
        this.state.btwTwoDates.forEach(e => {
            var start = {};
            start.title = 'day off'; 
            start.startDate = moment(e);
            start.hairdresser_id = {};
            start.hairdresser_id.id = 250;
            newArray.push(start);
            newArrayFormat.push(moment(e).format('L'))
        })
        this.setState({database: [...this.state.database, ...newArray], 
            dayoffCount : [...this.state.dayoffCount, ...newArrayFormat] });
    }

    async addDayOffBackend(){
        //title = day off
        //start and end depend on day choosen
        //customer ==> null
        //hairdresser ==> id
        var a;
        var b;
        if(this.state.checked){
            a = moment(this.state.from);
            b = moment(a);
            a.set({hour:23,minute:59,second:0,millisecond:0})
        }else{
            b = moment(this.state.from);
            a = moment(this.state.lastDate);
        }
        var json =  JSON.stringify({ title : "day off", startDate : b, endDate : a});
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
                            value={20- this.state.dayoffCount.length}
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
                                disableHighlightToday={true}
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
                        {20-this.state.dayoffCount.length===0 || this.state.alertAvailable ? <InputLabel error>Vous ne pouvez pas dépasser les nombres de jours de congés disponibles</InputLabel> : null}
                        <p>Here you can see your days off (in green) and when you can not take time off (red). In order to remove a day off, you click on the wright day and the button</p>
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <StaticDatePicker 
                                displayStaticWrapperAs="desktop"
                                openTo="day"
                                minDate={moment().startOf('year')}
                                maxDate={moment().endOf('year')}
                                defaultCalendarMonth={null}
                                value={this.state.dayAgenda}
                                onChange={(newValue) => { this.handleClickAgenda(newValue) }}
                                renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => this.handleColorAgenda(day, selectedDate, isInCurrentMonth, dayComponent)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent : "center"}} >
                        <IconButton disabled={this.state.error || this.state.errorLast || 20-this.state.dayoffCount.length===0 || this.state.alertAvailable} color="success"  onClick={() => { this.handleConfirm()}} ><AddIcon /></IconButton>
                        <IconButton color="error" disabled={!this.state.showButton} onClick={() => {this.handleLeave()}} ><DeleteForeverIcon /></IconButton>
                    </DialogActions>
                </Dialog>
        )
    }
}