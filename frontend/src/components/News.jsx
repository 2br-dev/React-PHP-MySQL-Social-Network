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
import moment from 'moment';

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
      hasNewsImage: false,
      uploadedNewsImage: '',
      newsComments: [],
      loadedComments: false,
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
    this.changeImportance = this.changeImportance.bind(this);
    this.uploadNewsImage = this.uploadNewsImage.bind(this);
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

  uploadNewsImage = (file) => {
    let fd = new FormData();
    let files = file;
    let self = this;
    fd.append('file', files);
    /* fd.append('id', this.state.singleNewsId); */

    $.ajax({
      url: `${API}/api/news/uploadImage.php`,
      type: 'post',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (window.location.host.includes('localhost')) {
          self.setState({ uploadedNewsImage: res.location.slice(15) })
        } else {
          self.setState({ uploadedNewsImage: res.location.slice(6) })
        }
        console.log(res);
      },
    });
  }

  newsFileSelect = event => {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.setState({ hasNewsImage: true })
      this.uploadNewsImage(event.target.files[0]);
      this.props.enqueueSnackbar('Фото добавлено', { variant: 'success' });
    } else {
      this.props.enqueueSnackbar('Файл слишком большой, размер должен не превышать 2МБ', { variant: 'warning' });
    }
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
        newsImage: this.state.hasNewsImage ? this.state.uploadedNewsImage : "",
        created_at: new Date().getTime(),
        importance: this.state.newNewsImportance ? 1 : 0,
        author_id: user.id,
        likes: 0,
        liked_by: '',
        comments: 0,
        avatar: user.avatar,
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
            newNewsTopic: '',
            uploadedNewsImage: ''
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

      const { newNewsText, newNewsTopic } = this.state;
      const news = {
        id: id,
        title: newNewsTopic,
        text: newNewsText
      }

      for (const prop in news) {
        formData.append(news[prop], prop);
      }

      $.ajax({
        url: `${API}/api/news/edit.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: () => {
          self.props.onUpdateNews(news);
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
        margin-right: 8px;  
      }
    `;
    return (
      <Tooltip placement='top' title='Отмечено как важное'>
        <Important>
          <WarningIcon />
        </Important>
      </Tooltip>
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
    const { invalidText, invalidTopic, newNews, newNewsText, newNewsTopic, editing, singleNews, singleNewsId, newNewsImportance, uploadedNewsImage, hasNewsImage } = this.state;
    const { user, news } = this.props.store;
    
    return (
      <Paper>
        {window.innerWidth < 600 ? <ResponsiveHeader title='Новости' /> : null}
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
                          {this.createImportantBar(0)}
                          <Typography variant='subtitle2'>Вы</Typography>
                          {moment(Number(item.created_at)).fromNow()}
                        </Typography>
                        <Icon>
                          <Tooltip placement='left' title="Удалить">
                            <DeleteIcon onClick={(e) => this.prepareDelete(e, item.id)} />
                          </Tooltip>
                        </Icon>
                      </Fragment>
                      :
                      <Typography variant='caption'>
                        {this.createImportantBar(0)}
                        <Typography variant='subtitle2'>{item.author}</Typography>
                        {moment(Number(item.created_at)).fromNow()}
                      </Typography>}
                  </NewsInfo>

                  {editing !== item.id ?                    
                    <Fragment>
                      <Typography variant='h6' style={{ fontSize: '1.1rem', fontWeight: 400 }}>{item.title.replace(/&quot;/g, `"`)}</Typography>
                      {item.image ? 
                      <div style={{textAlign: 'center', marginTop: '15px', marginBottom: '15px'}}><img src={`${API}/${item.image}`} alt=""/></div> : null}
                      
                      
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
                <Typography variant='caption'>Комментарии (5 последних)</Typography>
                {item.commentsobj.map((comment, j) =>{
                  return(
                    <Comments key={j}>
                      <div className='comment-header'>
                        <Avatar style={{ background: `url(${comment.who.avatar ? comment.who.avatar : defaultAvatar}) no-repeat center/cover`, marginTop: 20 }}></Avatar>
                        <Typography variant='subtitle2'>{comment.who.name} {comment.who.surname}</Typography>
                        <Typography variant='caption' className='comment-date'>{comment.date}</Typography>
                      </div>
                      <div className='comment-text'>{comment.text}</div>
                    </Comments>
                  )
                })}                
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
            newsFileSelect={this.newsFileSelect}
            uploadedNewsImage={uploadedNewsImage}
            hasNewsImage={hasNewsImage}
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
    padding: 10px 10px 10px 70px;
  }
`;
const Comments = styled.div`
  margin-left: -30px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;
  padding: 0px 30px 15px 80px;
  position: relative;
  border-top: 1px solid #e6ecf0;
  background: #e6ecf0;

  :hover {
    background: #f5f8fa;
    transition: .37s ease;
  }

  .comment-header {
    display: flex;
    align-items: center;
    
    div {
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }
  }

  .comment-text {
    padding-left: 45px;
    padding-bottom: 10px;
  }

  .comment-date {
    margin-left: 7.5px;
    color: #657786;
    :before {
      content: '⋆';
      margin-right: 7.5px;
      opacity: 0.37;
    }
  }
  @media all and (max-width: 600px) {
    width: calc(100% + 30px) !important;
    padding: 10px 0px !important;
    margin-left: -15px !important;
    
    .comment-text {
      padding-left: 50px;
    }
    :last-child {
      border-bottom: 1px solid red;
    }
  }
`;
const Avatar = styled.div`
  min-width: 30px;
  border-radius: 50%;
  min-height: 30px;
  margin-right: 15px;

  @media all and (max-width: 600px) {
    margin-right: 10px;
    margin-left: 10px;
  }
`;
const Body = styled.div`
  padding: 10px 15px;
  margin-top: 10px;
  background: #fafafa;
  border-radius: 10px;
`;
const NewsInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;

  span {
    display: flex;
    align-items: center;
    h6 {
      margin-right: 7.5px;
      :after {
        content: '⋆';
        margin-left: 7.5px;
        opacity: 0.37;
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
    width: 50px;
    height: 50px;
    left: 10px;
    top: 15px;
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
    onUpdateNews: news => dispatch({type: 'UPDATE_NEWS', payload: news}),
    onAddLike: (id, user_id) => dispatch({ type: 'ADD_LIKE', payload: id, user_id }),
    onRemoveLike: (id, user_id) => dispatch({ type: 'REMOVE_LIKE', payload: id, user_id }),
    onReadNews: () => dispatch({ type: "READ_NEWS" }),  
  }),
)(withSnackbar(News));