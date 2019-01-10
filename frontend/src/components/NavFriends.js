import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class NavFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
    }
  }

  componentDidMount() {
    fetch(`http://akvatory.local/api/user/read.php`)
      .then(response => response.json())
      .then(friends => this.setState({ friends: friends.records }))    
  }

  render() {
    return (
      <ul>
      {this.state.friends.map((friend, i) => {
        if (friend.id != this.props.user_logged_id) {                   
          return (
            <Link 
              key={i}
              to={`id${friend.id}`}
              onClick={() => this.props.handleChangeUserId(friend.id)}
            >
              {friend.name !== '' ? <li>`${friend.name} ${friend.surname}`</li> : <li>{friend.login}</li> }
            </Link>
          ) 
        } 
        })} 
      </ul>
    );
  }
}

export default NavFriends;