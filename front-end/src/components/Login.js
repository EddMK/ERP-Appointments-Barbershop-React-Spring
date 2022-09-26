import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Login.css'

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
		console.log("click login");
		console.log(this.state.username)
		console.log(this.state.password)
		const requestOptions = {
			method: 'POST',
			headers: { 
			  'Accept': 'application/json',
			  'Content-Type': 'application/json' 
			},
			body: JSON.stringify({	email : this.state.username,
									password : this.state.password})
		  };
		  const response = await fetch( 'http://localhost:8080/authentication/login',requestOptions);
		  const data = await response.text();
		  console.log(data);
	}

	render(){
		return(
			<div className="login">
				<h1>Log In</h1>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="username" 
						label="Last Name" 
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

export default Login;
