import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './home-page';
import './App.css';

export default function App(props) {
  return (
    <Router>
      <div className="app">
        <main>
          <Route exact path="/" component={Home}/>
        </main>
      </div>
    </Router>
  );
};