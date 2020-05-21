import { O } from '../core/O'
import { createInternalState } from '../core/state'

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

export const updateLocation = O.command('oblong.updateLocation')
  .with({ storedLocation })
  .as<[OblongLocation], void>((o) => {
    o.storedLocation = {
      hash: o.args[0].hash,
      pathname: o.args[0].pathname,
      search: o.args[0].search,
    }
  })

export const currentLocation = O.query()
  .with({ storedLocation })
  .as((o) => o.storedLocation)
