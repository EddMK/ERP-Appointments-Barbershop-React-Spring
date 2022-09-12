import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from './components/Signup.js';
import App from './components/App';
import Login from './components/Login';
import Agenda from './components/Agenda';
import Menu from './components/Menu';
import Employee from './components/Employee';
import Admin from './components/Admin';
import Invoice from './components/Invoice';
import ListEmployees from './components/ListEmployees';
import Turnover from './components/Turnover';
import StatEmployee from './components/StatEmployee'
import Barbershop from './components/Barbershop';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
          	<Menu />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/agenda" element={<Agenda />} />
				<Route path="/employee" element={<Employee />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/invoice" element={<Invoice />} />
				<Route path="/employees" element={<ListEmployees />} />
				<Route path="/turnover" element={<Turnover />} />
				<Route path="/statEmployee" element={<StatEmployee />} />
				<Route path="/barbershop" element={<Barbershop />} />
			</Routes>
		</BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
