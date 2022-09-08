import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import './Invoice.css';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';



export default class Invoice extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            date : moment(),
            name : "",
            price : ""
        };
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleName(e){
        this.setState( {name : e.target.value })
    }

    handlePrice(e){
        var string  = e.target.value
        string = string.replace(",", ".")
        console.log('price',parseFloat(string))
        this.setState( {price : string})
    }

    handleDate(e){
        this.setState( {date : e })
    }

    async handleConfirm(){
        console.log("confirm")
        var json =  JSON.stringify({ name : this.state.name, date : this.state.date, price : this.state.price});
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: json
        };
        const response = await fetch( 'http://localhost:8080/expense/add',requestOptions);
        const data = await response.text();
        this.setState({price : "", name : ""})

    }

    render(){
		return(
            <div className='invoice'>
                <Typography variant="h4" align="center" style={{ m: 5 }}>Invoice</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} style={{textAlign: "center"}}>
                        <TextField  
                            label="Name" 
                            variant="outlined" 
                            value = {this.state.name}
                            onChange={this.handleName} 
                        />
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center"}}>
                        <TextField
                            label="Price"
                            InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment>, }}
                            variant="outlined"
                            value = {this.state.price}
                            onChange={this.handlePrice} 
                        />
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center"}}>
                        <LocalizationProvider  dateAdapter={DateAdapter}>
                            <DatePicker
                                label="Date"
                                value={this.state.date}
                                onChange={(newValue) => { this.handleDate(newValue)}}
                                renderInput={(params) => <TextField {...params}  />}
                            />
                        </LocalizationProvider>        
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center"}}>
                    <Button onClick={this.handleConfirm} disabled={this.state.name === "" || this.state.price === "" } variant="contained">Confirm</Button>     
                  </Grid>
                </Grid>                
                
                

            </div>
        )
    }


}