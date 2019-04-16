import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import QuestionItem from './QuestionItem';
import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function CategoryItem(props) {
  const [checked, setChecked] = useState(false);
  const [categoryFiltered, setCategoryFiltered] = useState([]);
  const { classes } = props;
  const [checkedSubs, setCheckedSubs] = useState([]);

  useEffect(() => {
    const categoryFiltered = props.questions.filter(q => q.category === props.value);
    setCategoryFiltered(categoryFiltered);
    findUniqSubcategories(categoryFiltered);
  }, []);

  function markAll(e) {
    e.stopPropagation();
    let allCategories = props.store.categories;
    setChecked(checked ? false : true);
    !checked ? setCheckedSubs(allCategories) : setCheckedSubs([]);
  }

  function setHeadSubCategory(category) {
    let current = checkedSubs;

    if (current.indexOf(category) === -1) {
      current.push(category);
      setChecked(true);
    } else {
      current = current.filter(cat => cat !== category);
      if (current.length === 0) setChecked(false);
    }
    setCheckedSubs(current);
  }

  function markSub(e, category) {
    e.stopPropagation();
    props.handleMarkQuestion(undefined, props.value, checkedSubs.indexOf(category) !== -1, category)
    let current = checkedSubs;

    if (current.indexOf(category) === -1) {
      current.push(category);
      setChecked(true);
    } else {
      current = current.filter(cat => cat !== category);
      if (current.length === 0) setChecked(false);
    }

    setCheckedSubs(current);
  }

  function findUniqSubcategories(questions) {
    let result = props.store.categories;
    questions.forEach(question => {
      if (result.indexOf(question.subcategory) === -1) result.push(question.subcategory);
    })
    props.getCategories(result);
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className='align-center expansion-panel-top' style={{ paddingLeft: 12 }}>
        <Checkbox
          onClick={e => markAll(e)}
          checked={checked}
          onChange={() => props.handleMarkQuestion('', props.value, checked)}
        />
        <Typography className={classes.heading}>{props.var}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: 'column', padding: 0 }}>
        {/*eslint-disable-next-line */}
        {props.store.categories.map(category => {
          if (categoryFiltered.find(q => q.subcategory === category)) {
            return (
              <ExpansionPanel key={category}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className='align-center' style={{ paddingLeft: 12 }}>
                  <Checkbox
                    color='primary'
                    onClick={e => markSub(e, category)}
                    checked={checkedSubs.indexOf(category) !== -1}
                  />
                  <Typography className={classes.heading}>{category}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: 'column', padding: 0 }}>
                  <List>
                    {/*eslint-disable-next-line */}
                    {categoryFiltered.map(question => {
                      if (question.subcategory === category) {
                        return (
                          <QuestionItem
                            key={question.id}
                            category={category}
                            setHeadSubCategory={setHeadSubCategory}
                            question={question}
                            handleMarkQuestion={props.handleMarkQuestion}
                          />
                        )
                      }
                    })}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
          }
        }
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

CategoryItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(
  state => ({ store: state }),
  dispatch => ({
    getCategories: categories => {
      dispatch({ type: 'GET_CATEGORIES', payload: categories })
    },
    resetCategories: categories => {
      dispatch({ type: 'RESET_CATEGORIES', payload: categories })
    }
  })
)(withStyles(styles)(CategoryItem));
