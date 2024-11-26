import React, { useEffect, useState } from 'react';
import { FaHeart, FaEye } from 'react-icons/fa'; // Import icons
import { Link, useParams } from 'react-router-dom';
import { getFavoriteMovies, removeMovieFromFavorite } from './../../Server/api'
import { useTheme } from "./../../ThemeContext";

import Header from '../Header';

const FavoritesPage = () => {
  const { theme } = useTheme();

  const { userId } = useParams();

  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Fetch favorite movies when the component mounts
  useEffect(() => {
    const fetchFavoriteMoviesHandler = async () => {
      try {
        const response = await getFavoriteMovies(userId);
        setFavoriteMovies(response.data.favorites);
        // console.log(favoriteMovies)
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    fetchFavoriteMoviesHandler();
  }, [userId]);

  // Function to handle removing a movie from favorites
  const handleRemoveFromFavorites = async (movie) => {
    try {
      // Call the API to remove the movie from favorites
      await removeMovieFromFavorite(userId, movie._id); // Pass movie.trackId to remove specific movie

      // Update the favoriteMovies state after successful removal
      setFavoriteMovies((prev) =>
        prev.filter((favMovie) => favMovie.trackId !== movie.trackId)
      );
    } catch (error) {
      console.error("Error removing movie from favorites:", error);
    }
  };

  return (

    <div className={`w-full h-[100vh] flex flex-col ${theme === "light" ? 'bg-white text-black': 'bg-[#060d17] text-white'} `}>
      <Header />
      <div className="w-full h-full p-8 px-16 overflow-y-auto">

        {favoriteMovies.length === 0?
          <p className={`text-3xl ${theme === "light" ? 'bg-white text-black': 'bg-[#060d17] text-white'} `}>No Favorite Movie Yet</p>
        :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {favoriteMovies.map((movie, index) => (
            <div
              key={index}
              className="relative text-white rounded-lg shadow-lg shadow-gray-500 flex flex-col items-center hover:scale-105 duration-300 cursor-pointer group overflow-hidden"
            >
              {/* Check if movie is already in favorites */}
              
                <button
                  onClick={() => handleRemoveFromFavorites(movie)}
                  className="absolute p-2 flex justify-center items-center bg-red-500 rounded-full top-[-100px] group-hover:top-[10px] right-[10px] duration-300"
                >
                  Remove
                </button>

              {/* View movie details */}
              <Link
                key={movie.trackId}
                to={`/movie/${movie.trackId}`}
                state={movie} // Pass movie details as state
                className="block"
              >
                <div className="absolute w-[50px] h-[50px] flex justify-center items-center bg-black/60 rounded-full top-[-100px] group-hover:top-[10px] left-[10px] duration-300">
                  <FaEye className="text-xl hover:scale-150 duration-300" />
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
              {/* Movie Details */}
              <div className="absolute w-full bg-gradient-to-b from-black/50 to-black/90 bottom-[-500px] group-hover:bottom-0 duration-300">
                <h2 className="text-lg font-bold text-center">{movie.trackName}</h2>
                <p className="text-sm text-center">{movie.primaryGenreName}</p>
                <p className="text-sm font-semibold text-center">
                  {movie.trackPrice ? `$${movie.trackPrice}` : "Free"}
                </p>
              </div>
            </div>
          ))}
        </div>
        }
      </div>
    </div>
  );
};

export default FavoritesPage;
