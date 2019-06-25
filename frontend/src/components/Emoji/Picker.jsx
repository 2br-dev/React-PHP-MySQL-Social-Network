import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

export default function Emoji(props) {
  return (
    <Picker
      set='emojione'
      title='Эмоджи' emoji='point_up'
      onSelect={(emoji) => props.emojiClick(emoji)}
      style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '0',
        zIndex: 100,
      }}
    />
  )
}
