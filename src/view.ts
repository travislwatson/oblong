import * as React from 'react'
import { useSelector, useStore } from 'react-redux'
import { Unmaterialized } from './common'

export interface OblongView<TDep, TProps> extends React.FC<TProps> {
  inner: React.FC<TDep & TProps>
}

interface Config<TDep> {
  dependencies: Unmaterialized<TDep>
}

export interface ViewBuilder<TDep> {
  with: <TNewDep>(dependencies: Unmaterialized<TNewDep>) => ViewBuilder<TNewDep>
  as: <TProps = {}>(inner: React.FC<TDep & TProps>) => OblongView<TDep, TProps>
}

const makeView = <TDep>(initialDependencies: Unmaterialized<TDep>) => {
  const configuration: Config<TDep> = {
    dependencies: initialDependencies,
  }

  // TODO type this : ViewBuilder<TDependencies>
  const builderInstance: ViewBuilder<TDep> = {
    with: <TNewDep>(dependencies: Unmaterialized<TNewDep>) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as ViewBuilder<TNewDep>
    },
    // I don't know how to define this...
    // Is this related? https://github.com/microsoft/TypeScript/issues/5453
    as: <TProps = {}>(inner: React.FC<TDep & TProps>) => {
      const dependencyKeys = Object.keys(configuration.dependencies)

      const output = ((props: TProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { dispatch, getState } = useStore()

        const boundDependencies = {}

        for (const key of dependencyKeys) {
          const dependency = configuration.dependencies[key]
          switch (dependency.oblongType) {
            case 'command':
              // eslint-disable-next-line react-hooks/rules-of-hooks
              boundDependencies[key] = React.useCallback(
                dependency.materialize(dispatch, getState),
                [dispatch, getState]
              )
              break
            case 'query':
              // eslint-disable-next-line react-hooks/rules-of-hooks
              boundDependencies[key] = useSelector(dependency.selector)
              break
            case 'state':
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const currentValue = useSelector(dependency.query.selector)
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const setter = React.useCallback(
                dependency.command.materialize(dispatch, getState),
                [dispatch, getState]
              )
              Object.defineProperty(boundDependencies, key, {
                enumerable: true,
                get: () => currentValue,
                set: (newValue) => {
                  console.log({ newValue })
                  setter(newValue)
                },
              })
              break
            default:
              throw new Error('Unknown dependency provided to Oblong view')
          }
        }

        Object.assign(boundDependencies, props)

        return inner(boundDependencies as TDep & TProps)
      }) as OblongView<TDep, TProps>

      output.inner = inner

      return output
    },
  }

  // TODO This shimmy is due to not being able to get the `as` signature right above
  return builderInstance
}

export const createView = () => makeView({})
