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
    var NEWS_COUNTER = 0;

    return (
      <div className="news">  
        <div className="news-btns">
          <button onClick={this.changeImportance.bind(this)}
                  className={importance ? 'news-btns-enabled' : ''}>Все новости</button>
          <button onClick={this.changeImportance.bind(this)} 
                  className={!importance ? 'news-btns-enabled' : ''}>Только важное</button>
        </div>   
          {news.map((item,i) => {  
         
            if (importance) {
              if (item.importance == 1 && NEWS_COUNTER < 3) {
                NEWS_COUNTER++;
                return (
                <div key={i} className="news-item news-important">  
                  <div className="news-item-header">
                    <p className="news-item-header__author">{item.author}</p>
                    <p className="news-item-header__date">{item.date}</p>
                  </div>
                  <div className="news-item-title">{item.title}</div>
                  <div className="news-item-text" dangerouslySetInnerHTML={{__html: item.text}}></div>
                  <div className="news-item-comment">
                    <img src={window.location.origin + `/img/icons/comment.png`}></img><p>0 комментариев</p>     
                  </div>
                </div> 
                )
              }
            } else {
              if (i < 3) {
                return (
                  <div key={i} className={item.importance === '1' ? "news-item news-important" : "news-item"}>  
                    <div className="news-item-header">
                      <p className="news-item-header__author">{item.author}</p>
                      <p className="news-item-header__date">{item.date}</p>
                    </div>
                    <div className="news-item-title">{item.title}</div>
                    <div className="news-item-text" dangerouslySetInnerHTML={{__html: item.text}}></div>
                    <div className="news-item-comment">
                      <img src={window.location.origin + `/img/icons/comment.png`}></img><p>0 комментариев</p>     
                    </div>
                  </div> 
                )
              }
            }
          })}    
          <button className="news-button" onClick={() => {this.props.handleChangeSection('news'); window.scrollTo(0,0)}}>КО ВСЕМ НОВОСТЯМ</button> 
      </div>  
    ) 
  }
}

export default SideNews;