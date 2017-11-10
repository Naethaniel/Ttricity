import {auth} from './redux/modules/auth/reducers';
import {cardList} from './redux/modules/cardlist/reducers';

/* Redux */
import {routerReducer, syncHistoryWithStore} from 'react-router-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import firebase from 'firebase';
/* React Router */
import {browserHistory, hashHistory} from 'react-router';
import ReduxPromise from 'redux-promise';
/* Reducers */
import {createLogger} from 'redux-logger';
// const reducers = require('./reducers');
import thunk from 'redux-thunk';
/* App configs */
import config from './config';

/* Combine Reducers */
const reducer = combineReducers({
  routing: routerReducer,
  auth,
  cardList,
});

const logger = createLogger({
  // ...options
});

/* Initial the store */
function configureStore(initialState) {
  // Init firebase connection
  const config = {
    apiKey: " FIREBASE_API_KEY",
    authDomain: "turystycznetricity.firebaseapp.com",
    databaseURL: "https://turystycznetricity.firebaseio.com",
    projectId: "turystycznetricity",
    storageBucket: "turystycznetricity.appspot.com",
    messagingSenderId: "565617009011"
  };
  firebase.initializeApp(config);
  // Initial the redux devtools for Chrome
  // https://github.com/zalmoxisus/redux-devtools-extension/
  const createdStore = createStore(reducer, initialState,
    compose(
      applyMiddleware(logger, ReduxPromise, thunk),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f)
  );

  const {hot} = module;
  if (hot) {
    hot.accept('./reducers', () => {
      const auth = require('./redux/modules/auth/reducers');
      const cardList = require('./redux/modules/cardlist/reducers');
      const nextReducer = combineReducers({
        routing: routerReducer,
        auth,
        cardList,
      });
      createdStore.replaceReducer(nextReducer);
    });
  }

  return createdStore;
}

// Default saves and read saved redux state from local storage
const previousState = localStorage.getItem('reduxState');
const initialState = previousState ? JSON.parse(previousState) : {};

export const store = configureStore(initialState);
store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});
/* Initial history */
let routerHistory;
if (config.historyBackend === 'browserHistory') {
  routerHistory = browserHistory;
} else {
  routerHistory = hashHistory;
}
export const history = syncHistoryWithStore(routerHistory, store);
