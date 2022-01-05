import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import MainTemplate from "./MainTemplate.js";
import Upload from "./Upload.js";

function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="">
          <MainTemplate />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
