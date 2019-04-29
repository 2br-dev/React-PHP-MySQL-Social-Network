import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import SingleNews from './SingleNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from './Fab/Fab';
import NewNews from './News/NewNews';
import API from './functions/API';
import { Paper, Button, Typography, TextField, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import defaultAvatar from './img/photos/images.png';
import DeleteIcon from '@material-ui/icons/Delete';
import Loader from './Loader/Loader';
import ConfirmDelete from './News/ConfirmDelete';
import WarningIcon from '@material-ui/icons/Warning';
import { withSnackbar } from 'notistack';
import ResponsiveHeader from './ResponsiveHeader/ResponsiveHeader';

var newsTimeout = null;

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newNews: false,
      newNewsTopic: '',
      newNewsText: '',
      newNewsImportance: false,
      editing: '',
      singleNews: false,
      singleNewsData: [],
      singleNewsId: '',
      invalidText: false,
      invalidTopic: false,
      confirmDelete: false,
      preparedNewsId: '',
    }
    this.addLike = this.addLike.bind(this);
    this.removeLike = this.removeLike.bind(this);
    this.addNews = this.addNews.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitNews = this.submitNews.bind(this);
    this.removeNews = this.removeNews.bind(this);
    this.editNews = this.editNews.bind(this);
    this.prepareNews = this.prepareNews.bind(this);
    this.showNews = this.showNews.bind(this);
    this.changeImportance = this.changeImportance.bind(this)
  }

  componentDidMount() {
    if (this.props.store.unreaded.news > 0) {
      newsTimeout = setTimeout(() => {
        document.querySelector('.newsBadge span').style.display = 'none';
        this.props.onReadNews();
      }, 2000)
    }
  }

  componentWillUnmount() {
    window.clearTimeout(newsTimeout);
  }


  handleChange = e => this.setState({ [e.target.name]: e.target.value, invalidText: false, invalidTopic: false });

  // добавляем лайк
  addLike = (id, e) => {
    const { user } = this.props.store;
    var self = this;
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', user.id);
    formData.append('created_at', new Date().getTime());
    const actions = document.getElementById('actions');
    actions.style.pointerEvents = 'none';

    $.ajax({
      url: `${API}/api/news/addlike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.props.onAddLike(id, user.id);
        self.forceUpdate();
        setTimeout(() => actions.style.pointerEvents = 'all', 500)
      }
    });
  }

  // убираем лайк
  removeLike = (id, e) => {
    const { user } = this.props.store;
    const self = this;
    e.preventDefault();
    e.stopPropagation();
    const actions = document.getElementById('actions');
    actions.style.pointerEvents = 'none';

    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', user.id);

    $.ajax({
      url: `${API}/api/news/removelike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function () {
        self.props.onRemoveLike(id, user.id)
        self.setState({ newNews: false });
        setTimeout(() => actions.style.pointerEvents = 'all', 500)
      }
    });
  }

  submitNews = (e) => {
    const { user } = this.props.store;
    var self = this;
    e.preventDefault();
    if (this.state.newNewsTopic !== '' && this.state.newNewsText !== '') {
      const formData = new FormData();
      let news = {
        author: `${user.name} ${user.surname}`,
        title: this.state.newNewsTopic,
        text: this.state.newNewsText,
        date: new Date().toJSON().slice(0, 10).replace(/-/g, '.'),
        created_at: new Date().getTime(),
        importance: this.state.newNewsImportance ? 1 : 0,
        author_id: user.id,
        likes: 0,
        liked_by: '',
        comments: 0,
        avatar: user.avatar
      }

      for (let key in news) {
        formData.append(key, news[key]);    
      }

      $.ajax({
        url: `${API}/api/news/submitnews.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: res => {
          news.id = res["MAX(`id`)"]
          self.props.onAddNews(news);
          self.setState({ 
            newNews: !self.state.newNews, 
            newNewsText: '', 
            newNewsTopic: ''
          });
          self.props.enqueueSnackbar('Добавлена новая новость', { variant: 'success' })
        },
        error: () => self.props.enqueueSnackbar('Не удалось добавить новость', { variant: 'error' })
      });

    } else {
      self.props.enqueueSnackbar('Необходимо заполнить все поля', { variant: 'warning' })
      if (self.state.newNewsTopic === '') this.setState({ invalidTopic: true });
      if (self.state.newNewsText === '') this.setState({ invalidText: true });
    }
  }

  changeImportance = () => this.setState({ newNewsImportance: !this.state.newNewsImportance });

  removeNews = () => {
    this.setState({ editing: true });
    var self = this;
    const formData = new FormData();
    formData.append('id', this.state.preparedNewsId);

    $.ajax({
      url: `${API}/api/news/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.props.onDeleteNews(this.state.preparedNewsId);
        self.setState({ editing: '', preparedNewsId: '', confirmDelete: false  });
        self.props.enqueueSnackbar('Новость была удалена', { variant: 'info' });
      },
      error: () => self.props.enqueueSnackbar('Не удалось удалить новость', { variant: 'error' })
    });
  };

  prepareNews = id => {
    const { news } = this.props.store;
    let title = news.find(news => news.id === id).title;
    let text = news.find(news => news.id === id).text;
    this.setState({ editing: id, newNewsTopic: title, newNewsText: text });
  }

  editNews = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    var self = this;

    if (this.state.newNewsTopic !== '' && this.state.newNewsText !== '') {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('title', this.state.newNewsTopic);
      formData.append('text', this.state.newNewsText);

      $.ajax({
        url: `${API}/api/news/edit.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: () => {
          setTimeout(() => self.setState({ editing: '' }), 200);
          self.props.enqueueSnackbar('Новость была изменена', { variant: 'info' });
        },
        error: () =>  self.props.enqueueSnackbar('Не удалось изменить новость', { variant: 'error' })
      });
    } else {
      self.props.enqueueSnackbar('Нужно заполнить всё поля', { variant: 'warning' });
      if (self.state.newNewsTopic === '') this.setState({ invalidTopic: true });
      if (self.state.newNewsText === '') this.setState({ invalidText: true });
    }
  }

  addNews = () => this.setState({ editing: '', newNews: !this.state.newNews, newNewsText: '', newNewsTopic: '' });

  showNews(id) {
    setTimeout(() => {
      if (this.state.editing === '') this.setState({ singleNews: true, singleNewsId: id });
    }, 100)
  }

  // закрываем новость 
  closeNews = () => {
    this.setState({ 
      singleNews: false, 
      singleNewsId: '', 
      newNews: false, 
      likedBy: [], 
      preparedNewsId: '',
      confirmDelete: false
    });
  }

  /**
  |--------------------------------------------------
  | находим правильную форму склонения лайков 
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

  /**
  |--------------------------------------------------
  | Спрашиваем об удалении новости
  |--------------------------------------------------
  */
  prepareDelete = (e, id) => {
    this.setState({ confirmDelete: true, preparedNewsId: id });
    e.stopPropagation();
  }

  render() {
    const { invalidText, invalidTopic, newNews, newNewsText, newNewsTopic, editing, singleNews, singleNewsId, newNewsImportance } = this.state;
    const { user, news } = this.props.store;
    
    return (
      <Paper>
        {window.innerWidth < 600 ? <ResponsiveHeader title='Новости компании' /> : null}
        {news.length === 0 
          ? <Loader minHeight={300} color='primary' /> 
          : news.map((item, i) => {
            return (  
              <NewsContainer key={i} onClick={() => this.showNews(item.id)}>
                <UserAvatar style={{ background: `url(${item.avatar === '' ? defaultAvatar : item.avatar}) no-repeat center/cover` }} />
                <div>
                  <NewsInfo>
                    {user.id === item.author_id
                      ?
                      <Fragment>
                        <Typography variant='caption'>
                          <Typography variant='subtitle2'>Вы</Typography>
                          {item.date}
                        </Typography>
                        <Icon>
                          <Tooltip placement='left' title="Удалить">
                            <DeleteIcon onClick={(e) => this.prepareDelete(e, item.id)} />
                          </Tooltip>
                        </Icon>
                      </Fragment>
                      :
                      <Typography variant='caption'>
                        <Typography variant='subtitle2'>{item.author}</Typography>
                        {item.date}
                      </Typography>}
                  </NewsInfo>

                  {item.importance === '1' ? this.createImportantBar(0) : null}

                  {editing !== item.id ?
                    <Fragment>
                      <Typography variant='h6' style={{ fontSize: '1.1rem', fontWeight: 400 }}>{item.title.replace(/&quot;/g, `"`)}</Typography>
                      <Body><Typography variant='body2'>{item.text.replace(/&quot;/g, `"`)}</Typography></Body>
                    </Fragment>
                    :
                    <form id='edit-news' action={`${API}/api/news/edit.php`} method="POST" onSubmit={(e) => this.editNews(e, item.id)} >
                      <TextField
                        label="Заголовок"
                        value={newNewsTopic}
                        onChange={this.handleChange}
                        variant="outlined"
                        name='newNewsTopic'
                        type='text'
                        error={this.state.invalidTopic}
                      />
                      <TextArea>
                        <TextField
                          label="Текст новости"
                          multiline
                          variant="outlined"
                          name='newNewsText'
                          onChange={this.handleChange}
                          value={newNewsText}
                          error={this.state.invalidText}
                        />
                      </TextArea>
                      <Button onClick={(e) => this.editNews(e, item.id)} variant='contained' color='primary'>Изменить</Button>
                    </form>}
                </div>

                <Actions id='actions'>
                  <p>{item.comments}</p>
                  <Tooltip title={`${item.comments} ${this.getCommentsNoun(item.comments)}`} placement='top'>
                    <FontAwesomeIcon onClick={editing === '' ? () => this.showNews(item.id) : null} icon="comments" />
                  </Tooltip>
                  
                    <p>{item.likes}</p>

                  {!item.liked_by.includes(` ${user.id}`)
                    ?
                    <Tooltip title={`${item.likes} ${this.getNoun(item.likes)} "Нравится"`} placement='top'>
                      <FontAwesomeIcon onClick={e => this.addLike(item.id, e)} icon="heart" />
                    </Tooltip>  
                    :
                    <Tooltip title={`${item.likes} ${this.getNoun(item.likes)} "Нравится"`} placement='top'>
                      <FontAwesomeIcon onClick={e => this.removeLike(item.id, e)} icon="heart" style={{ color: '#1976d2' }} />
                    </Tooltip>  
                  }
                  {user.id === item.author_id
                    ?
                    <Tooltip title='Редактировать' placement='top'>
                    <FontAwesomeIcon onClick={() => this.prepareNews(item.id)} icon="edit" style={{ marginLeft: '25px' }} />
                    </Tooltip>
                    :
                    null
                  }
                  {window.innerWidth >= 600 ? 
                    <Button onClick={() => this.showNews(item.id)} variant='contained' color='primary' style={{ position: 'absolute', right: window.innerWidth > 600 ? 40 : 20 }}>Читать</Button>
                  : null }
                </Actions>
              </NewsContainer>
            )
          })}

        <div onClick={this.addNews}><Fab title='Добавить новость' /></div>

        {newNews ?
          <NewNews
            newNewsTopic={newNewsTopic}
            newNewsText={newNewsText}
            invalidText={invalidText}
            invalidTopic={invalidTopic}
            submitNews={this.submitNews}
            handleChange={this.handleChange}
            changeImportance={this.changeImportance}
            newNewsImportance={newNewsImportance}
            closeNews={this.closeNews.bind(this)}
          /> : null}

        {singleNews
          ?
          <SingleNews
            showNews={this.showNews}
            closeNews={this.closeNews.bind(this)}
            singleNewsId={singleNewsId}
            getNoun={this.getNoun}
            getCommentsNoun={this.getCommentsNoun}
            reloadComponent={this.reloadComponent}
            createImportantBar={this.createImportantBar} />
          :
          null}

        {/* Подтверить удаление новости */}
        {this.state.confirmDelete ?
        <ConfirmDelete
          closeNews={this.closeNews.bind(this)}
          removeNews={this.removeNews.bind(this)}
        /> : null}

      </Paper>
    )
  }
}

