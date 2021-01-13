// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import type {VFC, ChangeEvent} from 'react'
import {useState} from 'react'

interface Props {
  initialName?: string
}
const Greeting: VFC<Props> = ({initialName = ''}) => {
  // 💣 delete this variable declaration and replace it with a React.useState call
  const [name, setName] = useState(initialName)

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    // 🐨 update the name here based on event.target.value
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} value={name} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

const App: React.VFC = () => <Greeting initialName={'World'} />

export default App
