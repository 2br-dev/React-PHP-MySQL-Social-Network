import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import SingleNews from './SingleNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from './Fab/Fab';
import NewNews from './News/NewNews';

export default class News extends Component {
  constructor(props){
    super(props);
    this.state = {
      news: [],
      comments: [],
      newNews: false,
      newNewsTopic: '',
      newNewsText: '',
      newNewsImportance: false,
      editing: '',
      singleNews: false,
      singleNewsData: [],
      singleNewsId: ''
    }

    this.countComments   = this.countComments.bind(this);
    this.addLike         = this.addLike.bind(this);
    this.reloadComponent = this.reloadComponent.bind(this);
    this.removeLike      = this.removeLike.bind(this);
    this.addNews         = this.addNews.bind(this);
    this.handleChange    = this.handleChange.bind(this);
    this.submitNews      = this.submitNews.bind(this);
    this.removeNews      = this.removeNews.bind(this);
    this.editNews        = this.editNews.bind(this);
    this.prepareNews     = this.prepareNews.bind(this);
    this.showNews        = this.showNews.bind(this);
    this.changeImportance = this.changeImportance.bind(this)
  }

  componentDidMount() {
    this.reloadComponent();       
  }

  async reloadComponent()  {
    await fetch(`http://akvatory.local/api/news/read.php`)
      .then(response => response.json())
      .then(news => this.setState({ news: news.records }))
    await fetch(`http://akvatory.local/api/news/getcomments.php`)
      .then(response => response.json())
      .then(comments => this.setState({ comments: comments.records }))
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    $(e.target).removeClass('invalid');
  }

  // считает кол-во комментариев
  countComments = (id) => (this.state.comments.filter((comment) => comment.news_id === id)).length;
 
  // добавляем лайк
  addLike = (id, e) => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('liked_by', this.props.user.id);
    console.log(id);
    
