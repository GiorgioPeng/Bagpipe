import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GlobalStateProvider } from "./globalState";
import UploadPage from './subPages/UploadPage'

function App() {
  return (
    <GlobalStateProvider>
      <UploadPage />
    </GlobalStateProvider>
  );
}

export default App;
