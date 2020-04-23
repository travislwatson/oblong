import { useDispatch, useSelector, useStore } from 'react-redux'

// Maybe something like this for defining dependency types: https://stackoverflow.com/a/44441178
// Or maybe in here, check out the Record<T, K> stuff too: https://stackoverflow.com/a/39281228
interface ViewConfiguration<TDependencies> {
  displayName: string
  dependencies: TDependencies
}

const defaultConfiguration: ViewConfiguration<{}> = {
  displayName: null,
  dependencies: {},
}

class ViewBuilder<TDependencies> {
  constructor(private configuration: ViewConfiguration<TDependencies>) {}

  public with<TNewDependencies>(dependencies: TNewDependencies) {
    return new ViewBuilder({
      ...this.configuration,
      dependencies,
    })
  }

  public name(displayName: string) {
    return new ViewBuilder({
      ...this.configuration,
      displayName,
    })
  }

  public as(functionalComponent: (o: TDependencies) => any) {
    const output = (props) => {
      const o = {
        ...props,
      }
      return functionalComponent(o)
    }

    // TODO here, bind commands and queries
    // TODO compute merged return type of stateless functional component using TDependencies combined with supplementals (dispatch, getState)
    // Also need to allow incoming props to have a generic type, and merge that generic type with above 2

    // BBIIGG TODO... how the hell do I map the types of queries, like (state: TState) => whatever to just whatever for selectors, and from (whatever) => {type: string, etc} to (whatever) => void

    if (this.configuration.displayName)
      output.displayName = this.configuration.displayName

    return output
  }
}

export const view = (configuration = defaultConfiguration) =>
  new ViewBuilder(configuration)
