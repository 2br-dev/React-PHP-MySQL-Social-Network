import React from 'react';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

export default function Legend() {
  return (
    <Container>
      <div>
        <Badge children={true} color='primary'className='default-badge'>{''}</Badge>
        <Typography variant='caption' className='caption'>Вопрос ожидает ответа</Typography>
      </div>
      <div>
        <Badge children={true}  color='primary'>{''}</Badge>
        <Typography variant='caption' className='caption'>Вы ответили на этот вопрос</Typography>
      </div>
      <div>
        <Badge color='secondary'>{''}</Badge>
        <Typography variant='caption' className='caption'>Вы пропустили этот вопрос</Typography>
      </div>
    </Container>
  )
}

const Container = styled.div`
  margin: 35px 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  > div > span {
    width: 45px;
    height: 30px;
    margin: 10px 0 0;
    > span {
      width: 30px;
      height: 30px;
      transform: unset;
      left: 0;
      margin: auto;
    }
  }
  > div {
    align-items: center;
    display: flex;
    .caption {
      width: unset;
      height: unset;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
  .default-badge span {
    background: #F9A825;
  }
`;