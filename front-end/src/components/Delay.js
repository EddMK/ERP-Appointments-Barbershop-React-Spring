import * as React from "react";
import {Dialog,DialogTitle, DialogActions, Grid, DialogContent, DialogContentText, TextField, Autocomplete, Button, InputLabel} from '@mui/material/';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers/';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";
import 'moment/locale/fr';

/*
ENLEVER LE CHOIX DU JOUR
C EST UN RETARD AUJOURD HUI PAR DEMAIN OU HIER
*/

const minutes = [
    { id: 5, name: "5"},
    { id: 10, name: "10"},
    { id: 15, name: "15"},
    { id: 20, name: "20" },
    { id: 25, name: "25"},
    { id: 30, name: "30"},
]

export default class Delay extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            showDialog : true,
            date : moment(this.props.date),
            min : moment(this.props.date).startOf('week'),
            max : moment(this.props.date).endOf('week'),
            delay : null,
        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleDelay = this.handleDelay.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleChangeDate(e){
        this.setState({ date : e });
    }

    handleDelay(e){
        this.setState({ delay : e });
    }

    handleConfirm(){
        var object = {date : this.state.date, delay : this.state.delay}
        this.props.delay(object);
        this.setState({showDialog : false})
        this.props.close()
    }
        

    render(){
		return(
            <Dialog onClose={this.props.close} open={this.state.showDialog} fullWidth maxWidth="sm" >
                <DialogTitle sx={{ textAlign : "center"}} >Delay</DialogTitle>
                <DialogContent>
                    <DialogContentText>A delay must not exceed 30 minutes. Otherwise it will be an absence.</DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <InputLabel htmlFor="component-helper" sx={{mr : 0}}>Choose a date :</InputLabel>
                        </Grid>
                        <Grid item xs={8}>
                                <LocalizationProvider dateAdapter={DateAdapter} >
                                    <DatePicker
                                        value={this.state.date}
                                        minDate={this.state.min}
                                        maxDate={this.state.max}
                                        onChange={(newValue) => {
                                            this.handleChangeDate(newValue)
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel htmlFor="component-helper" sx={{mr : 0}}>Delay :</InputLabel>
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete   onInputChange={(event, newInputValue) => { this.handleDelay(newInputValue)}}  getOptionLabel={option => option.name}  options={minutes} sx={{ width: 150, mr : 0 }} renderInput={(params) => <TextField {...params} label="Minute" />} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ justifyContent : "center"}} >
                    <Button variant="contained"  onClick={() => {this.handleConfirm()}}  >Confirm</Button>
                </DialogActions>
            </Dialog>
        )
    }
}