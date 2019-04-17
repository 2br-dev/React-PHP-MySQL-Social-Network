import React from 'react';
import styled from 'styled-components';
import Select from './Select';

export default function Dropdown(props) {
  return (
    <Wrapper>
      <Select 
        userInfo={props.userInfo} u
        ser_logged_id={props.user_logged_id} 
        fetchUserInfo={props.fetchUserInfo} 
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;