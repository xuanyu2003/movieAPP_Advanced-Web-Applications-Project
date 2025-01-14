import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Categories.scss";
import { useNavigate } from "react-router-dom";

function Categories({ setSelectedMovie }) {
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const BASE_URL = process.env.REACT_APP_API_URL + "/movie";
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  const navigate = useNavigate();

  // Function to calculate cards to show based on screen width
  const calculateCardsToShow = () => {
    return window.innerWidth <= 768 ? 3 : 5; // Show 3 cards for small screens, 5 for larger screens
  };

  // State to hold the number of cards to show
  const [cardsToShow, setCardsToShow] = useState(calculateCardsToShow());

  // State for visible ranges
  const [visibleRange, setVisibleRange] = useState({
    trending: { startIndex: 0, endIndex: calculateCardsToShow() },
    popular: { startIndex: 0, endIndex: calculateCardsToShow() },
    topRated: { startIndex: 0, endIndex: calculateCardsToShow() },
  });

  // Adjust cardsToShow and visibleRange on window resize
  useEffect(() => {
    const handleResize = () => {
      const newCardsToShow = calculateCardsToShow();
      setCardsToShow(newCardsToShow);

      setVisibleRange((prevState) => {
        const updatedRange = {};
        Object.keys(prevState).forEach((category) => {
          updatedRange[category] = {
            startIndex: 0,
            endIndex: newCardsToShow,
          };
        });
        return updatedRange;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch movie data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingResponse = await axios.get(`${BASE_URL}/trending`);
        const popularResponse = await axios.get(BASE_URL + "/popular");
        const topRatedResponse = await axios.get(BASE_URL + "/toprated");

        setTrendingMovies(trendingResponse.data.slice(0, 20));
        setPopularMovies(popularResponse.data.slice(0, 20));
        setTopRatedMovies(topRatedResponse.data.slice(0, 20));
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovies();
  }, [BASE_URL]);

  // Handle movie card click
  const handleMovieClick = (movie) => {
    navigate(`/MoviePage/${movie.id}`);
  };

  // Scroll functionality for moving horizontally
  const scrollRow = (direction, category) => {
    const totalMovies =
      category === "trending"
        ? trendingMovies
        : category === "popular"
        ? popularMovies
        : topRatedMovies;

    let { startIndex, endIndex } = visibleRange[category];

    if (direction === "next" && endIndex < totalMovies.length) {
      setVisibleRange((prevState) => ({
        ...prevState,
        [category]: {
          startIndex: startIndex + cardsToShow,
          endIndex: endIndex + cardsToShow,
        },
      }));
    } else if (direction === "back" && startIndex > 0) {
      setVisibleRange((prevState) => ({
        ...prevState,
        [category]: {
          startIndex: startIndex - cardsToShow,
          endIndex: endIndex - cardsToShow,
        },
      }));
    }
  };

  // Render movie cards for each category
  const renderMovies = (movies, category) => {
    const { startIndex, endIndex } = visibleRange[category];
    return movies.slice(startIndex, endIndex).map((movie) => (
      <div
        key={movie.id}
        className="MovieCard"
        onClick={() => handleMovieClick(movie)}
      >
        <div className="MovieCard_logo">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
        <div className="MovieCard_title">
          <h3>{movie.title}</h3>
          <p>Release date: {movie.release_date}</p>
        </div>
      </div>
    ));
  };

  // Categories data to display
  const categoriesData = [
    { title: "Trending", movies: trendingMovies, category: "trending" },
    { title: "Popular", movies: popularMovies, category: "popular" },
    { title: "Top Rated", movies: topRatedMovies, category: "topRated" },
  ];

  return (
    <div className="category-container">
      {categoriesData.map((category, index) => (
        <div className="categories" key={index}>
          <h1>{category.title}</h1>
          <div className="scroll-container">
            <button
              className="scroll-btn back"
              onClick={() => scrollRow("back", category.category)}
            >
              &lt;
            </button>
            <div className="category">
              {renderMovies(category.movies, category.category)}
            </div>
            <button
              className="scroll-btn next"
              onClick={() => scrollRow("next", category.category)}
            >
              &gt;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;
