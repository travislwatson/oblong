// TODO how in the world can I allow this type of crazy?
// This isn't doing what I want. I can't figure out how to get interface overloading working right
type ZeroVoid = () => void
type OneVoid<TArg1> = (TArg1) => void
type TwoVoid<TArg1, TArg2> = (TArg1, TArg2) => void
type ThreeVoid<TArg1, TArg2, TArg3> = (TArg1, TArg2, TArg3) => void
type FourVoid<TArg1, TArg2, TArg3, TArg4> = (TArg1, TArg2, TArg3, TArg4) => void
type FiveVoid<TArg1, TArg2, TArg3, TArg4, TArg5> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5
) => void
type SixVoid<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6
) => void
type SevenVoid<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7
) => void
type EightVoid<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7,
  TArg8
) => void
type ZeroReturn<TReturn> = () => TReturn
type OneReturn<TArg1, TReturn> = (TArg1, ) => TReturn
type TwoReturn<TArg1, TArg2, TReturn> = (TArg1, TArg2, ) => TReturn
type ThreeReturn<TArg1, TArg2, TArg3, TReturn> = (
  TArg1,
  TArg2,
  TArg3,
  
) => TReturn
type FourReturn<TArg1, TArg2, TArg3, TArg4 TReturn> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  
) => TReturn
type FiveReturn<TArg1, TArg2, TArg3, TArg4, TArg5, TReturn> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  
) => TReturn
type SixReturn<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TReturn> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  
) => TReturn
type SevenReturn<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TReturn> = (
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7
) => TReturn
type EightReturn<
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7,
  TArg8,
  TReturn
> = (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8) => TReturn

// blarg, this didn't work either.
type AnyFunc = OneVoid | TwoVoid | ThreeVoid | FourVoid | FiveVoid | SixVoid | SevenVoid | EightVoid

export interface OblongCommand<
  TReturn = void,
  TArg1 = undefined,
  TArg2 = undefined,
  TArg3 = undefined,
  TArg4 = undefined,
  TArg5 = undefined,
  TArg6 = undefined,
  TArg7 = undefined,
  TArg8 = undefined
> {
  (): void
  (TArg1): void
  (TArg1, TArg2): void
  (TArg1, TArg2, TArg3): void
  (TArg1, TArg2, TArg3, TArg4): void
  (TArg1, TArg2, TArg3, TArg4, TArg5): void
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, rg8): void
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7): void
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8): void
  (): TReturn
  (TArg1): TReturn
  (TArg1, TArg2): TReturn
  (TArg1, TArg2, TArg3): TReturn
  (TArg1, TArg2, TArg3, TArg4): TReturn
  (TArg1, TArg2, TArg3, TArg4, TArg5): TReturn
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, rg8): TReturn
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7): TReturn
  (TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8): TReturn
  name: string
}

const thing = (incoming: OblongCommand<number, string>) => {
  incoming()
}
