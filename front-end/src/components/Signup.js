import * as React from "react";
import {TextField, Typography, Button, InputAdornment} from '@mui/material/';
import './Signup.css';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PasswordIcon from '@mui/icons-material/Password';
import { withRouter } from '../common/with-router';


/*
-AJOUTER REGEX POUR LE PASSWORD
-SE CONNCETER APRES  S ETRE INSCRIT
*/

class Signup extends React.Component{

	constructor(){
		super();
		this.state={
			lastName:'',
			errorLastName : true,
			helperLastName : null,
			firstName:'',
			errorFirstName : true,
			helperFirstName : null,
			email:'',
			errorEmail : true,
			helperEmail : null,
			phoneNumber:'',
			errorPhone : true,
			helperPhone : null,
			password:'',
			errorPassword : true,
			helperPassword : null,
			confirm:'',
			errorConfirm : true,
			helperConfirm : null,
			disableButton : true,
			errorMessage:""
		  }
		this.handleLastName = this.handleLastName.bind(this);
		this.handleFirstName = this.handleFirstName.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	async handleClick(){
		const requestOptions = {
			method: 'POST',
			headers: {  'Accept': 'application/json', 'Content-Type': 'application/json'  },
			body: JSON.stringify({	lastName : this.state.lastName, firstName : this.state.firstName, email : this.state.email, phone : this.state.phoneNumber, password : this.state.password	})
		};
		await fetch( 'http://localhost:8080/authentication/signup',requestOptions)
			.then((response) => response.json()  )
			.then((data) => {
				console.log(data);
				if (data.accessToken) {
					localStorage.setItem("user", JSON.stringify(data));
					this.props.router.navigate("/admin");
					window.location.reload();
				}else{
					this.setState({errorMessage : data.body})
				}
			});
	}

	handleLastName(event){
		if(event.value.trim().length === 0){
			this.setState({ errorLastName : true, helperLastName:"The last name cannot be empty !"})
		}else{
			this.setState({ lastName: event.value , errorLastName : false, helperLastName: null})
		}
	}

	handleFirstName(event){
		if(event.value.trim().length === 0){
			this.setState({ errorFirstName : true, helperFirstName:"The first name cannot be empty !"})
		}else{
			this.setState({ firstName: event.value , errorFirstName : false, helperFirstName: null})
		}
	}

	handleEmail(event){
		var pattern = /\S+@\S+\.\S+/; 
		console.log("email : "+ event.value.match(pattern));
		if(event.value.match(pattern) === null){
			this.setState({ errorEmail : true, helperEmail:"It is not an email"})
		}else{
			this.setState({ email: event.value , errorEmail : false, helperEmail: null})
		}
	}

	handlePhoneNumber(event){
		var pattern = /^\d{10}$/;
		if(event.value.match(pattern) === null){
			this.setState({ errorPhone : true, helperPhone:"It is not a phone number"})
		}else{
			this.setState({ phoneNumber: event.value , errorPhone : false, helperPhone: null})
		}
	}
	// IL FAUT CHOISIR UN REGEX
	handlePassword(event){
		var password = event.value;
		if(password.length<5){
			this.setState({ password : null, errorPassword : true, helperPassword:"The password must have minimum 5 characters"})
		}else{
			this.setState({ password : password , errorPassword : false, helperPassword:null})
		}
	}

	handleConfirmPassword(event){
		var password = this.state.password;
		var confirm = event.value;
		if(password === ''){
			this.setState({ errorConfirm : true, helperConfirm:"Complete first the password"})
		}else if(confirm.localeCompare(password) !== 0){
			this.setState({ errorConfirm : true, helperConfirm:"It is not the same as the password"})
		}else{
			this.setState({ confirm : confirm , errorConfirm : false, helperConfirm:null})
		}
	}

	render(){
		return(
			<div className="signup">
				<h1>Sign Up</h1>
				<p>Complete the following informations to sign up</p>
				<div className="textfield">
					<TextField 
						fullWidth 
						id="lastName" 
						label="Last Name" 
						onChange={(event) => this.handleLastName(event.target)}
						error={this.state.errorLastName}
						helperText={this.state.helperLastName}
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
						id="firstName" 
						label="First Name" 
						onChange={(event) => this.handleFirstName(event.target)}
						error={this.state.errorFirstName}
						helperText={this.state.helperFirstName}
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
						id="email" 
						label="E-mail" 
						onChange={(event) => this.handleEmail(event.target)}
						error={this.state.errorEmail}
						helperText={this.state.helperEmail}
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
						id="phoneNumber" 
						label="Phone Number" 
						onChange={(event) => this.handlePhoneNumber(event.target)}
						error={this.state.errorPhone}
						helperText={this.state.helperPhone}
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
						id="password" 
						label="Password" 
						type="password"
						onChange={(event) => this.handlePassword(event.target)}
						error={this.state.errorPassword}
						helperText={this.state.helperPassword}
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
						id="confirm" 
						label="Confirm Password" 
						type="password"
						onChange={(event) => this.handleConfirmPassword(event.target)}
						error={this.state.errorConfirm}
						helperText={this.state.helperConfirm}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PasswordIcon />
								</InputAdornment>
							),
						}} 
						variant="outlined" />
				</div>
				{this.state.errorMessage !== "" ? <Typography variant="body2" color="red" gutterBottom>{this.state.errorMessage}</Typography> : null }
				<div className="bouton">
					<Button disabled={ this.state.errorFirstName || this.state.errorLastName ||  this.state.errorEmail ||  this.state.errorPhone || this.state.errorPassword  || this.state.errorConfirm } variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
			</div>
		)
	}
}
export default  withRouter(Signup);