import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import DefaultAvatar from './img/photos/images.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, Button, TextField, Tooltip } from '@material-ui/core';
import API from './functions/API';

export default class SingleNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: [],
      thisComments: [],
      loadedComments: false,
      commentText: ''
    }
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

  handleChange = e => this.setState({ commentText: e.target.value });

  // добавляем лайк
  addLike = (id, e) => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', this.props.user.id);
    console.log(id);

    $.ajax({
      url: `${API}/api/news/addlike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.props.reloadComponent();
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

    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', this.props.user.id);

    $.ajax({
      url: `${API}/api/news/removelike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.props.reloadComponent();
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  submitComment = e => {
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
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  getNoun(number) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) return 'отметок';
    number %= 10;
    if (number === 1) return 'отметка';
    if (number >= 2 && number <= 4) return 'отметки';
    return 'отметок';
  }

  render() {
    const { closeNews, singleNewsId, user, likedBy } = this.props;
    const { currentUser, thisComments, loadedComments, commentText } = this.state;
    const newsElement = this.props.news.filter(item => item.id === singleNewsId);

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

    if (currentUser.length === 0) this.fetchUserInfo(newsElement[0].author_id);
    if (!loadedComments) this.fetchComments(singleNewsId);

    return (
      <Fragment>
        <Single>
          <button className='close' onClick={closeNews}></button>

          <PostHeader>
            <Avatar style={{ background: `url(${currentUser.avatar ? avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
            <Typography variant='subtitle2'>{currentUser.name} {currentUser.surname}</Typography>
          </PostHeader>

          <PostContent>
            <Typography variant='body1'>{newsElement[0].text}</Typography>
            <Typography variant='caption'>{newsElement[0].date}</Typography>
          </PostContent>

          <PostLikes>
            <Typography variant='subtitle2'>{newsElement[0].likes} {this.getNoun(newsElement[0].likes)} "Нравится"</Typography>
            {/* eslint-disable-next-line*/}
            {likedBy.map((user, i) => {

              while (i < 7) {
                return (
                <Tooltip key={i} title={`${user.name} ${user.surname}`} placement="top">
                  <Avatar style={{ background: `url(${user.avatar ? user.avatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                </Tooltip>
            )}})}
          </PostLikes>

          <PostActions>
            {Object.keys(thisComments).length}
            <FontAwesomeIcon icon='comments' />

            {!newsElement[0].liked_by.includes(` ${user.id}`)
              ?
              <React.Fragment>
                <span>{newsElement[0].likes}</span>
                <FontAwesomeIcon onClick={e => this.addLike(newsElement[0].id, e)} icon='heart' />
              </React.Fragment>
              :
              <React.Fragment>
                <span>{newsElement[0].likes}</span>
                <FontAwesomeIcon onClick={e => this.removeLike(newsElement[0].id, e)} icon='heart' style={{ color: 'red' }} />
              </React.Fragment>
            }

            <FontAwesomeIcon icon='envelope' style={{ marginLeft: '25px' }} />
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
                  onChange={this.handleChange}
                  required
                />
              </TextArea>
            </div>
            <Button variant='contained' color='primary' onClick={this.submitComment} disabled={!commentText}>Отправить</Button>
          </NewComment>

          {thisComments.map((comment, i) => {
            return (
              <Comments key={i}>
                <div className='comment-header'>
                  <Avatar style={{ background: `url(${user.avatar ? userAvatar : DefaultAvatar}) no-repeat center/cover` }}></Avatar>
                  <Typography variant='subtitle2'>{comment.who}</Typography>
                  <Typography variant='caption' className='comment-date'>{comment.date}</Typography>
                </div>
                <div className='comment-text'>{comment.text}</div>
              </Comments>
            )
          })}


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
    font-size: 24px;
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
  width: 30px;
  border-radius: 50%;
  height: 30px;
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