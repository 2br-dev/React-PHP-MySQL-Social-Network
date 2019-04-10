import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@material-ui/core/';
import { fetchTests, fetchTestsById } from '../Effects/fetches';
import Loader from '../Loader/Loader';
import TestList from '../List/List';
import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';
import styled from 'styled-components';
import NoTests from './NoTests';
import AdminPanel from './AdminPanel';
import { connect } from 'react-redux';
import UserPanel from './UserPanel';

var isAdmin = true;

function Tests(props) {
  const { tests } = props.store;
  const [loading, setLoading] = useState(tests.length === 0 ? true : false);

  useEffect(() => {
    if (tests.length === 0) {
        async function fetchData() {
        const response = isAdmin ? await fetchTests() : await fetchTestsById();
        props.fetchTests(response);
        setLoading(false);
      }
      fetchData(); 
    }
  }, []);

  return (
    <Paper style={{ minHeight: 300, position: 'relative' }}>

      {!loading && isAdmin ? <AdminPanel items={tests} /> : null}

      {!loading && !isAdmin ? <UserPanel /> : null}

      {loading 
        ? <Loader minHeight={350} color='primary' /> 
        : tests && tests.length > 0 && !isAdmin
          ? <TestList items={tests}/>
          : !isAdmin ? <NoTests /> : null}

      <Buttons>
        <Button  
          color='primary' 
          onClick={props.closeSection}
        >
          <KeyboardBackspace />
          Назад 
        </Button>
      </Buttons>
    </Paper>
  )
}

const Buttons = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 0;
  button {
    width: 100%;
    height: 50px;
    margin: 20px auto 0;
    background: #fff;
    span > svg {
      margin-right: 10px;
    }
    :hover {
      background: #1976d2;
      color: white;
      svg {
        color: white;
      }
    }
  }
`;

export default connect(
  state => ({ store: state }),
  dispatch => ({
    fetchTests: tests => {
      dispatch({ type: 'FETCH_TESTS', payload: tests })
    }
  })
)(Tests);