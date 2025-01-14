import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPage.css';
import { FaShareAlt, FaSignOutAlt, FaUser, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

function UserPage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const frontURL = process.env.REACT_APP_FRONT_URL;
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchFavorites(userData.users_id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchFavorites = async (userId) => {
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

  const handleLogout = async () => {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let refreshToken = user?.refreshToken;
    let accessToken = user?.accessToken;

    try {
      await axios.post(url + "/user/logout", {
        token: refreshToken 
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      sessionStorage.clear();
      navigate('/');
    } catch (error) {
      console.log("Error logging out", error.response || error);
      sessionStorage.clear();
      navigate('/');
    }
  };
 

  const handleShareFavorites = () => {
    if (user) {
      
      const shareUrl = frontURL +`/publicFavorites/${user.users_id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Favorites URL copied to clipboard!');
      }).catch((error) => console.error('Error copying URL:', error));
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${url}/user/deleteAccount/${user.users_id}`);
        sessionStorage.clear();  
        navigate('/');  
        alert("Your account has been deleted successfully.");
      } catch (error) {
        console.error('Error deleting account:', error);
        alert("Error deleting account. Please try again later.");
      }
    }
  };

  return (
    <div className='page-container'>
    <div className="user-page">
      {user ? (
        <div className="user-display">
          <div className="user-avatar">
            <FaUser className='user-icon' />
            <h1>User Profile</h1>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
            </button>
          </div>
          <p>User_Email :{user.users_email}</p>
          <p>User_ID:{user.users_id.toString().padStart(6, '0')}</p>
          <button className="remove-button" onClick={handleDeleteAccount}>Delete account</button>
          <div className="share-container">
            <h2>Favorite List</h2>
            <div className="share-button" onClick={handleShareFavorites}>
              <FaShareAlt className="share-icon" />
              <span className="share-text">Share your favorites!</span>
            </div>
          </div>

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
            <p>No favorites added yet.</p>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
    </div>
  );
  
}

export default UserPage;
