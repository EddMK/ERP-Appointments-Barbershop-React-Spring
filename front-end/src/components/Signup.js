import * as React from "react";
import TextField from '@mui/material/TextField';
import './Signup.css';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PasswordIcon from '@mui/icons-material/Password';
import Button from '@mui/material/Button';

/*
-AJOUTER REGEX POUR LE PASSWORD
-REVOIR LA DISABLE BUTTON
-SE CONNCETER APRES  S ETRE INSCRIT
*/

class Signup extends React.Component{

	constructor(){
		super();
		this.state={
			lastName:'',
			errorLastName : false,
			helperLastName : null,
			firstName:'',
			errorFirstName : false,
			helperFirstName : null,
			email:'',
			errorEmail : false,
			helperEmail : null,
			phoneNumber:'',
			errorPhone : false,
			helperPhone : null,
			password:'',
			errorPassword : false,
			helperPassword : null,
			confirm:'',
			errorConfirm : false,
			helperConfirm : null,
			disableButton : true
		  }
		this.handleLastName = this.handleLastName.bind(this);
		this.handleFirstName = this.handleFirstName.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDisable = this.handleDisable.bind(this);
	}

	async handleClick(){
		console.log("Cliqué !");
		const requestOptions = {
			method: 'POST',
			headers: { 
			  'Accept': 'application/json',
			  'Content-Type': 'application/json' 
			},
			body: JSON.stringify({	lastName : this.state.lastName,
									firstName : this.state.firstName,
									email : this.state.email,
									phoneNumber : this.state.phoneNumber,
									password : this.state.password	})
		  };
		  const response = await fetch( 'http://localhost:8080/user/addCustomer',requestOptions);
		  const data = await response.text();
	}

	handleLastName(event){
		if(event.value.trim().length === 0){
			this.setState({ errorLastName : true, helperLastName:"The last name cannot be empty !"})
		}else{
			this.setState({ lastName: event.value , errorLastName : false, helperLastName: null})
		}
		this.handleDisable();
	}

	handleFirstName(event){
		if(event.value.trim().length === 0){
			this.setState({ errorFirstName : true, helperFirstName:"The first name cannot be empty !"})
		}else{
			this.setState({ firstName: event.value , errorFirstName : false, helperFirstName: null})
		}
		this.handleDisable();
	}

	handleEmail(event){
		var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
		console.log("email : "+ event.value.match(pattern));
		if(event.value.match(pattern) === null){
			this.setState({ errorEmail : true, helperEmail:"It is not an email"})
		}else{
			this.setState({ email: event.value , errorEmail : false, helperEmail: null})
		}
		this.handleDisable();
	}

	handlePhoneNumber(event){
		//console.log("phone number : "+ event.value);
		var pattern = /^\d{10}$/;
		console.log("phone number : "+ event.value.match(pattern));
		if(event.value.match(pattern) === null){
			this.setState({ errorPhone : true, helperPhone:"It is not a phone number"})
		}else{
			this.setState({ phoneNumber: event.value , errorPhone : false, helperPhone: null})
		}
		this.handleDisable();
	}
	// IL FAUT CHOISIR UN REGEX
	handlePassword(event){
		var password = event.value;
		if(password.length<5){
			this.setState({ password : null, errorPassword : true, helperPassword:"The password must have minimum 5 characters"})
		}else{
			this.setState({ password : password , errorPassword : false, helperPassword:null})
		}
		this.handleDisable();
	}

	handleConfirmPassword(event){
		var password = this.state.password;
		var confirm = event.value;
		if(password == null){
			this.setState({ errorConfirm : true, helperConfirm:"Complete first the password"})
		}else if(confirm.localeCompare(password) !== 0){
			this.setState({ errorConfirm : true, helperConfirm:"It is not the same as the password"})
		}else{
			this.setState({ confirm : confirm , errorConfirm : false, helperConfirm:null})
		}
		this.handleDisable();
	}

	handleDisable(){
		if(this.state.errorFirstName || this.state.errorLastName || this.state.errorEmail || this.state.errorPhone || this.state.errorPassword ||  this.state.errorConfirm){
			this.setState({disableButton : true});
		}else{
			this.setState({disableButton : false});
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
						onBlur={(event) => this.handleEmail(event.target)}
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
						onBlur={(event) => this.handlePhoneNumber(event.target)}
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
						onBlur={(event) => this.handlePassword(event.target)}
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
						onBlur={(event) => this.handleConfirmPassword(event.target)}
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
				<div className="bouton">
					<Button disabled={this.state.disableButton} variant="contained" onClick={() => { this.handleClick() ;}}>Confirm</Button>
				</div>
			</div>
		)
	}
}

export default Signup;
