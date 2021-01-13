// useRef and useEffect: DOM interaction
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/05-classes.js

import * as React from 'react'
import VanillaTilt from 'vanilla-tilt'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

class Tilt extends React.Component<{children: React.ReactNode}> {
  tiltRef: React.RefObject<HTMLDivElement> = React.createRef()
  componentDidMount(): void {
    const tiltNode = this.tiltRef.current!
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)
  }
  componentWillUnmount(): void {
    // @ts-expect-error vanillaTilt missing proper typings
    this.tiltRef.current!.vanillaTilt.destroy()
  }
  render(): JSX.Element {
    return (
      <div ref={this.tiltRef} className="tilt-root">
        <div className="tilt-child">{this.props.children}</div>
      </div>
    )
  }
}
const App: React.VFC = () => (
  <Tilt>
    <div className="totally-centered">vanilla-tilt.js</div>
  </Tilt>
)

export default App
