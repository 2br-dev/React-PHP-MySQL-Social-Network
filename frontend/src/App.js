import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';

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

              <Route exact path={'/id:user_id'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/friends'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/colleagues'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/favourites'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/gallery'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/tasks'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/learnings'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/messages'} render={ ()=> 
                <div className="container">
                  <MainPage />
                </div>
              }/>
              <Route exact path={'/news'} render={ ()=> 
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

