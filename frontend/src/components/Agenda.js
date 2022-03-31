import * as React from "react";
import './Agenda.css';
import ChosenDate from './ChosenDate';
import Schedule from './Schedule';


class Agenda extends React.Component{

	constructor(){
		super();
		this.state = { 
			returnDate : true,
			showSchedule : false
		};
		this.handleDisplaySchedule = this.handleDisplaySchedule.bind(this);
	}

	handleDisplaySchedule(value) {
		this.setState({ showSchedule: true, returnDate : false });
	}

	render(){
		return(
			<div className="Agenda">
				{ this.state.returnDate ? <ChosenDate  click={this.handleDisplaySchedule}  /> : null }
				{ this.state.showSchedule ? <Schedule/> : null }
			</div>
		)
	}
}

export default Agenda;