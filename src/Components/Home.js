import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { fetchMovies ,addMovieToFavorites ,getFavoriteMovies } from "./../Server/api"; // Adjust the path if necessary
import { FaEye, FaHeart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from "./../ThemeContext";

import Header from './Header';

const Home = () => {
  const { theme } = useTheme();

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState('');

  const [searchTerm, setSearchTerm] = useState('star');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [yearRange, setYearRange] = useState('');

  const MOVIES_PER_PAGE = 10;

  useEffect(()=>{
    const userId = localStorage.getItem('userId');
    setUserId(userId);

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
  },[])

  // Fetch movies from the backend
  const fetchMoviesData = async () => {
    try {
      const params = {
        term: searchTerm || selectedGenre || "star",
        limit: MOVIES_PER_PAGE, // Number of movies per page
        offset: (currentPage - 1) * MOVIES_PER_PAGE, // Calculate offset for the current page
        genre: selectedGenre,
        priceRange,
        yearRange,
      };
  
      const response = await fetchMovies(params);
  
      const results = response.data.data;
      setMovies(results);
  
      // Set total pages from backend response
      const totalPagesFromResponse = response.data.totalPages || 1;
      setTotalPages(totalPagesFromResponse);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };  

  useEffect(() => {
    fetchMoviesData();
  }, [searchTerm, currentPage]);

  useEffect(() => {
    if(userId){
    // Fetch Favorite movies from the backend
    const fetchFavoriteMovies = async () => {
      try {
        const response = await getFavoriteMovies(userId);
        console.log(response);

        const results = response.data.favorites;
        setFavoriteMovies(results);
        console.log(favoriteMovies)
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };
    
    fetchFavoriteMovies();
  }
  },[userId]);

  // Handle the heart button click to add movie to favorites
  const handleAddToFavorites = async (movieData ) => {
    try {
      // Make the API request to add the movie to the backend
      const response = await addMovieToFavorites(userId, movieData ); // Assuming you have an API function

      // Assuming favoriteMovies is a state variable to hold the list of favorite movies
      setFavoriteMovies((prevMovies) => [
        ...prevMovies,
        movieData  // Push the current movie to the favorite movies array
      ]);
      toast.success("Movie added to favorites!")
      console.log("Movie added to favorites!");
      console.log(favoriteMovies);
      
    } catch (err) {
      toast.error("Error adding Movie to favorites")
      console.error("Failed to add movie to favorites", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
    fetchMoviesData();
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? 'bg-white text-black': 'bg-[#060d17] text-white'} `}>
      <ToastContainer />
      <Header />

      <div className="mt-4 md:mt-8 ml-4">
    <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center overflow-x-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`px-4 py-2 rounded-lg text-white ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'}`}
      />

      {/* Genre Filter */}
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className={`px-4 py-2 rounded-lg text-white ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'}`}
      >
        <option value="">Select Genre</option>
        <option value="">All Genre</option>
        <option value="action">Action</option>
        <option value="comedy">Comedy</option>
        <option value="drama">Drama</option>
        <option value="horror">Horror</option>
        <option value="romance">Romance</option>
      </select>

      {/* Price Range Filter */}
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className={`px-4 py-2 rounded-lg text-white ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'}`}
      >
        <option value="">Select Price Range</option>
        <option value="0-10">$0 - $10</option>
        <option value="10-20">$10 - $20</option>
        <option value="20-30">$20 - $30</option>
        <option value="30+">$30+</option>
      </select>

      {/* Year Range Filter */}
      <select
        value={yearRange}
        onChange={(e) => setYearRange(e.target.value)}
        className={`px-4 py-2 rounded-lg text-white ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'}`}
      >
        <option value="">Select Year Range</option>
        <option value="1980-1990">1980 - 1990</option>
        <option value="1991-2000">1991 - 2000</option>
        <option value="2001-2010">2001 - 2010</option>
        <option value="2011-2020">2011 - 2020</option>
        <option value="2021+">2021+</option>
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className={` ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'} text-white px-4 py-2 rounded-lg font-semibold`}
      >
        Search
      </button>
    </form>
  </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8 px-16">
        {/* Movie Grid */}
        {movies.length === 0 ? 
            <p className="text-3xl text-white">No Result for current Search</p>
          :
            null
          }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="relative text-white rounded-lg shadow-lg shadow-gray-500 flex flex-col items-center hover:scale-105 duration-300 cursor-pointer group overflow-hidden"
            >
              {!userId ? null :

              (favoriteMovies?.length > 0 ? favoriteMovies.some(favMovie => {
                return Number(favMovie.trackId) === movie.trackId;
              }) : false) ? (
                <button className="absolute p-2 flex justify-center items-center bg-green-500 rounded-full top-[-100px] group-hover:top-[10px] right-[10px] duration-300">
                  Favorite
                </button>
              ) : (
                <button onClick={() => handleAddToFavorites(movie)} className="absolute w-[50px] h-[50px] flex justify-center items-center bg-black/60 rounded-full top-[-100px] group-hover:top-[10px] right-[10px] duration-300">
                  <FaHeart className="text-xl hover:scale-150 duration-300" />
                </button>
              )}
              <Link 
                key={movie.trackId} 
                to={`/movie/${movie.trackId}`} 
                state={movie} // Pass movie details as state
                className="block"
              >
                <div className="absolute w-[50px] h-[50px] flex justify-center items-center bg-black/60 rounded-full top-[-100px] group-hover:top-[10px] left-[10px] duration-300">
                    <FaEye className="text-xl hover:scale-150 duration-300"/>
                </div>
              </Link>
              <Link 
                key={movie.trackId} 
                to={`/movie/${movie.trackId}`} 
                state={movie} // Pass movie details as state
                className="block"
              >
                <img
                  src={movie.artworkUrlHighRes || movie.artworkUrl100}
                  alt={movie.trackName}
                  className="w-full h-full rounded"
                />
              </Link>
              <div className="absolute w-full bg-gradient-to-b from-black/50 to-black/90 bottom-[-500px] group-hover:bottom-0 duration-300">
                <h2 className="text-lg font-bold text-center">{movie.trackName}</h2>
                <p className="text-sm text-center">{movie.primaryGenreName}</p>
                <p className="text-sm font-semibold text-center">{movie.trackPrice ? `$${movie.trackPrice}` : "Not Listed"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? ` ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'} text-white opacity-50` : `${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'} text-white`
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? ` ${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'} text-white opacity-50` : `${theme === "light" ? 'bg-blue-500': 'bg-yellow-500'} text-white`
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
