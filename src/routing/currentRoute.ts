import { O } from '../core/O'
import { state } from '../core/state'

export interface OblongLocation {
  pathname: string
  search: string
  hash: string
}

const storedLocation = state('oblong.routing.location').setEquality('shallow').as<OblongLocation>({
  pathname: '',
  search: '',
  hash: '',
})

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
