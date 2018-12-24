import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={"/id:user_id"} render={ ()=> 
            <div className="container">
              <MainPage />
            </div>
          }/>
          <Route exact path="/login" render={ ()=> 
            <LoginForm />
          }/>
        </Switch> 
      </BrowserRouter> 
    );
  }
}

export default App;
