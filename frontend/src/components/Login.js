import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Login.css'

class Login extends React.Component{
	render(){
		return(
			<div className="login">
				<h1>Log In</h1>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="Last Name" 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField 
						type="password"
						fullWidth 
						id="outlined-basic" 
						label="Password" 
						variant="outlined" />
				</div>
				<div className="bouton">
					<Button variant="contained" onClick={() => { this.handleClick() ;}}>Log In</Button>
				</div>
			</div>
		)
	}
}

export default Login;
