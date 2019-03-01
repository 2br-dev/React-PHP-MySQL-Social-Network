import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import DefaultAvatar from './img/photos/images.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, Button, TextField, Tooltip } from '@material-ui/core';
import API from './functions/API';
import _ from 'lodash';
import Loader from './Loader/Loader';
import CloseIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from './Snackbar/Snackbar';

export default class SingleNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: [],
      thisComments: [],
      loadedComments: false,
      commentText: '',
      currentNews: [],
      likedBy: [],
      loading: true,
      commentsLoading: false,
      snackBar: false,
      snackBarMessage: '',
      snackBarVariant: '',
    }
  }

  async componentDidMount() {
    await fetch(`${API}/api/news/read_one.php?id=${this.props.singleNewsId}`)
      .then(response => response.json())
      .then(currentNews => this.setState({ currentNews }))
    await this.fetchUserInfo(this.props.user.id);
    await this.fetchComments(this.props.singleNewsId);
    await this.getAvatars(this.props.singleNewsId);
    await this.setState({ loading: false })
  }

  fetchUserInfo(id) {
    fetch(`${API}/api/user/info.php?id=${id}`)
      .then(response => response.json())
      .then(currentUser => this.setState({ currentUser }))
  }

  fetchComments(id) {
    fetch(`${API}/api/news/single_comments.php?id=${id}`)
      .then(response => response.json())
      .then(thisComments => this.setState({ thisComments, loadedComments: !this.state.loadedComments }))
  }

  // получаем аватарки лайкнувших пост
  getAvatars = id => {
    const likedBy = this.state.currentNews.liked_by.split(', ').slice(1);
    const formData = new FormData();
    const self = this;
    formData.append('likedBy', likedBy);

    $.ajax({
      url: `${API}/api/user/getAvatars.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: res => self.setState({ likedBy: res }),
      error: err => console.log(err)
    });
  }
  handleChange = e => this.setState({ commentText: e.target.value });

  // добавляем лайк
  addLike = (id, e) => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', this.props.user.id);
    const actions = document.getElementById('actions');
    actions.style.pointerEvents = 'none';

    $.ajax({
      url: `${API}/api/news/addlike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (e, res) {
        console.log(res);
        fetch(`${API}/api/news/read_one.php?id=${self.props.singleNewsId}`)
          .then(response => response.json())
          .then(currentNews => self.setState({ currentNews }))
          .then(() => self.getAvatars(self.props.singleNewsId))

        setTimeout(() => actions.style.pointerEvents = 'all', 500)  
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  // убираем лайк
  removeLike = (id, e) => {
    const self = this;
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', this.props.user.id);
    const actions = document.getElementById('actions');
    actions.style.pointerEvents = 'none';

    $.ajax({
      url: `${API}/api/news/removelike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        console.log(res);
        fetch(`${API}/api/news/read_one.php?id=${self.props.singleNewsId}`)
          .then(response => response.json())
          .then(currentNews => self.setState({ currentNews }))
          .then(() => self.getAvatars(self.props.singleNewsId))

        setTimeout(() => actions.style.pointerEvents = 'all', 500)
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  submitComment = e => {
    this.setState({ commentsLoading: true });
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('news_id', this.props.singleNewsId);
    formData.append('who', `${this.props.user.name} ${this.props.user.surname}`);
    formData.append('date', new Date().toJSON().slice(0, 10).replace(/-/g, '.'));
    formData.append('visible', 1);
    formData.append('time', new Date().toLocaleTimeString().slice(0, -3));
    formData.append('text', this.state.commentText);

    $.ajax({
      url: `${API}/api/news/addcomment.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.setState({ commentText: '' });
        self.fetchComments();
        setTimeout(() => self.setState({ commentsLoading: false }), 250);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  /**
  |--------------------------------------------------
  | Удаление комментария 
  | arguments: @id 
  | type: @int
  |--------------------------------------------------
  */
  deleteComment = (e, id, news_id) => {
    this.setState({ commentsLoading: true });
    var self = this;
    e.preventDefault();

    $.ajax({
      url: `${API}/api/news/deletecomment.php`,
      data: { id, news_id },
      type: 'POST',
      success: function() {
        self.setState({ commentText: '', snackBar: true, snackBarMessage: 'Комментарий был удален', snackBarVariant: 'info' })
        self.fetchComments();
        setTimeout(() => self.setState({ commentsLoading: false }), 250);
      },
      error: function(err) {
        console.log(err);
        self.setState({ commentsLoading: false, snackBar: true, snackBarMessage: 'Не удалось удалить комментарий', snackBarVariant: 'error' })
      }
    });
    this.setSnackbarTimeout(5000);
  }

  /**
  |--------------------------------------------------
  | закрывает @Snackbar
  |--------------------------------------------------
  */
  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBar: false });
  };

  /**
  |--------------------------------------------------
  | Ставит @timeout у @snackbar
  |--------------------------------------------------
  */
  setSnackbarTimeout = (ms) => {
    window.clearTimeout(timer);
    var timer = setTimeout(() => {
      this.setState({ snackBar: false })
    }, ms);
  }

  render() {
    const { closeNews, singleNewsId, user } = this.props;
    const { currentUser, thisComments, loadedComments, commentText, currentNews, likedBy, loading, commentsLoading } = this.state;

    let avatar = null;
    if (window.location.host.includes('localhost')) {
      avatar = currentUser.avatar;
    } else {
      avatar = `frontend/public/${currentUser.avatar}`;
    }
    let userAvatar = null;
    if (window.location.host.includes('localhost')) {
      userAvatar = user.avatar;
    } else {
      userAvatar = `frontend/public/${user.avatar}`;
    }

    if (currentUser.length === 0) this.fetchUserInfo(currentNews.author_id);
    if (!loadedComments) this.fetchComments(singleNewsId);
    return (
      <Fragment>

        <Single>
          {loading ? <Loader minHeight={500} color='primary' /> :
            <Fragment>
              <Tooltip placement='left' title='Закрыть'>
                <Icon><CloseIcon onClick={closeNews} /></Icon>
              </Tooltip>

              <PostHeader>
                <Avatar style={{ background: `url(${currentUser.avatar ? avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                <Typography variant='subtitle2'>{currentUser.name} {currentUser.surname}</Typography>            
              </PostHeader>

              {currentNews.importance === '1' ? this.props.createImportantBar(10) : null}

              <Typography variant='h5'>{currentNews.title}</Typography>

              <PostContent>
                <Typography variant='body1'>{currentNews.text}</Typography>
                <Typography variant='caption'>{currentNews.date}</Typography>
              </PostContent>

              <PostLikes>
                <Typography variant='subtitle2'>{currentNews.likes} {this.props.getNoun(currentNews.likes)} "Нравится"</Typography>
                {/* eslint-disable-next-line*/}
                {likedBy.map((user, i) => {

                  while (i < 7) {
                    return (
                      <Tooltip key={i} title={`${user.name} ${user.surname}`} placement="top">
                        <Avatar style={{ background: `url(${user.avatar ? user.avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                      </Tooltip>
                    )
                  }
                })}
              </PostLikes>

              <PostActions id='actions'>
                {thisComments.length}
                <Tooltip placement='top' title={`${thisComments.length} ${this.props.getCommentsNoun(thisComments.length)}`}>
                  <FontAwesomeIcon icon='comments' style={{ marginLeft: 10 }} />
                </Tooltip>

                {!_.some(likedBy, ['id', user.id])
                  ?
                  <React.Fragment>
                    <span>{currentNews.likes}</span>
                    <Tooltip placement='top' title={`${currentNews.likes} ${this.props.getNoun(currentNews.likes)} "Нравится"`}>
                      <FontAwesomeIcon onClick={e => this.addLike(currentNews.id, e)} icon='heart' style={{ marginLeft: 10 }} />
                    </Tooltip>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <span>{currentNews.likes}</span>
                    <Tooltip placement='top' title={`${currentNews.likes} ${this.props.getNoun(currentNews.likes)} "Нравится"`}>
                      <FontAwesomeIcon onClick={e => this.removeLike(currentNews.id, e)} icon='heart' style={{ color: '#1976d2', marginLeft: 10 }} />
                    </Tooltip>  
                  </React.Fragment>
                }
                <Tooltip placement='top' title='Написать сообщение'>
                  <FontAwesomeIcon icon='envelope' style={{ marginLeft: '25px' }} />
                </Tooltip>
                
              </PostActions>

              <NewComment>
                <p className='newcomment-reply'>В ответ <a href={`${window.location.origin}/id${currentUser.id}`}>{currentUser.name} {currentUser.surname}</a></p>
                <div className='newcomment-input'>
                  <Avatar style={{ background: `url(${user.avatar ? userAvatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                  <TextArea>
                    <TextField
                      label='Комментарий'
                      multiline
                      variant='outlined'
                      name='commentText'
                      value={commentText}
                      onChange={this.handleChange}
                      required
                    />
                  </TextArea>
                </div>
                <Button variant='contained' color='primary' onClick={this.submitComment} disabled={!commentText}>Отправить</Button>
              </NewComment>

              {commentsLoading ? <Loader minHeight={280} color='primary' /> :
                thisComments.map((comment, i) => {
                  return (
                    <Comments key={i}>
                      <div className='comment-header'>
                        <Avatar style={{ background: `url(${user.avatar ? userAvatar : DefaultAvatar}) no-repeat center/cover`, marginTop: 20 }}></Avatar>
                        <Typography variant='subtitle2'>{comment.who}</Typography>
                        <Typography variant='caption' className='comment-date'>{comment.date}</Typography>
                      </div>
                      <div className='comment-text'>{comment.text}</div>

                      <DelIcon>
                        <Tooltip placement='left' title="Удалить">
                          <DeleteIcon onClick={(e) => this.deleteComment(e, comment.id, comment.news_id)} />
                        </Tooltip>
                      </DelIcon>
                    </Comments>
                  )
                })}

            </Fragment>}
        </Single>
        <Wrapper onClick={closeNews}></Wrapper>

        {/* Snackbar */}
        <Snackbar
          snackBar={this.state.snackBar}
          variant={this.state.snackBarVariant}
          message={this.state.snackBarMessage}
          handleCloseSnackBar={this.handleCloseSnackBar.bind(this)}
        />
      </Fragment>
    )
  }
}

const Single = styled.div`
  width: 600px;
  min-height: 300px;
  left: 0;
  right: 0;
  margin: auto;
  position: fixed;
  z-index: 50;
  background: #fff;
  top: 100px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  padding: 15px 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80%;

  .close {
    top: 5px;
  }
  ::-webkit-scrollbar { 
    display: none; 
  }
`;

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0,.5);
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 49;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  img {
    border-radius: 50%;
    width: 60px;
  }
  p {
    font-size: 18px;
    font-weight: 700;
  }
`;

const PostContent = styled.div`
  p {
    margin: 15px 0 5px;
    font-size: 20px;
  }
  span {
    color: #657786;
    font-size: 14px;
  }
`;

const PostLikes = styled.div`
  border-top: 1px solid #e6ecf0;
  border-bottom: 1px solid #e6ecf0;
  margin-top: 20px;
  1px solid #e6ecf0;
  align-items: center;
  display: flex;

  div {
    margin: 0 5px;
  }

  h6:first-child {
    width: 50%;
    padding: 15px 10px;
    border-right: 1px solid #e6ecf0;
  }

  span {
    width: 50%;
    padding: 15px 10px 15px;
  }
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  img {
    width: 15px;
    margin-right: 40px;
    margin-left: 10px;
    opacity: .7;
    cursor: pointer;
  }

  img:hover {
    opacity: 1;
    transition: .37s ease;
  }
`;

const Comments = styled.div`
  margin-left: -30px;
  width: 600px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;
  padding: 15px 30px;
  position: relative;

  :last-child {
    border-bottom: none;
  }

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
  }

  .comment-date {
    margin-left: 10px;
    color: #657786;
    :before {
      content: '\00b7';
      margin-right: 10px;
    }
  }
`;

const NewComment = styled.div`
  padding: 15px 30px;
  background: #f5f8fa;
  width: 600px;
  margin-top: 20px;
  margin-left: -30px;
  border-bottom: 1px solid #e6ecf0;
  border-top: 1px solid #e6ecf0;
  display: flex;
  flex-direction: column;
  .close {
    top: 5px;
  }
  button {
    width: 150px;
    align-self: flex-end;
    margin-top: 15px;
  }
  
  .newcomment-reply {
    margin: 0 40px;
    color: #657786;
    a {
      color: #0084B4;
      text-decoration: none;
      margin-left: 5px;
      :hover {
        text-decoration: underline;
      }
    }
  }

  .newcomment-input {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    div {
      margin-right: 0;
    }
  }
`;
const Avatar = styled.div`
  min-width: 30px;
  border-radius: 50%;
  min-height: 30px;
  margin-right: 15px;
`;
const TextArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 10px;
  background: #fff;
  height: 110px;
  width: 100%;

  textarea {
    max-height: 90px;
    background: #fff;
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
  position: absolute;
  right: 25px;
  top: 10px;
  cursor: pointer;
  svg {
    color: #1976d2;
  }
`;

const DelIcon = styled.div`
  cursor: pointer;
  right: 25px;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  height: fit-content;
  svg {
    color: rgba(0,0,0,.54);
  }
`;