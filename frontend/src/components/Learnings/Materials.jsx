import React from 'react';
import Button from '@material-ui/core/Button';

export default function Materials(props) {
  return (
    <div>
      materials

      <Button variant='contained' onClick={props.closeSection}>Назад</Button>
    </div>
  )
}
