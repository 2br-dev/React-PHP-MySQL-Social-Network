import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export default function NotFound() {
  return (
    <Wrapper>
      <Typography variant='h6'>ничего не найдено</Typography>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  min-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: .35;
`;