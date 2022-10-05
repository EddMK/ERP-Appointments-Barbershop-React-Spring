import React, { PureComponent } from 'react';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Barbershop extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            barbershops : [],
            hairdressers : [],
            barberChoosen : null,
            evolutionExpense : [],
            evolutionHairdresser : []
        };
        this.handleBarbershopChange = this.handleBarbershopChange.bind(this);
        this.stringToColor = this.stringToColor.bind(this);

    }

    componentDidMount() {
        fetch('http://localhost:8080/barbershop/all').then(response => response.json()).then(data => this.setState({barbershops : data}));

            }

    changeJsonDataSecond(json){
      console.log(json)
      var array = json.map((e) => {
        var rObj = {};
        rObj['name'] = e[0][1]
        rObj[e[1][0]] = parseInt(e[1][1]);
        rObj[e[2][0]] = parseInt(e[2][1]);
        return rObj;
      });
      console.log(array);
      this.setState({evolutionHairdresser : array})

    }


    changeJsonData(json){
      console.log(json);
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
      //console.log(array);
      this.setState({evolutionExpense : array.reverse()});
    }

    handleBarbershopChange(value) {
      console.log(value);
      //value !== null
      if(value !== null){
        this.setState({barberChoosen : value});
        this.handleFillGraph(value.id);
      }
		
	}

  handleFillGraph(id){
    fetch('http://localhost:8080/user/hairdressByBarbershop/'+id).then(response => response.json()).then(data => this.setState({hairdressers : data}));
    fetch("http://localhost:8080/admin/evolutionExpenseBarbershop/"+id).then((res) => res.json()).then( (json) => this.changeJsonData(json));
    fetch("http://localhost:8080/admin/evolutionTurnoverBarbershopHairdresser/"+id).then((res) => res.json()).then( (json) => this.changeJsonDataSecond(json));
  }

  stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

    render(){
		return(
            <div className='Barbershop' style={{marginLeft: 160 + 'px'}}>
                <Typography variant="h4" align="center" gutterBottom  style={{marginBottom: 50 + 'px'}}>{this.state.barberChoosen === null ?  "Barbershop" : this.state.barberChoosen.name }</Typography>
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
                        data={this.state.evolutionHairdresser}
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
                            {this.state.hairdressers.map((element) =>{
                              return(<Bar  dataKey={element.lastName+" "+element.firstName} key={element.lastName+" "+element.firstName} fill={this.stringToColor(element.lastName+" "+element.firstName)} />)
                            })}                        
                        </BarChart>
                        </Paper>
                    </Grid>
                </Grid>
                
            </div>
    )}
}