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
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';

class SingleNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thisComments: [],
      loadedComments: false,
      commentText: '',
      likedBy: [],
      loading: true,
      commentsLoading: false,
      lightboxIsOpen: false
    }
  }

  async componentDidMount() {
    await this.fetchComments(this.props.singleNewsId);
    await this.getAvatars();
    await this.setState({ loading: false })
  }

  fetchComments(id) {
    fetch(`${API}/api/news/single_comments.php?id=${id}`)
      .then(response => response.json())
      .then(thisComments => this.setState({ thisComments, loadedComments: !this.state.loadedComments }))
  }

  // получаем аватарки лайкнувших пост
  getAvatars = () => {
    const currentNews = this.props.store.news.find(item => item.id === this.props.singleNewsId);
    const likedBy = currentNews.liked_by.split(', ').slice(1);
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
    });
  }
  handleChange = e => this.setState({ commentText: e.target.value });

  // добавляем лайк
  addLike = (id, e) => {
    const actions = document.getElementById('actions-news');
    actions.style.pointerEvents = 'none';
    e.preventDefault();
    const { user } = this.props.store;
    const formData = new FormData();
    var self = this;
    formData.append('id', id);
    formData.append('liked_by', user.id);
    formData.append('created_at', new Date().getTime());
    
    $.ajax({
      url: `${API}/api/news/addlike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.props.onAddLike(id, user.id);
        fetch(`${API}/api/news/read_one.php?id=${self.props.singleNewsId}`)
          .then(response => response.json())
          .then(() => self.getAvatars())

        setTimeout(() => actions.style.pointerEvents = 'all', 1000)  
      }
    });
  }

  // убираем лайк
  removeLike = (id, e) => {
    const actions = document.getElementById('actions-news');
    const { user } = this.props.store;
    actions.style.pointerEvents = 'none';
    const self = this;
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', user.id);

    $.ajax({
      url: `${API}/api/news/removelike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.props.onRemoveLike(id, user.id);
        fetch(`${API}/api/news/read_one.php?id=${self.props.singleNewsId}`)
          .then(response => response.json())
          .then(() => self.getAvatars())
        setTimeout(() => actions.style.pointerEvents = 'all', 1000)
      }
    });
  }

  submitComment = e => {
    const { user } = this.props.store;
    this.setState({ commentsLoading: true });
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('news_id', this.props.singleNewsId);
    formData.append('who', `${user.name} ${user.surname}`);
    formData.append('date', new Date().toJSON().slice(0, 10).replace(/-/g, '.'));
    formData.append('visible', 1);
    formData.append('time', new Date().toLocaleTimeString().slice(0, -3));
    formData.append('text', this.state.commentText);
    formData.append('author_id', user.id);
    formData.append('created_at', new Date().getTime());

    $.ajax({
      url: `${API}/api/news/addcomment.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () =>  {
        self.props.onAddComment(this.props.singleNewsId, user.id);
        document.getElementById('updateSideNews').click();
        self.setState({ commentText: '' });
        self.fetchComments(self.props.singleNewsId);
        self.props.enqueueSnackbar('Комментарий был добавлен', { variant: 'success' });
        setTimeout(() => {
          self.setState({ commentsLoading: false });
          const commentsContainer = document.getElementById("single-news");
          commentsContainer.scrollTop = commentsContainer.scrollHeight; 
        }, 250);    
      },
      error: () => self.props.enqueueSnackbar('Не удалось оставить комментарий', { variant: 'error' })
    });
  }

  deleteComment = (e, id, news_id) => {
    const { user } = this.props.store;
    this.setState({ commentsLoading: true });
    var self = this;
    e.preventDefault();

    $.ajax({
      url: `${API}/api/news/deletecomment.php`,
      data: { id, news_id },
      type: 'POST',
      success: function() {
        self.props.onRemoveComment(news_id, user.id);
        document.getElementById('updateSideNews').click();
        self.props.enqueueSnackbar('Комментарий был удален', { variant: 'info' });
        self.fetchComments(self.props.singleNewsId);
        setTimeout(() => self.setState({ commentsLoading: false }), 250);
      },
      error: () => self.props.enqueueSnackbar('Не удалось удалить комментарий', { variant: 'error' })
    });
  }

  render() {
    const { closeNews, singleNewsId } = this.props;
    const { thisComments, commentText, likedBy, loading, commentsLoading, lightboxIsOpen } = this.state;
    const { user, news } = this.props.store;
    const currentNews = news.find(item => item.id === singleNewsId);
    const userAvatar = currentNews.avatar;
   
    return (
      <Fragment>
        <Single id='single-news'>
          {loading ? <Loader minHeight={500} color='primary' /> :
            <Fragment>
              <Tooltip placement='left' title='Закрыть'>
                <Icon><CloseIcon onClick={closeNews} /></Icon>
              </Tooltip>

              <Link to={`/id${currentNews.author_id}`} style={{ textDecoration: 'none' }}>
                <PostHeader>
                  <Avatar style={{ background: `url(${currentNews.avatar ? userAvatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                  <Typography variant='subtitle2'>{currentNews.author}</Typography>            
                </PostHeader>
              </Link>

              <Typography variant='h5' style={{ display: 'flex', alignItems: 'center' }}>
                <span></span>
                {currentNews.importance === '1' ? this.props.createImportantBar(0) : null}
                {currentNews.title.replace(/&quot;/g, `"`)}
              </Typography>

              <ImagePost>
                  <img onClick={() => this.setState({lightboxIsOpen: true})} src={`${API}/${currentNews.image}`} alt={currentNews.title.replace(/&quot;/g, `"`)}/>
              </ImagePost>

              {lightboxIsOpen && (
                  <Lightbox
                      mainSrc={`${API}/${currentNews.image}`}
                      onCloseRequest={() => this.setState({ lightboxIsOpen: false })}
                  />
              )}

              <PostContent>
                <Typography variant='body1'>{currentNews.text.replace(/&quot;/g, `"`)}</Typography>
                <Typography variant='caption'>{moment(Number(currentNews.created_at)).fromNow()}</Typography>
              </PostContent>

              <PostLikes>
                <Typography variant='subtitle2'>{currentNews.likes} {this.props.getNoun(currentNews.likes)} "Нравится"</Typography>
                <div style={{ maxWidth: '50vw', display: 'flex', overflow: 'overlay' }}>
                {/* eslint-disable-next-line*/}
                {likedBy.map((user, i) => {
                  while (i < 5) {
                    return (
                      <Tooltip key={i} title={`${user.name} ${user.surname}`} placement="top">
                        <Link to={`/id${user.id}`}>
                          <Avatar style={{ background: `url(${user.avatar ? user.avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                        </Link>
                      </Tooltip>
                    )
                  }      
                })}
                </div>
              </PostLikes>

              <PostActions id='actions-news'>
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
              </PostActions>

              <NewComment>
                <p className='newcomment-reply'>В ответ <Link to={`/id${currentNews.author_id}`}>{currentNews.author}</Link></p>
                <div className='newcomment-input'>
                  <Link to={`/id${user.id}`}><Avatar style={{ background: `url(${user.avatar ? user.avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar></Link>
                  <TextArea>
                    <TextField
                      style={{ top: 0 }}
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
                        <Avatar style={{ background: `url(${comment.avatar ? comment.avatar : DefaultAvatar}) no-repeat center/cover`, marginTop: 20 }}></Avatar>
                        <Typography variant='subtitle2'>{comment.who}</Typography>
                        <Typography variant='caption' className='comment-date'>{moment(Number(comment.created_at)).fromNow()}</Typography>
                      </div>
                      <div className='comment-text'>{comment.text}</div>

                      {comment.author_id === user.id ?
                      <DelIcon>
                        <Tooltip placement='left' title="Удалить">
                          <DeleteIcon onClick={(e) => this.deleteComment(e, comment.id, comment.news_id)} />
                        </Tooltip>
                      </DelIcon>
                      : null}
                    </Comments>
                  )
                })}
                {thisComments.length > 0 ? 
                  <Typography variant='caption' 
                    style={{ 
                      opacity: .5,
                      textAlign: 'center',
                      margin: '37px 0'
                    }}
                  >показаны последние комментарии
                  </Typography> 
                : null}
            </Fragment>}
        </Single>
        <Wrapper onClick={closeNews}></Wrapper>
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

  @media all and (max-width: 600px) {
    width: 100%;
    top: 0;
    max-height: calc(100vh - 55px);
    border-radius: 0;
    padding: 15px 15px 80px;
    overflow: scroll;
    h5 {
      font-size: 18px;
    }
    p {
      font-size: 16px !important;
    }
     div:first-child {
       top: 18px;
       color: #f5f5f5;
    }
    svg {
      font-size: 24px !important;
    }
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

  @media all and (max-width: 600px) {
    h6:first-child {
      font-size: 12px;
    }
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

const NewComment = styled.div`
  padding: 15px 30px;
  background: #f5f8fa;
  width: calc(100% + 60px);
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
  
  a > div {
    margin-left: 0 !important;
  }

  .newcomment-input {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    div {
      margin-right: 0;
    }
  }

  @media all and (max-width: 600px) {
    margin-left: -15px !important;
    padding: 15px;
    width: calc(100% + 30px);
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

  @media all and (max-width: 600px) {
    right: 10px;
    top: 25px;
    svg {
      font-size: 32px;
    }
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

  @media all and (max-width: 600px) {
    right: 15px;
    top: -20px;
  }
`;

const ImagePost = styled.div`
  width: 100%;
  text-align: center;
  img {
    max-width: 100%;
    margin-top: 15px;
    cursor: pointer;
  }
`;

export default connect(state => ({ store: state }),
  dispatch => ({ 
    onAddLike: (id, user_id) => dispatch({ type: 'ADD_LIKE', payload: id, user_id }),
    onRemoveLike: (id, user_id) => dispatch({ type: 'REMOVE_LIKE', payload: id, user_id }),
    onAddComment: (id, user_id) => dispatch({ type: 'ADD_COMMENT', payload: id, user_id }),
    onRemoveComment: (id, user_id) => dispatch({ type: 'REMOVE_COMMENT', payload: id, user_id })
  }),
)(withSnackbar(SingleNews));
