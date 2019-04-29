import React, { Fragment } from 'react';
import Header from '../Header';
import MainpageHeader from '../MainpageHeader';
import Nav from '../Navigation/Navigation';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import CalendarContainer from './CalendarContainer';

function index({  store: { user }} ) {
  return (
    <Fragment>
      <MainpageHeader />
      <div className="container"> 
        <Header />
        <Nav />
      </div> 

      {!user.hasOwnProperty('name') 
        ? <Loader minHeight={370} />
        : <CalendarContainer user={user} /> }
  </Fragment>
  )
}

export default connect(state => ({ store: state }))(index);