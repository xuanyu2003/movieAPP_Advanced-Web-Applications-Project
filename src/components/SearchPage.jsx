import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = ({ setSelectedMovie }) => {
  const [results, setResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [releaseDateOrder, setReleaseDateOrder] = useState(null);
  const url = process.env.REACT_APP_API_URL
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (query && query.length > 0) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get(url + "/movie/search/", {
            params: {
              query,
            },
          });
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      };
      fetchMovies();
    }
  }, [query]);

  const sortMovies = (movies) => {
    return [...movies].sort((a, b) => {
      if (ratingOrder) {
        const ratingA = a.vote_average || 0;
        const ratingB = b.vote_average || 0;
        return ratingOrder === "highToLow" ? ratingB - ratingA : ratingA - ratingB;
      }

      if (releaseDateOrder) {
        const dateA = new Date(a.release_date || "1970-01-01");
        const dateB = new Date(b.release_date || "1970-01-01");
        return releaseDateOrder === "newToOld" ? dateB - dateA : dateA - dateB;
      }

      return 0;
    });
  };

  // const handleMovieClick = (movie) => {
  //   setSelectedMovie(movie);
  //   navigate('/MoviePage');
  // };
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);  // Set the selected movie
    navigate(`/MoviePage/${movie.id}`);  // Navigate to the MoviePage with movieId in the URL
};

  return (
    <div className="search-page-container">
      <h2>Search results for "{query}"</h2>
      
      <div className="filters">
        {/* Rating and Release Date Filter Buttons */}
        <button
          onClick={() => {
            setRatingOrder("highToLow");
            setReleaseDateOrder(null);
          }}
        >
          Highest Rating
        </button>
        <button
          onClick={() => {
            setRatingOrder("lowToHigh");
            setReleaseDateOrder(null);
          }}
        >
          Lowest Rating
        </button>
        <button
          onClick={() => {
            setReleaseDateOrder("newToOld");
            setRatingOrder(null);
          }}
        >
          Newest Movie
        </button>
        <button
          onClick={() => {
            setReleaseDateOrder("oldToNew");
            setRatingOrder(null);
          }}
        >
          Oldest Movie
        </button>
      </div>

      {isTyping && query && <p>Searching...</p>}
      
      <div className="movie-list">
        {results.length === 0 && !isTyping && query && <p>No results found.</p>}
        
        {sortMovies(results).map((movie) => (
          <div key={movie.id} className="movie-item" onClick={() => handleMovieClick(movie)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-details">
              <h3>{movie.title}</h3>
              <p>Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
              <p>Release Date: {movie.release_date || "Unknown"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
