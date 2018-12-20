import React, {Component} from 'react';
import Header from './Header';
import MainpageHeader from './MainpageHeader';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Header />
        <MainpageHeader />
      </div>
    );
  }
}

export default MainPage;