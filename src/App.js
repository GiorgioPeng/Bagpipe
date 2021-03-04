import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import logo from './logo.svg';
import './App.css';
import { GlobalStateProvider } from "./globalState";
import ReactLive2d from 'react-live2d';
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
  return (
    <GlobalStateProvider>
      <Paper className={classes.root}>
        <IntroductionPage />
        <UploadPage />
        <VisualizationPage />
      </Paper>
      {/* <ReactLive2d
        width={300}
        height={500}
        bottom={'10px'}
        right={'10px'}
        ModelList={['miku']}
        TouchBody={['啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊你要干嘛', '哼', '坏人']}
      /> */}
    </GlobalStateProvider>
  );
}

export default App;
