import React, { PureComponent } from 'react';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

export default class Barbershop extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            barbershops : [],
            localisation : null,
            evolutionExpense : [],
        };
        this.handleBarbershopChange = this.handleBarbershopChange.bind(this);

    }

    componentDidMount() {
        fetch('http://localhost:8080/barbershop/all').then(response => response.json()).then(data => this.setState({barbershops : data}));
        fetch("http://localhost:8080/admin/evolutionExpenseBarbershop/").then((res) => res.json()).then( (json) => this.changeJsonData(json));
    }

    changeJsonData(json){
        var array = json.map((e) => {
          var rObj = {};
          rObj.name = e[0];
          var prix = e[1].reduce((acc, curr) => {
            let key = curr[0];
            let value = parseInt(curr[1]);
            acc[key] = value;
            return acc;
          }, {})
          rObj = Object.assign(rObj,prix);
          return rObj;
      });
      console.log(array);
      this.setState({evolutionExpense : array.reverse()});
      }

    handleBarbershopChange(value) {
		this.setState({localisation : value});
	}

    render(){
		return(
            <div className='Barbershop' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" gutterBottom  style={{marginBottom: 50 + 'px'}}>Barbershop</Typography>
                <Autocomplete
						disablePortal
						id="barbershop"
						options={this.state.barbershops}
						getOptionLabel={(option) => option.name}
						sx={{ width: 300, marginTop : 2 }}
						onChange={(event,newValue) => {
							this.handleBarbershopChange(newValue);
						}}
						renderInput={(params) => <TextField {...params} label="Choose a barbershop" />}
				/>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Paper elevation={5}>
                        <Typography variant="h5" align="center" gutterBottom  style={{marginBottom: 50 + 'px'}}>Evolution expense</Typography>
                            <LineChart
                                width={500}
                                height={300}
                                data={this.state.evolutionExpense}
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
                                <Line type="monotone" dataKey="Charges" stroke="#0A75AD" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Taxes" stroke="#FA8072" />
                                <Line type="monotone" dataKey="Materiel" stroke="#458B74" />
                            </LineChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                    <Paper elevation={5}>
                    <Typography variant="h5" align="center" gutterBottom  style={{marginBottom: 50 + 'px'}}>Evolution turnover by hairdresser</Typography>
                        <BarChart
                        width={500}
                        height={300}
                        data={data}
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
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                        </Paper>
                    </Grid>
                    
                </Grid>
                
            </div>
    )}

}