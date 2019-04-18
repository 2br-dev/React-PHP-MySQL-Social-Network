import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComments, faHeart, faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';
import routes from './routes';

library.add(faComments, faHeart, faEnvelope, faEdit)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {routes.map(route =>
            <Route 
              path={route.path} 
              component={route.component} 
              key={route.description}
            />
          )}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