    $.ajax({ 
      // DEV
      url         : 'http://akvatory.local/api/news/addlike.php',
      /* url         : window.location.origin + '/api/news/addlike.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        self.reloadComponent();
      },
      error: function(err) {
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
      // DEV
      url         : 'http://akvatory.local/api/news/removelike.php',
      /* url         : window.location.origin + '/api/news/removelike.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        self.reloadComponent();
        self.setState({ newNews: false });
          /*  */
      },
        error: function(err) {
        console.log(err);
      }
    });
  } 

  submitNews = (e) => {
    var self = this;
    e.preventDefault();
    if(self.state.newNewsTopic !== '' && self.state.newNewsText !== '') {
      const formData = new FormData();
    
      formData.append('author', `${this.props.user.name} ${this.props.user.surname}`);
      formData.append('title', this.state.newNewsTopic);
      formData.append('text', this.state.newNewsText);
      formData.append('date', new Date().toJSON().slice(0,10).replace(/-/g,'.'));
      formData.append('created', new Date().getTime());
      formData.append('importance', this.state.newNewsImportance ? 1 : 0);
      formData.append('author_id', this.props.user.id);
      
      $.ajax({ 
        // DEV
        url         : 'http://akvatory.local/api/news/submitnews.php',
        /* url         : window.location.origin + '/api/news/submitnews.php', */
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          self.reloadComponent();
          self.setState({ newNews: !self.state.newNews, newNewsText: '', newNewsTopic: ''});
          window.scrollTo(0,0);
        },
        error: function(err) {
          console.log(err);
        }
      });
    } else {
      
      if (self.state.newNewsTopic === '') $('input[name="newNewsTopic"]').addClass('invalid');
      if (self.state.newNewsText === '') $('textarea').addClass('invalid');
    }
  } 

  changeImportance = () => this.setState({newNewsImportance: !this.state.newNewsImportance});

  removeNews = (e) => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', $(e.target).data("id"));
      
    $.ajax({ 
      // DEV
      url         : 'http://akvatory.local/api/news/delete.php',
      /* url         : window.location.origin + '/api/news/delete.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        self.reloadComponent();
      },
      error: function(err) {
        console.log(err);
      }
    });
  };

  prepareNews = e => {
    let title = this.state.news.find(news => news.id === e.target.dataset.id).title;
    let text = this.state.news.find(news => news.id === e.target.dataset.id).text;
    this.setState({ editing: e.target.dataset.id, newNewsTopic: title, newNewsText: text});
  } 

  editNews = e => {
    var self = this;
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', $(e.target).data("id"));
    formData.append('title', this.state.newNewsTopic);
    formData.append('text', this.state.newNewsText);
      
    $.ajax({ 
      // DEV
      url         : 'http://akvatory.local/api/news/edit.php',
      /* url         : window.location.origin + '/api/news/edit.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        self.reloadComponent();
        self.setState({ editing: '' });
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
  
  addNews = () => this.setState({ editing: '', newNews: !this.state.newNews, newNewsText: '', newNewsTopic: ''});

  showNews = id => this.setState({ singleNews: true, singleNewsId: id });
  
  // закрываем новость 
  closeNews = () => {
    this.setState({ singleNews: false, singleNewsId: '', newNews: false });
    this.reloadComponent();
  }
  

  render() {
    const { news, newNews, newNewsText, newNewsTopic, editing, singleNews, singleNewsId, comments, newNewsImportance } = this.state;
    const { user } = this.props;

    return (
      <div>
        {news.map((item,i) => {  
          return (
            <NewsContainer key={i}>
              <UserAvatar src={window.location.origin + `/img/photos/images.png`} /> 
              
              <div onClick={editing === '' ? () => this.showNews(item.id) : null }>
                <NewsInfo>
                  {user.id === item.author_id ?
                  <><p><strong>Вы</strong> {item.date}</p> <button onClick={this.removeNews} data-id={item.id} className="btn">Удалить</button></> :
                  <p><strong>{item.author}</strong> {item.date}</p> }
                </NewsInfo>
                {editing !== item.id ?
                <><NewsTitle>{item.title}</NewsTitle>
                <div dangerouslySetInnerHTML={{__html: item.text}}></div></>
                : 
                <form id='edit-news' action="" method="POST" onSubmit={this.editNews}>
                  <NewsTitle>
                    <input name='newNewsTopic' value={newNewsTopic} 
                      onChange={this.handleChange} />
                  </NewsTitle>
                  <textarea name='newNewsText' value={newNewsText} 
                    onChange={this.handleChange} 
                  >{item.text}</textarea>
                  <button onClick={this.editNews}
                    data-id={item.id} type='submit' className="btn" style={{'marginTop':'5px'}}>Изменить</button>
                </form> }
              </div>

              <Actions>
                <p>{this.countComments(item.id)}</p> 
                <FontAwesomeIcon onClick={editing === '' ? () => this.showNews(item.id) : null } icon="comments" />  
                <p>{item.likes}</p> 

                {!item.liked_by.includes(` ${user.id}`) 
                  ?
                  <FontAwesomeIcon onClick={e => this.addLike(item.id, e)} icon="heart" /> 
                  :
                  <FontAwesomeIcon onClick={e => this.removeLike(item.id, e)} icon="heart" style={{ color: 'red' }} />
                }

                <FontAwesomeIcon data-id={item.id} onClick={this.addLike} icon="envelope" style={{ marginLeft: '25px' }} />
                
                {user.id === item.author_id 
                  ? 
                  <FontAwesomeIcon data-id={item.id} onClick={this.prepareNews} icon="edit" style={{ marginLeft: '25px' }} />
                  : 
                  null
                }    
              </Actions>

            </NewsContainer> 
            )
          }
        )} 

        <div onClick={this.addNews}><Fab title='Добавить новость' /></div>

        {newNews ? 
          <NewNews 
            user={user}
            newNewsTopic={newNewsTopic}
            newNewsText={newNewsText}
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
              comments={comments}
              news={news}
              user={user}
              reloadComponent={this.reloadComponent} />
          : 
            null}
      </div>
    )
  }
}

const NewsContainer = styled.div`
  position: relative;
  padding: 20px 20px 20px 140px;
  cursor: pointer;
  border-bottom: 1px solid #e6ecf0;

  :hover {
    background: #e6f7ff;
    transition: .37s ease;
  }

  textarea {
    border-bottom: 1px solid #e6ecf0;
    resize: none;
    width: 100%;
    border-radius: 10px;
    min-height: 100px;
    padding: 5px 10px;
  }
`;

const NewsTitle = styled.p`
  font-size: 1.37rem;
  input {
    font-size: 16px;
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid #e6ecf0;
  }
`;

const NewsInfo = styled.div`
  position: relative;
  
  p {
    color: #657786;
  }
  strong {
    color: #000;
    :after {
      content: '\00b7';
      margin-left: 5px;
    }
  }
  .btn {
    position: absolute;
    left: unset;
  }
`;

const UserAvatar = styled.img`
  position: absolute;
  left: 25px;
  top: 37px;
  border-radius: 50%;
  width: 80px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 5px;
    color: #657786;
  }
`;
