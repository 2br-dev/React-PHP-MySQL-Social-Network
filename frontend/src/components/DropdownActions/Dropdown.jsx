import React from 'react';
import styled from 'styled-components';
import Select from './Select';

export default function Dropdown() {
  return (
    <Wrapper>
      <Select />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  > div {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 20px;
  }
  button {
    margin: 0;
  }
`;