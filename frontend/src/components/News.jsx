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
import Snackbar from './Snackbar/Snackbar';
import Loader from './Loader/Loader';

class News extends Component {
  constructor(props) {
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
      singleNewsId: '',
      invalidText: false,
      invalidTopic: false,
      snackBar: false,
      snackBarMessage: '',
      snackBarVariant: '',
      loading: true
    }

    this.countComments = this.countComments.bind(this);
    this.addLike = this.addLike.bind(this);
    this.reloadComponent = this.reloadComponent.bind(this);
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
    this.reloadComponent();
  }

  async reloadComponent(action) {
    if (!action) await this.setState({ loading: true }) 
    await fetch(`${API}/api/news/read.php`)
      .then(response => response.json())
      .then(news => this.props.onAddNews(news.records || []))
    await fetch(`${API}/api/news/getcomments.php`)
      .then(response => response.json())
      .then(comments => this.setState({ comments: comments.records }))
    await this.setState({ loading: false })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ invalidText: false, invalidTopic: false });
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

    $.ajax({
      url: `${API}/api/news/addlike.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.reloadComponent('like');
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
        self.reloadComponent('like');
        self.setState({ newNews: false });
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  submitNews = (e) => {
    var self = this;
    e.preventDefault();
    if (this.state.newNewsTopic !== '' && this.state.newNewsText !== '') {
      const formData = new FormData();

      formData.append('author', `${this.props.user.name} ${this.props.user.surname}`);
      formData.append('title', this.state.newNewsTopic);
      formData.append('text', this.state.newNewsText);
      formData.append('date', new Date().toJSON().slice(0, 10).replace(/-/g, '.'));
      formData.append('created', new Date().getTime());
      formData.append('importance', this.state.newNewsImportance ? 1 : 0);
      formData.append('author_id', this.props.user.id);

      $.ajax({
        url: `${API}/api/news/submitnews.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          console.log(res);
          self.reloadComponent();
          self.setState({ newNews: !self.state.newNews, newNewsText: '', newNewsTopic: '' });
          window.scrollTo(0, 0);
          self.setState({ snackBar: true, snackBarMessage: 'Добавлена новая новость', snackBarVariant: 'success' })
        },
        error: function (err) {
          console.log(err);
          self.setState({ snackBar: true, snackBarMessage: 'Не удалось добавить новость', snackBarVariant: 'error' })
        }
      });
    } else {

      if (self.state.newNewsTopic === '') this.setState({ invalidTopic: true });
      if (self.state.newNewsText === '') this.setState({ invalidText: true });
    }
  }

  changeImportance = () => this.setState({ newNewsImportance: !this.state.newNewsImportance });

  removeNews = id => {
    this.setState({ editing: true });
    var self = this;
    const formData = new FormData();
    formData.append('id', id);

    $.ajax({
      url: `${API}/api/news/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.reloadComponent();
        self.setState({ editing: '' });
        self.setState({ snackBar: true, snackBarMessage: 'Новость была удалена', snackBarVariant: 'success' })
      },
      error: function (err) {
        console.log(err);
        self.setState({ snackBar: true, snackBarMessage: 'Не удалось удалить новость', snackBarVariant: 'error' })
      }
    });
    setTimeout(() => this.setState({ snackBar: false }), 5700);
  };

  prepareNews = id => {
    let title = this.props.store.news.find(news => news.id === id).title;
    let text = this.props.store.news.find(news => news.id === id).text;
    this.setState({ editing: id, newNewsTopic: title, newNewsText: text });
  }

  editNews = (e, id) => {
    e.preventDefault();
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
        success: function (res) {
          self.reloadComponent();
          setTimeout(() => self.setState({ editing: '' }), 200);
          self.setState({ snackBar: true, snackBarMessage: 'Новость была изменена', snackBarVariant: 'success' })
        },
        error: function (err) {
          console.log(err);
          self.setState({ snackBar: true, snackBarMessage: 'Не удалось изменить новость', snackBarVariant: 'error' })
        }
      });
      setTimeout(() => this.setState({ snackBar: false }), 5700);
    } else {
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
    this.setState({ singleNews: false, singleNewsId: '', newNews: false, likedBy: [] });
    this.reloadComponent('close');
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBar: false });
  };

  render() {
    const { news, invalidText, invalidTopic, newNews, loading, newNewsText, newNewsTopic, editing, singleNews, singleNewsId, comments, newNewsImportance } = this.state;
    const { user } = this.props;
    let avatar = null;
    window.location.host.includes('localhost') ? avatar = user.avatar : avatar = `frontend/public/${user.avatar}`;

    if (this.state.news.length === 0) {
      setTimeout(() => this.setState({ news: this.props.store.news }), 0);
    }

    return (
      <Paper>
        {loading ? <Loader minHeight={300} color='primary' /> :
          this.props.store.news.length > 0 && this.props.store.news ? this.props.store.news.map((item, i) => {
            return (
              <NewsContainer key={i}>
                <UserAvatar style={{ background: `url(${user.avatar === '' ? defaultAvatar : avatar}) no-repeat center/cover` }} />
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
                            <DeleteIcon onClick={() => this.removeNews(item.id)} />
                          </Tooltip>
                        </Icon>
                      </Fragment>
                      :
                      <Typography variant='caption'>
                        <Typography variant='subtitle2'>{item.author}</Typography>
                        {item.date}
                      </Typography>}
                  </NewsInfo>
                  {editing !== item.id ?
                    <Fragment>
                      <Typography variant='button'>{item.title.replace(/&quot;/g, `"`)}</Typography>
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
                        required
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
                          required
                        />
                      </TextArea>
                      <Button onClick={(e) => this.editNews(e, item.id)} variant='contained' color='primary'>Изменить</Button>
                    </form>}
                </div>

                <Actions>
                  <p>{this.countComments(item.id)}</p>
                  <FontAwesomeIcon onClick={editing === '' ? () => this.showNews(item.id) : null} icon="comments" />
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
                    <FontAwesomeIcon onClick={() => this.prepareNews(item.id)} icon="edit" style={{ marginLeft: '25px' }} />
                    :
                    null
                  }
                  <Button onClick={() => this.showNews(item.id)} variant='contained' color='primary' style={{ position: 'absolute', right: 40 }}>Читать</Button>
                </Actions>

              </NewsContainer>
            )
          }
          ) : <NoNews><Typography variant='h6'>нет новостей</Typography></NoNews>}

        <div onClick={this.addNews}><Fab title='Добавить новость' /></div>

        {newNews ?
          <NewNews
            user={user}
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
            comments={comments}
            news={news}
            user={user}
            reloadComponent={this.reloadComponent} />
          :
          null}

        {/* Snackbar */}
        <Snackbar
          snackBar={this.state.snackBar}
          variant={this.state.snackBarVariant}
          message={this.state.snackBarMessage}
          handleCloseSnackBar={this.handleCloseSnackBar.bind(this)}
        />
      </Paper>
    )
  }
}

const NewsContainer = styled.div`
  position: relative;
  padding: 20px 40px 20px 120px;
  border-bottom: 1px solid #e6ecf0;
  input {
    padding: 10px 15px;
  }
  :hover {
    background: rgba(0,0,0,0.015);
    transition: .37s ease;
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
const NoNews = styled.div`
  height: 254px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .37;
  margin-bottom: 20px;
`;
const Icon = styled.div`
  cursor: pointer;
  svg {
    color: rgba(0,0,0,0.54);
  }
`;

export default connect(
  state => ({
    store: state,
  }),
  dispatch => ({
    onAddNews: (news) => {
      dispatch({ type: 'ADD_NEWS', payload: news })
    }
  })
)(News);