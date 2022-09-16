import React, { PureComponent } from 'react';
import {Paper, Grid , Typography}from '@mui/material/';
import moment from "moment";
import 'moment/locale/fr'
import {Table, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, DialogTitle,  Dialog , DialogActions, DialogContent}from '@mui/material/';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';

//[]
const agenda = [{
    name : 'Coiffure Simonis',
    Monday : '10:00 - 20:00',
    Tuesday : '10:00 - 20:00',
    Wednesday : '10:00 - 20:00',
    Thursday : '10:00 - 20:00',
    Friday : '10:00 - 20:00',
    Saturday : '10:00 - 20:00',
    Sunday : '10:00 - 20:00',
}];

export default class Availability extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            showBarbershopEdit : false,
            value : moment('15:00','h:mm'),
            barbershopChoosen : {},
            tryHours : {
                Monday : '10:00 - 20:00',
                Tuesday : '10:00 - 20:00',
                Wednesday : '10:00 - 20:00',
                Thursday : '10:00 - 20:00',
                Friday : '10:00 - 20:00',
                Saturday : '10:00 - 20:00',
                Sunday : '10:00 - 20:00',
            }
        };
        moment.locale('fr');
        this.handleEditBarbershopSchedule = this.handleEditBarbershopSchedule.bind(this);
        this.handleClose = this.handleClose.bind(this)
        this.handleChangeTime = this.handleChangeTime.bind(this)
        //console.log(moment('22:00','h:mm a').format('h:mm'))
        var string = "8:00 - 20:00";
        console.log(string.substring(0, string.indexOf('-')))
        console.log(string.substring(string.indexOf('-') + 1))
        //var streetaddress = string.substr(0, addy.indexOf(',')); 
        this.handleEdit = this.handleEdit.bind(this);
    }

     componentDidMount() {
         //fetch("http://localhost:8080/admin/evolutionTurnoverExpense/").then((res) => res.json()).then( (json) => this.changeJsonDataEvolution(json));
         //fetch("http://localhost:8080/admin/turnoverToday/").then((res) => res.json()).then( (json) => this.setState({turnover : json})); 
         //fetch("http://localhost:8080/admin/turnoverThisMonth/").then((res) => res.json()).then( (json) => this.setState({turnoverMonth : json}));   
         //fetch("http://localhost:8080/admin/expenseThisMonth/").then((res) => res.json()).then( (json) => this.setState({expenseMonth : json}));   
    }

    handleEditBarbershopSchedule(e){
        //console.log("EDIT");
        //console.log(e);
        this.setState({showBarbershopEdit : true, barbershopChoosen : e})
    }

    handleClose(){
        this.setState({showBarbershopEdit : false})
    }

    handleChangeTime(e, day, part){
        //console.log(this.state.tryHours)
        //console.log(day);
        //console.log(moment.locale('fr'))
        console.log(e.format('HH:mm'));
        //console.log(this.state.tryHours)
        var newTodos = Object.assign({}, this.state.tryHours);
        if(part === "f"){
            newTodos[day] = newTodos[day].replace(newTodos[day].substring(0, newTodos[day].indexOf('-')), moment(e,'HH:mm').format('HH:mm'));
        }else{
            newTodos[day] = newTodos[day].replace( newTodos[day].substring(newTodos[day].indexOf('-') + 1) , moment(e,'HH:mm').format('HH:mm'));
        }
        this.setState({ tryHours :  newTodos })
    }

    handleEdit(){
        this.setState({showBarbershopEdit : false})
    }

    render(){
		return(
            <div className='availability' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h3" align="center" marginBottom={5}>Availability</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Barbershop</TableCell>
                            <TableCell align="right">Monday</TableCell>
                            <TableCell align="right">Tuesday</TableCell>
                            <TableCell align="right">Wednesday</TableCell>
                            <TableCell align="right">Thursday</TableCell>
                            <TableCell align="right">Friday</TableCell>
                            <TableCell align="right">Saturday</TableCell>
                            <TableCell align="right">Sunday</TableCell>
                            <TableCell align="right">Edit</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {agenda.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.Monday}</TableCell>
                                <TableCell align="right">{row.Tuesday}</TableCell>
                                <TableCell align="right">{row.Wednesday}</TableCell>
                                <TableCell align="right">{row.Thursday}</TableCell>
                                <TableCell align="right">{row.Friday}</TableCell>
                                <TableCell align="right">{row.Saturday}</TableCell>
                                <TableCell align="right">{row.Sunday}</TableCell>
                                <TableCell align="right"><Button onClick={() => this.handleEditBarbershopSchedule(row)}>{row.name}</Button></TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                <TableCell component="th" scope="row">Michel Sebahat</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right">10:00-16:00</TableCell>
                                <TableCell align="right"><Button>Edit</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <Dialog open={this.state.showBarbershopEdit} onClose={this.handleClose} >
                        <DialogTitle sx={{ textAlign : "center"}} >Coiffure Simonis</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                {Object.keys(this.state.tryHours).map((key) => (
                                    <Grid container spacing={2} marginTop={5}>
                                        <Grid item xs={4} > {key} </Grid>
                                        <Grid item xs={4} >
                                            <TimePicker
                                                renderInput={(params) => <TextField {...params} />}
                                                value={moment(this.state.tryHours[key].split("-")[0],'HH:mm')}
                                                label="From"
                                                onChange={(newValue) => this.handleChangeTime(newValue, key, "f")}
                                            />
                                        </Grid>
                                        <Grid item xs={4} >
                                        <TimePicker
                                            renderInput={(params) => <TextField {...params} />}
                                            value={moment(this.state.tryHours[key].split("-")[1],'HH:mm')}
                                            label="To"
                                            onChange={(newValue) => this.handleChangeTime(newValue, key, "t") }
                                        />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid> 
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center'}} >
                            <Button autoFocus  onClick={this.handleEdit}>Edit</Button>
                        </DialogActions>
                    </Dialog>
                </LocalizationProvider>
            </div>
        )
    }
}