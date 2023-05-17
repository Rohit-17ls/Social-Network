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
import Post from './routes/Post'
import NewGroup from './routes/NewGroup';
import Group from './routes/Group';
import Test from './routes/Test';
import Status from './routes/Status'
import Explore from './routes/Explore'

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
            <Route path="/new/group" element={<NewGroup/>}/>
            <Route path="/group/:groupname" element={<Group/>}/>
            <Route path="/post/:postID" element={<Post/>}/>
            <Route path="/explore" element={<Explore/>}/>
            <Route path='/check/status' element={<Status/>}/>
            <Route path="/test" element={<Test/>}/>
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
      </AuthContextProvider>
    </>
  )
}

export default App
