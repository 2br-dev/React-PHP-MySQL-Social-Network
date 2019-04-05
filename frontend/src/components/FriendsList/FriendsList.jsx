import React, { Component } from 'react';
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

class FriendList extends Component {
  state = { 
    friends: [], 
    searchValue: '',
    loading: true,
    documentTitle: document.title
  }

  componentDidMount() {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(friends => this.setState({ 
        friends: friends.data.filter(friend => friend.id !== this.props.user_id.toString())
      })) 
      .then(() => this.props.onFetchFriends(this.state.friends))
      .then(() => this.sortFriends())
      .then(() => this.setState({ loading: false }))   
  }

  sortFriends = () => {
    let sorted = this.state.friends;
    let online = [],
        offline = [],
        not_used = [];
    sorted.forEach(friend => {
      friend.last_activity = this.setOnline(friend.last_activity);
      friend.last_activity === 'Online' 
        ? online.push(friend) 
        : friend.last_activity 
          ? offline.push(friend)
          : not_used.push(friend)
    }); 
    sorted = online.concat(offline.concat(not_used));
    this.props.setOnline(sorted);
  }

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
    const searchValue = e.target.value.toLowerCase();

    document.title = e.target.value || this.state.documentTitle;

    let friends = this.state.friends;
    friends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchValue) || 
      friend.surname.toLowerCase().includes(searchValue) ||
      friend.position.toLowerCase().includes(searchValue)
    );
    this.props.filterFriends(friends);
  }

  setOnline = time => {
    if (!time) return '';

    const lastActivity = moment(Number(time)).fromNow();
    if ((lastActivity.includes('секунд') || lastActivity.includes('минут')) && (parseInt(lastActivity) < 15 || !parseInt(lastActivity))) {
      return `Online`;
    } else {
      return `Последний визит: ${lastActivity}`;
    }
  }

  componentWillUnmount = () => {
    document.title = this.state.documentTitle;
  }

  render() {
    return (
      <Paper>
        {
          this.state.loading ? 
            <Loader minHeight={370} color='primary' /> 
          :
          <FriendWrapper>
            <Search 
              handleSearch={this.handleSearch} 
              searchValue={this.searchValue}
            />
            <List>
              {this.props.store.friends.map(friend  => 
                <Link 
                  key={friend.id} 
                  to={`id${friend.id}`}
                  onClick={() => this.props.handleChangeUserId(friend.id)}
                >
                  <Friend
                    friend={friend} 
                  />
                </Link>
              )} 
            </List>
          </FriendWrapper>
        }
      </Paper>
    );
  }
}

const FriendWrapper = styled.div`
  a {
    text-decoration: none;
  }
  ul {
    padding: 0;
    padding-bottom: 50px;
  }

  @media all and (max-width: 600px) {
    ul {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
`;

export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    onFetchFriends: (friends) => {
      dispatch({ type: 'FETCH_FRIENDS', payload: friends })
    },
    filterFriends: (friends) => {
      dispatch({ type: 'FILTER_FRIENDS', payload: friends })
    },
    setOnline: (friends) => {
      dispatch({ type: 'SET_FRIENDS', payload: friends })
    }
  })
)(FriendList);