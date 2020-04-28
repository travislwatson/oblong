export interface OblongDependency<TMaterialized> {
  oblongType: 'command' | 'query' | 'state' | 'view'
  materialize: (
    dispatch: (action: any) => void,
    getState: () => any
  ) => TMaterialized
}

export interface OblongCommand<TDependencies>
  extends OblongDependency<() => void> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [] }) => void
}

export interface OblongCommandOut<TDependencies, TOut>
  extends OblongDependency<() => TOut> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [] }) => TOut
}

export interface OblongCommandIn<TDependencies, TIn1>
  extends OblongDependency<(in1: TIn1) => void> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1] }) => void
}

export interface OblongCommandInOut<TDependencies, TIn1, TOut>
  extends OblongDependency<(in1: TIn1) => TOut> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1] }) => TOut
}

export interface OblongCommandInIn<TDependencies, TIn1, TIn2>
  extends OblongDependency<(in1: TIn1, in2: TIn2) => void> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1, TIn2] }) => void
}

export interface OblongCommandInInOut<TDependencies, TIn1, TIn2, TOut>
  extends OblongDependency<(in1: TIn1, in2: TIn2) => TOut> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1, TIn2] }) => TOut
}

export interface OblongCommandInInIn<TDependencies, TIn1, TIn2, TIn3>
  extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3) => void> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1, TIn2, TIn3] }) => void
}

export interface OblongCommandInInInOut<TDependencies, TIn1, TIn2, TIn3, TOut>
  extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3) => TOut> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: [TIn1, TIn2, TIn3] }) => TOut
}

export interface OblongCommandInInInIn<TDependencies, TIn1, TIn2, TIn3, TIn4>
  extends OblongDependency<
    (in1: TIn1, in2: TIn2, in3: TIn3, in4: TIn4) => void
  > {
  oblongType: 'command'
  inner: (
    dependencies: TDependencies & { args: [TIn1, TIn2, TIn3, TIn4] }
  ) => void
}

export interface OblongCommandInInInInOut<
  TDependencies,
  TIn1,
  TIn2,
  TIn3,
  TIn4,
  TOut
>
  extends OblongDependency<
    (in1: TIn1, in2: TIn2, in3: TIn3, in4: TIn4) => TOut
  > {
  oblongType: 'command'
  inner: (
    dependencies: TDependencies & { args: [TIn1, TIn2, TIn3, TIn4] }
  ) => TOut
}

// TODO blow this out to 8 arguments. That should be enough for even the crazy people
// It's just types so it shouldn't blow out the bundle size

export interface OblongQuery<TDependencies, TOutput>
  extends OblongDependency<TOutput> {
  oblongType: 'query'
  inner: (dependencies: TDependencies) => TOutput
  selector: (state: any) => TOutput
}

// This is the magic sauce! Copied from Proxy example in Typescript docs... allows unmaterializing while preserving types
export type Unmaterialized<T> = {
  [P in keyof T]: OblongDependency<T[P]>
}

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
