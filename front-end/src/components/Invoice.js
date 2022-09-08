import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Paper, Grid , Typography}from '@mui/material/';
import './Admin.css';
import moment from "moment";

export default class Invoice extends  PureComponent{
    
    constructor(props){
        super(props);
        this.state = {
            turnover : null,
            evolutionCommerce : null,
            evolutionCommerceBarbershop : null
        };
		    // faire en sorte que le premier du mois il paye tout 
    }

    render(){
		return(
            <div>
                <h1>Invoice</h1>
            </div>
        )
    }


}