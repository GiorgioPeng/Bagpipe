import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import head from '../assets/gs.jpg'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '5px auto',
    width: '95%',
  },
  media: {
    height: 400,
  },
}));

function IntroductionPage() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
            className={classes.media}
            image={head}
            title="Contemplative Reptile"
          />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Privacy Preserving Time Series Data Mining Platform based on Front-End
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          In the platform, user can upload their own data to do data mining without care about the privacy leaking problem.
          Because the platform is only depende on the front-end, that mean when the page finishes loading, you can run the
          platform offline. You can finish data preprocess, data visualization, machine learning model training and prediction.
          This platform have a really high freedom, you can choose different method according your data. Now, have a try!
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IntroductionPage
