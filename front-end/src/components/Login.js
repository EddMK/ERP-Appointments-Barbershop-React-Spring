import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Login.css'
import AuthService from "../services/AuthService.js";
import { withRouter } from '../common/with-router';

class Login extends React.Component{
/*

Atention mots de passe compris entre 5 et 10 caractères

*/
	constructor(props){
		super(props);
		this.state={
			username : null,
			password : null
		}	
		this.handleConfirm = this.handleConfirm.bind(this);
	}
 
	async handleConfirm(){
		const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({	email : this.state.username, password : this.state.password})};
		await fetch( 'http://localhost:8080/authentication/login',requestOptions).then((response) => response.json())
		.then((data) => {
			if (data.accessToken) {
				localStorage.setItem("user", JSON.stringify(data));
				if(data.role.includes("ADMIN")){
					this.props.router.navigate("/admin");
				}
				if(data.role.includes("EMPLOYEE")){
					this.props.router.navigate("/employee");
				}
				if(data.role.includes("CUSTOMER")){
					this.props.router.navigate("/agenda");
				}
			}
		  	console.log(data);
		});
	}

	render(){
		return(
			<div className="login">
				<h1>Log In</h1>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="username" 
						label="Email" 
						variant="outlined" 
						onChange={(event) => this.setState({username : event.target.value})}/>
				</div>
				<div className="textfield">
					<TextField 
						type="password"
						fullWidth 
						id="password" 
						label="Password" 
						variant="outlined"
						onChange={(event) => this.setState({password : event.target.value})}/> 
				</div>
				<div className="bouton">
					<Button variant="contained" onClick={() => { this.handleConfirm() ;}}>Log In</Button>
				</div>
			</div>
		)
	}
}

export default  withRouter(Login);
