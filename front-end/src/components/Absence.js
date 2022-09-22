import * as React from "react";
import {Dialog,DialogTitle,  Grid, DialogContent, TextField, Autocomplete, Button, InputLabel} from '@mui/material/';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers/';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";
import 'moment/locale/fr';

const hours = [
    { id: 10, name: "10"},
    { id: 11, name: "11"},
    { id: 12, name: "12"},
    { id: 13 , name: "13"},
    { id: 14, name: "14"},
    { id: 15, name: "15"},
    { id: 16, name: "16"},
    { id: 17, name: "17" },
    { id: 18, name: "18"},
    { id: 19, name: "19" },
    { id: 20, name: "20"},
]

const minutes = [
    { id: 10, name: "10"},
    { id: 20, name: "20"},
    { id: 30, name: "30"},
    { id: 40, name: "40" },
    { id: 50, name: "50"},
    { id: 0, name: "00"},
]

/*
-faire attention quand change de minute remettre les heures à null
-ajouter absence toute la journee
*/

export default class Absence extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            showDialog : true,
            availability : {},
            date : moment(this.props.date),
            from : moment(this.props.date),
            to : moment(this.props.date),
            min : moment() > moment(this.props.date).startOf('week') ? moment() : moment(this.props.date).startOf('week') ,
            max : moment(this.props.date).endOf('week'),
            fromHour : "",
            toHour : "",
            fromMinute : "",
            toMinute : "",
            reason : ""
        };
        this.handleFrom = this.handleFrom.bind(this);
        this.handleTo = this.handleTo.bind(this);
        this.handleReason = this.handleReason.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleConfirm(){
        var abs ={
            startDate : this.state.from,
            endDate : this.state.to, 
            title : 'absence',
            reason : this.state.reason
        }
        this.props.absence(abs);
        this.setState({showDialog : false})
        //this.props.close()
    }

    handleReason(e){
        this.setState( {reason : e.target.value })
    }

    handleFrom(e, t){
        //console.log(e)
        if(e !== ""){
            var nbr = parseInt(e)
            if(t === "hour"){
                this.setState({ from : moment(this.state.from).set({h: nbr, second : 0}) , fromHour : e })
            }
            if(t === "minute"){
                this.setState({ from : moment(this.state.from).set({m: nbr, second : 0}) , fromMinute : e })
            }
        }else{
            console.log("VIDE")
        }
        
    }

    handleTo(e, t){
        //console.log(e)
        if(e !== ""){
            var nbr = parseInt(e)
            if(t === "hour"){
                this.setState({ to : moment(this.state.to).set({h: nbr, second : 0}) , toHour : e })
            }
            if(t === "minute"){
                this.setState({ to : moment(this.state.to).set({m: nbr, second : 0}) , toMinute : e })
            }
        }else{
            console.log("VIDE")
        }
        
    }

    handleChangeDate(e){
        var month = e.format('M');
        console.log("mois : "+month);
        var day   = e.format('D');
        var year   = e.format('Y');
        this.setState({ date : e, 
                        from : moment(this.state.from).set({ date : day, month : month-1, year : year }),
                        to : moment(this.state.to).set({ date : day, month : month-1, year : year })   });
    }

    render(){
		return(
            <Dialog onClose={this.props.close} open={this.state.showDialog} fullWidth maxWidth="sm" >
                    <DialogTitle sx={{ textAlign : "center"}} >Absence</DialogTitle>
                    <DialogContent>
                    <LocalizationProvider dateAdapter={DateAdapter} >

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <InputLabel htmlFor="component-helper" sx={{mr : 0}}>Choose a date :</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                    <DatePicker
                                        value={this.state.date}
                                        minDate={this.state.min}
                                        maxDate={this.state.max}
                                        onChange={(newValue) => {
                                            this.handleChangeDate(newValue)
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel  sx={{mr : 0}}>From :</InputLabel>
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete   inputValue={this.state.fromHour} onInputChange={(event, newInputValue) => {this.handleFrom(newInputValue, "hour")}}    getOptionLabel={option => option.name} options={hours.filter(e => e.id !== 20)} sx={{ width: 150, mr : 0 }} renderInput={(params) => <TextField {...params} label="Hour" />} />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete  inputValue={this.state.fromMinute} onInputChange={(event, newInputValue) => { this.handleFrom(newInputValue, "minute")}}  getOptionLabel={option => option.name}  options={minutes} sx={{ width: 150, mr : 0 }} renderInput={(params) => <TextField {...params} label="Minute" />} />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel  sx={{mr : 0}}>To :</InputLabel>
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete   inputValue={this.state.toHour} onInputChange={(event, newInputValue) => { this.handleTo(newInputValue, "hour")}}    getOptionLabel={option => option.name} options={hours.filter(e => this.state.fromMinute === "50" ? e.id > this.state.fromHour :  e.id >= this.state.fromHour)} sx={{ width: 150, mr : 0 }} renderInput={(params) => <TextField {...params} label="Hour" />} />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete  inputValue={this.state.toMinute} onInputChange={(event, newInputValue) => { this.handleTo(newInputValue, "minute")}}  getOptionLabel={option => option.name}  options={minutes.filter(e => this.state.toHour === "20" ? e.id === 0 : this.state.toHour === this.state.fromHour ?   e.id > parseInt(this.state.fromMinute) : e.id !== -1 )} sx={{ width: 150, mr : 0 }} renderInput={(params) => <TextField {...params} label="Minute" />} />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel  sx={{mr : 0}}>Reason :</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField  label="Write here ..." variant="outlined" multiline rows={4} onChange={this.handleReason} />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={this.handleConfirm} disabled={this.state.fromHour === "" || this.state.toHour === "" ||  this.state.fromMinute === "" ||  this.state.toMinute === "" || this.state.reason === ""} variant="contained">Confirm</Button>
                            </Grid>
                        </Grid>
                        </LocalizationProvider>

                    </DialogContent>
            </Dialog>
        )
    }
}