export const makeLocatorActionCreator = <TPayload>(locator: string) => (payload: TPayload) => ({
  type: `${locator}=`,
  meta: { oblong: { isSet: true, locator } },
  payload,
})
