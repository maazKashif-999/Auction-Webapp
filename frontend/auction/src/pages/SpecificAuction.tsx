import axios, { AxiosError } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Item } from '../interfaces'
import NavBar from './NavBar'
import { authContext } from '../App'
import { io } from 'socket.io-client'
const socket = io("http://localhost:8000")

const SpecificAuction = () => {
  const token = localStorage.getItem('token')
  const {setAuth} = useContext(authContext)
  const [err,setErr] = useState("")
  const [message,setMessage] = useState("")
  const {id} = useParams()
  const [item, setItem] = useState<Item>({
    _id: 0,
    title: '',
    description: '',
    startingPrice: 0,
    currentPrice: 0,
    startingTime: new Date(),
    endingTime: new Date(),
    status: '',
  });

  useEffect(() => {
    
    axios.get(`http://localhost:8000/auction/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(res =>{
      if (res.status == 200){
        setItem(res.data)
        socket.emit("joinRoom",res.data._id)
      }
    })
    .catch((err:AxiosError<any>) =>{
      setErr(err.response?.data.message)
    })
 
  }, [])
  useEffect(()=>{
    setAmount(item.currentPrice)
  },[item])

  useEffect(() => {
    socket.on("bidAmount", (balance) => {
      
      setItem((prevState) => ({
        ...prevState,
        currentPrice: balance,
      }));
      setMessage(`Someone place a bid of ${balance}`)
      setErr("")
    });
  }, [socket]);
    const [amount,setAmount] = useState(item.currentPrice)
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      axios.post(`http://localhost:8000/auction/${id}`,{amount:amount},{
        headers:{
          Authorization:token
        }
      })
      .then(res=>{
        if (res.status == 200){
          setItem(res.data)
          socket.emit("updateBalance",token,res.data._id,res.data.currentPrice)
          setMessage(`Your bid has been placed`)
          setErr("")
        }
      }
      )
      .catch((err:AxiosError<any>) =>{
        setErr(err.response?.data.message)
      })
    }
  return (
    <div className="container mx-auto">
      <NavBar setAuth={setAuth} />
      <div className="max-w-lg mx-auto mt-8">
        
        <div className="bg-white shadow-md rounded-md p-8 ">
        <h2 className="text-3xl font-semibold text-center  ">Place Your Bid</h2>
          <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
          <p >{item.description}</p>
          <p><strong>Starting Price:</strong> Rs. {item.startingPrice}</p>
          <p><strong>Current Price:</strong> Rs. {item.currentPrice}</p>
          <p><strong>Start Time:</strong> {new Date(item.startingTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(item.endingTime).toLocaleString()}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="bidAmount" className="block font-semibold">Your Bid:</label>
              <input
                onChange={(e) => setAmount(parseInt(e.target.value))}
                value={amount}
                type="number"
                id="bidAmount"
                name="bidAmount"
                min={item.currentPrice + 1}
                step="1"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
              />
            </div>
            {err && <p className="text-red-500 my-2">{err}</p>}
            {message && <p className="text-green-500 my-2">{message}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300 ease-in-out"
            >
              Place Bid
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SpecificAuction