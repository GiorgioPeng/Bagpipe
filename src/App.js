import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import logo from './logo.svg';
import './App.css';
import { GlobalStateProvider } from "./globalState";
import { useKbn } from "use-kbn";
import UploadPage from './subPages/UploadPage'
import IntroductionPage from './subPages/IntroductionPage'
import VisualizationPage from './subPages/VisualizationPage'
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '30px auto',
    width: '90vw',
  },
}));
function App() {
  const classes = useStyles();
  const { element } = useKbn(
    "/model/platelet/model.json",
    'hello world',
    400,
    500
  );
  return (
    <GlobalStateProvider>
      <Paper className={classes.root}>
        <IntroductionPage />
        <UploadPage />
        <VisualizationPage />
      </Paper>
      {element}
    </GlobalStateProvider>
  );
}

export default App;
