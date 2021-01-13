// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import type {ChangeEvent, VFC} from 'react'
import {useState} from 'react'

// interface NameProps {
//   name: string
//   onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
// }
const Name: VFC = () => {
  const [name, setName] = useState<string>('')
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
    </div>
  )
}

interface FavoriteAnimalProps {
  animal: string
  onAnimalChange?: (event: ChangeEvent<HTMLInputElement>) => void
}
const FavoriteAnimal: VFC<FavoriteAnimalProps> = ({animal, onAnimalChange}) => (
  <div>
    <label htmlFor="animal">Favorite Animal: </label>
    <input id="animal" value={animal} onChange={onAnimalChange} />
  </div>
)

interface DisplayProps {
  animal: string
}
const Display: VFC<DisplayProps> = ({animal}) => {
  return <div>{`Your favorite animal is: ${animal}!`}</div>
}

const App: VFC = () => {
  // const [name, setName] = useState<string>('')

  const [animal, setAnimal] = useState<string>('')
  return (
    <form>
      <Name />

      <FavoriteAnimal
        animal={animal}
        onAnimalChange={event => setAnimal(event.target.value)}
      />
      <Display animal={animal} />
    </form>
  )
}

export default App
