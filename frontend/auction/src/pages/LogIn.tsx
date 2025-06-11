import React from 'react'
import { useState,useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { authContext } from '../App';
import { useNavigate,Link } from 'react-router-dom';
const LogIn = () => {
  const navigate = useNavigate();
  const {auth,setAuth} = useContext(authContext);
  const [err,setErr] = useState("")
  const [formData, setFormData] = useState({ name: "", password: ""});
  const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault(); 
    axios.post(`http://localhost:8000/login`, {
      name: formData.name,
      password: formData.password})
    .then((response:any)=>{
      console.log(response)
      if (response.status === 200){
        setAuth(true)
        const token = response.data.token;        
        localStorage.setItem('token', token);
        navigate("./home")
      }
    })
    .catch((error:AxiosError<any>)=>{
      setErr(error.response?.data?.message)
    })

  }
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to Auction</h2>
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input onChange={onhandleChange} type="text" id="username" name="name" value={formData.name} className="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50" required/>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input onChange={onhandleChange} type="password" id="password" name="password" value={formData.password} className="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50" required/>
      </div>
      <div className="mb-4">
        <button type="submit" className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600">Login</button>
      </div>
      {err && <p className="text-red-500">{err}</p>}
      <div className="mb-4 text-center text-sm ">
        Don't have an account? <Link to="./signup" className="text-teal-500">Sign up</Link>
      </div>
    </form>
  </div>
  
  )
}

export default LogIn