import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope } from 'react-icons/fa';

const ResetPasswordEmailSent = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const handleCloseTab = () => {
    if (window.confirm("Are you sure you want to close this tab?")) {
        window.open('', '_self').close(); // Attempt to close the current tab
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
        <div className='lg:w-2/6 md:w-3/6 sm:w-[60%] w-[90%] h-auto min-h-[300px] my-[50px] md:my-0px md:py-16 p-8 bg-[#333] flex flex-col gap-16 items-center md:hover:scale-105 duration-300 shadow-xl shadow-black'>
          <h2 className='flex text-3xl font-semibold text-yellow-500 mb-[-20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width={30} height={30} stroke="currentColor" class="heading-icon shake fill">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
              &nbsp; Reset Password Email Sent</h2>
          <p className='font-semibold text-white text-center'>A link to reset your password has been sent to your email. Please check your inbox (and spam folder) for further instructions. You may close this window.</p>
          {/* <button onClick={handleCloseTab} className="px-5 py-3 text-lg font-semibold rounded-lg border-white-2px overflow-hidden relative group cursor-pointer bg-yellow-500 hover:scale-105 duration-[700ms] z-10">
                <span className="absolute w-64 h-0 transition-all duration-[700ms] origin-center rotate-45 -translate-x-16 bg-yellow-400 top-1/3 group-hover:h-[500px] group-hover:-translate-y-32 ease"></span>
                <span className="relative text-white transition duration-[700ms] group-hover:text-black ease">
                Close Tab
                </span>
            </button> */}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordEmailSent;
