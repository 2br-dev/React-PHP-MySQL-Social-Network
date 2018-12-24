import React, { Component } from 'react';
import './css/SideNews.css';

class SideNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      importance: false,
    }
  }

  componentDidMount() {
    fetch(`http://akvatory.local/api/news/read.php`)
      .then(response => response.json())
      .then(news => this.setState({ news: news.records }))    
  }
  
  changeImportance() {
    this.setState({importance: !this.state.importance});
  }

  render() {
    const { news, importance } = this.state;

    return (
      <div>  
        <button onClick={this.changeImportance.bind(this)}>CHANGE IMPORTANCE</button>
        {news.map((item,i) => {
          if (importance) {
            if (item.importance == 1) {
              return (
                <p key={i}>{item.author}</p>
              )
            }
          } else {
            return (
              <p key={i}>{item.author}</p>
            )
          }
        })}  
      </div>  
    ) 
  }
}

export default SideNews;