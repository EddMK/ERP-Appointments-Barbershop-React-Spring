import './Menu.css';
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {Badge} from '@mui/material/';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import moment from "moment";






const drawerWidth = 160;

class Menu extends React.Component{
	
	constructor(props){
		super(props);
		this.state={
			admin : true,
			showBadge : moment().date() === 1 ? 1 : 0
		}		
	}
	render(){
		return(
			
				<div className='Menu'>
					{this.state.admin ?
						<Drawer
							sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
							},
							backgroundColor: 'red'
							}}
							variant="permanent"
							anchor="left"
							PaperProps={{
								sx: {
									backgroundColor: '#333', 
									color : 'white'
								}
							}}
					  	>
						<Toolbar />
						<Divider />
						<List>
							<Link to="/invoice"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<Badge badgeContent={this.state.showBadge} color="primary">
												<ReceiptLongOutlinedIcon />
											</Badge>											
										</ListItemIcon>
										<ListItemText primary="Invoicing" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/employees"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<GroupsOutlinedIcon />							
										</ListItemIcon>
										<ListItemText primary="Employees" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/turnover"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<Badge badgeContent={this.state.showBadge} color="primary">
												<ReceiptLongOutlinedIcon />
											</Badge>											
										</ListItemIcon>
										<ListItemText primary="Turnover" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/barbershop"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<Badge badgeContent={this.state.showBadge} color="primary">
												<ReceiptLongOutlinedIcon />
											</Badge>											
										</ListItemIcon>
										<ListItemText primary="Barbershops" />
									</ListItemButton>
								</ListItem>
							</Link>
						</List>
					  </Drawer>
					: 
						<nav >
							<ul className='menu'>
								<li><Link to="/signup">Sign Up</Link></li>
								<li><Link to="/login">Log In</Link></li>
								<li><Link to="/agenda">Make an appointment</Link></li>
								<li><Link to="/employee">Schedule</Link></li>
								<li><Link to="/admin">Admin</Link></li>
								<li style={{ float: "left" }}><Link to="/">Ed Barbershop</Link></li>
							</ul>
						</nav>
					}
				</div>

		)
	}
}

export default Menu;

/*

<div class="sidenav">
	<a href="#about">About</a>
	<a href="#services">Services</a>
	<a href="#clients">Clients</a>
	<a href="#contact">Contact</a>
</div>


*/