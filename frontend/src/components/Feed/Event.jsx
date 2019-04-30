import React from 'react';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export default function Result({ item }) {
  function getRemainingPlaces(max, signed) {
    let maxUsers = Number(max);
    let signedUsers = signed.split(',').length;
    if (signed === '') signedUsers = 0;
    let remaining = maxUsers - signedUsers;

    if (remaining === 0) {
      return 'Свободных мест нет.'
    } else if (remaining === 1) {
      return 'Можно записаться, осталось одно место.'
    } else if (remaining > 5) {
      return `Можно записаться, осталось ${remaining} мест.`
    } else if (remaining > 1) {
      return `Можно записаться, осталось ${remaining} места.`
    }
  }

  function isFuture() {
    return moment(item.endDate).diff(moment(new Date()));
  }

  return (
    <EventWrapper>
      <UserAvatar avatar={item.avatar} type={item.type} />
      <EventContent>
        <Typography variant='subtitle2' color='primary'>{`Новое событие в календаре — ${item.title}`}</Typography>
        <Typography variant='body1' style={{ padding: '10px 15px', background: '#fafafa', borderRadius: 10, margin: '5px 0' }}>{`${moment(item.startDate).calendar()} — ${item.endDate.slice(-5)}`}</Typography>

        {item.max !== '0' && isFuture() > 0 ? <Typography variant='caption'>{getRemainingPlaces(item.max, item.signed)}</Typography> : null}
        <Typography variant='caption' style={{ marginTop: 5 }}>
          Событие добавлено в календарь — &nbsp;
          <b style={{ fontWeight: 500}}>{moment(Number(item.created_at)).calendar()}</b>
        </Typography>
      </EventContent>
    </EventWrapper>
  )
}

const EventWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  
  @media all and (max-width: 600px) {
    align-items: flex-start;
  }
`;

const EventContent = styled.div`
  width: 100%;
  padding-right: 25px;
`;
