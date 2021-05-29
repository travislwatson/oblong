import { fromActionCreator } from './fromActionCreator'

export const hydrate = fromActionCreator((state) => ({
  type: 'HYDRATE',
  payload: state,
  meta: { isOblongHydrate: true },
}))
