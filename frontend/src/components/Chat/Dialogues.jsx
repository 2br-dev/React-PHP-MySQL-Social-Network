import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ChatItem from './ChatItem';
import API from '../functions/API';
import styled from 'styled-components';
import Search from '../FriendsList/Search';
import Paper from '@material-ui/core/Paper';
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring/renderprops';
import ChatRoom from './ChatRoom';

class FriendList extends Component {
  constructor(props){
    super(props);
    this.state = {
      friends: [],
      initial: [],
      searchValue: '',
      loading: true,
      documentTitle: document.title,
      completed: false,
      openRoom: false,
      index: 1,
      initialAnimation: false,
      direction: true
    }

    this.rebuildList = this.rebuildList.bind(this);
  }
    
  componentDidMount() {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(friends => {
        const data = friends.data.filter(friend => friend.id !== this.props.user_id);
        this.setState({ friends: data, initial: data, loading: false })
      })
      .catch(err => console.log(err))
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

  /**
  |--------------------------------------------------
  | переделываем массив списка друзей исходя из полученных сообщений
  |--------------------------------------------------
  */
  rebuildList = (chats) => {
    let friends = this.state.friends;
    chats.forEach(chat => {
      friends.find(friend => `id${friend.id}` === chat.users).message = chat.message;
    })
    let withMessages = Array(friends.find(friend => friend.hasOwnProperty('message')));
    let withoutMessages = Array(friends.find(friend => !friend.hasOwnProperty('message')));
    let sorted = withMessages.concat(withoutMessages);
    this.setState({ completed: true, friends: sorted });
  }

  /**
  |--------------------------------------------------
  | переключаем и анимируем комнату чата и список
  |--------------------------------------------------
  */
  openRoom = (chat, friend) => {
    if (!this.state.initialAnimation) this.setState({ initialAnimation: true });

    if (chat) {
      this.props.openChat(chat, friend);
    } else {
      this.rebuildList(this.props.store.chats);
      setTimeout(() => this.props.closeChat(friend), 570);
    }

    this.setState({ direction: !this.state.direction });

    setTimeout(() => this.setState(state => ({
      index: state.index === 1 ? 0 : 1,
    })), 300)
  }

  /**
  |--------------------------------------------------
  | массив того, что анимируем
  |--------------------------------------------------
  */
  pages = [
    style => (
      <animated.div style={{ ...style, position: 'absolute', width: '100%' }}>
        <ChatRoom
          openRoom={this.openRoom.bind(this)}
        />
      </animated.div>
    ),
    style => (
      <animated.div style={{ ...style, position: 'absolute', width: '100%' }}>
        <Search
          handleSearch={this.handleSearch}
          searchValue={this.searchValue}
        />
        <List>
          {this.state.friends.map(friend =>
            <ChatItem
              openRoom={this.openRoom.bind(this)}
              key={friend.id}
              friend={friend}
            />
          )}
        </List>
      </animated.div>
    )
  ]

  getDirection = direction => {
    if (direction) {
      return 'translateX(100%)';
    } else {
      return 'translateX(-100%)';
    }
  }

  render() {
    const { chats } = this.props.store;
    const { completed, friends, index, direction } = this.state;

    if (chats.length > 0 && friends.length > 0 && !completed) {
      this.rebuildList(chats);
    }

    return (
      <Paper>
        {this.state.loading ?
          <Loader minHeight={370} color='primary' />
          :
          <FriendWrapper>
            <Transition
              reset
              unique
              native
              items={index}
              from={this.state.initialAnimation ? { transform: this.getDirection(direction) } : { zIndex: 1 }}
              enter={{ transform: 'translateX(0%)' }}
              leave={{ transform: this.getDirection(!direction) }}
            >
              {index => this.pages[index]}
            </Transition>
          </FriendWrapper>
        }
      </Paper>
    );
  }
}

const FriendWrapper = styled.div`
  height: 432px;
  overflow: auto;
  overflow-x: hidden;
  position: relative;

  &::-webkit-scrollbar {
    width: 5px;
  } 
  &::-webkit-scrollbar-track {
    background-color: #fafafa;
  }
  &::-webkit-scrollbar-thumb {
    background: #1976d2; 
  }
  a {
    text-decoration: none;
  }
  ul {
    padding: 0;
    padding-bottom: 50px;
  }
`;

export default connect(
  state => ({ store: state }),
  dispatch => ({
    openChat: (chat, friend) => {
      dispatch({ type: 'OPEN_CHAT', payload: [chat, friend] })
    },
    closeChat: (friend) => {
      dispatch({ type: 'CLOSE_CHAT', payload: [null, friend] })
    },
  })
)(FriendList);