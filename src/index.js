import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './Containers/App/App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCJuLWLHq1XNRKcd5VEkZMmHhwxKRM_dJ8",
    authDomain: "trip-3b743.firebaseapp.com",
    databaseURL: "https://trip-3b743.firebaseio.com",
    projectId: "trip-3b743",
    storageBucket: "trip-3b743.appspot.com",
    messagingSenderId: "602397498465",
    appId: "1:602397498465:web:6c8fbc35fb489153"
  };
firebase.initializeApp(firebaseConfig);
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

serviceWorker.unregister();
