import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import Approved from './components/Approved';
import Restore from './components/Restore';

class App extends Component {
/*   constructor(props) {
    super(props);
    this.state = {
      routes: [
        "/id:user_id", 
        "/friends",
        "/colleagues",
        "/favourites",
        "/gallery",
        "/learnings",
        "/tasks",
        "/news",
        "/messages",
      ],
    };
  } */

  render() {
    /* const { routes } = this.state; */

    return (
      <BrowserRouter>
        <Switch>

              <Route path={'/id:user_id'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/friends'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/colleagues'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/favourites'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/gallery'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/tasks'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/learnings'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/messages'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route path={'/news'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>

          <Route path="/login" component={LoginForm}/>
          <Route path="/approved" component={Approved}/>
          <Route path="/restore" component={Restore}/>
        </Switch> 
      </BrowserRouter> 
    );
  }
}

export default App;

