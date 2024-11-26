import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for toasts

const Logout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    // Remove token from localStorage or sessionStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    // Optionally, display a logout success message
    localStorage.setItem('toastMessage', `You have successfully logged out.`);
    toast.success('You have successfully logged out!'); // Show a toast message

    // Redirect to login page or home page
    navigate('/');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <button 
        onClick={toggleModal} 
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Yes, Logout
              </button>
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
