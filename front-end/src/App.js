import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup.js';
import Home from './components/Home';
import Login from './components/Login';
import Agenda from './components/Agenda';
import Employee from './components/Employee';
import ListExpense from './components/ListExpense';
import Admin from './components/Admin';
import Invoice from './components/Invoice';
import ListAppointment from './components/ListAppointment';
import ListEmployees from './components/ListEmployees';
import Turnover from './components/Turnover';
import AddDaysOff from './components/AddDaysOff';
import StatEmployee from './components/StatEmployee'
import Barbershop from './components/Barbershop';
import Availability from './components/Availability';
import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {Collapse} from '@mui/material/';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import moment from "moment";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AuthService from "./services/AuthService";
import EventBus from "./common/eventBus.js";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';


//cacher : turnover, statistique de l employe
//ajouter un liste customer et aussi rendez-vous pour voir l'emploi du temps des autres employés
//ajouter une partie services pour montrer les differents services et si il veut en ajouter d autres
// ATTENTION LE REDIRECT DE L ADMIN FONCTIONNE PAS LE MENU N EST PAS MISE A JOUR

const drawerWidth = 160;


class App extends React.Component{
	
	constructor(props){
		super(props);
        
		this.state={
			admin : false,
            showAdmin : false,
            showEmployee : false,
            showCustomer : false,
			showFutureAppointment : false,
			showBadge : moment().date() === 1 ? 1 : 0,
			openListEmployee : false,
			open : false
		}	

		this.logOut = this.logOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		console.log("clicke");
		this.setState({open : !this.state.open})
	}

	componentDidMount() {
		var user = AuthService.getCurrentUser();
		console.log("USER app",user);
		if (user) {
			if(user.role.includes("CUSTOMER")){
				fetch("http://localhost:8080/customer/getOwnAppointment/"+user.id).then((res) => res.json()).then((json) => json.length !== 0 ? this.setState({ showFutureAppointment : true }) : this.setState({ showFutureAppointment : false }) );//this.setState({ services : json }) 
			}

		  this.setState({
			currentUser: user,
			showCustomer: user.role.includes("CUSTOMER"),
			showEmployee: user.role.includes("EMPLOYEE"),
			showAdmin: user.role.includes("ADMIN"),
		  });
		}


		EventBus.on("logout", () => {
		  this.logOut();
		});
	  }

	  logOut() {
		AuthService.logout();
		this.setState({
			showCustomer: false,
			showEmployee: false,
			showAdmin: false,
			showFutureAppointment : false
		});
	  }


	render(){
		return(
            <BrowserRouter>
            	{this.state.showAdmin ?
                    <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, backgroundColor: 'red' }}
							variant="permanent" anchor="left" PaperProps={{ sx: { backgroundColor: '#333',  color : 'white' } }} >
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
							<ListItem button disablePadding>
									<ListItemButton onClick={this.handleClick}>
										<ListItemIcon>
												<PointOfSaleOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Expenses" />
										{this.state.open ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
								</ListItem>
							<Collapse in={this.state.open} timeout="auto" unmountOnExit>
							<Link to="/invoice"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<AddCircleOutlineIcon />											
										</ListItemIcon>
										<ListItemText primary="Add" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/listExpense"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
										<ListItemButton>
											<ListItemIcon>
													<FormatListBulletedOutlinedIcon />
											</ListItemIcon>
											<ListItemText primary="List" />
										</ListItemButton>
								</ListItem>
							</Link>
							</Collapse>
							<Link to="/availability"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
									<ListItemButton >
										<ListItemIcon>
												<EventAvailableOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary="Schedule" />
									</ListItemButton>
								</ListItem>
							</Link>
							<Link to="/"  style={{ textDecoration: 'none', color:'white' }} >
								<ListItem button disablePadding>
										<ListItemButton  onClick={this.logOut} >
											<ListItemIcon>
													<LogoutOutlinedIcon />
											</ListItemIcon>
											<ListItemText primary="Log out" />
										</ListItemButton>
								</ListItem>
							</Link>
						</List>
					  </Drawer>
                      :
                      	<nav >
							<ul className='menu'>
								{this.state.showCustomer || this.state.showEmployee ? 
									<li><Link to="/" onClick={this.logOut}>Log Out</Link></li>
									: 
									<>
									<li><Link to="/signup">Sign Up</Link></li>
									<li><Link to="/login">Log In</Link></li>
									</>
								}
								{this.state.showCustomer ?<li><Link to="/agenda">Make an appointment</Link></li>: null}
								{this.state.showFutureAppointment ?<li><Link to="/list">Yours upcoming appointments</Link></li>: null}
								{this.state.showEmployee ?<li><Link to="/employee">Schedule</Link></li> : null}
								{this.state.showEmployee ?<li><Link to="/daysoff">Days Off</Link></li> : null}
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
					<Route path="/list" element={<ListAppointment />} />
					<Route path="/daysoff" element={<AddDaysOff />} />
					<Route path="/listExpense" element={<ListExpense />} />
                </Routes> 
            </BrowserRouter>
		)
	}
}

export default  App;

/*
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

*/