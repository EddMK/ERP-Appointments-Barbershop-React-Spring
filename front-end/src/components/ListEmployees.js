import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';

export default class ListEmployees extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            hairdressers : []
        };

    }

    componentDidMount() {
        fetch("http://localhost:8080/admin/getHairdressers/").then((res) => res.json()).then( (json) =>{ console.log(json);   this.setState({hairdressers : json})  }); 
    }

    render(){
		return(
            <div className="employees" style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center">Employees</Typography>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell align="right">Barbershop</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Phonenumber</TableCell>
                        <TableCell align="right">Seniority</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.hairdressers.map((hairdresser) => (
                        <TableRow key={hairdresser.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                            <TableCell component="th" scope="row"> {hairdresser.lastName} {hairdresser.firstName} </TableCell>
                            <TableCell align="right">{hairdresser.barbershop.name}</TableCell>
                            <TableCell align="right">{hairdresser.email}</TableCell>
                            <TableCell align="right">{hairdresser.phoneNumber}</TableCell>
                            <TableCell align="right">{moment().diff(moment(hairdresser.start), 'month')} month</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
        )}
}