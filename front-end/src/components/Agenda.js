import * as React from "react";
import './Agenda.css';
import ChosenDate from './ChosenDate';
import Schedule from './Schedule';



class Agenda extends React.Component{

	constructor(){
		super();
		this.state = { 
			returnDate : true,
			showSchedule : false,
			choosenDate : null,
			hairDresser : null
		};
		this.handleDisplaySchedule = this.handleDisplaySchedule.bind(this);
		this.handleDisplayDate = this.handleDisplayDate.bind(this);
	}

	handleDisplaySchedule(choosendate, hairdresser) {
		
		this.setState({ showSchedule: true, 
						returnDate : false ,
						choosenDate : choosendate,
						hairDresser : hairdresser
		});
	}

	handleDisplayDate(value) {
		this.setState({ showSchedule: false, returnDate : true });
	}

	render(){
		return(
			<div className="Agenda">
				{ this.state.returnDate ? <ChosenDate  click={this.handleDisplaySchedule}  /> : null }
				{ this.state.showSchedule ? <Schedule  click={this.handleDisplayDate} date={this.state.choosenDate} hairdresser={this.state.hairDresser}/> : null }
			</div>
		)
	}
}

export default Agenda;