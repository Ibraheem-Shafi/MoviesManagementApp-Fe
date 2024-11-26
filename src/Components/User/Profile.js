// Dashboard.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserById, updateProfile } from '../../Server/api'; // Import the API functions
import { useParams } from 'react-router-dom'; // To access URL parameters

import Header from './../Header';
import Logout from './Logout';

const Dashboard = () => {  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', image: null });
  const { userId } = useParams();

  const fetchUser = async () => {
    try {
      const response = await getUserById(userId); // Fetch the user data
      const userData = response.data.data;
  
      setUser(userData); // Set the user data
      setFormData({
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        password: '',
        image: null
      }); // Initialize form data
  
      // Display toast message if available in localStorage
      const message = localStorage.getItem('toastMessage');
      if (message) {
        toast.success(message);
        
        // Remove the message from localStorage after 5 seconds
        const timeout = setTimeout(() => {
          localStorage.removeItem('toastMessage');
        }, 5000); // Adjust the timeout duration as per your needs
  
        // Cleanup function to clear the timeout if component unmounts
        return () => clearTimeout(timeout);
      }
  
    } catch (error) {
      setError('Failed to fetch user data'); // Handle errors
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append('userId', userId);
    updatedData.append('name', formData.name);
    updatedData.append('email', formData.email);
    updatedData.append('password', formData.password);
    if (formData.image) {
      updatedData.append('image', formData.image);
    }

    try {
      const response = await updateProfile(updatedData); // Update the user data
      setUser(response.data.data); // Update user state with new data
      localStorage.setItem('imageURL', response.data.data.imageURL)
      setEditing(false); // Exit editing mode
    } catch (error) {
      setError('Failed to update user data'); // Handle errors
    }
  };

  if (loading) return <>
    <div className='loader-outer'>
      <div className="loader"></div>
    </div>
  </>;
  if (error) return <p>{error}</p>;

  return (
    <div className='w-full h-[100vh] flex flex-col bg-[#1e2128] overflow-hidden'>
      <ToastContainer />
      <Header />
      {loading ? (
        <>
          <div className='loader-outer'>
            <div className="loader"></div>
          </div>
        </>
      ) : (<>
      {editing ? (
        <div className='w-full h-full flex justify-center items-center bg-[#222] overflow-auto'>
          <div className='lg:w-3/6 md:w-4/6 w-[90%] h-auto min-h-[300px] my-[50px] mt-[100px] md:my-0px md:py-8 p-8 bg-[#333] flex flex-col gap-16 items-center md:hover:scale-105 duration-300 shadow-xl shadow-black'>
            <h2 className='flex text-3xl font-semibold text-yellow-500 mb-[-20px]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={30} height={30} stroke="currentColor" class="heading-icon fill shake">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              &nbsp; Edit Profile</h2>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-[3vh] z-5'>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
                required
              />
            </label>
            {/* <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
                required
              />
            </label> */}
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
                placeholder="Leave blank to keep current password"
              />
            </label>
            <label>
              Profile Image:
              <input
                type="file"
                name="image"
                className='w-full md:px-4 p-2 px-2 bg-gray-300 rounded-sm placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="mt-5 px-5 py-2 md:py-3 text-xl font-semibold shadow-lg shadow-black border-2 border-yellow-500 overflow-hidden relative group cursor-pointer bg-transparent hover:bg-yellow-500 hover:scale-105 duration-[700ms]">
                <span className="relative text-yellow-500 group-hover:text-white transition duration-[700ms] ease">
                  Sace Changes
                </span>
            </button>
            <button type="button" onClick={() => setEditing(false)} className="mt-5 px-5 py-2 md:py-3 text-xl font-semibold shadow-lg shadow-black border-2 border-yellow-500 overflow-hidden relative group cursor-pointer bg-transparent hover:bg-yellow-500 hover:scale-105 duration-[700ms]">
                <span className="relative text-yellow-500 group-hover:text-white transition duration-[700ms] ease">
                Cancel
                </span>
            </button>
          </form>
          </div>
        </div>
      ) : (
        <div className="w-5/6 md:w-3/6 md:h-[400px] m-16 flex flex-col justify-center items-center bg-white shadow-md p-6 rounded-lg mx-auto">
          <img
            src={user.imageURL}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="flex mt-4 space-x-4">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
            <Logout />
          </div>
        </div>
        )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
