// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import type {VFC, FC} from 'react'
import {useEffect, useRef} from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'
import type {HTMLVanillaTiltElement, TiltOptions} from 'vanilla-tilt'

function isHTMLVanillaTiltElement(
  htmlElement: HTMLElement | HTMLVanillaTiltElement,
): htmlElement is HTMLVanillaTiltElement {
  return 'vanillaTilt' in htmlElement
}

const Tilt: FC = ({children}) => {
  // 🐨 create a ref here with React.useRef()
  const tiltRef = useRef<HTMLDivElement>(null!)

  // 🐨 add a `React.useEffect` callback here and use VanillaTilt to make your
  // div look fancy.
  // 💰 like this:
  // const tiltNode = tiltRef.current
  // VanillaTilt.init(tiltNode, {
  //   max: 25,
  //   speed: 400,
  //   glare: true,
  //   'max-glare': 0.5,
  // })
  //
  // 💰 Don't forget to return a cleanup function. VanillaTilt.init will add an
  // object to your DOM node to cleanup:
  // `return () => tiltNode.vanillaTilt.destroy()`
  //
  // 💰 Don't forget to specify your effect's dependencies array! In our case
  // we know that the tilt node will never change, so make it `[]`. Ask me about
  // this for a more in depth explanation.
  useEffect(() => {
    const tiltNode = tiltRef.current
    const vanillaTiltOptions: TiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }

    VanillaTilt.init(tiltNode, vanillaTiltOptions)

    return () => {
      if (isHTMLVanillaTiltElement(tiltNode)) {
        tiltNode.vanillaTilt.destroy()
      }
    }
  }, [])

  // 🐨 add the `ref` prop to the `tilt-root` div here:
  return (
    <div className="tilt-root" ref={tiltRef}>
      <div className="tilt-child">{children}</div>
    </div>
  )
}

const App: VFC = (): JSX.Element => (
  <Tilt>
    <div className="totally-centered">vanilla-tilt.js</div>
  </Tilt>
)

export default App
