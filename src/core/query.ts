import { createSelector } from 'reselect'
import { Query, QueryDependencies, isQueryable, Queryable } from '../foundation/types'
import { deepFreeze } from '../utils/deepFreeze'
import { fromSelector } from '../injectables/fromSelector'

const makeQuery = <TDep, TOut>(
  name: string,
  dependencies: TDep,
  inner: (dependencies: TDep) => TOut
): Query<TDep, TOut> => {
  const dependencyKeys = Object.keys(dependencies)
  const dependentSelectors = dependencyKeys.map((i) => {
    const dependency = dependencies[i] as Queryable<any>
    if (!dependency[isQueryable]) {
      throw new Error(`Invalid dependency provided for ${name}. ${i} is not Queryable.`)
    }

    return dependency.selector
  })
  const remappedInner = (...args) => {
    const output = inner(
      dependencyKeys.reduce((out, i, index) => ({ ...out, [i]: args[index] }), {}) as any
    )

    if (process.env.NODE_ENV !== 'production') deepFreeze(output)

    return output
  }

  const selector = createSelector(dependentSelectors, remappedInner)

  return {
    ...fromSelector(selector),
    inner,
  }
}

export class QueryBuilder<TDep> {
  private dependencies: TDep
  private name: string

  constructor(name: string) {
    this.name = name
  }

  with<TNewDep>(dependencies: QueryDependencies<TNewDep>) {
    this.dependencies = dependencies as any
    // TODO, this isn't the proper type for left part of Omit, it should be `this`
    // but I can't change the generic...
    return (this as unknown) as Omit<QueryBuilder<TNewDep>, 'with'>
  }

  as<TOut>(inner: (dependencies: TDep) => TOut) {
    return makeQuery(this.name, this.dependencies, inner)
  }
}

export const query = (name: string = '') => new QueryBuilder(name)
