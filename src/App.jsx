import { Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import { Header } from './components'

function App() {
  return (
    <>
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </>
  )
}

export default App
