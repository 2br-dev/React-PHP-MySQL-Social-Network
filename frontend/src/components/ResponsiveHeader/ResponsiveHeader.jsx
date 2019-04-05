import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

export default function ResponsiveHeader(props) {
  return (
    <Wrapper>
      <Typography variant='h6'>{props.title}</Typography>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); 
  height: 80px;
  padding: 36px 20px 15px;
  font-size: 24px;
  background: #fff;
`;