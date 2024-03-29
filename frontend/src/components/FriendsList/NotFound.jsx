import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export default function NotFound() {
  return (
    <Wrapper>
      <Typography variant='h6' style={{ opacity: .3 }}>совпадений не найдено</Typography>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 555px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
   
  @media all and (max-width: 600px) {
    height: calc(100vh - 140px);
    margin-top: -75px;
  }
`;