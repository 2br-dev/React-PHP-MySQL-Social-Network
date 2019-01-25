import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import SingleNews from './SingleNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class News extends Component {
  constructor(props){
    super(props);
    this.state = {
      news: [],
      comments: [],
      newNews: false,
      newNewsTopic: '',
      newNewsText: '',
      newNewsImportance: 0,
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
      formData.append('importance', this.state.newNewsImportance);
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

  changeImportance = () => this.state.newNewsImportance === 0 ? this.setState({newNewsImportance: 1}) : this.setState({newNewsImportance: 0});

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
    this.setState({ singleNews: false, singleNewsId: '' });
    this.reloadComponent();
  }
  

  render() {
    const { news, newNews, newNewsText, newNewsTopic, editing, singleNews, singleNewsId, comments } = this.state;
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
        <AddNews onClick={this.addNews}>
          <img src={window.location.origin + '/img/icons/add.png'} alt='Добавить новость' title='Добавить новость' />
          <p>Добавить новость</p>
        </AddNews> 

        {newNews ? (
          <>
          <NewNews>
            <div className="newNews-header">Новая новость <button className='close' onClick={() => this.setState({ newNews: !this.state.newNews })}></button></div>
            <div className='newNews-content'>
              <form action="" method="POST" onSubmit={this.submitNews}>
                {user.avatar === '' 
                  ? <img alt='' src={window.location.origin + `/img/photos/images.png`} /> 
                  : <img alt='' src={`${window.location.origin}${user.avatar}`} /> 
                }
                <input 
                  onChange={this.handleChange} required
                  name='newNewsTopic' type='text' placeholder='Заголовок' value={newNewsTopic} />
                <textarea required name='newNewsText' onChange={this.handleChange} className='nawNews-text' value={newNewsText} />
                <Checkbox>
                  <label className="checkbox-container">Важная новость
                    <input type="checkbox" name='importance' />
                    <span onClick={this.changeImportance.bind(this)} className="checkbox-checkmark"></span>
                  </label>
                </Checkbox>
                <button
                  onClick={this.submitNews} 
                  className='btn'>Добавить новость</button>
              </form>  
            </div>
          </NewNews>
          <Wrapper onClick={() => this.setState({ newNews: !this.state.newNews })}></Wrapper>
          </>
          ) 
          : null}

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

const AddNews = styled.div`
  width: 125px;
  background: #00c5fe;
  position: fixed;
  right: 50px;
  bottom: 50px;
  border-radius: 50%;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  p, img {
    margin-left: 5px;
  }
  
  &:hover {
    cursor: pointer;
    background: lighten(#00c5fe, 10%);
    box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0, .5);
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 30;
`;

const NewNews = styled.div`
  background: #f0f8f6;
  width: 600px;
  position: fixed;
  top: 150px;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 20px;
  z-index: 37;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

  .newNews-header {
    border-bottom: 1px solid #e6ecf0;
    text-align: center;
    position: relative;
    font-weight: 700;
    font-size: 20px;
    padding: 10px 0;
  }

  .newNews-content {
    height: fit-content;
    min-height: 150px;
    padding: 10px;
    background: #e6f7ff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    position: relative;
    padding-bottom: 70px;

    input, .nawNews-text {
      margin-left: 60px;
      padding: 10px 5px;
      border-radius: 10px;
      width: 85%;
      border: 2px solid #e6ecf0
    }

    input {
      font-weight: bold;
    }

    .nawNews-text {
      display: block;
      margin-top: 10px;
      min-height: 130px;
      background: #fff;
      resize: none;
    }

    .btn {
      position: absolute;
      left: unset;
      right: 35px;
      bottom: 20px;
    }

    img {
      position: absolute;
      left: 15px;
      top: 10px;
      width: 40px;
      border-radius: 50%;
    }

  }

  .close {
    top: -5px;
  }
`;

const Checkbox = styled.div`
  label {
    position: absolute;
    left: 70px;
    font-size: 16px;
    bottom: 10px;
    line-height: 25px;
  }
`;