import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Grid , Typography}from '@mui/material/';
import './Admin.css';

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
         fetch("http://localhost:8080/admin/turnoverToday/").then((res) => res.json()).then( (json) => this.setState({turnover : json})); 
         fetch("http://localhost:8080/admin/evolutionTurnover/").then((res) => res.json()).then( (json) => this.changeJsonData(json)); 
         fetch("http://localhost:8080/admin/evolutionTurnoverBarbershop/").then((res) => res.json()).then( (json) => this.changeJsonDataEvolution(json));   
  
    }

    changeJsonDataEvolution(json){
      var array = json.map((e) => {
        var rObj = {};
        rObj.name = e[0][1];
        rObj.simo = parseInt(e[1][1]);
        rObj.crea = parseInt(e[2][1]);
        rObj.esar = parseInt(e[3][1]);
        return rObj;
    });
    this.setState({evolutionCommerceBarbershop : array.reverse()});
    }

    changeJsonData(json){
        var array = json.map(([k, v]) => {
            var rObj = {};
            rObj.name = k;
            rObj.edShop = parseInt(v);
            return rObj;
        });
        this.setState({evolutionCommerce : array.reverse()});
    }

    render(){
		return(
            <div className='admin'>
                <Typography variant="h4" align="center" gutterBottom>Admin</Typography>
                <Grid container spacing={2}>
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
                  <Grid item xs={6}>
                    <Paper elevation={5} sx={{width:500, backgroundColor: '#F4F6F6'}}>
                      <Typography variant="h5" align="center" gutterBottom>Evolution differents salon</Typography>
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
                    </Paper >
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={5} sx={{width:500, backgroundColor: '#F4F6F6'}}>
                      <Typography variant="h5" align="center" gutterBottom>Evolution commerce</Typography>
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
                  </Grid>
                </Grid>
            </div>
        )
    }
}