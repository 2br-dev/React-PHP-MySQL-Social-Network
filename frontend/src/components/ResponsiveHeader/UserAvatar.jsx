import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader/Loader';
import noPhoto from '../img/photos/images.png';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function UserAvatar({ store: { user }}) {
  return (
    <Wrapper>
      {user.hasOwnProperty('avatar') 
        ? 
          <Link to={`/id${user.id}`}>
            <Avatar 
              style={{ background: `url(${!user.avatar ? user.avatar : noPhoto}) no-repeat center/cover` }} 
            />
          </Link>
        : <Loader />}
    </Wrapper> 
  )
}

const Wrapper = styled.div`
  max-width: 35px;
`;
const Avatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

export default connect(state => ({ store: state }))(UserAvatar)