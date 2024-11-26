import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../Server/api'; // Assume you have an endpoint for forgot password
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // Use email instead of code
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const message = localStorage.getItem('toastMessage');
    console.log("Message from localStorage:", message);
    if (message) {
      toast.success(message);
      
      const timeout = setTimeout(() => {
        localStorage.removeItem('toastMessage');
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value); // Change to handle email input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    try {
      setLoading(true);
      const response = await forgotPassword({ email, baseUrl }); // Send email to backend to request password reset
      setMessage(response.data.message);

      localStorage.setItem('toastMessage', 'Password reset link sent to your email.');

      navigate(`/reset-password-email-sent`); // Optionally navigate to another page if needed
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during password reset');
      toast.error(error.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-[#222] overflow-hidden'>
      <ToastContainer />
      {loading ? (
        <>
          <div className='loader-outer'>
            <div className="loader"></div>
          </div>
        </>
      ) : (null)}
      <div className='w-full h-full flex justify-center items-center overflow-auto'>
        <div className='lg:w-2/6 md:w-3/6 w-[90%] h-auto min-h-[300px] my-[50px] mt-[100px] md:my-0px md:pb-16 p-8 bg-[#333] flex flex-col gap-16 items-center md:hover:scale-105 duration-300 shadow-xl shadow-black relative'>
          <Link to='/login'><FaArrowLeft size={24} className='absolute left-10 top-10 shake text-yellow-500'/></Link>
          <h2 className='flex text-3xl font-semibold text-yellow-500 mb-[-20px]'>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={30} height={30} stroke="currentColor" class="heading-icon shake fill">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg> */}
          
            Forgot Password</h2>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-[3vh]'>
            <span className='w-full flex relative hover:scale-105 duration-300'>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={24} height={24} stroke="currentColor" class="icon shake fill">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </span>
            <button type="submit" className="px-5 py-2 md:py-3 text-xl font-semibold shadow-lg shadow-black border-2 border-yellow-500 overflow-hidden relative group cursor-pointer bg-transparent hover:bg-yellow-500 hover:scale-105 duration-[700ms]">
                <span className="relative text-yellow-500 group-hover:text-white transition duration-[700ms] ease">
                  Send Reset Link
                </span>
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
