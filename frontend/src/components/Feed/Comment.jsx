import React from 'react';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export default function Comment({ item }) {
  return (
    <CommentWrapper>
      <UserAvatar avatar={item.avatar} type={item.type} />
      <CommentContent>
        <Typography variant='subtitle2' color='primary'>{`${item.name} ${item.surname}`}</Typography>
        <Typography variant='body1' style={{ padding: '10px 15px', background: '#fafafa', borderRadius: 10, margin: '5px 0' }}>{item.text}</Typography>
        <Typography variant='caption'>
          <b style={{ fontWeight: 500}}>{moment(Number(item.created_at)).calendar()}</b> — {item.sex === "женский" ? 'оставила ' : 'оставил '} комментарий к вашей новости&nbsp;
          <b style={{ fontWeight: 500}}>{item.title}</b>
        </Typography>
      </CommentContent>
    </CommentWrapper>
  )
}

const CommentWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  
  @media all and (max-width: 600px) {
    align-items: flex-start;
  }
`;

const CommentContent = styled.div`
  width: 100%;
  padding-right: 25px;
`;
