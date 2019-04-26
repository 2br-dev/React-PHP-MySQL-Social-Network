import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './css/SideNews.css';
import SingleNews from './SingleNews';
import styled from 'styled-components';
import { Typography, Paper, Switch, Button, Tooltip } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from './Loader/Loader';

class SideNews extends Component {
  state = {
    importance: false,
    singleNews: false,
    singleNewsData: [],
    singleNewsId: ''
  }

  // переходим к конкретной новости
  goToSingleNews = id => this.setState({ singleNews: true, singleNewsId: id });

  // закрываем новость 
  closeNews = () => {
    this.setState({ singleNews: false, singleNewsId: '' });
  }

  changeImportance = () => this.setState({ importance: !this.state.importance });

  /**
  |--------------------------------------------------
  | Находим правильную форму склонения комментариев
  |--------------------------------------------------
  */
  getNoun = number => {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) return 'отметок';
    number %= 10;
    if (number === 1) return 'отметка';
    if (number >= 2 && number <= 4) return 'отметки';
    return 'отметок';
  }

  /**
  |--------------------------------------------------
  | Находим правильную форму склонения комментариев
  |--------------------------------------------------
  */
  getCommentsNoun = number => {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) return 'комментариев';
    number %= 10;
    if (number === 1) return 'комментарий';
    if (number >= 2 && number <= 4) return 'комментария';
    return 'комментариев';
  }

  /**
  |--------------------------------------------------
  | создаёт надпись "Помечено как важное"
  |--------------------------------------------------
  */
  createImportantBar = (margin) => {
    const Important = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin-top: ${margin}px;
    svg {
      color: rgba(0,0,0,.15);
      margin-right: 5px;  
    }
  `;
    return (
      <Important>
        <WarningIcon />
        <Typography variant='caption'>Отмечено как "Важное"</Typography>
      </Important>
    )
  }

  render() {
    const { importance, singleNews, singleNewsId } = this.state;
    const { store: { news }} = this.props;
    var NEWS_COUNTER = 0;

    return (
      <Wrapper>
        <Paper>
          {news.length === 0 ? <Loader minHeight={250} color='primary' /> :
            <News>
              <NewsSwitch>
                <Typography variant='subtitle2'>Только важное </Typography>
                <Switch color='primary' onClick={this.changeImportance.bind(this)} />
              </NewsSwitch>
              {/* eslint-disable-next-line */}
              {news.length > 0 ? news.map((item, i) => {
                if (importance) {
                  if (item.importance === '1' && NEWS_COUNTER < 3) {
                    NEWS_COUNTER++;
                    return (
                      <div key={i} className="news-item">
                        <div className="news-item-header">
                          <Typography variant='subtitle2'>{item.author}</Typography>
                          <Typography variant='caption'>{item.date}</Typography>
                        </div>
                        <Typography variant='body1' className='news-caption' onClick={() => this.goToSingleNews(item.id)}>
                          {item.importance === '1' ? <Tooltip title='Важное!' placement="left"><WarningIcon /></Tooltip> : null}
                          {item.title}
                        </Typography>
                        <div className="news-item-text">
                          <Typography variant='body2'>{item.text}</Typography>
                        </div>
                        <Tooltip title="Перейти к комментариям" placement="top-start">
                          <div
                            onClick={() => this.goToSingleNews(item.id)}
                            className="news-item-comment"
                          >
                            <FontAwesomeIcon icon='comments' />
                            {item.comments} {this.getCommentsNoun(item.comments)}
                          </div>
                        </Tooltip>
                      </div>
                    )
                  }
                } else {
                  while (i < 3) {
                    return (
                      <div key={i} className="news-item">
                        <div className="news-item-header">
                          <Typography variant='subtitle2'>{item.author}</Typography>
                          <Typography variant='caption'>{item.date}</Typography>
                        </div>
                        <Typography variant='body1' className='news-caption' onClick={() => this.goToSingleNews(item.id)}>
                          {item.importance === '1' ? <Tooltip title='Важное!' placement="top-start"><WarningIcon /></Tooltip> : null}
                          {item.title.replace(/&quot;/g, `"`)}
                        </Typography>
                        <div className="news-item-text">
                          <Typography variant='body2'>{item.text.replace(/&quot;/g, `"`)}</Typography>
                        </div>
                        <Tooltip title="Перейти к комментариям" placement="top-start">
                          <div
                            onClick={() => this.goToSingleNews(item.id)}
                            className="news-item-comment"
                          >
                            <FontAwesomeIcon icon='comments' />
                            {item.comments} {this.getCommentsNoun(item.comments)}
                          </div>
                        </Tooltip>
                      </div>
                    )
                  }
                }
              })
              : <NoNews><Typography variant='h6'>нет новостей</Typography></NoNews>}
              <Button
                variant='contained'
                color='primary'
                onClick={() => window.scrollTo(0, 0) }
                component={Link} to="/news"
              >
                ко всем новостям
              </Button>
              <span id='updateSideNews' style={{ display: 'none' }} onClick={() => this.forceUpdate()}></span>
            </News>}
        </Paper>
        <Fragment>
        {singleNews ?
          <SingleNews
            closeNews={this.closeNews.bind(this)}
            singleNewsId={singleNewsId}
            news={news}
            getNoun={this.getNoun}
            getCommentsNoun={this.getCommentsNoun}
            reloadComponent={this.reloadComponent}
            createImportantBar={this.createImportantBar.bind(this)}
          />
          : null}
        </Fragment>  
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 30%;
  @media all and (max-width: 600px) {
    display: none;
  }
`;
const NewsSwitch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const News = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  .news-item {
    width: 100%;
    padding-bottom: 0;
  }
  svg {
    margin-left: 0;
  }
  .news-caption {
    display: flex;
    align-items: flex-start;
    width: 111%;
    cursor: pointer;
    margin-left: -15px;
    padding: 10px 15px 8px;
    &:hover {
      background: #1976d2;
      color: #ffffff;
      transition: .37s ease;
    }
    svg {
      color: rgba(0,0,0,.15) !important;
      margin-right: 8px;
      font-size: 22px;
    }
  }

  .news-item-comment {
    width: 111%;
    cursor: pointer;
    margin-left: -15px;
    padding: 12px 15px;
    &:hover {
      background: rgba(0,0,0,0.015);
    }
  }
`;
const NoNews = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .37;
  margin-bottom: 20px;
`;
export default connect(state => ({ store: state }))(SideNews);