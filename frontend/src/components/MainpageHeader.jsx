import React from 'react';
import './css/MainpageHeader.css';
import noPhoto from './img/photos/images.png';
import { Button, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import defaultBackground from './img/photos/Water image_Dreamstime.jpg';
import Loader from './Loader/Loader';
import SettingsIcon from '@material-ui/icons/Settings';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function MainpageHeader({ store: { user } }) {
  return (  
    <Wrapper>
      {window.innerWidth < 600 && !window.location.pathname.includes('id') ? null :
      <header className="header" style={{ zIndex: 2, position: 'relative' }}>
        <div className="person">
          {user.length === 0
            ?
            <div className="person-image" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <Loader minHeight={125} color='primary' />
            </div>
            :
              <Link to={`/id${user.id}`}>
                <div className="person-image" style={{ backgroundImage: `url(${user.avatar === '' ? noPhoto : user.avatar})` }}></div>
              </Link>
          }
          <div className="person-info">
            <div className="person-info__container">
              {user.hasOwnProperty('name') 
                ?
                <Tooltip placement="bottom" title='Перейти на страницу профиля'>
                  <Link to={`/id${user.id}`} style={{ textDecoration: 'none', color: '#000', cursor: 'pointer' }}>
                    <p className="person-info__name">{`${user.name} ${user.surname}`}</p>
                    <p className="person-info__position">{user.position}</p>
                  </Link>
                </Tooltip>
                :
                <Loader minHeight={70} color='primary' />}
            </div>
            <Button variant="contained" href="logout.php" color="primary">Выйти</Button>
          </div>
        </div>
        <Button variant="contained" href="/settings" color="primary">{window.innerWidth > 600 ? 'Персональные данные' : <SettingsIcon />}</Button>
      </header>}
      <Backdrop />
    </Wrapper>
  )
}
const Wrapper = styled.div`
  background: url('${defaultBackground}') no-repeat center/cover;
  background-attachment: fixed;
  position: relative;
  box-shadow: 0px -4px 4px 0px inset rgba(0,0,0,0.15)
`;
const Backdrop = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.10);
  z-index: 1;
`;

export default connect(
  state => ({ store: state })
)(MainpageHeader);