import React from "react";
import { Typography, Button , TextField} from '@mui/material';
import './Login.css'
import { withRouter } from '../common/with-router';


class Login extends React.Component{
/*

Atention mots de passe compris entre 5 et 10 caractères

*/
	constructor(props){
		super(props);
		this.state={
			username : "",
			password : "",
			errorAuto : false,
		}	
		this.handleConfirm = this.handleConfirm.bind(this);
	}
 
	async handleConfirm(){
		const requestOptions = { method: 'POST', headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({	email : this.state.username.trim(), password : this.state.password.trim()})};
		await fetch( 'http://localhost:8080/authentication/login',requestOptions)
		.then((response) => response.status === 200 ? response.json() : response  )
		.then((data) => {
			console.log(data);
			if (data.accessToken) {
				localStorage.setItem("user", JSON.stringify(data));
				if(data.role.includes("ADMIN")){
					this.props.router.navigate("/admin");
					window.location.reload();
				}
				if(data.role.includes("EMPLOYEE")){
					this.props.router.navigate("/employee");
					window.location.reload();
				}
				if(data.role.includes("CUSTOMER")){
					this.props.router.navigate("/agenda");
					window.location.reload();
				}
			}else{
				console.log("ERREUR");
				this.setState({errorAuto : true})
			}
		});
	}

	validEmailTest(email){
		var boul = false;
		var pattern = /\S+@\S+\.\S+/; 
		if(email !== null){
			console.log("email : "+ email.match(pattern));
			if(email.match(pattern) === null){
				boul = true;
			}
		}
		return boul;
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
				{this.state.errorAuto ? <Typography variant="body2" color="red" gutterBottom>Username or password is not correct</Typography> : null }
				<div className="bouton">
					<Button variant="contained" disabled={this.validEmailTest(this.state.username) || this.state.username.trim()==="" || this.state.password.trim()==="" } onClick={() => { this.handleConfirm() ;}}>Log In</Button>
				</div>
			</div>
		)
	}
}
export default  withRouter(Login);