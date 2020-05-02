import * as React from 'react'
import { Store } from 'redux'
import { History } from 'history'
import { Selector } from 'reselect'

export type OblongState = any

export interface OblongStore extends Store {
  history: History
}

interface PropertyDefinition<T> {
  get: () => T
  set: (newValue: T) => void
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

export type Query<TDep, TOut> = Injectable<TOut> &
  Queryable<TOut> & { inner: (dep: TDep) => TOut }

export type CommandArgs<TDep, TArgs> = TDep & { args: TArgs }
export type Command<TDep, TArgs extends any[], TOut> = Injectable<
  (...args: TArgs) => TOut
> & { inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut }

export type State<T> = Injectable<T> & Queryable<T>

export type View<TDep, TProps> = React.FC<TProps> & {
  inner: React.FC<TDep & TProps>
}
