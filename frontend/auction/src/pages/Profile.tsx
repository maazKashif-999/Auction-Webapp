import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../App';
import NavBar from './NavBar';
import {User} from '../interfaces'

const Profile: React.FC = () => {
  const { setAuth } = useContext(authContext);
  const [user, setUser] = useState<User>({
    userName: '',
    password: '',
    noOfItemsOwned: 0,
    items: [],
    boughtAuctions: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get<User>('http://localhost:8000/user', {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="container mx-auto">
      <NavBar setAuth={setAuth} />
      <div>
        <h2 className="text-3xl font-semibold text-center my-3 ">My Profile</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between my-4 mx-10">
        <div className="profile-info flex flex-col md:flex-row items-center">
          <div className="ml-8">
            <h2 className="text-lg font-semibold">Name: {user.userName}</h2>
            <p className="text-gray-600">Username: {user.userName}</p>
          </div>
        </div>
        <div className="ml-8">
          <button className="bg-teal-500 text-white px-4 py-2 rounded-md mr-4 mb-4 md:mb-0 hover:bg-teal-600 focus:outline-none focus:bg-teal-600">
            <Link to="../create-auction">Create Auction</Link>
          </button>
          <p className="text-teal-500 hover:text-teal-600">
            <Link to="../update-password">Update Password</Link>
          </p>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4 mx-10">My Listed Auctions</h3>
      
      {user && (
      <div className="grid-container mx-10 overflow-x-auto">
        <div className="flex flex-no-wrap overflow-x-auto">
          {user.items && user.items.length > 0 ? (
            user.items.map((item) => (
              <div className="auction-card border border-gray-300 rounded-lg p-4 mr-4" key={item._id}>
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-600">Starting Price: {item.startingPrice}</p>
                <p className="text-gray-600">Current Price: {item.currentPrice}</p>
                <p className="text-gray-600">Start Time: {new Date(item.startingTime).toLocaleString()}</p>
                <p className="text-gray-600">End Time: {new Date(item.endingTime).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center my-3">No listed auctions</p>
          )}
        </div>
      </div>
    )}
      <h3 className="text-lg font-semibold mb-4 mx-10 my-4">Auctions Won</h3>
      
      {user && (
        <div className="grid-container mx-10 my-4 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {user.boughtAuctions && user.boughtAuctions.length > 0 ? (
              user.boughtAuctions.map((item) => (
                <div className="auction-card border border-gray-300 rounded-lg p-4" key={item._id}>
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-600">Starting Price: {item.startingPrice}</p>
                  <p className="text-gray-600">Current Price: {item.currentPrice}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No listed auctions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Profile;
