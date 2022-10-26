import React, { PureComponent } from 'react';
import {Container, Autocomplete , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";


export default class Invoice extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            date : moment(),
            name : "",
            price : "",
            barbershops : [],
            type : null,
            barber : null,
            showComponent : true
        };
        this.handleName = this.handleName.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    componentDidMount() {
        var user = AuthService.getCurrentUser();
        if(user !== null){
          if(! user.role.includes("ADMIN")){
            this.setState({ showComponent : false });
          }else{
            fetch('http://localhost:8080/barbershop/all').then(response => response.json()).then(data => this.setState({barbershops : data}));
          }
        }else{
          this.setState({ showComponent : false });
        }
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
        
        var json =  JSON.stringify({ name : this.state.name,  date : this.state.date,  price : this.state.price,
                                    type : this.state.type, barbershop : this.state.barber.id});
        const requestOptions = {
          method: 'POST',
          headers: {  'Accept': 'application/json', 'Content-Type': 'application/json'  },
          body: json
        };
        console.log(requestOptions);
        await fetch( 'http://localhost:8080/admin/addExpense',requestOptions);
        this.setState({price : "", name : "", type:null, barber : null})
        
    }

    render(){
        if(this.state.showComponent === false){
            return <Navigate to='/' />
        }
		return(
            <div className='invoice' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" marginBottom={10}>Expense</Typography>
                <Container sx={{ width:415 }}>
                        <Autocomplete  
                            
                            value={this.state.type} 
                            onChange={(event, newInputValue) => { this.setState({type : newInputValue})     }}    
 
                            options={['Charges', 'Taxes', 'Materiel']} 
                            sx={{ marginBottom: 2 }} 
                            renderInput={(params) => <TextField {...params} 
                            label="Type" />} 
                        />
                            <Autocomplete
                                disablePortal
                                id="barbershop"
                                value={this.state.barber}
                                options={this.state.barbershops}
                                getOptionLabel={(option) => option.name}
                                onChange={(event,newValue) => { this.setState({barber : newValue});}}
                                renderInput={(params) => <TextField {...params} label="Barbershop" />}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField  
                                label="Name" 
                                variant="outlined" 
                                value = {this.state.name}
                                onChange={this.handleName} 
                                sx={{ width: 415, marginBottom: 2  }} 
                            />
                            <TextField
                                label="Price"
                                InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment>, }}
                                variant="outlined"
                                value = {this.state.price}
                                onChange={this.handlePrice}
                                sx={{ width: 415, marginBottom: 2  }}  
                            />
                            <LocalizationProvider  dateAdapter={DateAdapter}>
                                <DatePicker
                                    label="Date"
                                    value={this.state.date}
                                    onChange={(newValue) => { this.handleDate(newValue)}}
                                    renderInput={(params) => <TextField {...params} sx={{ width: 415 , marginBottom: 2 }}  />}
                                />
                            </LocalizationProvider>        
                        <Button onClick={this.handleConfirm} disabled={this.state.name.trim() === "" || isNaN(this.state.price) || this.state.price === "" || this.state.type === null || this.state.barber === null } variant="contained">Confirm</Button>     
                </Container>                
            </div>
        )
    }


}