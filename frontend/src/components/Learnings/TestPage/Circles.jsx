import React from 'react';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';

export default function Circles({ questions, answered, skipped }) {
  function getStatus(index, type) {
    let isAnswered = answered.includes(index);
    let isSkipped = skipped.includes(index);
    
    if (type === 'class' && !isAnswered && !isSkipped) {
      return 'default-badge';
    } else if (type === 'class') {
      return '';
    }

    if (type === 'color' && isAnswered) {
      return 'primary';
    } else {
      return 'secondary'
    }
  }

  return (
    <Container>
      {questions.map((_, i ) => 
        <Badge 
          key={i}
          badgeContent={i + 1} 
          color={getStatus(i, 'color')} 
          className={getStatus(i, 'class')}
        >{''}</Badge>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > span {
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
  .default-badge span {
    background: #F9A825;
  }
`;
