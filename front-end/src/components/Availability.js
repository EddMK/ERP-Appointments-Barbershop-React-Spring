import React, { PureComponent } from 'react';
import {Paper, Grid , Typography}from '@mui/material/';
import moment from "moment";
import 'moment/locale/fr'
import {Table, Checkbox, FormControlLabel, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, DialogTitle,  Dialog , DialogActions, DialogContent}from '@mui/material/';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
//import { Box } from '@mui/system';

//[]
//FERMETURE , CONGE
//BACKEND

export default class Availability extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            showBarbershopEdit : false,
            choosen : {},
            barberChoosen : false,
            error : false,
            titleDialog : "",
            arrayHide : [],
            minimum : moment('8:00','HH:mm'),
            maximum : moment('22:00','HH:mm'),
            agenda :[['Coiffure Simonis', {id : 1, Monday : '10:00 - 20:00',
                                        Tuesday : '10:00 - 20:00',
                                        Wednesday : '10:00 - 20:00',
                                        Thursday : '12:00 - 20:00',
                                        Friday : '10:00 - 20:00',
                                        Saturday : '10:00 - 20:00',
                                        Sunday : '10:00 - 20:00',}],
                    ['Michel Sebahat', { id : 2,Monday : '10:00 - 20:00',
                                        Tuesday : '10:00 - 20:00',
                                        Wednesday : '10:00 - 20:00',
                                        Thursday : '10:00 - 20:00',
                                        Friday : '10:00 - 20:00',
                                        Saturday : '10:00 - 20:00',
                                        Sunday : '10:00 - 20:00',}]
                                    ],
        };
        moment.locale('fr');
        this.handleEditBarbershopSchedule = this.handleEditBarbershopSchedule.bind(this);
        this.handleClose = this.handleClose.bind(this)
        this.handleChangeTime = this.handleChangeTime.bind(this)
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        //console.log(moment('22:00','h:mm a').format('h:mm'))
        //var string = "8:00 - 20:00";
        //console.log(string.substring(0, string.indexOf('-')))
        //console.log(string.substring(string.indexOf('-') + 1))
        //var streetaddress = string.substr(0, addy.indexOf(',')); 
        //console.log(this.state.agenda[0][1]["Monday"])
    }

    componentDidMount() {
        fetch("http://localhost:8080/admin/availability/").then((res) => res.json()).then( (json) => json); 
    }

    handleEditBarbershopSchedule(e){
        //console.log("EDIT");
        //console.log(e);
        //console.log(this.state.agenda.indexOf(e))
        var bool;
        this.state.agenda.indexOf(e) === 0 ?  bool = true : bool = false
        //console.log(e[1]);
        var arrayToHide = []
        var obj = e[1]
        Object.keys(obj).forEach( (e) => {
            if(e !== "id"){
                console.log(e);
                var str = obj[e]
                console.log(str.charAt(0))
                if(str === "close" || str === "day off"){
                    arrayToHide.push([e, true])
                }
            }
        })
        this.setState({showBarbershopEdit : true, arrayHide : arrayToHide,  barberChoosen : bool , titleDialog : e[0],   choosen : e[1]})
    }

    handleClose(){
        this.setState({showBarbershopEdit : false})
    }

    handleChangeTime(e, day, part){
        var newTodos = Object.assign({}, this.state.choosen);
        var newTodosDay = newTodos[day];
        if(part === "f"){
            newTodos[day] = newTodosDay.replace(newTodosDay.substring(0, newTodosDay.indexOf('-')), moment(e,'HH:mm').format('HH:mm'));
        }else{
            newTodos[day] = newTodosDay.replace( newTodosDay.substring(newTodosDay.indexOf('-') + 1) , moment(e,'HH:mm').format('HH:mm'));
        }
        this.errorPlaning(newTodos) ? this.setState({ error : true, choosen :  newTodos }) : this.setState({ error : false,  choosen :  newTodos })
    }

    errorPlaning(obj){
        var bool = false;
        Object.entries(obj).forEach( (e) => {
            if(e[0] !== "id"){
                var array = e[1].split("-")
                if(moment(array[0],'HH:mm') > moment(array[1],'HH:mm')){
                    bool = true
                }
            }
            
        });
        return bool;
    }

    handleEdit(){
        var object = this.state.choosen;
        var id = this.state.choosen.id;
        this.state.agenda.map(obj => {
            if (obj[1].id === id) {
                var newObj = obj
                newObj[1] = object
                return newObj;
            }
            return obj;
          });
        if(this.state.barberChoosen){
            //VERIFIER QUE LES AUTRES COIFFEURS AIENT UN HORARIE COMPRIS DANS LES HEURES D OUVERTURE
            //TROUVER UN MOYEN DE MODIFIER LE BACKEND
            Object.entries(object).forEach( (e) => {
                if(e[0] !== "id"){
                    this.validationOtherHairdresser(e);
                }                
            });
        } 
        this.setState({showBarbershopEdit : false})
    }

    validationOtherHairdresser(barber){
        this.state.agenda.forEach( (e) => {
            if(this.state.agenda.indexOf(e) !== 0 ){
                var startHair = moment(e[1][barber[0]].split("-")[0],'HH:mm') ;
                var startBarber = moment(barber[1].split("-")[0],'HH:mm') ;
                var endHair = moment(e[1][barber[0]].split("-")[1],'HH:mm') ;
                var endBarber = moment(barber[1].split("-")[1],'HH:mm') ;
                if(startHair<startBarber){
                    //console.log(e[1])
                    //console.log(startBarber)
                    e[1][barber[0]] = startBarber.format('HH:mm')+" - "+endHair.format('HH:mm')
                }
                if(endBarber<endHair){
                    //console.log(e[1])
                    //console.log(endBarber)
                    //console.log(endHair)
                    e[1][barber[0]] = startHair.format('HH:mm')+" - "+endBarber.format('HH:mm')
                }
            }
        })
    }

    handleCheckbox(e, day){
        var bool = e.target.checked;
        if(bool){
            this.state.arrayHide.push([day, bool])
        }else{
            this.state.arrayHide.splice(this.state.arrayHide.indexOf([day, true]), 1)
        }
        console.log(this.state.arrayHide);
    }

    render(){
		return(
            <div className='availability' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h3" align="center" marginBottom={5}>Availability</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Barbershop with Hairdressers</TableCell>
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
                            {this.state.agenda.map((row) => (
                                <TableRow key={row[0]} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope="row"> {row[0]} </TableCell>
                                    <TableCell align="right">{row[1].Monday}</TableCell>
                                    <TableCell align="right">{row[1].Tuesday}</TableCell>
                                    <TableCell align="right">{row[1].Wednesday}</TableCell>
                                    <TableCell align="right">{row[1].Thursday}</TableCell>
                                    <TableCell align="right">{row[1].Friday}</TableCell>
                                    <TableCell align="right">{row[1].Saturday}</TableCell>
                                    <TableCell align="right">{row[1].Sunday}</TableCell>
                                    <TableCell align="right"><Button onClick={() => this.handleEditBarbershopSchedule(row)}>{row[0]}</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <Dialog open={this.state.showBarbershopEdit} onClose={this.handleClose} >
                        <DialogTitle sx={{ textAlign : "center"}} >Planning {this.state.titleDialog}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                {Object.keys(this.state.choosen).map((key) => key !== "id" ?
                                 (
                                    <Grid key={key} container spacing={2} marginTop={5}>
                                        <Grid item xs={2} >{key}</Grid>
                                        <Grid item xs={2} >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox name="jason" onChange={(value) => this.handleCheckbox(value, key)} />
                                                }
                                                label={this.state.barberChoosen ? "close" : "day off" }
                                            />
                                        </Grid>
                                        {this.state.arrayHide.indexOf([key,true]) === -1 ?
                                        <>
                                            <Grid item xs={4} >
                                                <TimePicker
                                                    renderInput={(params) => <TextField {...params} />}
                                                    value={moment(this.state.choosen[key].split("-")[0],'HH:mm')}
                                                    label="From"
                                                    onChange={(newValue) => this.handleChangeTime(newValue, key, "f")}
                                                    minTime = {this.state.barberChoosen ? this.state.minimum : moment(this.state.agenda[0][1][key].split("-")[0],'HH:mm')} 
                                                    maxTime={ this.state.barberChoosen ? this.state.maximum : moment(this.state.agenda[0][1][key].split("-")[1],'HH:mm')}
                                                />
                                            </Grid>
                                            <Grid item xs={4} >
                                                <TimePicker
                                                    renderInput={(params) => <TextField {...params} />}
                                                    value={moment(this.state.choosen[key].split("-")[1],'HH:mm')}
                                                    label="To"
                                                    onChange={(newValue) => this.handleChangeTime(newValue, key, "t") }
                                                    minTime = {this.state.barberChoosen ? this.state.minimum : moment(this.state.agenda[0][1][key].split("-")[0],'HH:mm')} 
                                                    maxTime={ this.state.barberChoosen ? this.state.maximum : moment(this.state.agenda[0][1][key].split("-")[1],'HH:mm')}
                                                />
                                            </Grid>
                                        </>
                                        : null}
                                    </Grid>
                                ) : null  )}
                                {this.state.error ? <Grid container spacing={2} marginTop={5} justifyContent ="center" ><Typography variant="body2" sx={{ color: "red" }} gutterBottom>Error : the "from" time must be before the "to" time</Typography></Grid> : null}
                            </Grid> 
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center'}} >
                            <Button autoFocus disabled={this.state.error}  onClick={this.handleEdit}>Edit</Button>
                        </DialogActions>
                    </Dialog>
                </LocalizationProvider>
            </div>
        )
    }
}

//{ moment(this.state.choosen[key].split("-")[0],'HH:mm') > moment(this.state.choosen[key].split("-")[1],'HH:mm') ? this.setState({error : true}) : this.setState({error : false})}
