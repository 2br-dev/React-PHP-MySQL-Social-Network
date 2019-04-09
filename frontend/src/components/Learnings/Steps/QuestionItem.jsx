import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

class QuestionItem extends React.Component {

  mark(category, id) {
    this.props.setHeadSubCategory(category);
    this.props.handleMarkQuestion(id, '')
  }

  render() {
    const { question } = this.props;
    return (
      <ListItem dense button onClick={() => this.mark(this.props.category, question.id)}>
        <Checkbox
          checked={question.checked}
          tabIndex={-1}
          disableRipple
          color='primary'
        />
        <ListItemText primary={question.question} />
      </ListItem>
    );
  }
}

export default QuestionItem;