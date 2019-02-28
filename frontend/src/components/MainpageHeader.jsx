import React, { Fragment } from 'react';
import './css/MainpageHeader.css';
import image from './img/photos/images.png';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import defaultBackground from './img/photos/Water image_Dreamstime.jpg';
import Loader from './Loader/Loader';

function MainpageHeader(props) {
  const { user } = props;
  const defaultAvatar = { backgroundImage: `url(${image})` };
  let uploadedAvatar = '';

  if (window.location.host.includes('localhost')) {
    uploadedAvatar = { backgroundImage: `url(${user.avatar})` };
  } else {
    uploadedAvatar = { backgroundImage: `url(frontend/public/${user.avatar})` };
  }

  return (
    <Wrapper>
      <header className="header">
        <div className="person">
          {props.loading
            ?
            <div className="person-image" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <Loader minHeight={125} color='primary' />
            </div>
            :
            <div className="person-image" style={user.avatar === '' ? defaultAvatar : uploadedAvatar}></div>
          }
          <div className="person-info">
            <div className="person-info__container">
              {!props.loading
                ?
                (<Fragment>
                  <p className="person-info__name">{`${user.name} ${user.surname}`}</p>
                  <p className="person-info__position">{user.position}</p>
                </Fragment>)
                :
                <Loader minHeight={70} color='primary' />}
            </div>
            <Button variant="contained" href="logout.php" color="primary">Выйти</Button>
          </div>
        </div>
        <Button variant="contained" href="/settings" color="primary">Настройки</Button>
      </header>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: url('${defaultBackground}') no-repeat center/cover;
`;

export default MainpageHeader;