// const dispatch = (i) => ({ type: 'foo' })
// const getState = () => ({})
// const materialize = <TMaterialized>(dep: OblongDependency<TMaterialized>) =>
//   dep.materialize(dispatch, getState)
// type TDependencies = {
//   [K in keyof TDependencies]: T[K] implements OblongDependency<TMaterialized> ? TMaterialized: never
// }
// const materializeMany = <T>(deps: Unmaterialized<T>): T => {
//   const output = {} as T
//   for (const key in deps) {
//     output[key] = deps[key].materialize(dispatch, getState)
//   }
//   return output
//   // todo
//   // return deps.map((i) => materialize(i))
// }
// const thing = (
//   name: OblongQuery<{}, string>,
//   setName: OblongCommandIn<{}, string>
// ) => {
//   const o = materializeMany({ name, setName })
//   const newName = o.name
//   o.setName()
// }
