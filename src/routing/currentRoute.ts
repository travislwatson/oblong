import { O } from '../core/O'
import { createInternalState } from '../core/createState'

export interface OblongLocation {
  pathname: string
  search: string
  hash: string
}

const storedLocation = createInternalState()
  .withDefault<OblongLocation>({
    pathname: '',
    search: '',
    hash: '',
  })
  .setEquality('shallow')
  .as('routing.location')

export const updateLocation = O.createCommand()
  .with({ storedLocation })
  .named('oblong.updateLocation')
  .as<[OblongLocation], void>((o) => {
    o.storedLocation = {
      hash: o.args[0].hash,
      pathname: o.args[0].pathname,
      search: o.args[0].search,
    }
  })

export const currentLocation = O.createQuery()
  .with({ storedLocation })
  .as((o) => o.storedLocation)
