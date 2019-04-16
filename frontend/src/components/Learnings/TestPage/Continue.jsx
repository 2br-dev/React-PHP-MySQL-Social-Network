import React, { useState, useEffect, Fragment } from 'react';
import { Typography, Button } from '@material-ui/core';
import styled from 'styled-components';
import Test from './Test';
import API from '../../functions/API';

export default function Continue() {
  const [object, setObject] = useState([]);
  const [isContinue, setContinue] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.replace('/test/', "");
    fetch(`${API}/api/result/getResults.php?test_id=${id}`)
      .then(response => response.json())
      .then(results => {
        let testData = [];
        testData.push(results.data.estimated_time);
        testData.push({
          answered: [],
        });

        results.data.object = JSON.parse(results.data.object);
        results.data.object.forEach(result => {
          result.question_data = JSON.parse(result.question_data);
          testData[1].answered.push(result.question_data.id);
        });
        setObject(testData)   
      })
      .catch(err => console.log(err))
  }, []);

  return (
    <Container>
      {isContinue 
        ? <Test object={object} />
        : <Fragment>
          <Typography variant='h4' style={{ marginBottom: 10 }}>Тест стартовал.</Typography>
          <Typography variant='body1'>Вы можете продолжить тестирование, нажав на кнопку ниже.</Typography>
          <Buttons>
            <Button variant='contained' color='primary' onClick={() => setContinue(true)}>продолжить</Button>
            <Button variant='outlined' color='primary' component='a' href='/'>на главную</Button>
          </Buttons>
        </Fragment> 
      }
    </Container>
  )
}

const Container = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
`;
const Buttons = styled.div`
  margin-top: 30px;
  button {
    margin: 0 10px;
  }
`;