import './App.css'
import HomePage from './HomePage'
import { Route, Routes } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import About from './About'
import Menu from './Menu'
import Contact from './Contact'
import Checkout from './Checkout'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/checkout' element={<Checkout />} />
      </Routes>
    </div>
  )
}

export default App