import * as React from 'react'
import { Store } from 'redux'
import { Selector } from 'reselect'

export type OblongState = any

export type CommandDebugLevel =
  | 'none'
  | 'redux-single'
  | 'redux-detailed'
  | 'console'
export type OblongStoreExtension = {
  commandDebugLevel: CommandDebugLevel
}

export interface OblongStore extends Store {
  oblong: OblongStoreExtension
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
  actionCreator: (payload: TPayload) => {
    type: string
    payload: TPayload
    meta: unknown
  }
}

export type CommandInner<TDep, TArgs extends unknown[], TOut> = (
  deps: TDep,
  ...args: TArgs
) => TOut
export type Command<TDep, TArgs extends any[], TOut> = Injectable<
  (...args: TArgs) => TOut
> & {
  inner: CommandInner<TDep, TArgs, TOut>
  name: string
}

export type State<T> = Injectable<T> & Queryable<T> & Dispatchable<T>

export type ViewInner<TDep, TProps> = ((
  deps: TDep,
  props: TProps
) => React.ReactElement<any, any> | null) & { displayName?: string }
export type View<TDep, TProps> = React.FC<TProps> & {
  inner: ViewInner<TDep, TProps>
}
