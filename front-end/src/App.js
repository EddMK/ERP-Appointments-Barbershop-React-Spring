import React from "react";
import './App.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup.js';
import Home from './components/Home';
import Login from './components/Login';
import Agenda from './components/Agenda';
import Employee from './components/Employee';
import Admin from './components/Admin';
import Invoice from './components/Invoice';
import ListEmployees from './components/ListEmployees';
import Turnover from './components/Turnover';
import StatEmployee from './components/StatEmployee'
import Barbershop from './components/Barbershop';
import Availability from './components/Availability';
import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {Badge, Collapse} from '@mui/material/';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import moment from "moment";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

//cacher : turnover, statistique de l employe
//ajouter un liste customer et aussi rendez-vous pour voir l'emploi du temps des autres employés
//ajouter une partie services pour montrer les differents services et si il veut en ajouter d autres

const drawerWidth = 160;

class App extends React.Component{
	
	constructor(props){
		super(props);
        
		this.state={
			admin : false,
            showAdmin : false,
            showEmployee : false,
            showCustomer : false,
			showBadge : moment().date() === 1 ? 1 : 0,
			openListEmployee : false
		}	
        
	}

	render(){
		return(
            <BrowserRouter>
            {this.state.admin ?
                    <Drawer
							sx={{ width: drawerWidth, flexShrink: 0,
							'& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', },
							backgroundColor: 'red' }}
							variant="permanent"
							anchor="left"
							PaperProps={{ sx: { backgroundColor: '#333',  color : 'white' } }}
					  	>
						<Toolbar />
						<Divider />
						<List>
							<Link to="/admin"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<AdminPanelSettingsOutlinedIcon />										
										</ListItemIcon>
										<ListItemText primary="Admin" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/barbershop"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton >
										<ListItemIcon>
												<StorefrontOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Barbershops" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/invoice"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<Badge badgeContent={this.state.showBadge} color="primary">
												<AddShoppingCartOutlinedIcon />
											</Badge>											
										</ListItemIcon>
										<ListItemText primary="Expense" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/employees"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton >
										<ListItemIcon>
											<GroupsOutlinedIcon />	
										</ListItemIcon>
										<ListItemText primary="Employees" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/availability"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton >
										<ListItemIcon>
												<EventAvailableOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Availability" />
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
								<li style={{ float: "left" }}><Link to="/">Ed Barbershop</Link></li>
							</ul>
						</nav>
                        }
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/employees" element={<ListEmployees />} />
                    <Route path="/turnover" element={<Turnover />} />
                    <Route path="/statEmployee" element={<StatEmployee />} />
                    <Route path="/barbershop" element={<Barbershop />} />
                    <Route path="/availability" element={<Availability />} />
                </Routes> 
            </BrowserRouter>
		)
	}
}

export default App;
