import React, { Fragment, useState, useEffect } from 'react';
import Header from '../Header';
import MainpageHeader from '../MainpageHeader';
import Nav from '../Navigation/Navigation';
import { connect } from 'react-redux';
import API from '../functions/API';
import Loader from '../Loader/Loader';
import CalendarContainer from './CalendarContainer';

function index() {
  const [user, setUser] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/user/info.php`)
      .then(response => response.json())
      .then(user => setUser(user))
      .then(() => setLoading(false))
      .catch(err => console.log(err))
  }, [])

  return (
    <Fragment>
      <MainpageHeader 
        user={user} 
      />
      <div className="container">
        <Header />
        <Nav user_logged_id={user.id} />
      </div> 

      {isLoading 
        ? <Loader minHeight={370} />
        : <CalendarContainer user={user} /> }
  </Fragment>
  )
}

export default connect(state => ({ store: state }))(index);