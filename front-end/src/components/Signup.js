import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import './Signup.css';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PasswordIcon from '@mui/icons-material/Password';
import Button from '@mui/material/Button';



class Signup extends React.Component{
	render(){
		return(
			<div className="signup">
				<h1>Sign Up</h1>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="Last Name" 
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircle />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField  
						fullWidth 
						id="outlined-basic" 
						label="First Name" 
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircle />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="E-mail" 
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AlternateEmailIcon />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="Phone Number" 
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LocalPhoneIcon />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="Password" 
						type="password"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PasswordIcon />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="outlined-basic" 
						label="Confirm Password" 
						type="password"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PasswordIcon />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				<div className="bouton">
					<Button variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
			</div>
		)
	}
}

export default Signup;
