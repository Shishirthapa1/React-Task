// App.jsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import UserList from './pages/UserList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </Router>
  )
}

export default App
