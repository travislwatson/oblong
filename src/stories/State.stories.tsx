import * as React from 'react'
import { OblongApp, O } from '../'

type StateProps = {
  path: string
  defaultValue: string
}

const Template = (props: StateProps) => {
  const sampleState = O.state(props.path).as(props.defaultValue)
  const SampleView = O.view()
    .with({ sampleState })
    .as((x) => (
      <input
        type="text"
        value={x.sampleState}
        onChange={(e) => {
          x.sampleState = e.target.value
        }}
      />
    ))

  return (
    <OblongApp>
      <SampleView />
    </OblongApp>
  )
}

export default {
  title: 'State',
  component: Template,
}

export const State = Template.bind({})
State.args = {
  path: 'test.location',
  defaultValue: 'Hello World',
}

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
