import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];



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
                <Typography variant="h4" align="center" marginBottom={10}>Invoice</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4} >
                        <Typography variant="h5" align="center" marginBottom={2}>Form</Typography>
                        <Autocomplete  
                            inputValue={this.state.type} 
                            onInputChange={(event, newInputValue) => { this.setState({type : newInputValue})  }}  
                             
                            options={['Charges', 'Taxes', 'Matériaux']} 
                            sx={{ marginBottom: 2 }} 
                            renderInput={(params) => <TextField {...params} 
                            label="Type" />} 
                        />
                            <Autocomplete
                                disablePortal
                                id="barbershop"
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
                        <Button onClick={this.handleConfirm} disabled={this.state.name === "" || this.state.price === "" || this.state.type === "" || this.state.barber === null } variant="contained">Confirm</Button>     
                    </Grid> 
                    <Grid item xs={8} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Dessert (100g serving)</TableCell>
                                    <TableCell align="right">Calories</TableCell>
                                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>                
                
                

            </div>
        )
    }


}