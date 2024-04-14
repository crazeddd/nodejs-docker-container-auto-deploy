import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Panel from './components/Panel';
import NotFound from './components/NotFound';

import './index.css';


function App() {
  return (
    <Router>
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/panel" component={Panel} />
      <Route component={NotFound} />
      </Switch>
    </Router>
  );
}


export default App;
