import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

const FeatureList = [
  {
    title: 'React for UI',
    Svg: require('../../static/img/react.svg').default,
    description: (
      <>
        Oblong uses React for what it does best: UI binding. Oblong views are
        just React functional components with sugar. Oblong pulls stored state,
        derived state, and callbacks out of your components so they're lean and
        focused.
      </>
    ),
  },
  {
    title: 'Redux for State Management',
    Svg: require('../../static/img/redux.svg').default,
    description: (
      <>
        Oblong uses Redux, but you might not even recognize it. Unless you want
        to, there's <em>no reducer creation</em> in Oblong applications thanks
        to the auto-reducer.
      </>
    ),
  },
  {
    title: 'Oblong for Developer Experience',
    Svg: require('../../static/img/logo.svg').default,
    description: (
      <>
        TypeScript done right, with tons of type inference and low overhead.
        Dependency Injection for easy testing and application organization. Zero
        overhead performance optimizations. Accidental mutation prevention. And
        more!
      </>
    ),
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
