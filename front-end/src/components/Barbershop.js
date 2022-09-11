import React, { PureComponent } from 'react';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      pv: 1398,
      uv: 3000,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
  ];

export default class Barbershop extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            barChart : null
        };
    }

     componentDidMount() {
         fetch("http://localhost:8080/admin/barChart/").then((res) => res.json()).then( (json) => this.changeJsonData(json));   
    }

    changeJsonData(json){
      console.log(json)
      var array = json.map((e) => {
        var rObj = {};
        rObj.name = e[0];
        var prix = e[1].reduce((acc, curr) => {
          let key = curr[0];
          let value = curr[1];
          acc[key] = value;
          return acc;
        }, {})
        rObj = Object.assign(rObj,prix);
        return rObj;
    });
    this.setState({barChart : array});
    }
/*
{
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },

*/

    render(){
		return(
            <div className='barbershop' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" style={{marginBottom: 160 + 'px', fontFamily: "Roboto", textDecoration : 'underline'}} gutterBottom>Barbershop</Typography>
                <Paper sx={{width:600, height: 400 , backgroundColor: '#F4F6F6'}}>
                    <BarChart
                        width={500}
                        height={300}
                        data={this.state.barChart}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip width={50}  height={100}/>
                        <Legend />
                        <Bar dataKey="Bénéfice" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="Salaire" stackId="a" fill="#FF33F6" />
                        <Bar dataKey="Charges" stackId="a" fill="#8884d8" />
                        <Bar dataKey="Taxes" stackId="a" fill="#33F9FF" />
                        <Bar dataKey="Materiel" stackId="a" fill="#FFB533" />
                    </BarChart>
                </Paper>

            </div>
        )}
}