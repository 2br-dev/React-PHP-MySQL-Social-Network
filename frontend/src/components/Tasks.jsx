import React, { Component } from 'react';
import './css/Tasks.css';

class Tasks extends Component {
  render() {
    return (
      <section className="tasks">
        <nav className="tasks-header">
          <ul>
            <li className="task-active"> Все задачи</li>
            <li> Переданные</li>
            <li> Выполненные</li>
          </ul>
        </nav>
        <div className="tasks-item">
          <p className="tasks-item__from">ОтАлекян Сергей</p>
          <div className="tasks-item__all">
            <div className="tasks-item__all-when">
              <p>Получено:</p>
              <p className="tasks-time">29.03.1993</p>
              <p className="tasks-time">12:00</p>
            </div>
            <div className="tasks-item__all-text">
              <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.</p>
            </div>
            <div className="tasks-item__all-until">
              <p>Cрок выполнения:</p>
              <span>
                <p className="tasks-time">29.03.1993</p>
                <p>Изменить</p>
              </span>
              <span>
                <p className="tasks-time">15:00</p>
                <p>Изменить</p>
              </span>
            </div>
          </div>
          <nav className="tasks-footer">
            <ul>
              <li> Удалить</li>
              <li> Изменить</li>
              <li className="tasks-footer-trans"> Передать другому</li>
              <li className="tasks-footer-transfered">ПереданаАлекян 037</li>
              <button>Выполнено</button>
            </ul>
          </nav>
        </div>
        <div className="tasks-item important-task">
          <p className="tasks-item__from">ОтАлекян Сергей</p>
          <div className="tasks-item__all">
            <div className="tasks-item__all-when">
              <p>Получено:</p>
              <p className="tasks-time">29.03.1993</p>
              <p className="tasks-time">12:00</p>
            </div>
            <div className="tasks-item__all-text ">
              <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.</p>
            </div>
            <div className="tasks-item__all-until">
              <p>Cрок выполнения:</p>
              <span>
                <p className="tasks-time">29.03.1993</p>
                <p>Изменить</p>
              </span>
              <span>
                <p className="tasks-time">15:00</p>
                <p>Изменить</p>
              </span>
            </div>
          </div>
          <nav className="tasks-footer">
            <ul>
              <li> Удалить</li>
              <li> Изменить</li>
              <li className="tasks-footer-trans"> Передать другому</li>
              <li className="tasks-footer-transfered">ПереданаАлекян 037</li>
              <button>Выполнено</button>
            </ul>
          </nav>
        </div>
        <div className="tasks-item transfered-task">
          <p className="tasks-item__from">ОтАлекян Сергей</p>
          <div className="tasks-item__all">
            <div className="tasks-item__all-when">
              <p>Получено:</p>
              <p className="tasks-time">29.03.1993</p>
              <p className="tasks-time">12:00</p>
            </div>
            <div className="tasks-item__all-text">
              <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.</p>
            </div>
            <div className="tasks-item__all-until">
              <p>Cрок выполнения:</p>
              <span>
                <p className="tasks-time">29.03.1993</p>
                <p>Изменить</p>
              </span>
              <span>
                <p className="tasks-time">15:00</p>
                <p>Изменить</p>
              </span>
            </div>
          </div>
          <nav className="tasks-footer">
            <ul>
              <li> Удалить</li>
              <li> Изменить</li>
              <li className="tasks-footer-trans"> Передать другому</li>
              <li className="tasks-footer-transfered">ПереданаАлекян 037</li>
              <button>Выполнено</button>
            </ul>
          </nav>
        </div>
        <div className="tasks-item done-task">
          <p className="tasks-item__from">ОтАлекян Сергей</p>
          <div className="tasks-item__all">
            <div className="tasks-item__all-when">
              <p>Получено:</p>
              <p className="tasks-time">29.03.1993</p>
              <p className="tasks-time">12:00</p>
            </div>
            <div className="tasks-item__all-text">
              <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой"</p>
            </div>
            <div className="tasks-item__all-until">
              <p>Cрок выполнения:</p>
              <span>
                <p className="tasks-time">29.03.1993</p>
                <p>Изменить</p>
              </span>
              <span>
                <p className="tasks-time">15:00</p>
                <p>Изменить</p>
              </span>
            </div>
          </div>
          <nav className="tasks-footer">
            <ul>
              <li> Удалить</li>
              <li className="tasks-footer-change"> Изменить</li>
              <li className="tasks-footer-trans"> Передать другому</li>
              <li className="tasks-footer-transfered">ПереданаАлекян 037</li>
              <button>Выполнено</button>
            </ul>
          </nav>
        </div>
        <div className="tasks-add">
          <img src={window.location.origin + '/img/icons/add.png'} alt='Добавить задачу' title='Добавить задачу' />
          <p>Новая задача</p>
        </div>
      </section>
    )
  }
}

export default Tasks;