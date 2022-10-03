import * as React from "react";
import './Agenda.css';
import ChosenDate from './ChosenDate';
import Schedule from './Schedule';
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";




class Agenda extends React.Component{

	constructor(){
		super();
		this.state = { 
			returnDate : true,
			showSchedule : false,
			choosenDate : null,
			hairDresser : null,
			showComponent : true,
		};
		this.handleDisplaySchedule = this.handleDisplaySchedule.bind(this);
		this.handleDisplayDate = this.handleDisplayDate.bind(this);
	}

	componentDidMount() {
        var user = AuthService.getCurrentUser();
		if(user !== null){
			if(! user.role.includes("CUSTOMER")){
				this.setState({ showComponent : false });
			}
		}else{
			this.setState({ showComponent : false });
		}
    }

	handleDisplaySchedule(choosendate, hairdresser) {
		this.setState({ showSchedule: true,  returnDate : false , choosenDate : choosendate, hairDresser : hairdresser });
	}

	handleDisplayDate(value) {
		this.setState({ showSchedule: false, returnDate : true });
	}

	render(){

		if(this.state.showComponent === false){
            return <Navigate to='/' />
        }

		return(
			<div className="Agenda">
				{ this.state.returnDate ? <ChosenDate  click={this.handleDisplaySchedule}  /> : null }
				{ this.state.showSchedule ? <Schedule  click={this.handleDisplayDate} date={this.state.choosenDate} hairdresser={this.state.hairDresser}/> : null }
			</div>
		)
	}
}

export default Agenda;