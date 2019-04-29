import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import Friend from './Friend';
import API from '../functions/API';
import styled from 'styled-components';
import Search from './Search';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import moment from 'moment';
import NotFound from './NotFound';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';

function FriendList({ onFetchFriends, setOnline, filterFriends, store: { friends }}) {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [_friends, setFriends] = useState([]);
  const documentTitle = document.title;

  useEffect(() => {
    if (friends.length === 0) {
      setLoading(true);
      fetch(`${API}/api/user/read.php`)
        .then(response => response.json())
        .then(friends => {
          onFetchFriends(friends.data);
          sortFriends(friends.data);
          setFriends(friends.data);
        })
        .then(() => setLoading(false)) 
    }
 
    return () => document.title = documentTitle;  
  }, [])
    
  
  function sortFriends(friends) {
    let sorted = friends;
    let online = [],
        offline = [],
        not_used = [];
    sorted.forEach(friend => {
      friend.last_activity = setFriendsOnline(friend.last_activity);
      friend.last_activity === 'Online' 
        ? online.push(friend) 
        : friend.last_activity 
          ? offline.push(friend)
          : not_used.push(friend)
    }); 
    sorted = online.concat(offline.concat(not_used));
    setOnline(sorted);
  }

  function handleSearch(e) {
    setSearchValue(e.target.value);
    const searchValue = e.target.value.toLowerCase();
    document.title = e.target.value || documentTitle;

    if (searchValue === '') {
      filterFriends(_friends);
      return;
    } 

    friends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchValue) || 
      friend.surname.toLowerCase().includes(searchValue) ||
      friend.position.toLowerCase().includes(searchValue)
    );
    filterFriends(friends);
  }

  function setFriendsOnline(time) {
    if (!time) return '';

    const lastActivity = moment(Number(time)).fromNow();
    if ((lastActivity.includes('секунд') || lastActivity.includes('минут')) && (parseInt(lastActivity) < 15 || !parseInt(lastActivity))) {
      return `Online`;
    } else {
      return `Последний визит: ${lastActivity}`;
    }
  }

  return (
    <Paper>
      {window.innerWidth < 600 ? <ResponsiveHeader title='Коллеги' /> : null}

      {loading ? <Loader minHeight={370} color='primary' /> 
        :
        <FriendWrapper>
          <Search 
            handleSearch={handleSearch} 
            searchValue={searchValue}
          />
          <List>
            {friends.map(friend  => 
              <Link 
                key={friend.id} 
                to={`id${friend.id}`}
              >
                <Friend
                  friend={friend} 
                />
              </Link>
            )} 
          </List>
          {friends.length === 0 ? <NotFound /> : null}
        </FriendWrapper>
      }
    </Paper>
  );
}

const FriendWrapper = styled.div`
  a {
    text-decoration: none;
  }
  ul {
    padding: 0;
    padding-bottom: 50px !important;
  }

  @media all and (max-width: 600px) {
    ul {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
`;

export default connect( state => ({ store: state }),
  dispatch => ({
    onFetchFriends: (friends) => {
      dispatch({ type: 'FETCH_FRIENDS', payload: friends })},
    filterFriends: (friends) => {
      dispatch({ type: 'FILTER_FRIENDS', payload: friends })},
    setOnline: (friends) => {
      dispatch({ type: 'SET_FRIENDS', payload: friends })}
  })
)(FriendList);