import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

export default function Emoji() {
  return (
    <Picker
      set='emojione'
      title='Эмоджи' emoji='point_up'
      onSelect={(emoji) => console.log(emoji)}
      style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px' 
      }}
      i18n={{ 
        search: 'Поиск', 
        categories: { 
          search: 'Результат поиска', 
          recent: 'Последние' 
        } 
      }}
    />
  )
}