const NewsContainer = styled.div`
  position: relative;
  padding: 20px 40px 20px 120px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;

  input {
    padding: 10px 15px;
  }
  :hover {
    background: rgba(0,0,0,0.037);
    transition: .37s ease;
  }
  @media all and (max-width: 600px) {
    padding: 10px 20px 10px 80px;
  }
`;
const Body = styled.div`
  padding: 10px 15px;
  margin-top: 10px;
  background: rgba(0,0,0,0.015);
`;
const NewsInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;

  span {
    display: flex;
    align-items: baseline;
    h6 {
      margin-right: 10px;
      :after {
        content: '\00b7';
        margin-left: 10px;
      }
    }
  }
`;
const UserAvatar = styled.div`
  position: absolute;
  left: 20px;
  top: 30px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  @media all and (max-width: 600px) {
    width: 45px;
    height: 45px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 5px;
    color: #657786;
  }
`;

const TextArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 15px 0 10px;
  height: 120px;

  textarea {
    max-height: 100px;
    &::-webkit-scrollbar {
      width: 10px;
    }
   
    &::-webkit-scrollbar-track {
      background-color: #ebebeb;
      -webkit-border-radius: 10px;
      border-radius: 10px;
    }
  
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: #1976d2; 
    }
  }

  & > div {
    width: 100%;
    & > div {
      height: 100%;
    }
  }
`;
const Icon = styled.div`
  cursor: pointer;
  svg {
    color: rgba(0,0,0,0.54);
  }
`;

export default connect(state => ({ store: state }),
  dispatch => ({ 
    onAddNews: news => dispatch({ type: 'ADD_NEWS', payload: news }),
    onDeleteNews: id => dispatch({ type: 'DELETE_NEWS', payload: id }),
    onAddLike: (id, user_id) => dispatch({ type: 'ADD_LIKE', payload: id, user_id }),
    onRemoveLike: (id, user_id) => dispatch({ type: 'REMOVE_LIKE', payload: id, user_id }),
    onReadNews: () => dispatch({ type: "READ_NEWS" }),  
  }),
)(withSnackbar(News));