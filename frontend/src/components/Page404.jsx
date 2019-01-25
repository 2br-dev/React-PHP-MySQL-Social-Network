import React, { Component } from 'react';
import './css/404.css';

class Page404 extends Component {

  goToMain = () => window.location.href = '/';

  render() {
    return (
      <main>
        <div className="loading wave">
          404
        </div>
        <div className="not-found wave">
          Страница не найдена
        </div> 
      <button onClick={this.goToMain}>перейти на главную</button>
    </main>
    )
  }
}

export default Page404;