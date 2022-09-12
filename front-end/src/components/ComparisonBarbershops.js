import React, { PureComponent } from 'react';
import {Paper, Autocomplete, Grid , Typography, InputAdornment, Button, TextField}from '@mui/material/';
import moment from "moment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default class ComparisonBarbershops extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            barChart : null,
            from : "",
            valueInput : moment().subtract(1, 'months').format('YYYY-MM') ,
            list : []
        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    componentDidMount() {
         fetch("http://localhost:8080/admin/barChart/"+parseInt(moment().subtract(1, 'months').format('MM'))+"/"+moment().year()+"/").then((res) => res.json()).then( (json) => this.changeJsonData(json));
         fetch("http://localhost:8080/admin/firstAppoitment/").then((res) => res.json()).then( (json) => this.getListAutocomplete(json));   
    }

    getListAutocomplete(from){
      var dateStart = moment(from);
      var dateEnd = moment();
      var timeValues = [];

      while (dateEnd > dateStart) {
        timeValues.push(dateStart.format('YYYY-MM'));
        dateStart.add(1,'month');
      }

      if(dateEnd.format('YYYY-MM') === timeValues[timeValues.length - 1]){
        timeValues.pop()
      }

      console.log(timeValues);
      this.setState({ list : timeValues})
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

    handleChangeDate(e){
      this.setState({valueInput : e});
      if(e === null){
        this.setState({barChart : null});
      }else{
        console.log(e);
        var year = parseInt(e.slice(0, 4));
        var month = parseInt(e.slice(5, 7));
        fetch("http://localhost:8080/admin/barChart/"+month+"/"+year+"/").then((res) => res.json()).then( (json) => this.changeJsonData(json));
      }
    }

    render(){
		return(
              <Paper sx={{width:600, height: 450 , backgroundColor: '#F4F6F6'}}>
                <Typography variant="h5" align="center" gutterBottom>Compare barbershops by month</Typography>

                <Autocomplete
                  disablePortal
                  id="barbershop"
                  value = {this.state.valueInput}
                  options={this.state.list}
                  sx={{ width: 300, marginTop : 2 }}
                  onChange={(event,newValue) => { this.handleChangeDate(newValue)}}
                  renderInput={(params) => <TextField {...params} label="Choose a month" />}
                />
                
                    <BarChart
                        width={500}
                        height={350}
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

        )}
}