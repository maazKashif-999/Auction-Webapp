import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import axios, { AxiosError } from 'axios';
import { authContext } from '../App';

const UpdatePassword = () => {
  const { setAuth } = useContext(authContext);
  const [formData, setFormData] = useState({
    oldPass: '',
    pass: ''
  });
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    axios.post("http://localhost:8000/pass", formData, {
        headers: {
            Authorization: token
        }
    })
    .then((response) => {
        if (response.status === 200) {
            setMessage(response.data.message);
            setErr("")
        }
    })
    .catch((err: AxiosError<any>) => {
        setErr(err.response?.data.message || 'An error occurred');
        setMessage("");
    });
  }; // <-- Add this closing curly brace

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar setAuth={setAuth} />
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Update Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="oldPass" className="block">Old Password</label>
            <input
              type="password"
              id="oldPass"
              name="oldPass"
              value={formData.oldPass}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="pass" className="block">New Password</label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          {message && <p className="text-green-500">{message}</p>}
          {err && <p className="text-red-500">{err}</p>}
          <button type="submit" className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
