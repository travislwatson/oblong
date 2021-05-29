import { render } from 'react-dom'
import { OblongApp, React, state, view, command, query } from './oblong'

const clickCount = state('myGame.clickCount').as(0)

const isPlaying = query()
  .with({ clickCount }) // ⬅ Dependency Injection! 🎉
  .as((o) => o.clickCount < 10)

const fallDown = command()
  .with({ clickCount, isPlaying })
  .as((o) => {
    if (o.isPlaying) {
      o.clickCount = o.clickCount - 1 // ⬅ That's actually immutable Redux! 💪
    }
  })

const hitUp = command()
  .with({ clickCount, isPlaying, fallDown }) // ⬅ State, Queries, & Commands! 🤭
  .as((o) => {
    if (o.isPlaying) {
      o.clickCount = o.clickCount + 1

      setTimeout(o.fallDown, 2000)
    }
  })

const Game = view()
  .with({ clickCount, hitUp, isPlaying })
  .as((o) => (
    <>
      <button onClick={o.hitUp} disabled={!o.isPlaying}>
        ☝️
      </button>
      <label>{o.isPlaying ? `${o.clickCount} clicks` : `You won!`}</label>
      <progress max="10" value={o.clickCount} />
    </>
  ))

render(
  <OblongApp>
    <Game />
  </OblongApp>,
  document.getElementById('root')
)
