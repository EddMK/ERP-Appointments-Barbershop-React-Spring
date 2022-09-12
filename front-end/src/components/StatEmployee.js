import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Grid , Autocomplete, TextField, Typography}from '@mui/material/';
import moment from "moment";

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


export default class StatEmployee extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            hairdressers : [],
            choosen : null,
            dataGraph : {}
        };
        this.handleChangeHairdresser = this.handleChangeHairdresser.bind(this)
    }

     componentDidMount() {
        fetch("http://localhost:8080/admin/getHairdressers/").then((res) => res.json()).then( (json) =>{ console.log(json);   this.setState({hairdressers : json})  });
        //fetch("http://localhost:8080/admin/evolutionTurnoverHairdresser/").then((res) => res.json()).then( (json) => this.changeJsonData(json)); 
    }

    handleChangeHairdresser(newValue){
        this.setState({choosen : newValue })
        console.log(newValue.id)
        fetch("http://localhost:8080/admin/evolutionTurnoverHairdresser/"+newValue.id).then((res) => res.json()).then( (json) => this.changeJsonData(json)); 
    }

    changeJsonData(json){
        console.log(json);
        var array = json.map(([k, v]) => {
            var rObj = {};
            rObj.name = k;
            rObj.turnover = parseInt(v);
            return rObj;
        });
        this.setState({dataGraph : array.reverse()});
    }

    render(){
		return(
            <div className='statEmployee' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" gutterBottom>Statistique</Typography>
                <Autocomplete
						disablePortal
						id="barbershop"
						options={this.state.hairdressers}
						getOptionLabel={(option) => option.lastName + " " + option.firstName}
						sx={{ width: 300, marginTop : 2 }}
						onChange={(event,newValue) => { this.handleChangeHairdresser(newValue)}}
						renderInput={(params) => <TextField {...params} label="Choose a hairdresser" />}
				/>
                <LineChart
                    width={500}
                    height={300}
                    data={this.state.dataGraph}
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
                    <Line type="monotone" dataKey="turnover" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        )
    }

}
