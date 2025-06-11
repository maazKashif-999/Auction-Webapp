import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import { authContext } from '../App';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAuction: React.FC = () => {
  const { setAuth } = useContext(authContext);
  const [err,setErr] = useState("")
  const [formData,setFormData] = useState(
    {
      title: '',
      description: '',
      startingPrice: 0,
      startingDate: getDefaultDateTime(),
      endingDate: getDefaultDateTime(),
    }
  )
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    const {name,value} = e.target
    setFormData({...formData,[name]:value})
 }
  const navigate = useNavigate()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    const startingDate = new Date(formData.startingDate);
    const endingDate = new Date(formData.endingDate);
    e.preventDefault()
    if (startingDate>= endingDate){
      setErr("Starting Time must be less then  ending time")
    }
    else{
      const token = localStorage.getItem('token')

    axios.post('http://localhost:8000/create',formData,{
      headers: {
        Authorization: token,
      }})
      .then((res)=>{
        console.log(res.data)
        navigate(`../auction/${res.data}`)
      })
      .catch((err:AxiosError<any>)=>setErr(err.response?.data.message))

    }
    
  }

  function getDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  return (
    <div className="container mx-auto">
      <NavBar setAuth={setAuth} />
      <div className="max-w-lg mx-auto mt-8">
        <div className="bg-white shadow-md rounded-md p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Create Auction</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                placeholder="Enter title"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startingDate" className="block text-gray-700 text-sm font-semibold mb-2">Starting Date</label>
              <input
                type="datetime-local"
                id="startingDate"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startingPrice" className="block text-gray-700 text-sm font-semibold mb-2">Starting Price</label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                placeholder="Enter starting price"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="endingDate" className="block text-gray-700 text-sm font-semibold mb-2">Ending Date</label>
              <input
                type="datetime-local"
                id="endingDate"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                placeholder="Enter description"
                required
              />
            </div>
            {err && <p className="text-red-500 col-span-2">{err}</p>}
            <button
              type="submit"
              className="col-span-2 w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300 ease-in-out"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction
