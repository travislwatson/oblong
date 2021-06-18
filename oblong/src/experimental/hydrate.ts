import { fromActionCreator } from './fromActionCreator'

export const hydrate = fromActionCreator((state: any) => ({
  type: 'HYDRATE',
  payload: state,
  meta: { isOblongHydrate: true },
}))
