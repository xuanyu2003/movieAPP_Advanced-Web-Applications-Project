
import React, { useEffect, useState } from "react";
import "./MoviePage.css";
import { MdFavoriteBorder } from "react-icons/md";
import XMLParser from "react-xml-parser";
import { IoMdAdd } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function MoviePage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL + "/movie";
  const url = process.env.REACT_APP_API_URL
  const [activeTab, setActiveTab] = useState("showtimes");
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writeReview, setWriteReview] = useState("");
  const [starReview, setStarReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showGroups, setShowGroups] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(true);
  const [groups, setGroups] = useState(["Group 1", "Group 2", "Group 3"]);

  const addGroup = (groupName) => {
    setGroups([...groups, groupName]);
  };
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/findbyid`, {
          params: { movie_id: movieId },
        });
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [movieId]);

  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie) return; // Early return if movie is not set
      try {
        const response = await fetch("https://www.finnkino.fi/xml/Schedule/");
        const xmlText = await response.text();
        const xml = new XMLParser().parseFromString(xmlText);

        const movieShowtimes = xml
          .getElementsByTagName("Show")
          .filter((showtime) => {
            const showtimeTitle = showtime
              .getElementsByTagName("Title")[0]
              .value.toLowerCase();
            return showtimeTitle === movie.title.toLowerCase();
          });

        setShowtimes(movieShowtimes);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie]);

  // Fetch reviews
    const fetchReviews = async () => {
    try {
      const response = await axios.get(url + '/reviews/review' , {
        params: { movie_id: movie.id }
      });
      
      setReviews(response.data);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }
  useEffect(() => {
    const fetchReviews = async () => {
      if (!movie) return; // Early return if movie is not set
      try {
        const response = await axios.get(url + "/reviews/review", {
          params: { movie_id: movie.id },
        });
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [movie]);

 // Fetch groups that the user is part of
 useEffect(() => {
  const fetchGroups = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      console.error("User not found");
      return;
    }

    try {
      const response = await axios.get(url + "/groups", {
        params: { userId: user.users_id },
      });
      setGroups(response.data); // Populate groups with the fetched data
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  fetchGroups();
}, []);


  // Handle add movie to group
  const handleAddMovieToGroup = async (groupId) => {
    if (!movie) {
      console.error("No movie selected");
      return;
    }

   
   
    
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      console.error("No user found in session storage.");
      toast.error("You must be logged in to add a movie to a group.");
      return;
    }
    try {
      const response = await axios.post(url + "/groups/addToGroup", {
        movie_id: movie.id,
        group_id: groupId,
        user_id: user.users_id,
        movie_title: movie.title,
        movie_description: movie.overview,
        movie_image: movie.poster_path
      });

      
      if (response.status === 201) {
      toast.success("Movie added to group successfully!");
      }

      if (response.status === 200) {
        alert("Movie is already in this group")
      }
    } catch (error) {
      console.error("Error adding movie to group:", error);
      toast.error("Failed to add movie to group.");
    }
    // backend request to add movie to group
  };

  //add movie to favorites
  const handleFavorite = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        console.error("No user found in session storage.");
        toast.error("You must be logged in to favorite a movie.");
        return;
    }

    const { users_id } = user; 
    const movie_id = movie.id;

    const data = { users_id, movie_id };
    

    try {
        const response = await axios.post(url + "/movie/addFavorite/", data);
        console.log(response)
        toast.success("Movie added to your favorites!");
    } catch (error) {
        if (error.response) {
            console.error("Server responded with error:", error.response.data);
            toast.error(`Error: ${error.response.data}`);
        } else {
            console.error("Request error:", error.message);
            toast.error("An error occurred while adding to favorites.");
        }
    }
  };

    const handleInputReview = (e) => {
    e.preventDefault();
    setWriteReview(e.target.value);
  }

  const handleStarReview = (e) => {
    e.preventDefault();
    const value = Number(e.target.value)
    if (value <= 5 && value >= 0) {
      setStarReview(e.target.value);
    } else {
      alert("The rating must be 1-5")
      e.target.value = ""
    }
    
  }
  const handleAddGroup = () => {
    setShowGroups(!showGroups);
  };

  const showWriteReviewHandle = () => {
    setShowWriteReview(!showWriteReview);
  };

    const writeReviewHandle = async (e) => {
    e.preventDefault();
    // Check session if user is logged in
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (user !== null) {
      let user_id = user.users_id;
      let user_email = user.users_email;
      let movie_id = movie.id;
      let review = writeReview;
      let review_rating = starReview;
  
      let data = {
        user_id,
        user_email,
        movie_id,
        review,
        review_rating
      };
  
      let token = user.accessToken;
  
      try {
        const response = await axios.post(url + "/reviews/create", data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        
  
        // Fetch updated reviews list
        fetchReviews();
  
        // reset the review input fields
        setWriteReview('');
        setStarReview('');
  
        // Close the review form
        setShowWriteReview(true);
      } catch (error) {
        console.log("Error creating review", error.response || error);
      }
    } else {
      alert('You must be logged in to write a review');
    }
    
  };
  
  if (!movie) return <div>Select a movie to view details</div>;

  return (
    <div className="movie-container">
      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-details">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>Rating: {movie.vote_average.toFixed(1)}</p>
          <p>Release Date: {movie.release_date}</p>
          <div className="btns">
            <button 
            className={activeTab === "showtimes" ? "active" : ""}
            onClick={() => setActiveTab("showtimes")}
            >Showtimes</button>
            <button 
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
            >Reviews</button>
          </div>

          <div className="add-group" onMouseLeave={() => setShowGroups(false)}>
            <div className="add-group-title" onClick={() => setShowGroups(!showGroups)}>
              <IoMdAdd className="addIcon" />
              <p>Add this movie to a group</p>
            </div>

            {showGroups && (
              <div className="groups-options">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <div className="groups-item" key={group.group_id} 
                    onClick={() => handleAddMovieToGroup(group.group_id)}>
                      <MdGroups className="groupIcon" />
                      <p>{group.group_name}</p>
                    </div>
                  ))
                ) : (
                  <p>No groups available</p>
                )}
              </div>
            )}
          </div>

         

        </div>
        <MdFavoriteBorder onClick={handleFavorite} className="favorite-btn" />
      </div>

      {activeTab === 'showtimes' && (
        <div className="showtimes">
          <h1>Showtimes</h1>
          {loading ? (
            <p>Loading showtimes...</p>
          ) : showtimes.length > 0 ? (
            <div className="theatres">
              {showtimes.map((showtime, index) => (
                <div className="theatre" key={index}>
                  <h3>{showtime.getElementsByTagName('Theatre')[0].value}</h3>
                  <p>Location: {showtime.getElementsByTagName('TheatreAndAuditorium')[0].value}</p>
                  <p>Showtime: {showtime.getElementsByTagName('dttmShowStart')[0].value}</p>
                  <a href="https://www.finnkino.fi/" target="_blank" rel="noopener noreferrer">
                  <button>Tickets</button>
                 </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No showtimes available for this movie</p>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className='reviews-container'>

          <div className='reviews-head'>
            <div className='review-title'>
              <h1>Reviews</h1>
              <h3>Latest reviews</h3>
            </div>

            { showWriteReview ? 
              <div className='create-review-title' onClick={showWriteReviewHandle}>
                  <PiPencilSimpleLineBold className='reviewIcon'/>
                  <h3>Write a review</h3>
            </div> 
            : 
            <div className='create-review'>
              <div className='review-input'>
                 <input className='rateTxt-input' onChange={handleInputReview} type="text" placeholder='write a review' />
                 <input className='rateNbr-input' onChange={ handleStarReview } type="number" min={0} max={5} placeholder="rate 1-5?" />
              </div>

                <button onClick={writeReviewHandle}>
                  <FaPencil className='reviewIcon'/>
                </button>
            </div>
            }
          </div>
          { reviews.length > 0 ?
            <div className='reviews'>
              {reviews.map((review, index) => (
                <div className='review' key={index}>
                  {/* <h3>{movie.title}</h3> */}
                  <h3>{review.review_text}</h3>
                  <p>Rating: {review.review_rating}</p>
                  <p>Created By: {review.review_users_email}</p>
                  <p>Created At: {new Date(review.review_created_at).toLocaleString()}</p>

                </div>
              ))}
            </div>
          :
          <p>No reviews available</p>
          }

        </div>
      )}
    </div>
  );
}

export default MoviePage;