import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserData } from './redux/userSlice'
import Interview from './pages/Interview'
import InterviewReport from './pages/InterviewReport'
import History from './pages/History'
import Pricing from './pages/Pricing'

export const ServerUrl="http://localhost:8000"

const App = () => {

const dispatch=useDispatch()

useEffect(() => {
  const getUser=async()=>{
    try {
      const response=await axios.get(ServerUrl+"/api/user/current-user",{withCredentials:true})
      
      dispatch(setUserData(response.data))
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }
  getUser()
}, [dispatch])

  return (
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/auth' element={<Auth />} />
    <Route path='/interview' element={<Interview/>} />
    <Route path='/history' element={<History/>}/>
    <Route path='/pricing' element={<Pricing/>}/>
    <Route path='/report/:id' element={<InterviewReport/>}/>
   </Routes>
  )
}

export default App