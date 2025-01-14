import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PublicFavoritesPage.css';
import { FaHeart } from 'react-icons/fa';

function PublicFavoritesPage() {
  const { userId } = useParams(); 
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const url = process.env.REACT_APP_API_URL
  useEffect(() => {
    fetchPublicFavorites(userId);
  }, [userId]);

  const fetchPublicFavorites = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(url + `/userpage/?users_id=${userId}`);
      const favoriteMovies = Array.isArray(response.data) ? response.data : [response.data];

      const movieDetailsPromises = favoriteMovies.map(favorite =>
        axios.get(`https://api.themoviedb.org/3/movie/${favorite.movie_id}`, {
          params: { api_key: TMDB_API_KEY }
        })
      );

      const movieDetailsResponses = await Promise.all(movieDetailsPromises);
      const movieDetails = movieDetailsResponses.map(response => response.data);

      const updatedFavorites = favoriteMovies.map((favorite, index) => ({
        ...favorite,
        title: movieDetails[index].title,
        overview: movieDetails[index].overview,
        poster_path: movieDetails[index].poster_path,
        vote_average: movieDetails[index].vote_average,
        release_date: movieDetails[index].release_date
      }));

      setFavorites(updatedFavorites);
      setLoading(false);
    } catch (error) {
      setError('Error fetching favorites. Please try again later.');
      setLoading(false);
      console.error('Error fetching favorites:', error);
    }
  };

  const handleMovieClick = (favorite) => {
    navigate(`/moviePage/${favorite.movie_id}`);
  };


  return (
    <div className="page-container">
    <div className="public-favorites-page">
      <h1>User_ID:{userId}'s Favorite List</h1> 
      {loading ? (
        <p>Loading favorites...</p>
      ) : error ? (
        <p>{error}</p>
      ) : favorites.length > 0 ? (
        <div className="favorite-list">
              {favorites.map((favorite, index) => (
                <div key={index} className="favorite-card" onClick={() => handleMovieClick(favorite)}>
                  <FaHeart className="favorite-icon" />
                  {favorite.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
                      alt={favorite.title}
                      className="movie-poster"
                    />
                  )}
                  <div className="favorite-card-content">
                    <h3>{favorite.title}</h3>
                    <p>Rating: {favorite.vote_average ? favorite.vote_average.toFixed(1) : "N/A"}</p>
                    <p>Release Date: {favorite.release_date || "Unknown"}</p>
                  </div>
                </div>
          ))}
        </div>
      ) : (
        <p>This user has no favorites yet.</p>
      )}
    </div>
  </div>
  );
}

export default PublicFavoritesPage;
