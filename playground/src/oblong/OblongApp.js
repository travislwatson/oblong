import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
const rootReducer = (state, action) => {
    if (action.type === 'hello world')
        return { boom: true };
    return state;
};
const makeStore = () => {
    const middlewares = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);
    return createStore(rootReducer, composeWithDevTools(middleWareEnhancer));
};
export const OblongApp = ({ children }) => {
    const store = React.useMemo(makeStore, []);
    return React.createElement(Provider, { store: store }, children);
};
