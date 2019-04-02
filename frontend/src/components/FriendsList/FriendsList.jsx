import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Friend from './Friend';
import API from '../functions/API';
import styled from 'styled-components';
import Search from './Search';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Loader from '../Loader/Loader';

export default class FriendList extends Component {
  state = { 
    friends: [], 
    initial: [],
    searchValue: '',
    loading: true,
    documentTitle: document.title
  }

  componentDidMount() {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(friends => this.setState({ 
        friends: friends.data.filter(friend => friend.id !== this.props.user_id.toString()), 
        initial: friends.data.filter(friend => friend.id !== this.props.user_id.toString()), 
      })) 
      .then(() => this.setState({ loading: false }))   
  }

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
    const searchValue = e.target.value.toLowerCase();

    document.title = e.target.value || this.state.documentTitle;

    let friends = this.state.initial;
    friends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchValue) || 
      friend.surname.toLowerCase().includes(searchValue) ||
      friend.position.toLowerCase().includes(searchValue)
    );
    this.setState({ friends });
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
              {this.state.friends.map(friend  => 
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