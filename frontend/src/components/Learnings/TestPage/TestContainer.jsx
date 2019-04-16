import React, { Fragment, useState, useEffect } from 'react';
import Header from '../../Header';
import Test from './Test';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import StartTestTemplate from './StartTestTemplate';
import BgBubbles from '../../BgBubbles';
import { connect } from 'react-redux';
import { startTest as startTestRequest, setupResult } from '../../Effects/requests';
import moment from 'moment';
import Finish from './Finish';
import Continue from './Continue';
import API from '../../functions/API';
import Loader from '../../Loader/Loader';

document.body.style.height = 'unset';

function TestContainer({ store }) {
  const [start, setStart] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = window.location.pathname.replace('/test/',"");
    fetch(`${API}/api/test/getStatus.php?id=${id}`)
      .then(response => response.json())
      .then(res => {
        switch(res) {
          case '1': 
            setFinished(true);
            break;
          case '0.5':
            setStarted(true);
            break
          default: return;  
        }
      })
      .then(() => setLoading(false))
      .catch(err => console.log(err))
  }, []);

  function startTest() {
    const test = store.tests[0]
    const id = window.location.pathname.replace('/test/',"");
    const testData = {
      test_id: test.id,
      user_id: test.user_id,
      user_name: test.user_name,
      date: moment().format('L'),
      estimated_time: test.estimated_time
    }

    setStart(true);
    startTestRequest(id);
    setupResult(testData);
  }

  return (
    <Fragment>
      <Header /> 
      <Container className='container'>
        <Paper style={styles.container}>
          {loading ? 
          <Loader minHeight={250} color="primary" /> :
          start
            ? <Test /> 
            : 
              !finished && !started 
              ? <StartTestTemplate start={startTest} /> 
              : finished ? <Finish /> : <Continue />
          }
        </Paper> 
      </Container>
      <BgBubbles cssClass='testing-bubbles' />
    </Fragment>
  )
}

const styles = {
  container: {
    margin: '200px auto 0',
    width: 'fit-content',
    minWidth: 600
  }
}

const Container = styled.div``;

export default connect(
  state => ({ store: state })
)(TestContainer);