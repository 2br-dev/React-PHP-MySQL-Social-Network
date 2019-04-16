import React, { useEffect, useState, Fragment } from 'react';
import { fetchSingleTest } from '../../Effects/fetches';
import Loader from '../../Loader/Loader';
import { connect } from 'react-redux';
import TestContainer from './TestContainer';

function TestPage({ fetchTest }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.replace('/test/',"");
    async function fetchData() {
      const response = await fetchSingleTest(id);
      await response ? fetchTest(response) : window.location.href = '/404';
      await setLoading(false);  
    }
    fetchData(); 
  }, []);
  
  return (
    <Fragment>
      {loading ? <Loader minHeight='100vh' color='secondary' /> : <TestContainer /> }
    </Fragment>
  )
}

export default connect(
  state => ({ store: state }),
  dispatch => ({
    fetchTest: test => {
      dispatch({ type: 'FETCH_TEST', payload: test })
    }
  })
)(TestPage);