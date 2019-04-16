import React from 'react';
import './css/BgBubbles.css';

const BgBubbles = ({ cssClass }) => {
  return (
    <ul className={cssClass ? `${cssClass} bg-bubbles` : 'bg-bubbles'}>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  )
}

export default BgBubbles;