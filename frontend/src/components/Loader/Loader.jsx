import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const Loader = props => (
  <StyledLoader style={{ minHeight: props.minHeight }}>
    <CircularProgress color={props.color} />
  </StyledLoader>
)

const StyledLoader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Loader;