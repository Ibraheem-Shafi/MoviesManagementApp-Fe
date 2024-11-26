import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovies } from "../Server/api";
import ReactPlayer from 'react-player';
import { useTheme } from "./../ThemeContext";

import Header from "./Header";

function VideoDetails() {
  const { theme } = useTheme();

  const location = useLocation();
  const movie = location.state; // Get movie details from state
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState("");

  // Fetch related movies based on the genre of the current movie
  useEffect(() => {
    const fetchRelatedMovies = async () => {
      setLoadingRelated(true);
      try {
        const params = {
          limit: 10,
          genre: movie.primaryGenreName.split(' ')[0], // Pass the genre
        };
  
        console.log("Fetching related movies with params:", params);
  
        const response = await fetchMovies(params);
        console.log("Related movies response:", response.data);
  
        setRelatedMovies(response.data.data);
      } catch (err) {
        setError("Failed to load related movies.");
        console.error(err);
      } finally {
        setLoadingRelated(false);
      }
    };
  
    if (movie.primaryGenreName) {
      fetchRelatedMovies();
    }
  }, [movie]);  

  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className={`w-full py-16 md:px-16 flex flex-col md:flex-row ${theme === "light" ? 'bg-white text-black': 'bg-[#060d17] text-white'} `}>
        <div className="w-full md:w-5/6">
        {/* Video Player */}
        <div className="w-full md:w-5/6">
          {movie.previewUrl ? (
            <ReactPlayer
              url={movie.previewUrl} // URL of the video (trailer)
              controls={true}
              className="w-full rounded-lg shadow-lg shadow-gray-500"
              width="100%" // Make it responsive
              height="auto" // Adjust the height automatically
              alt={`Trailer of ${movie.trackName}`}
            />
          ) : (
            <div className="w-full h-[500px] bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center">
              <p>Trailer unavailable</p>
            </div>
          )}
        </div>

        {/* Main Movie Details */}
        <div className="w-5/6 pt-16 mx-auto md:mx-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Artwork and Details */}
            <div className="md:w-1/3">
              <img
                src={movie.artworkUrlHighRes || movie.artworkUrl100}
                alt={movie.trackName}
                className="rounded-lg w-full shadow-lg shadow-gray-500"
              />
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3">
              <h1 className="text-2xl font-bold mb-4">{movie.trackName}</h1>
              <p className="mb-2">
                <span className="font-bold">Description:</span> {movie.longDescription || movie.shortDescription || "No description available."}
              </p>
              <p className="mb-2">
                <span className="font-bold">Release Date:</span> {movie.releaseDate || "Unknown"}
              </p>
              <p className="mb-2">
                <span className="font-bold">Director:</span> {movie.artistName || "Not listed"}
              </p>
              <p className="mb-2">
                <span className="font-bold">Price:</span> {'$'+movie.trackPrice || "Free"}
              </p>
              <p className="mb-2">
                <span className="font-bold">Cast:</span> {movie.cast || "Not listed"}
              </p>
            </div>
          </div>
        </div>
        </div>
        
        {/* Related Movies */}
        <div className="mt-12 md:h-[100vh] w-full md:w-auto flex flex-col md:inline-block justify-center items-center">
          <h2 className="text-lg font-semibold mb-4">Related Movies</h2>
          {loadingRelated ? (
            <p className="text-gray-500">Loading related movies...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : relatedMovies.length > 0 ? (
            <div className="flex flex-col gap-4 h-full overflow-y-auto overflow-x-hidden">
              {relatedMovies.map((relatedMovie) => (
                <Link
                  to={`/movie/${relatedMovie.trackId}`}
                  state={relatedMovie}
                  key={relatedMovie.trackId}
                  className="flex-none w-40"
                >
                  <img
                    src={relatedMovie.artworkUrlHighRes}
                    alt={relatedMovie.trackName}
                    className="w-full h-auto rounded-lg shadow-lg shadow-gray-500"
                  />
                  <h3 className="mt-2 text-sm font-semibold">{relatedMovie.trackName}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoDetails;
