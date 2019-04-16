import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import Loader from '../../Loader/Loader';
import API from '../../functions/API';
import { Typography, Button } from '@material-ui/core'; 
import ResultsList from './ResultsList';
import NotAnswered from './NotAnswered';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = window.location.pathname.replace('/test/', "");
    fetch(`${API}/api/result/getResults.php?test_id=${id}`)
      .then(response => response.json())
      .then(results => {
        results.data.not_answered = JSON.parse(results.data.not_answered);
        results.data.object = JSON.parse(results.data.object);
        results.data.object.forEach(result => {
          result.question_data = JSON.parse(result.question_data);
          result.question_data.variants = result.question_data.variants.split("\n");
          result.question_data.answers = result.question_data.answers.split("\n");
        });
        setResults(results.data)
      })
      .then(() => setLoading(false))
      .catch(err => console.log(err))
  }, []);

  function getPercent(value) {
    return parseFloat(value.replace(',','.')).toFixed(2) * 100 + '%';
  }

  function getColor(value) {
    return parseFloat(value.replace(',','.')).toFixed(2) >= 0.5 ? 'primary' : 'secondary';
  }

  return (
    <Container>
      {loading
        ? <Loader minHeight='300px' color='primary' />
        : (
          <Fragment>
            <Typography variant='h1' style={{ marginBottom: 20 }} color={getColor(results.result)}>{getPercent(results.result)}</Typography>
            <Typography variant='h6'>{results.user_name}</Typography>
            <Typography variant='caption'>Дата прохождения тестирования: {results.date}</Typography>
            {results.estimated_time ? <Typography variant='caption'>Оставшееся время: {results.estimated_time}</Typography> : null}

            <br />
            <br />
            <br />
            {results.object.map(result => 
                <ResultsList object={result} />
            )}  

            {results.not_answered.map(result => 
                <NotAnswered object={result} />
            )}        

            <Buttons>
              <Button variant='contained' component='a' href='/' color='primary'>на главную</Button>
              <Button variant='outlined' component='a' href='/learnings' color='primary'>обучение</Button>
            </Buttons>
          </Fragment>
      )}
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
const Buttons = styled.div`
  margin-top: 40px;
  a {
    margin-right: 10px;
  }
`;