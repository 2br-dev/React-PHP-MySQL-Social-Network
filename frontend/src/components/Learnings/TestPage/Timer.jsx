import React, { useState } from 'react';
import Countdown from 'react-countdown-now';
import { connect } from 'react-redux';
import { Typography, Tooltip } from '@material-ui/core/';
import styled from 'styled-components';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import AlarmIcon from '@material-ui/icons/AlarmOn'

const Completionist = () => <Typography variant='h3' id='timer' className='completed'>Время вышло</Typography>;

const Timer = ({ hours, minutes, seconds, completed, api }) => {
  function getTime(h, m, s) {
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;

    if (h === '00') {
      return `${m}:${s}`;
    } else {
      return `${h}:${m}:${s}`;
    }
  }

  if (completed) {
    return <Container><Time><Completionist /></Time></Container>;
  } else {
    return (
      <Container>
        <Time> 
          <AlarmIcon className='time-icon' />
          <Typography variant='h3' id='timer'>{getTime(hours, minutes, seconds)}</Typography>
        </Time>
        <Controls>
          <Tooltip title='старт' onClick={api.start}><PlayIcon style={api.isPaused() ? { pointerEvents: 'all' } : { pointerEvents: 'none', opacity: 1 }} /></Tooltip>
          <Tooltip title='пауза' onClick={api.pause}><PauseIcon style={api.isPaused() ? { pointerEvents: 'none', opacity: 1 } : { pointerEvents: 'all'}} /></Tooltip>   
        </Controls>
      </Container>
    )
  }
};

const CountdownTimer = ({ store, pauseTest, resumeTest, finish }) => {
  // eslint-disable-next-line
  const [time, setTime] = useState(store.tests[0] && store.tests[0].hasOwnProperty('time') ? Date.now() + Number(store.tests[0].time) * 60 * 1000 : 0);

  return (
    <Countdown
      controlled={false}
      autoStart={true}
      date={time}
      renderer={Timer}
      onPause={pauseTest}
      onStart={resumeTest}
      onComplete={finish}
    />
  )
}

const Controls = styled.div`
  svg {
    font-size: 40px;
    opacity: .15;
    transition: .57s ease;
    cursor: pointer;
    :hover {
      opacity: .9;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Time = styled.div`
  display: flex;
  justify-content: space-between;
  width: 25%;
  align-items: center;
  h3 {
    opacity: .15;
  }
  .time-icon {
    font-size: 42px;
    opacity: .15;
  }
  .completed {
    font-size: 32px;
    margin-top: 64px;
  }
`;

export default connect(
  state => ({ store: state }),
)(CountdownTimer);