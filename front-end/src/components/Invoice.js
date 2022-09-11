import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
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
            price : "",
            barbershops : [],
            type : "",
            barber : null
        };
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    componentDidMount() {
		fetch('http://localhost:8080/barbershop/all').then(response => response.json()).then(data => this.setState({barbershops : data}));
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
        console.log("type", this.state.type)
        console.log("barber", this.state.barber.id)
        
        var json =  JSON.stringify({ name : this.state.name, 
                                    date : this.state.date, 
                                    price : this.state.price,
                                    type : this.state.type,
                                    barbershop : this.state.barber.id});
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: json
        };
        console.log(requestOptions);
        const response = await fetch( 'http://localhost:8080/admin/addExpense',requestOptions);
        this.setState({price : "", name : "", type:"", barbershop : null})
        
    }

    render(){
		return(
            <div className='invoice' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" style={{ m: 5 }}>Invoice</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Autocomplete  
                            inputValue={this.state.type} 
                            onInputChange={(event, newInputValue) => { this.setState({type : newInputValue})  }}  
                             
                            options={['Charges', 'Taxes', 'Matériaux']} 
                            sx={{ width: 150, mr : 0 }} 
                            renderInput={(params) => <TextField {...params} 
                            label="Type" />} 
                        />

                    </Grid>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                            <Autocomplete
                                disablePortal
                                id="barbershop"
                                options={this.state.barbershops}
                                getOptionLabel={(option) => option.name}
                                sx={{ width: 150}}
                                onChange={(event,newValue) => { this.setState({barber : newValue});}}
                                renderInput={(params) => <TextField {...params} label="Barbershop" />}
                            />
                    </Grid>
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
                        <Button onClick={this.handleConfirm} disabled={this.state.name === "" || this.state.price === "" || this.state.type === "" || this.state.barber === null } variant="contained">Confirm</Button>     
                    </Grid>
                </Grid>                
                
                

            </div>
        )
    }


}