// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import {VFC, ChangeEvent, Dispatch, SetStateAction, useRef} from 'react'
import {useState, useEffect} from 'react'

interface JSONStrategies {
  serialize: typeof JSON.stringify
  deserialize: <S>(text: string) => S & typeof JSON.parse
}

const useLocalStorageState = <K extends string, S>(
  key: K,
  initialState: S | (() => S),
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: JSONStrategies = {} as JSONStrategies,
): readonly [S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(() => {
    const valueInLocalStorage: null | string = globalThis.localStorage.getItem(
      key,
    )

    if (valueInLocalStorage) {
      try {
        return deserialize<S>(valueInLocalStorage)
      } catch (error) {
        globalThis.localStorage.removeItem(key)
      }
    }

    return typeof initialState === 'function'
      ? (initialState as () => S)()
      : initialState
  })

  const prevKeyRef = useRef(key)
  useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      globalThis.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    globalThis.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])
  return [state, setState] as const
}

interface Props {
  initialName?: string
}

const Greeting: VFC<Props> = ({initialName = ''}) => {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  const [name, setName] = useLocalStorageState('name', initialName)

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setName(event.target.value)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

const App: VFC = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        {count}
      </button>
      <Greeting />
    </>
  )
}

export default App
