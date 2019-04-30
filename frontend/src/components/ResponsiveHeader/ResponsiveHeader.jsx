import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import UserAvatar from './UserAvatar';
import Dropdown from '../DropdownActions/Dropdown';
import Loader from '../Loader/Loader';

export default function ResponsiveHeader({ name, surname, title }) {
  // eslint-disable-next-line
  const [_, updateState] = useState(0);

  return (
    <Wrapper id="updateUser" onClick={() => updateState(Math.random())}>
      <UserAvatar />
      {title ?
        <Typography variant='h6'>{title}</Typography>
        : name && surname 
          ? <Typography variant='h6'>{`${name} ${surname}`}</Typography>
          : <Loader />
      }
      <Dropdown />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); 
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 60px;
  position: fixed;
  top: 0;
  width: 100vw;
  background: #fff;
  z-index: 10;

  h6 {
    font-weight: 700;
    font-size: 16px;
  }

  & :last-child {
    margin: 0;
    width: 35px;
  }
`;