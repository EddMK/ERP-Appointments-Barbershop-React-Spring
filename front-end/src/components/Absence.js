import * as React from "react";
import {Dialog,DialogTitle, DialogContent, TextField} from '@mui/material/';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers/';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";
//import frLocale from 'date-fns/locale/fr';
import 'moment/locale/fr'


export default class Absence extends React.Component{

    constructor(props){
        super(props)
        console.log(this.props.date);
        this.state = {
            date : moment(this.props.date),
            min : moment(this.props.date).startOf('week'),
            max : moment(this.props.date).endOf('week'),
        };
    }

    render(){
		return(
            <Dialog onClose={this.props.close} open={true}>
                    <DialogTitle sx={{ textAlign : "center"}} >Absence</DialogTitle>
                    <DialogContent>
                        <LocalizationProvider dateAdapter={DateAdapter} >
                            <DatePicker
                                label="Choose the day"
                                value={this.state.value}
                                minDate={this.state.min}
                                maxDate={this.state.max}
                                onChange={(newValue) => {
                                    this.setState({value : newValue})
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </DialogContent>
            </Dialog>
        )
    }
}