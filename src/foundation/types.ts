import * as React from 'react'
import { Store, Reducer } from 'redux'
import { History } from 'history'
import { Selector } from 'reselect'

export type OblongState = any

export interface OblongStore extends Store {
  history: History
  registerReducer: (location: string, reducer: Reducer) => void
}

interface PropertyDefinition<T> {
  get: () => T
  set?: (newValue: T) => void
}

export interface Injectable<T> {
  resolve: (store: OblongStore) => PropertyDefinition<T>
}

export type Dependencies<T> = {
  [P in keyof T]: Injectable<T[P]>
}
export const isQueryable = Symbol()
export interface Queryable<T> {
  selector: Selector<OblongState, T>
  [isQueryable]: true
}

export type QueryDependencies<T> = {
  [P in keyof T]: Queryable<T[P]>
}

export type Query<TDep, TOut> = Injectable<TOut> & Queryable<TOut> & { inner: (dep: TDep) => TOut }

export interface Dispatchable<TPayload> {
  actionCreator: (payload: TPayload) => { type: string; payload: TPayload; meta: unknown }
}

export type CommandArgs<TDep, TArgs> = TDep & { args: TArgs }
export type Command<TDep, TArgs extends any[], TOut> = Injectable<(...args: TArgs) => TOut> & {
  inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
  name: string
}

export type State<T> = Injectable<T> & Queryable<T> & Dispatchable<T>

export type View<TDep, TProps> = React.FC<TProps> & {
  inner: React.FC<TDep & TProps>
}

type ResolvedLoader = {
  isLoading: boolean
  track: <TOut>(asyncAction: () => Promise<TOut>) => Promise<TOut>
}

export type Loader = Injectable<ResolvedLoader> & { named: (name: string) => Loader }

export type ErrorSink = Injectable<{
  errors: string[]
  logError: (error: string | string[]) => void
  clear: () => void
  dismiss: (error: string) => void
}> &
  Queryable<string[]>

export type PortableReducer<TState = any> = Injectable<TState> &
  Queryable<TState> & {
    location: string
    reducer: Reducer<TState>
  }
