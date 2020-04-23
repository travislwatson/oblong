import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
const rootReducer = (state, action) => {
    if (action.type === 'hello world')
        return { boom: true };
    return state;
};
const store = createStore(rootReducer);
export const OblongApp = ({ children }) => {
    return React.createElement(Provider, { store: store }, children);
};
