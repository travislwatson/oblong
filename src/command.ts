// TODO how in the world can I allow this type of crazy?
// This isn't doing what I want. I can't figure out how to get interface overloading working right
type ZeroVoid = () => void
type OneVoid = <TArg1>(TArg1) => void
type TwoVoid = <TArg1, TArg2>(TArg1, TArg2) => void
type ThreeVoid = <TArg1, TArg2, TArg3>(TArg1, TArg2, TArg3) => void
type FourVoid = <TArg1, TArg2, TArg3, TArg4>(TArg1, TArg2, TArg3, TArg4) => void
type FiveVoid = <TArg1, TArg2, TArg3, TArg4, TArg5>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5
) => void
type SixVoid = <TArg1, TArg2, TArg3, TArg4, TArg5, TArg6>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6
) => void
type SevenVoid = <TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7
) => void
type EightVoid = <TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7,
  TArg8
) => void
type ZeroReturn = <TReturn>() => TReturn
type OneReturn = <TArg1, TReturn>(TArg1) => TReturn
type TwoReturn = <TArg1, TArg2, TReturn>(TArg1, TArg2) => TReturn
type ThreeReturn = <TArg1, TArg2, TArg3, TReturn>(
  TArg1,
  TArg2,
  TArg3
) => TReturn
type FourReturn = <TArg1, TArg2, TArg3, TArg4, TReturn>(
  TArg1,
  TArg2,
  TArg3,
  TArg4
) => TReturn
type FiveReturn = <TArg1, TArg2, TArg3, TArg4, TArg5, TReturn>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5
) => TReturn
type SixReturn = <TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TReturn>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6
) => TReturn
type SevenReturn = <TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TReturn>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7
) => TReturn
type EightReturn = <
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7,
  TArg8,
  TReturn
>(
  TArg1,
  TArg2,
  TArg3,
  TArg4,
  TArg5,
  TArg6,
  TArg7,
  TArg8
) => TReturn

type AnyFunc =
  | OneVoid
  | TwoVoid
  | ThreeVoid
  | FourVoid
  | FiveVoid
  | SixVoid
  | SevenVoid
  | EightVoid
  | OneReturn
  | TwoReturn
  | ThreeReturn
  | FourReturn
  | FiveReturn
  | SixReturn
  | SevenReturn
  | EightReturn

export interface OblongCommand extends AnyFunc {
  name: string
}

type Query = <TReturn>(state: any) => TReturn

const myFunc = (q: Query) => {
  return () => q(null)
}
