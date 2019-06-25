import React, {Component} from 'react';
import EmojiPicker from 'emoji-picker-react';

const emojiClickOK = (emoji) => {
    console.log(emoji);
}

export default function Emoji({emojiClick}){
    
    return (
        <EmojiPicker onEmojiClick={(emoji) => emojiClickOK(emoji)}/>
    ); 
}