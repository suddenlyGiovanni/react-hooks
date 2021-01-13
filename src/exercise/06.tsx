// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.tsx

import {useEffect, VFC} from 'react'
import {useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import type {IPokemon} from '../pokemon'

interface PokemonInfoProps {
  pokemonName: string
}

//#region State
enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

interface BaseState {
  status: Status
  pokemon: null | IPokemon
  error: null | Error
}

interface IdleState extends BaseState {
  status: Status.IDLE
  pokemon: null
  error: null
}

interface PendingState extends BaseState {
  status: Status.PENDING
  pokemon: null
  error: null
}

interface RejectedState extends BaseState {
  status: Status.REJECTED
  pokemon: null
  error: Error
}
interface ResolvedState extends BaseState {
  status: Status.RESOLVED
  pokemon: IPokemon
  error: null
}

type State = IdleState | PendingState | RejectedState | ResolvedState
//#endregion

const PokemonInfo: VFC<PokemonInfoProps> = ({pokemonName}) => {
  const [state, setState] = useState<State>({
    status: Status.IDLE,
    pokemon: null,
    error: null,
  })

  useEffect(() => {
    if (!pokemonName) return undefined

    setState({
      status: Status.PENDING,
      pokemon: null,
      error: null,
    })

    fetchPokemon(pokemonName).then(
      pokemonData =>
        setState({
          status: Status.RESOLVED,
          pokemon: pokemonData,
          error: null,
        }),
      error =>
        setState({
          status: Status.REJECTED,
          error: error,
          pokemon: null,
        }),
    )
  }, [pokemonName])

  switch (state.status) {
    case Status.IDLE:
      return <>Submit a pokemon</>
    case Status.PENDING:
      return <PokemonInfoFallback name={pokemonName} />
    case Status.RESOLVED:
      return <PokemonDataView pokemon={state.pokemon} />
    case Status.REJECTED:
      // this will be handled by an error boundary
      throw state.error
    default:
      return null
  }
}

const ErrorFallback: VFC<FallbackProps> = ({error, resetErrorBoundary}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
)

const App: VFC = () => {
  const [pokemonName, setPokemonName] = useState<string>('')

  function handleSubmit(newPokemonName: string): void {
    setPokemonName(newPokemonName)
  }

  function handleErrorReset(): void {
    return setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={handleErrorReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
