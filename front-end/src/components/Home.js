import './App.css';
import React from "react";

class Home extends React.Component{
	render(){
		return(
			<div className="Home">
				<h1>Home</h1>
				<div className="slider">
					<div className="slides">
						<div className="slide"><img src={require('../pictures/image1.jpg')} alt="img1" width="500px" height="200px"/></div>
						<div className="slide"><img src={require('../pictures/image2.jpg')} alt="img2" width="500px"  height="200px" /></div>
						<div className="slide"><img src={require('../pictures/image3.jpg')} alt="img3" width="500px" height="200px" /></div>
					</div>
				</div>
		    </div>
		)
	}
}

export default Home;

