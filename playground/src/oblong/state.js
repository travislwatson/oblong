import { createSelector } from 'reselect';
let locatorIdIncrementor = 0;
const defaultUnorganized = {};
const unorganized = (state) => (state && state.unorganized) || defaultUnorganized;
const defaultConfiguration = {
    defaultValue: undefined,
    locator: '',
};
const nestingLocatorPattern = /^([a-z_]+\.)*([a-z\_]+)$/i;
const namespaceSelectorCache = {};
const emptyNamespace = {};
const getNamespaceSelector = (namespace) => {
    if (!namespaceSelectorCache.hasOwnProperty(namespace)) {
        const namespacePieces = namespace.split('.');
        // TODO revisit this and see if there's a faster way to do it
        // Maybe the new Function from string trick?
        // This selector needs to be very fast
        namespaceSelectorCache[namespace] = (state) => {
            if (!state)
                return emptyNamespace;
            let currentStep = state;
            for (const namespacePiece of namespacePieces) {
                currentStep = currentStep[namespacePiece] || emptyNamespace;
            }
        };
    }
    return namespaceSelectorCache[namespace];
};
const makeSelector = ({ defaultValue, locator, }) => {
    const isNestingLocator = nestingLocatorPattern.test(locator);
    if (!isNestingLocator)
        return createSelector([unorganized], (unorganized) => unorganized[locator] || defaultValue);
    if (!locator.includes('.'))
        return (state) => (state && state[locator]) || defaultUnorganized;
    const namespacePropSplitLocation = locator.lastIndexOf('.');
    const namespace = locator.substr(0, namespacePropSplitLocation);
    const namespaceSelector = getNamespaceSelector(namespace);
    const prop = locator.substr(namespacePropSplitLocation);
    return createSelector([namespaceSelector], (namespaceSelector) => namespaceSelector[prop] || defaultValue);
};
// TODO figure out how to support array destructuring for [query, command]
export class OblongState {
    constructor(newConfiguration = {}) {
        this.configuration = Object.assign(Object.assign({}, defaultConfiguration), newConfiguration);
        if (!this.configuration.locator)
            this.configuration.locator = `UNNAMED ${locatorIdIncrementor++}`;
        this.query = this.query.bind(this);
        this.command = this.command.bind(this);
    }
    query(state) {
        if (!this.cachedSelector)
            this.cachedSelector = makeSelector(this.configuration);
        return this.cachedSelector(state);
    }
    command(dispatch, 
    // TODO use query + getState support setSomething(oldValue => oldValue + 1)
    // TODO use Object.is to bail out of state updates
    getState) {
        return (newValue) => dispatch({
            type: `SET ${this.configuration.locator}`,
            meta: { isOblongSetter: true },
            payload: newValue,
        });
    }
    withDefault(defaultValue) {
        return new OblongState(Object.assign(Object.assign({}, this.configuration), { defaultValue }));
    }
    as(locator) {
        return new OblongState(Object.assign(Object.assign({}, this.configuration), { locator }));
    }
}
export const createState = () => new OblongState();
