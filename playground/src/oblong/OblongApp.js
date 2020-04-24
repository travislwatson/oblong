import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { makeReducer } from './makeReducer';
const makeStore = () => {
    const middlewares = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);
    return createStore(makeReducer(), composeWithDevTools(middleWareEnhancer));
};
export const OblongApp = ({ children }) => {
    const store = React.useMemo(makeStore, []);
    return React.createElement(Provider, { store: store }, children);
};
