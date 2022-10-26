import React, { PureComponent } from 'react';
import {Paper, Table,Autocomplete, FormControlLabel,Checkbox, Button, TableBody, TableCell, TableContainer, TableHead, TableRow,  Grid , Typography, TextField}from '@mui/material/';
import moment from "moment";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";


export default class ListExpense extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            expenses : [], 
            showTable : [], 
            barbershops : [], 
            types : ['Charges', 'Materiel', 'Taxes' ], 
            dateMin : null,
            barberChoosen : null,
            typeChoosen : null,
            monthChoosen : null , 
            checked : true,
            showComponent : true,
        };
        this.handleBarber = this.handleBarber.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        var user = AuthService.getCurrentUser();
        if(user !== null){
          if(! user.role.includes("ADMIN")){
            this.setState({ showComponent : false });
          }else{
            fetch("http://localhost:8080/admin/expenses/").then((res) => res.json()).then( (json) => this.setState({expenses : json, showTable : json}));
            fetch("http://localhost:8080/barbershop/all/").then((res) => res.json()).then( (json) => this.setState({barbershops : json})); 
            fetch("http://localhost:8080/admin/minExpenses/").then((res) => res.json()).then( (json) => this.setState({dateMin : moment(json)})); 
          }
        }else{
          this.setState({ showComponent : false });
        }
            }

    handleDelete(id){
        console.log(id);
        fetch('http://localhost:8080/admin/deleteExpense/'+id, { method: 'DELETE' });
        var array =  this.state.showTable;
        array = array.filter(e => e.id !== id);
        this.setState({showTable : array});
    }

    handleCheckbox(e){
        if(e.target.checked === false){
            this.select(this.state.barberChoosen, this.state.typeChoosen, null);
            this.setState({checked : ! this.state.checked, monthChoosen : null})
        }else{
            this.setState({checked : ! this.state.checked})
        }
    }

    handleBarber(e){
        this.setState({barberChoosen : e})
        this.select(e, this.state.typeChoosen, this.state.monthChoosen);
    }

    handleType(e){
        this.setState({typeChoosen : e})
        this.select(this.state.barberChoosen, e, this.state.monthChoosen);
    }

    handleDate(e){
        this.setState({ monthChoosen : e})
        this.select(this.state.barberChoosen, this.state.typeChoosen, e);
    }

    select(barber, type, month){
        var array = this.state.expenses
        if( type === null){
            array = array.filter( element => element.type !== type )
        }else{
            array = array.filter( element => element.type === type )
        } 
        if(barber === null){
            array = array.filter( element => element.barbershop.id !== -1 )
        }else{
            array = array.filter( element => element.barbershop.id === barber.id )
        }
        if(month === null){
            array = array.filter( element =>  moment(element.date).isValid() )
        }else{
            array = array.filter( element =>  month.startOf('month')<moment(element.date) && moment(element.date)<month.endOf('month') )
        }
        this.setState({ showTable : array })
    }

    render(){
        if(this.state.showComponent === false){
            return <Navigate to='/' />
        }
		return(
            <div className='listExpense' style={{marginLeft: 160 + 'px'}}>
                <Typography marginBottom={3} variant="h4" align="center" gutterBottom>Expenses</Typography>
                <Grid container marginBottom={2} spacing={2}>
                    <Grid item xs={1}>
                        <Typography variant="body1" align="center" gutterBottom>select : </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            disablePortal
                            id="barbershops"
                            value={this.state.barberChoosen} 
                            onChange={(event, newInputValue) => { this.handleBarber(newInputValue)}}    
                            getOptionLabel={option => option.name} 
                            options={this.state.barbershops}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Barbershop" />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            disablePortal
                            id="types"
                            value={this.state.typeChoosen} 
                            onChange={(event, newInputValue) => { this.handleType(newInputValue)}}    
                            options={this.state.types}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Type" />}
                        />
                    </Grid>
                    <Grid item xs={5}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <FormControlLabel
                            control={
                                <Checkbox name="jason" checked={this.state.checked}  onChange={(value) => this.handleCheckbox(value)}  />
                            }
                            label={"By month ?"}
                        />
                        {this.state.checked ? 
                        <DatePicker
                            views={['year', 'month']}
                            label="Year and Month"
                            value={this.state.monthChoosen}
                            minDate = {this.state.dateMin}
                            maxDate = {moment()}
                            onChange={(newValue) => { this.handleDate(newValue) }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                        : null }
                    </LocalizationProvider>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Barbershop</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.showTable.map((expense) => (
                        <TableRow key={expense.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                            <TableCell component="th" scope="row"> {expense.name} </TableCell>
                            <TableCell align="right">{expense.type}</TableCell>
                            <TableCell align="right">{expense.barbershop.name}</TableCell>
                            <TableCell align="right">{moment(expense.date).locale('fr').format('L')}</TableCell>
                            <TableCell align="right">{expense.price}</TableCell>
                            <TableCell align="right"><Button variant="contained"  color="error"  onClick={() => this.handleDelete(expense.id)}><DeleteForeverIcon/></Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
        )
    }
}