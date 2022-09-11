import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Grid , Typography}from '@mui/material/';
import moment from "moment";


export default class Admin extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            turnover : null,
            evolutionTurnoverExpense : null
        };
		    // faire en sorte que le premier du mois il paye tout 
    }

     componentDidMount() {
         fetch("http://localhost:8080/admin/evolutionTurnoverExpense/").then((res) => res.json()).then( (json) => this.changeJsonDataEvolution(json));   
   
    }

    changeJsonDataEvolution(json){
      console.log(json)
      
        var array = json.map((e) => {
          var rObj = {};
          rObj.name = e[0][1];
          rObj.turnover = parseInt(e[1][1]);
          rObj.expense = parseInt(e[2][1]);
          return rObj;
      });
    this.setState({evolutionTurnoverExpense : array.reverse()});
    
    }

    render(){
		return(
            <div className='admin' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" gutterBottom>Admin</Typography>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={3}>
                    <Paper elevation={5}>
                      <Typography variant="body1" align="center" gutterBottom>Today's Turnover</Typography>
                      <Typography variant="body1" align="center" gutterBottom>{this.state.turnover === null ? '0': this.state.turnover } €</Typography>
                    </Paper>
                  </Grid> 
                  <Grid item xs={3}>
                    <Typography>xs=4</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>xs=4</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>xs=8</Typography>
                  </Grid>
                  <Grid item xs={12} alignItems="center" justifyContent="center" >
                    <Paper elevation={5} sx={{width:800, backgroundColor: '#F4F6F6'}}>
                      <Typography variant="h5" align="center" gutterBottom>Evolution chiffre d'affaire et dépenses</Typography>
                      <AreaChart width={730} height={250} data={this.state.evolutionTurnoverExpense} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f44336" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="expense" stcdroke="#f44336" fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="turnover" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                      </AreaChart>
                    </Paper >
                  </Grid>
                </Grid>
            </div>
        )
    }
}