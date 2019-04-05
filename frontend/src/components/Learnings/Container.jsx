import React from 'react';
import { Paper } from '@material-ui/core';
import Card from '../Media/Media';
import cards from './cards';

export default function Container(props) {
  return (
    <Paper className={props.class}>
      {cards.map(card => 
        <Card 
          key={card.id} 
          title={card.title} 
          image={card.image} 
          description={card.description} 
          section={card.section}
          changeSection={props.changeSection}
          button={card.button}
        />
      )}
    </Paper>
  )
}
