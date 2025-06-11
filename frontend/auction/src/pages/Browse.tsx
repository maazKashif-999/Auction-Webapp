import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { authContext } from '../App';
import { useContext } from 'react';
import axios from 'axios';
import { Item } from '../interfaces';
import { Link } from 'react-router-dom';

const Browse = () => {
  const {setAuth} = useContext(authContext)
  const [items,setItems] = useState<Item[]>([])
  const [title,setTitle] =  useState("")
  const handleSearch = ()=>{
    const token = localStorage.getItem("token")
    axios.post('http://localhost:8000/browse',{title:title},{
      headers:{
        'Authorization': token
      }
    })
    .then((res)=>{
        setItems(res.data)
    }
    )
    .catch(err=>{
      console.log(err)
    })
  }
  useEffect(()=>{
    handleSearch()
  },[])
  return (
    <div className="container mx-auto">
    <div className="mb-8">
      <NavBar setAuth={setAuth} />
    </div>
    <h2 className="text-2xl font-semibold mr-4 text-center mb-4">Auction Items</h2>
    <div className="mb-8 flex justify-center">
  <div className="search-container flex items-center">
    
    <input
      onChange={(e) => setTitle(e.target.value)}
      type="text"
      placeholder="Search..."
      className="border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:border-teal-500"
    />
    <button onClick={handleSearch} className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 transition duration-300 ease-in-out">
      Search
    </button>
  </div>
</div>
  
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {
  items.map(item => (
    <div key={item._id} className="auction-card border border-gray-300 rounded-lg overflow-hidden ml-4 ">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
        <p className="text-gray-700 ">{item.description}</p>
        <p className="text-gray-700">Starting Price: Rs. {item.startingPrice}</p>
        <p className="text-gray-700">Current Price: Rs. {item.currentPrice}</p>
        <p className="text-gray-700">Start Time: {new Date(item.startingTime).toLocaleString()}</p>
        <p className="text-gray-700">End Time: {new Date(item.endingTime).toLocaleString()}</p>
        <Link to={`../auction/${item._id}`}>
          <button className="bg-teal-500 text-white px-6 py-2 my-2 rounded-md hover:bg-teal-600 transition duration-300 ease-in-out">
            Bid
          </button>
        </Link>
      </div>
    </div>
  ))
}

      
    </div>
  </div>
  
  
  );
}

export default Browse;
