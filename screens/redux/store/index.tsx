import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import reduxApp from '../reducers/index';

const middlewares = [ReduxThunk];


const store = createStore(
    reduxApp,
    {},// default state of the application
    compose(applyMiddleware(...middlewares)),
);


export default store;