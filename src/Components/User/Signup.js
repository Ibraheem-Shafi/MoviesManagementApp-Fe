import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate for navigation
import { registerUser } from './../../Server/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (image) {
        formDataToSend.append('image', image);
      }

      // Extract referral ID from the URL if present
      const searchParams = new URLSearchParams(window.location.search); // Get query parameters from the current URL
      const referralId = searchParams.get('referralId'); // Detect 'referralId' from the URL
      if (referralId) {
        formDataToSend.append('referralId', referralId); // Send referralId to the backend
      }

      const response = await registerUser(formDataToSend);
      setMessage(response.data.message);

      localStorage.setItem('toastMessage', `Dear ${formData.name}, check your email for verification code`);

      const userId = response.data.userId
      const imageURL = response.data.imageURL

      localStorage.setItem('imageURLTemp', imageURL);

      // Redirect to verification page on successful signup
      navigate(`/verification/${userId}`); // Use navigate to redirect

    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while signing up');
      toast.error(error.response.data.error);
    } finally {
      setLoading(false); // Hide loader when fetch completes
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#222] overflow-hidden relative">
      <ToastContainer />
      {loading ? (
        <>
          <div className='loader-outer'>
            <div className="loader"></div>
          </div>
        </>
      ) : (null)}
      {/* <ParticlesComponent /> */}
      
      {/* <img src={bgimage} className=' w-full h-full absolute z-1'/> */}
      <div className='w-full h-full flex justify-center items-center overflow-auto'>
        <div className='lg:w-2/6 md:w-3/6 w-[90%] h-auto min-h-[300px] my-[50px] mt-[100px] md:my-0px md:py-16 p-8 bg-[#333] flex flex-col gap-16 items-center md:hover:scale-105 duration-300 shadow-xl shadow-black'>
          <h2 className='flex text-4xl font-bold text-yellow-500 mb-[-20px]'>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={30} height={30} stroke="currentColor" class="heading-icon fill shake">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg> */}
            SignUp</h2>
          <form onSubmit={handleSubmit} className='w-full flex flex-col gap-[3vh] z-5'>
            <span className='w-full flex relative hover:scale-105 duration-300'>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={24} height={24} stroke="currentColor" class="icon shake fill">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            </span>
            <span className='w-full flex relative hover:scale-105 duration-300'>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={24} height={24} stroke="currentColor" class="icon shake fill">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            </span>
            <span className='w-full flex relative hover:scale-105 duration-300'>
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
              required
            />
            {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24} stroke-width="1.5" stroke="currentColor" class="size-6" className="icon fill" onClick={toggleNewPasswordVisibility}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24} stroke-width="1.5" stroke="currentColor" class="size-6" className="icon fill" onClick={toggleNewPasswordVisibility}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  )}
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <span>
              <Link className='text-white font-semibold hover:text-yellow-500 duration-300' to={'/login'}>Already have an account?</Link>
            </span>
            <button type="submit" className="px-5 py-2 md:py-3 text-xl font-semibold shadow-lg shadow-black border-2 border-yellow-500 overflow-hidden relative group cursor-pointer bg-transparent hover:bg-yellow-500 hover:scale-105 duration-[700ms]">
                <span className="relative text-yellow-500 group-hover:text-white transition duration-[700ms] ease">
                  SignUp
                </span>
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
