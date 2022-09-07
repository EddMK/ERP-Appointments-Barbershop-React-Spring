import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Paper from '@mui/material/Paper';
import './Admin.css';

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      mv : 3000,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      mv : 2500,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      mv : 5000,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      mv : 3000,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      mv : 2000,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      mv : 3000,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      mv : 3000,
      amt: 2100,
    },
  ];



export default class Admin extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            turnover : null,
            evolutionCommerce : null,
            evolutionCommerceBarbershop : null
        };
    }

     componentDidMount() {
         fetch("http://localhost:8080/appointment/turnoverToday/").then((res) => res.json()).then( (json) => this.setState({turnover : json})); 
         fetch("http://localhost:8080/appointment/evolutionTurnover/").then((res) => res.json()).then( (json) => this.changeJsonData(json)); 
         fetch("http://localhost:8080/appointment/evolutionTurnoverBarbershop/").then((res) => res.json()).then( (json) => this.changeJsonDataEvolution(json));   
  
    }
/*
{
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      mv : 3000,
      amt: 2400,
    },
*/
    changeJsonDataEvolution(json){
      console.log("graph",json)
      var array = json.map((e) => {
        var rObj = {};
        console.log(e);
        rObj.name = e[0][1];
        rObj.simo = parseInt(e[1][1]);
        rObj.crea = parseInt(e[2][1]);
        rObj.esar = parseInt(e[3][1]);
        console.log(rObj);
        console.log("_____________");
        return rObj;
    });
    console.log("graph",array)
    this.setState({evolutionCommerceBarbershop : array});
    //evolutionCommerceBarbershop
      /*
      var array = json.map(([k, v]) => {
          var rObj = {};
          rObj.name = k;
          rObj.edShop = parseInt(v);
          return rObj;
      });*/
      //this.setState({evolutionCommerce : array});
      //console.log(array);
    }

    changeJsonData(json){
        //console.log("graph",json)
        var array = json.map(([k, v]) => {
            var rObj = {};
            rObj.name = k;
            rObj.edShop = parseInt(v);
            return rObj;
        });
        this.setState({evolutionCommerce : array});
        //console.log(array);
    }

    render(){
		return(
            <div className='admin'>
                <h1>Admin</h1>
                <Paper elevation={5}><p>Chiffre d'affaire du jour : {this.state.turnover === null ? '0': this.state.turnover } €</p> </Paper>
                <Paper elevation={5} sx={{width:500, ml: 20}}>
                    <h2>Evolution differents salon</h2>
                    <LineChart
                        width={500}
                        height={300}
                        data={this.state.evolutionCommerceBarbershop}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="simo" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="crea" stroke="#961316" />
                        <Line type="monotone" dataKey="esar" stroke="#82ca9d" />
                    </LineChart>
                </Paper>
                <Paper elevation={5}>
                    <LineChart
                        width={500}
                        height={300}
                        data={this.state.evolutionCommerce}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="edShop" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </Paper>
            </div>

            
        )
    }
}

/*

<h1>Admin</h1>
                <p>Chiffre d'affaire du jour : {this.state.turnover} €</p>

*/