import React from 'react';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import styled from 'styled-components';
import { Typography, Tooltip } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

export default function News({ item }) {
  function createImportantBar() {
    const Important = styled.div`
      display: flex;
      align-items: center;
      margin: 0;
      svg {
        color: rgba(0,0,0,.15);
        margin-right: 5px;  
      }
    `;
    return (
      <Tooltip title='Отмечено как важно' placement='top'>
        <Important>
          <WarningIcon />       
        </Important>
      </Tooltip>
    )
  }

  return (
    <NewsWrapper>
      <UserAvatar avatar={item.avatar} />
      <NewsContent>
        <Typography variant='subtitle2' color='primary' style={{ display: 'flex', alignItems: 'center' }}>
          {item.importance === '1' ? createImportantBar() : null}
          {`${item.name} ${item.surname} — ${item.title}`}
        </Typography>
        <Typography variant='body1' style={{ padding: '5px 0' }}>{item.text}</Typography>
        <Typography variant='caption'>
          <b style={{ fontWeight: 500}}>{moment(Number(item.created_at)).calendar()}</b>
        </Typography>
      </NewsContent>
    </NewsWrapper>
  )
}

const NewsWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const NewsContent = styled.div`
  width: 100%;
  padding-right: 25px;
`;
