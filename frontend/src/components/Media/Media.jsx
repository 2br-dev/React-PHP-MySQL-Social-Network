import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    width: '100%',
    maxWidth: 345,
  },
  media: {
    height: 170,
  },
  text: {
    height: 140,
  }
};

function MediaCard(props) {
  const { classes } = props;
  return (
    <Card className={classes.card} style={ props.section === 'materials' ? { pointerEvents: 'none', filter: 'grayscale(100%)' } : {}}>
      <CardActionArea onClick={() => props.changeSection(props.section)}>
        <CardMedia
          className={classes.media}
          image={props.image}
          title={props.title}
        />
        <CardContent
          className={classes.text}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => props.changeSection(props.section)}>
          {props.button || "Перейти"}
        </Button>

{/*     <Button size="small" color="primary">
          Learn More
        </Button> */}
      </CardActions>
    </Card>
  );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);