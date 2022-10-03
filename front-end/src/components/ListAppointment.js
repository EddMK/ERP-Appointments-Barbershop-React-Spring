import React, { PureComponent } from 'react';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { withRouter } from '../common/with-router';
import AuthService from "../services/AuthService";
import moment from "moment";
import { Navigate } from "react-router-dom";




//PAS OUBLIER CONFIRMATION DU DELETE

class ListAppointment extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            appointments : [],
            show : true,
        };
        console.log(this.props)
    }


    componentDidMount() {
        var user = AuthService.getCurrentUser();
		if(user !== null){
			if(user.role.includes("CUSTOMER")){
				fetch("http://localhost:8080/customer/getOwnAppointment/"+user.id).then((res) => res.json()).then((json) => { json.length===0? this.setState({ show : false }) : this.setState({ show : true })   ; this.setState({ appointments : json })   }  );
			}else{
                this.setState({ show : false });
            }
		}else{
			this.setState({ show : false });
		}
    }

    handleDeleteAppointment(id){
        var direct = false;
        if(this.state.appointments.length === 1){
            direct = true;
        }
        this.setState({appointments: this.state.appointments.filter(obj => { return obj.id !== id; })});
        fetch('http://localhost:8080/customer/delete/'+id, { method: 'DELETE' });
        if(direct){
            this.props.router.navigate("/");
            window.location.reload();
        }
    }

    render(){

        if(this.state.show === false){
            return <Navigate to='/' />
        }

		return(
                <>
                    <Typography variant="h5" align="center" gutterBottom>Your appointments</Typography>
                    {this.state.appointments.map((appointment) => (
                        <Card key={appointment.id} sx={{ marginBottom : 5, backgroundColor : '#F4F6F6' }}>
                            <CardContent>
                                <Typography>
                                {moment(appointment.startDate).format('L')} from {moment(appointment.startDate).format('HH:mm')} to {moment(appointment.endDate).format('HH:mm')}
                                </Typography>
                                <Typography>
                                {appointment.title}
                                </Typography>
                                <Typography>
                                by {appointment.hairdresser_id.lastName} {appointment.hairdresser_id.firstName}
                                </Typography>
                                <Typography>
                                at {appointment.hairdresser_id.barbershop.name}
                                </Typography>
                                <Typography>
                                at {appointment.hairdresser_id.barbershop.address}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="error" onClick={() => this.handleDeleteAppointment(appointment.id)}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))}
                </>
        )}
}
export default  withRouter(ListAppointment);