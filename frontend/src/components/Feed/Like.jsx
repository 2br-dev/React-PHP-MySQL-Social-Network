import React from 'react';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export default function Comment({ item }) {
  return (
    <LikeWrapper>
      <UserAvatar avatar={item.avatar} type={item.type} />
      <LikeContent>
        <Typography variant='subtitle2' color='primary'>{`${item.name} ${item.surname}`}</Typography>
        <Typography variant='caption'>
          <b style={{ fontWeight: 500}}>{moment(Number(item.created_at)).calendar()}</b> — понравилась ваша запись&nbsp;
          <b style={{ fontWeight: 500}}>{item.title}</b>
        </Typography>
      </LikeContent>
    </LikeWrapper>
  )
}

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const LikeContent = styled.div`
  width: 100%;
  padding-right: 25px;
`;