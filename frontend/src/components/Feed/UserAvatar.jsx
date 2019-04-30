import React from 'react';
import styled from 'styled-components';
import defaultAvatar from '../img/photos/images.png';
import Heart from '@material-ui/icons/Favorite';
import Calendar from '@material-ui/icons/InsertChart';
import News from '@material-ui/icons/NewReleases';
import Task from '@material-ui/icons/ListAlt';
import Comment from '@material-ui/icons/Comment';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

export default function UserAvatar({ avatar, type }) {
  
  function drawBadge() {
    switch (type) {
      case 'likes':
        return <Heart style={{ color: '#ff4800', top: '2px' }} />
      case 'tasks':
        return <Task style={{ color: '#6a1b9a' }} />
      case 'results':
        return <VerifiedUser style={{ color: '#2e7d32' }} />
      case 'events':
        return <Calendar style={{ color: '#1976d2' }} />
      case 'comments':
        return <Comment style={{ color: '#1976d2' }} />
      case 'news':
        return <News style={{ color: '#1976d2' }} />
      default:
        return <Heart style={{ color: '#ff4800', top: '2px' }} />  
    }
  }

  return (
    <Wrapper
      style={{ background: `url("${avatar ? avatar : defaultAvatar}") center center / cover no-repeat` }}
    >
      <Badge>{drawBadge()}</Badge>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 50%;
  min-width: 80px;
  margin: 15px 25px;
  min-height: 80px;
  position: relative;

  @media all and (max-width: 600px) {
    margin: 0 15px;
    min-width: 50px;
    min-height: 50px;
  }
`;

const Badge = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 2px 2px 3px 0px #2323;
  svg {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    margin: auto;
    font-size: 18px;
  }
`;