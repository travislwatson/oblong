import { useSelector, useStore } from 'react-redux'
import { Unmaterialized } from './common'
import * as React from 'react'

export interface OblongView<TDependencies, TProps> extends React.FC<TProps> {
  inner: React.FC<TDependencies & TProps>
}

// Maybe something like this for defining dependency types: https://stackoverflow.com/a/44441178
// Or maybe in here, check out the Record<T, K> stuff too: https://stackoverflow.com/a/39281228
interface ViewConfiguration<TDependencies> {
  dependencies: Unmaterialized<TDependencies>
  displayName: string
  trace: boolean
}

export interface ViewBuilder<TDependencies> {
  with: <TNewDependencies>(
    dependencies: Unmaterialized<TNewDependencies>
  ) => ViewBuilder<TNewDependencies>
  displayName: (displayName: string) => ViewBuilder<TDependencies>
  trace: () => ViewBuilder<TDependencies>
  as: <TProps = {}>(
    inner: React.FC<TDependencies & TProps>
  ) => OblongView<TDependencies, TProps>
}

let displayNameIncrementor = 0

const makeView = <TDependencies>(
  initialDependencies: Unmaterialized<TDependencies>
) => {
  const configuration: ViewConfiguration<TDependencies> = {
    dependencies: initialDependencies,
    displayName: `UnknownView${displayNameIncrementor}`,
    trace: false,
  }

  // TODO type this : ViewBuilder<TDependencies>
  const builderInstance: ViewBuilder<TDependencies> = {
    with: <TNewDependencies>(
      dependencies: Unmaterialized<TNewDependencies>
    ) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as ViewBuilder<TNewDependencies>
    },
    displayName: (displayName: string) => {
      configuration.displayName = displayName
      return builderInstance
    },
    trace: () => {
      configuration.trace = true
      return builderInstance
    },
    // I don't know how to define this...
    // Is this related? https://github.com/microsoft/TypeScript/issues/5453
    as: <TProps = {}>(inner: React.FC<TDependencies & TProps>) => {
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

        return inner(boundDependencies as TDependencies & TProps)
      }) as OblongView<TDependencies, TProps>

      output.inner = inner

      return output
    },
  }

  // TODO This shimmy is due to not being able to get the `as` signature right above
  return builderInstance
}

export const createView = () => makeView({})
