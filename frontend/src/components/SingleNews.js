import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import DefaultAvatar from './img/photos/images.png';
import Comment from './img/icons/comment.png';
import Like from './img/icons/like.png';
import Liked from './img/icons/liked.png';
import Message from './img/icons/mail.png';

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
    fetch(`http://akvatory.local/api/user/info.php?id=${id}`)
      .then(response => response.json())
      .then(currentUser => this.setState({ currentUser }))
  }

  fetchComments(id) {
    fetch(`http://akvatory.local/api/news/single_comments.php?id=${id}`)
      .then(response => response.json())
      .then(thisComments => this.setState({ thisComments, loadedComments: !this.state.loadedComments }))
  }

  handleChange = e => {
    this.setState({commentText: e.target.value});
  }

  submitComment = e => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('news_id', this.props.singleNewsId);
    formData.append('who', `${this.props.user.name} ${this.props.user.surname}`);
    formData.append('date', new Date().toJSON().slice(0,10).replace(/-/g,'.'));
    formData.append('visible', 1);
    formData.append('time', new Date().toLocaleTimeString().slice(0,-3));
    formData.append('text', this.state.commentText);
    
    $.ajax({ 
      // DEV
      url         : 'http://akvatory.local/api/news/addcomment.php',
      /* url         : window.location.origin + '/api/news/addcomment.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        self.setState({commentText: ''});
        self.fetchComments();
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  getNoun(number) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return 'отметок';
    }
    number %= 10;
    if (number == 1) {
        return 'отметка';
    }
    if (number >= 2 && number <= 4) {
        return 'отметки';
    }
    return 'отметок';
} 

  render() {
    const { closeNews, singleNewsId, comments, news, user } = this.props;
    const { currentUser, thisComments, loadedComments, commentText } = this.state;
    const newsElement = this.props.news.filter((item) => item.id === singleNewsId);
    
    if(currentUser.length === 0) {
      this.fetchUserInfo(newsElement[0].author_id);
    }

    if(!loadedComments) {
      this.fetchComments(singleNewsId);
    }

    return (
      <>
        <Single>
          <button className="close" onClick={closeNews}></button>
          
          <PostHeader>
            {currentUser.avatar === '' ? <img src={DefaultAvatar} /> : <img src={window.location.origin + currentUser.avatar} />}
            <p>{currentUser.name} {currentUser.surname}</p>
          </PostHeader>

          <PostContent>
            <p>{newsElement[0].text}</p>
            <span>{newsElement[0].date}</span>
          </PostContent> 

          <PostLikes>
            <span><strong>{newsElement[0].likes}</strong> {this.getNoun(newsElement[0].likes)} "Нравится"</span>
            <span><strong>{newsElement[0].likes}</strong> {this.getNoun(newsElement[0].likes)} "Нравится"</span>  
          </PostLikes>  

          <PostActions>
            {Object.keys(thisComments).length}   <img src={Comment} /> 
            {newsElement[0].likes}          <img src={Like} />
                                            <img src={Message} />  
          </PostActions>   

          <NewComment>
            <p className='newcomment-reply'>В ответ <a href={`${window.location.origin}/id${currentUser.id}`}>{currentUser.name} {currentUser.surname}</a></p>
            <div className='newcomment-input'>
              {user.avatar === '' ? <img src={DefaultAvatar} /> : <img src={window.location.origin + user.avatar} />}
              <textarea onChange={this.handleChange} value={commentText} />
            </div>
            <button
              onClick={this.submitComment} 
              className="btn" 
              disabled={!commentText ? true : false}
              >
              Отправить</button>
          </NewComment>

            {thisComments.map((comment,i) => {    
              return ( 
                <Comments key={i}>
                  <div className='comment-header'>
                    {comment.avatar === '' || !comment.avatar ? <img src={DefaultAvatar} /> : <img src={window.location.origin + comment.avatar} />}
                    <p><strong>{comment.who}</strong></p>
                    <p className='comment-date'>{comment.date}</p>
                  </div>
                  <div className='comment-text'>{comment.text}</div>
                </Comments> 
            )})}
            

        </Single>
        <Wrapper onClick={closeNews}></Wrapper>
      </>
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
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  padding: 15px 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 80%;

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
    margin-bottom: 5px;
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

  span:first-child {
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
    
    img {
      border-radius: 50%;
      width: 40px;
    }
  }

  .comment-text {
    padding-left: 40px;
  }

  .comment-date {
    margin-left: 10px;
    color: #657786;
    :before {
      content: "\00b7";
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

    img {
      width: 30px;
      border-radius: 50%;
    }
    textarea {
      resize: none;
      width: 100%;
      margin-left: 10px;
      height: 90px;
      border-radius: 20px;
      border: 2px solid lightblue;
      padding: 10px;
      font-family: 'Calibri';
    }
  }
  .btn {
    margin-top: 15px;
    margin-left: 80%;
    :disabled {
      background: #329CC3;
      opacity: .3;
      cursor: not-allowed;
    }
  }
`;