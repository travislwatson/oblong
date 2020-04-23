import { OblongCommand } from './command'
import { OblongQuery } from './query'

// type OblongStateStarter<T> = [OblongQuery<T>, OblongCommand<T>]

// export interface OblongState extends OblongStateStarter {
//   nombre: string
// }

// const test = (thing: OblongState) => {
//   const [name, setName] = thing
// }

let locatorId = 0
const getLocatorId = () => `UNKNOWN-${locatorId++}`

type StateValue = null | undefined | number | boolean | string | object | any[]

interface StateConfiguration<TValue> {
  defaultValue: TValue
  locator: string
}

const defaultConfiguration: StateConfiguration = {
  defaultValue: undefined,
  locator: '',
}

type PartialOblongState<TValue> = {
  [get: () => TValue, set: (TValue) => void]
}

class OblongState<TValue = undefined> implements PartialOblongState<TValue> {
  private configuration: StateConfiguration<TValue>

  constructor(newConfiguration: Partial<StateConfiguration<TValue>>) {
    this.configuration = {
      ...defaultConfiguration,
      ...newConfiguration,
    }

    if (!this.configuration.locator)
      this.configuration.locator = `UNKNOWN-${locatorId++}`
  }

  public withDefault<TNewValue>(newDefault: TNewValue) {
    return new OblongState<TNewValue>({
      ...this.configuration,
      defaultValue: newDefault,
    })
  }
}
