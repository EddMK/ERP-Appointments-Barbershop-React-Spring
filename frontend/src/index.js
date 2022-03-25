import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from './components/Signup.js';
import App from './components/App';
import Login from './components/Login';
import Agenda from './components/Agenda';
import Menu from './components/Menu';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
          	<Menu />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/agenda" element={<Agenda />} />
			</Routes>
		</BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
