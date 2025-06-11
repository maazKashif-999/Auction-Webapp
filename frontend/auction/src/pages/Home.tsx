import React, { useContext } from 'react'
import NavBar from './NavBar'
import { authContext } from '../App'
import { Link } from 'react-router-dom'

const Home = () => {
  const {auth,setAuth}= useContext(authContext)
  console.log(auth)
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className="w-full">
      <NavBar setAuth={setAuth}/>
    </div>
    <div className="flex flex-col items-center justify-center flex-grow">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to BidMe</h1>
      <p className="text-lg text-gray-600 mt-4">Discover unique items and bid to win!</p>
      <button className="bg-teal-500 text-white px-6 py-3 rounded-full mt-8 hover:bg-teal-600 transition duration-300 ease-in-out"><Link to = "../browse">Browse Now!</Link></button>
    </div>
  </div>

  )
}

export default Home