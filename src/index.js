import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import FirebaseContext from './context/firebaseContext';
import { firebase, FieldValue } from './lib/firebase';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
