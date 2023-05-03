import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Home from './routes/Home'
import AuthContextProvider from './context/AuthContext'
import Profile from './routes/Profile'
import NotFound from './routes/NotFound'
import NewPost from './routes/NewPost'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>

      <AuthContextProvider>
        <Routes>
          <Route path="/" element ={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/user/:username" element={<Profile/>}/>
            <Route path="/new/post" element={<NewPost/>}/>
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
      </AuthContextProvider>
    </>
  )
}

export default App
