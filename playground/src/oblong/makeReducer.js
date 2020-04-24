const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i;
export const makeReducer = () => {
    // const portableReducers = {}
    // TODO handle portableReducers
    return (previousState = { oblong: { unorganized: {} } }, { type, payload, meta }) => {
        if ((meta === null || meta === void 0 ? void 0 : meta.isOblong) && type.startsWith('SET ')) {
            const locator = type.substring(4);
            const isNestingLocator = nestingLocatorPattern.test(locator);
            if (!isNestingLocator)
                return Object.assign(Object.assign({}, previousState), { oblong: Object.assign(Object.assign({}, previousState.oblong), { unorganized: Object.assign(Object.assign({}, previousState.oblong.unorganized), { [locator]: payload }) }) });
            const isNamespaced = locator.includes('.');
            if (!isNamespaced)
                return Object.assign(Object.assign({}, previousState), { oblong: Object.assign(Object.assign({}, previousState.oblong), { [locator]: payload }) });
            const pathPartsAndProp = locator.split('.');
            const pathParts = pathPartsAndProp.slice(0, -1);
            const prop = pathPartsAndProp.slice(-1);
            const newOblongState = Object.assign({}, previousState.oblong);
            let workingLevel = newOblongState;
            for (const part of pathParts) {
                workingLevel[part] = workingLevel[part] ? Object.assign({}, workingLevel[part]) : {};
                workingLevel = workingLevel[part];
            }
            workingLevel[prop] = payload;
            return Object.assign(Object.assign({}, previousState), { oblong: newOblongState });
        }
        return previousState;
    };
};
