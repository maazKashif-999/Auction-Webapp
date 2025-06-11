import React from 'react'
import { useState } from 'react'
import axios, {AxiosError } from 'axios'
import { useNavigate,Link } from 'react-router-dom'

const SignUp = () => {
  const [err,setErr] = useState("")
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: "", password: "",confirmPassword : "" });

  const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if (formData.password !== formData.confirmPassword){
      setErr("Passwords does not match")
    }
    else{
      axios.post(`http://localhost:8000/signup`, {
        name: formData.username,
        password: formData.password})
      .then((response:any)=>{
        console.log(response)
        if (response.status === 200){
          navigate('/')
        }
        
      })
      .catch((error:AxiosError<any>)=>{
        setErr(error.response?.data.message)
      })
  
    }
   
  }
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create your Account</h2>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input onChange={onhandleChange} type="text" id="username" name="username" value={formData.username} className="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50" required/>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input onChange={onhandleChange} type="password" id="password" name="password" value={formData.password} className="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"  required/>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input onChange={onhandleChange} type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50" required/>
        </div>
        {err && <p className="text-red-500 mb-4">{err}</p>}
        <div className="mb-4">
          <button type="submit" className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600">Sign Up</button>
        </div>
      </form>

      <div className="mb-4 text-sm text-center">
        Already have an account? <Link to="/" className="text-teal-500">Login</Link>
      </div>
    </div>

  )
}

export default SignUp