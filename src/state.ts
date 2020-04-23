import { OblongCommand } from './command'
import { OblongQuery } from './query'

type OblongStateStarter<T> = [OblongQuery<T>, OblongCommand<T>]

export interface OblongState extends OblongStateStarter {
  nombre: string
}

const test = (thing: OblongState) => {
  const [name, setName] = thing
}
