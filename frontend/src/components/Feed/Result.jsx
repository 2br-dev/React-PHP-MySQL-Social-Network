import React from 'react';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Result({ item }) {
  const result = `${parseFloat(item.result.replace(',','.')) / item.questions.split(',').length * 100}%`;

  return (
    <ResultWrapper>
      <UserAvatar avatar={item.avatar} type={item.type} />
      <ResultContent>
        <Typography variant='subtitle2' color='primary'>Вы прошли тестирование</Typography>
        <div style={{ padding: '10px 15px', background: '#fafafa', borderRadius: 10, margin: '5px 0' }}>
          <Typography variant='h3' color='primary'>{result}</Typography>
          <Typography variant='caption'>Оставшееся время: {item.estimated_time}</Typography>
        </div>
        <Typography variant='caption'>
          <b style={{ fontWeight: 500}}>{moment(Number(item.created_at)).calendar()}</b>&nbsp;
          — &nbsp;
          <Link to={`/test/${item.id}`} style={{  
            color: '#1976d2', 
            textDecoration: 'none'
          }}
          >посмотреть детальные результаты</Link>
        </Typography>
      </ResultContent>
    </ResultWrapper>
  )
}

const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  
  @media all and (max-width: 600px) {
    align-items: flex-start;
  }
`;

const ResultContent = styled.div`
  width: 100%;
  padding-right: 25px;
`;
