import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyUser } from './../../Server/api'; // Assume you have an endpoint for user verification
import { FaArrowLeft, FaClipboardCheck } from 'react-icons/fa';

const Verification = () => {
  const { userId } = useParams(); // Extract userId from URL parameters
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [imageURL, setImageURL] = useState('');

  useEffect(() => {

    const imageURLTemp = localStorage.getItem('imageURLTemp');
    setImageURL(imageURLTemp);

    const message = localStorage.getItem('toastMessage');
    console.log("Message from localStorage:", message);
    if (message) {
      toast.success(message);
      // toast.success("the toast should appear")
      // Set a timeout to remove the message from localStorage after 5 seconds
      const timeout = setTimeout(() => {
        localStorage.removeItem('toastMessage');
      }, 5000); // Adjust the timeout duration as per your needs

      // Cleanup function to clear the timeout if component unmounts
      return () => clearTimeout(timeout);
    }
  }, []); 

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await verifyUser({ userId, code }); // Send verification code and userId to the backend
      setMessage(response.data.message);

      localStorage.setItem('toastMessage', `Congratulations, your journey begins here.`);

      localStorage.setItem('imageURL', imageURL);
      localStorage.setItem('userId', userId);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate(`/profile/${userId}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during verification');
      toast.error(error.response.data.error);
    } finally {
      setLoading(false); // Hide loader when fetch completes
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
          <Link to='/signup'><FaArrowLeft size={24} className='absolute left-10 top-10 shake text-yellow-500'/></Link>
          <h2 className='flex text-3xl font-semibold text-yellow-500 mb-[-20px]'>Verification</h2>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-[3vh]'>
            <span className='w-full flex relative hover:scale-105 duration-300'>
            <input
              type="text"
              name="code"
              placeholder="Enter Verification Code"
              value={code}
              onChange={handleChange}
              className='w-full md:px-4 p-2 px-2 bg-transparent placeholder:text-yellow-600 placeholder:font-semibold border-2 border-yellow-500 focus:outline-none focus:shadow-lg focus:shadow-yellow-600 focus:bg-yellow-500 focus:placeholder:text-white'
              required
            />
            <FaClipboardCheck className='icon shake'/>
            </span>
            <button type="submit" className="px-5 py-2 md:py-3 text-xl font-semibold shadow-lg shadow-black border-2 border-yellow-500 overflow-hidden relative group cursor-pointer bg-transparent hover:bg-yellow-500 hover:scale-105 duration-[700ms]">
                <span className="relative text-yellow-500 group-hover:text-white transition duration-[700ms] ease">
                  Verify
                </span>
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Verification;
