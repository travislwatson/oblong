export interface Dependency<TSig> {
  type: 'command' | 'query' | 'state'
}

export type Dependencies<T> = {
  [K in keyof T]: Dependency<T[K]>
}

// export interface Command<TDep extends Dependencies, TOut> extends Dependency<(o: TDep) => > {
//   type: 'command'
//   resolve: (dispatch: any, getState: any) => (args: any[]) => any
//   inner: TSig
// }

export interface Query<T> extends Dependency<T> {
  type: 'query'
  resolve: () => (state: any) => T
}

export interface OblongDependency<TMaterialized> {
  oblongType: 'command' | 'query' | 'state' | 'view'
  materialize: (
    dispatch: (action: any) => void,
    getState: () => any
  ) => TMaterialized
}

export interface OblongCommand<TDependencies>
  extends OblongDependency<(...args: any[]) => any> {
  oblongType: 'command'
  inner: (dependencies: TDependencies & { args: any[] }) => any
}

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
