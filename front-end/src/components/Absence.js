import * as React from "react";
import {Dialog,DialogTitle, DialogContent, TextField} from '@mui/material/';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers/';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";


export default class Absence extends React.Component{

    constructor(props){
        super(props)
        console.log(this.props.date);
        this.state = {
            date : this.props.date,
            value : moment(this.props.date)
        };
    }

    render(){
		return(
            <Dialog onClose={this.props.close} open={true}>
                    <DialogTitle sx={{ textAlign : "center"}} >Absence</DialogTitle>
                    <DialogContent>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                            label="Choose the day"
                            value={this.state.value}
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