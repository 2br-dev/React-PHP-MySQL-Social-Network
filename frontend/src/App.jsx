import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import Approved from './components/Approved';
import Restore from './components/Restore';
import Page404 from './components/Page404';
import Settings from './components/Settings';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComments, faHeart, faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';

library.add(faComments, faHeart, faEnvelope, faEdit)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>          
            <Route path='/id:user_id' component={MainPage}/>
            <Route path='/friends'    component={MainPage}/>
            <Route path='/colleagues' component={MainPage}/>
           {/*  <Route path='/favourites' component={MainPage}/>
            <Route path='/gallery'    component={MainPage}/> */}
            <Route path='/tasks'      component={MainPage}/>
            <Route path='/learnings'  component={MainPage}/>
            <Route path='/messages'   component={MainPage}/>
            <Route path='/news'       component={MainPage}/> 
            <Route path='/settings'   component={Settings}/>
            <Route path="/login"      component={LoginForm}/>
            <Route path="/approved"   component={Approved}/>
            <Route path="/restore"    component={Restore}/>
            <Route path="/404"        component={Page404}/>
            <Route path="/:any"       component={Page404}/>
        </Switch> 
      </BrowserRouter> 
    );
  }
}

export default App;

