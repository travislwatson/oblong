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
        return createSelector([unorganized], (unorganized) => unorganized.hasOwnProperty(locator) ? unorganized[locator] : defaultValue);
    const isNamespaced = locator.includes('.');
    if (!isNamespaced)
        return createSelector([oblongSelector], (oblongSelector) => oblongSelector.hasOwnProperty(locator)
            ? oblongSelector[locator]
            : defaultUnorganized);
    const namespacePropSplitLocation = locator.lastIndexOf('.');
    const namespace = locator.substr(0, namespacePropSplitLocation);
    const namespaceSelector = getNamespaceSelector(namespace);
    const prop = locator.substr(namespacePropSplitLocation + 1);
    return createSelector([namespaceSelector], (namespaceSelector) => namespaceSelector.hasOwnProperty(prop)
        ? namespaceSelector[prop]
        : defaultValue);
};
export class OblongState {
    constructor(newConfiguration = {}) {
        this.oblongType = 'state';
        this.configuration = Object.assign(Object.assign({}, defaultConfiguration), newConfiguration);
        if (!this.configuration.locator)
            this.configuration.locator = `Unnamed State ${locatorIdIncrementor++}`;
    }
    get query() {
        if (!this.cachedSelector)
            this.cachedSelector = makeSelector(this.configuration);
        return {
            oblongType: 'query',
            // This probably won't be used... is it required? Does materialize have to be on everything?
            materialize: (_dispatch, getState) => this.cachedSelector(getState()),
            inner: () => undefined,
            selector: this.cachedSelector,
        };
    }
    get command() {
        if (!this.cachedSelector)
            this.cachedSelector = makeSelector(this.configuration);
        return {
            oblongType: 'command',
            materialize: (dispatch, _getState) => (newValue) => {
                Object.freeze(newValue);
                return dispatch({
                    type: `SET ${this.configuration.locator}`,
                    meta: { isOblong: true },
                    payload: newValue,
                });
            },
            inner: () => undefined,
        };
    }
}
// TODO figure out how to support array destructuring for [query, command]
export class OblongStateBuilder extends OblongState {
    constructor(newConfiguration = {}) {
        super(newConfiguration);
    }
    withDefault(defaultValue) {
        Object.freeze(defaultValue);
        return new OblongStateBuilder(Object.assign(Object.assign({}, this.configuration), { defaultValue }));
    }
    as(locator) {
        return new OblongStateBuilder(Object.assign(Object.assign({}, this.configuration), { locator }));
    }
}
export const createState = () => new OblongStateBuilder();