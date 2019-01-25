import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './css/SideNews.css';
import SingleNews from './SingleNews';
import Switch from '@material-ui/core/Switch';

class SideNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      importance: false,
      singleNews: false,
      singleNewsData: [],
      singleNewsId: '',
      comments: []
    }
    this.reloadComponent = this.reloadComponent.bind(this);
  }

  componentDidMount() {
    this.reloadComponent();       
  }

  async reloadComponent() {
    await fetch(`http://akvatory.local/api/news/read.php`)
      .then(response => response.json())
      .then(news => this.setState({ news: news.records }))
    await fetch(`http://akvatory.local/api/news/getcomments.php`)
      .then(response => response.json())
      .then(comments => this.setState({ comments: comments.records }))
  }
  
  // переходим к конкретной новости
  goToSingleNews = id => this.setState({ singleNews: true, singleNewsId: id });

  // закрываем новость 
  closeNews = () => {
    this.setState({ singleNews: false, singleNewsId: '' });
    this.reloadComponent();
  }

  changeImportance = () => this.setState({ importance: !this.state.importance });

  getNoun = number => {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) return 'комментариев';
    number %= 10;
    if (number == 1) return 'комментарий';
    if (number >= 2 && number <= 4) return 'комментария';
    return 'комментариев';
  }

  render() {
    const { news, importance, singleNews, singleNewsId, comments } = this.state;
    const { user } = this.props;
    var NEWS_COUNTER = 0;

    return (
      <>
      <div className="news-btns">
        Только важные новости
        <Switch color='default' onClick={this.changeImportance.bind(this)}  /> 
      </div>
      <div className="news">
        {news.map((item, i) => {

          if (importance) {
            if (item.importance === '1' && NEWS_COUNTER < 3) {
              NEWS_COUNTER++;
              return (
                <div key={i} className="news-item news-important">
                  <div className="news-item-header">
                    <p className="news-item-header__author">{item.author}</p>
                    <p className="news-item-header__date">{item.date}</p>
                  </div>
                  <div className="news-item-title">{item.title}</div>
                  <div className="news-item-text" dangerouslySetInnerHTML={{ __html: item.text }}></div>
                  <div className="news-item-comment">
                    <img alt='' src={window.location.origin + `/img/icons/comment.png`}></img><p>0 комментариев</p>
                  </div>
                </div>
              )
            }
          } else {
            if (i < 3) {
              return (
                <div key={i} className={item.importance === 1 ? "news-item news-important" : "news-item"}>
                  <div className="news-item-header">
                    <p className="news-item-header__author">{item.author}</p>
                    <p className="news-item-header__date">{item.date}</p>
                  </div>
                  <div className="news-item-title">{item.title}</div>
                  <div className="news-item-text" dangerouslySetInnerHTML={{ __html: item.text }}></div>
                  <div
                    onClick={() => this.goToSingleNews(item.id)}
                    className="news-item-comment"
                  >
                    <FontAwesomeIcon icon='comments' />
                    {item.comments} {this.getNoun(item.comments)}
                  </div>
                </div>
              )
            }
          }
        })}
        <button className="news-button" onClick={() => { this.props.handleChangeSection('news'); window.scrollTo(0, 0) }}>КО ВСЕМ НОВОСТЯМ</button>

        {singleNews 
          ?
          <SingleNews
            closeNews={this.closeNews.bind(this)}
            singleNewsId={singleNewsId}
            news={news}
            user={this.props.user}
            comments={comments}
            reloadComponent={this.reloadComponent}
          />
          : null}
        
      </div>
      </>
    )
  }
}

export default SideNews;