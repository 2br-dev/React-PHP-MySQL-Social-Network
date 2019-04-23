import React from 'react';
import styled from 'styled-components';
import defaultAvatar from '../img/photos/images.png';

export default function UserAvatar({ avatar }) {
  return (
    <Wrapper
      style={{ background: `url("${avatar ? avatar : defaultAvatar}") center center / cover no-repeat` }}
    />
  )
}

const Wrapper = styled.div`
  border-radius: 50%;
  min-width: 80px;
  margin: 15px 25px;
  min-height: 80px;
`;