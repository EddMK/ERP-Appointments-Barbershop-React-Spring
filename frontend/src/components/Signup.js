import React, { Component } from "react";
import TextField from '@mui/material/TextField';


class Signup extends React.Component{
	render(){
		return(
			<div>
				<h1>Sign Up</h1>
				<TextField id="outlined-basic" label="Last Name" variant="outlined" />
				<TextField id="outlined-basic" label="First Name" variant="outlined" />
				<TextField id="outlined-basic" label="E-mail" variant="outlined" />
				<TextField id="outlined-basic" label="Phone Number" variant="outlined" />
				<TextField id="outlined-basic" label="Picture" variant="outlined" />
				<TextField id="outlined-basic" label="Password" variant="outlined" />
				<TextField id="outlined-basic" label="Confirm Password" variant="outlined" />
			</div>
		)
	}
}

export default Signup;
