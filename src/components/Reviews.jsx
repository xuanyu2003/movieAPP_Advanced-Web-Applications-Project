import axios from "axios";
import "./Reviews.css";
import { useState, useEffect } from "react";

const url = process.env.REACT_APP_API_URL;

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewedMovies, setReviewedMovies] = useState([]);

  // Fetch review data from the database
  useEffect(() => {
    axios.get(url + "/reviews")
      .then(response => {
        
        setReviews(response.data);
      }).catch(error => {
        alert(error.response?.data?.error || error);
      });
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const fetchMovies = reviews.map(review => fetchReviewedMovies(review.review_movie_id));
      Promise.all(fetchMovies).then(() => {}).catch(err => {
        console.error("Error fetching movies:", err);
      });
    }
  }, [reviews]);

  const fetchReviewedMovies = async (movieId) => {
    
    try {
      const response = await axios.get(url + "/movie/findbyid", {
        params: { movie_id: movieId }
      });
      

      
      setReviewedMovies(prevMovies => [
        ...prevMovies, 
        { movieId, ...response.data } 
      ]);
    } catch (error) {
      console.error("Error fetching movie data from moviedb:", error);
    }
  };

  return (
    <div className="reviews-main">
      <ul>
        {reviews.map((review) => (
          
          <li key={review.review_id}>
            <h3>{review.movie_title}</h3>
            <img src={review.movie_image} alt={review.movie_title} />
            <p><strong>Rating:</strong> {review.review_rating} / 5</p>
            <p className="review-content"><strong>Review:</strong> {review.review_text}</p>
            <p><strong>Created At:</strong> {new Date(review.review_created_at).toLocaleString()}</p>
            <p><strong>Created By:</strong> {review.review_users_email}</p>
  
            {/* Movie Details Section */}
            {reviewedMovies.length > 0 &&
              (() => {
                const movie = reviewedMovies.find((movie) => movie.movieId === review.review_movie_id);
                if (movie) {
                  return (
                    <div>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title || 'Movie Poster'}
                        style={{ width: '150px', height: 'auto' }}
                      />
                      <h4>Movie Details:</h4>
                      <p><strong>Title:</strong> {movie.title}</p>
                      <p><strong>Release Date:</strong> {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  );
                }
                return null;
              })()}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Reviews
