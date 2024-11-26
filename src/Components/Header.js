import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "./../ThemeContext";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  const [userId, setUserId] = useState('');
  const [imageURL, setImageURL] = useState('');

  useEffect(()=>{
    const userId = localStorage.getItem('userId');
    setUserId(userId);

    const imageURL = localStorage.getItem('imageURL');
    setImageURL(imageURL);

  },[])

  return (
      <header className={`w-full bg-[#000] text-white p-4 flex justify-between items-center`}>
        <div className="w-[100px] h-[75px]">
          <Link to='/'><img src="/logo.PNG" className="w-full h-full"/></Link>
        </div>
        <div className="flex items-center gap-4">
          {theme === "light" ? <FaToggleOff className="text-blue-500" onClick={toggleTheme} /> : <FaToggleOn className="text-yellow-500" onClick={toggleTheme} />}
          {userId?
            <>
              <Link to={`/favorites/${userId}`} className="text-white">
                Favorites
              </Link>
              <Link to={`/profile/${userId}`} className="flex items-center text-white">
                <img src={imageURL} className="w-[50px] h-[50px] rounded-full"/>
              </Link>
            </>
            :
            <>
              <Link to="/login" className="text-white">
                Login
              </Link>
              <Link to="/signup" className="text-white">
                Signup
              </Link>
            </>
          }
          
        </div>
      </header>
  );
};

export default Header;
