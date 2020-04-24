import { createSelector } from 'reselect';
const defaultOblong = {};
const oblongSelector = (state) => (state ? state.oblong : defaultOblong);
let locatorIdIncrementor = 0;
const defaultUnorganized = {};
const unorganized = createSelector([oblongSelector], (oblongSelector) => oblongSelector.unorganized || defaultUnorganized);
const defaultConfiguration = {
    defaultValue: undefined,
    locator: '',
};
const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i;
const namespaceSelectorCache = {};
const emptyNamespace = {};
const getNamespaceSelector = (namespace) => {
    if (!namespaceSelectorCache.hasOwnProperty(namespace)) {
        const namespacePieces = namespace.split('.');
        // TODO revisit this and see if there's a faster way to do it
        // Maybe the new Function from string trick?
        // This selector needs to be very fast
        namespaceSelectorCache[namespace] = createSelector([oblongSelector], (oblongSelector) => {
            let currentStep = oblongSelector;
            for (const namespacePiece of namespacePieces) {
                currentStep = currentStep[namespacePiece] || emptyNamespace;
            }
            return currentStep;
        });
    }
    return namespaceSelectorCache[namespace];
};
const makeSelector = ({ defaultValue, locator, }) => {
    const isNestingLocator = nestingLocatorPattern.test(locator);
    if (!isNestingLocator)
        return createSelector([unorganized], (unorganized) => unorganized[locator] || defaultValue);
    const isNamespaced = locator.includes('.');
    if (!isNamespaced)
        return createSelector([oblongSelector], (oblongSelector) => oblongSelector[locator] || defaultUnorganized);
    const namespacePropSplitLocation = locator.lastIndexOf('.');
    const namespace = locator.substr(0, namespacePropSplitLocation);
    const namespaceSelector = getNamespaceSelector(namespace);
    const prop = locator.substr(namespacePropSplitLocation + 1);
    return createSelector([namespaceSelector], (namespaceSelector) => {
        return namespaceSelector[prop] || defaultValue;
    });
};
export class OblongState {
    constructor(newConfiguration = {}) {
        this.configuration = Object.assign(Object.assign({}, defaultConfiguration), newConfiguration);
        if (!this.configuration.locator)
            this.configuration.locator = `UNNAMED ${locatorIdIncrementor++}`;
        this.query = this.query.bind(this);
        this.query.oblongType = 'query';
        this.command = this.command.bind(this);
        this.command.oblongType = 'command';
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
            meta: { isOblong: true },
            payload: newValue,
        });
    }
}
// TODO figure out how to support array destructuring for [query, command]
export class OblongStateBuilder extends OblongState {
    constructor(newConfiguration = {}) {
        super(newConfiguration);
    }
    withDefault(defaultValue) {
        return new OblongStateBuilder(Object.assign(Object.assign({}, this.configuration), { defaultValue }));
    }
    as(locator) {
        return new OblongStateBuilder(Object.assign(Object.assign({}, this.configuration), { locator }));
    }
}
export const createState = () => new OblongStateBuilder();
