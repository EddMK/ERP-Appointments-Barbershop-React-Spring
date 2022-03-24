import './Menu.css';
import React, { Component } from "react";

class Menu extends React.Component{
	render(){
		return(
			<div className="menu">
					<nav >
						<ul>
							<li className="logo"><a className="logo" href="#">Ed Barbershop</a></li>
							<li><a href="#">Les tarifs</a></li>
							<li><a href="#">Les salons</a></li>
							<li><a href="#">S'inscrire</a></li>
							<li><a href="#">Se connecter</a></li>
						</ul>
					</nav>
			</div>
		)
	}
}

export default Menu;