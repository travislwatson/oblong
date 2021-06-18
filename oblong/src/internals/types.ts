import * as React from 'react'
import { Store, Reducer } from 'redux'
import { History } from 'history'
import { Selector } from 'reselect'

export type OblongState = any

export interface OblongStore extends Store {
  history: History
  registerReducer: (location: string, reducer: Reducer) => void
  registerEventHandler: (event: Event, command: Command<any, [], any>) => void
  eventHandlers: { [k: string]: Command<any, [], any>[] }
}

export interface PropertyDefinition<T> {
  get: () => T
  set?: (newValue: T) => void
}

export interface Injectable<T> {
  resolve: (store: OblongStore) => PropertyDefinition<T>
  register?: (store: OblongStore) => void
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

export type Query<TDep, TOut> = Injectable<TOut> &
  Queryable<TOut> & { inner: (dep: TDep) => TOut }

export interface Dispatchable<TPayload> {
  actionCreator: (
    payload: TPayload
  ) => { type: string; payload: TPayload; meta: unknown }
}

export type CommandArgs<TDep, TArgs> = TDep & { args: TArgs }
export type Command<TDep, TArgs extends any[], TOut> = Injectable<
  (...args: TArgs) => TOut
> & {
  inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
  name: string
}

export type State<T> = Injectable<T> & Queryable<T> & Dispatchable<T>

export type View<TDep, TProps> = React.FC<TProps> & {
  inner: React.FC<TDep & TProps>
}