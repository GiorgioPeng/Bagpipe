import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import logo from './logo.svg';
import './App.css';
import { GlobalStateProvider } from "./globalState";
import { useKbn } from "use-kbn";
import Divider from '@material-ui/core/Divider';
import UploadPage from './subPages/UploadPage'
import IntroductionPage from './subPages/IntroductionPage'
import VisualizationPage from './subPages/VisualizationPage'
import MachineLearnPage from './subPages/MachineLearnPage'
import LearningResultPage from './subPages/LearningResultPage'
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '30px auto',
    width: '90vw',
  },
}));
function App() {
  const classes = useStyles();
  // const { element } = useKbn(
  //   "/model/platelet/model.json",
  //   'hello world',
  //   400,
  //   500
  // );
  return (
    <GlobalStateProvider>
      <Paper className={classes.root}>
        <IntroductionPage />
        <UploadPage />
        <Divider variant="middle" />
        <VisualizationPage />
        <Divider variant="middle" />
        <MachineLearnPage />
        <LearningResultPage />
      </Paper>
      {/* {element} */}
    </GlobalStateProvider>
  );
}

export default App;
