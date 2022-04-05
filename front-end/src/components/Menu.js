import './Menu.css';
import React, { Component } from "react";
import { Link } from "react-router-dom";


class Menu extends React.Component{
	render(){
		return(
				<nav >
					<ul className='menu'>
						<li><Link to="/signup">Sign Up</Link></li>
						<li><Link to="/login">Log In</Link></li>
						<li><Link to="/agenda">Agenda</Link></li>
						<li style={{ float: "left" }}><Link to="/">Ed Barbershop</Link></li>
					</ul>
				</nav>
		)
	}
}

export default Menu;