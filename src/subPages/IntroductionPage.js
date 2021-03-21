import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TopPicture from '../assets/Picture'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  root: {
    // margin: '15px auto',
    marginBottom: 0

  },
  media: {
    height: 400,
    overflow: 'hidden'
  },
}));

function IntroductionPage() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.media}>
      <TopPicture/>
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Privacy Preserving Time Series Data Mining Platform based on Front-End
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          In the platform, users can upload their own datasets to do data mining without care about the privacy leaking problem.
          Because the platform is only depende on the front-end, that mean when the page finishes loading, users can run the
          platform offline. In this platform, Users can finish data preprocess, data visualization, machine learning(model training and prediction).
          There is a really high freedom of the platform, users can do data mining by different method according different dataset. Now, have a try!
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IntroductionPage
