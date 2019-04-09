import React, { Fragment } from 'react';
import CategoryItem from './CategoryItem';

export default function SelectQuestions(props) {
  return (
    <Fragment>
      {props.categories.map(category => 
        <CategoryItem 
          key={category.id} 
          var={category.var} 
          value={category.value} 
          questions={props.questions} 
          handleMarkQuestion={props.handleMarkQuestion}
        />
      )}
    </Fragment>
  )
}
