import React, { useState } from 'react';
import axios from 'axios';
import './style3.css'; // Import CSS file

const API_KEY = 'aeba120c'; // Your OMDb API key

const Thirdpage = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!movieTitle.trim()) {
      setError('Movie title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setMovieData(null);

    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${API_KEY}`);
      console.log('API Response:', response.data); // Debugging line
      if (response.data.Response === 'True') {
        setMovieData(response.data);
      } else {
        setError(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching movie details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-container">
      <div className="background-image"></div>
      <div className="container">
        <button className="go-back-button" onClick={() => window.history.back()}>
          Back
        </button>
        <h1 className="title">Movie Search</h1>
        <div className="search-bar">
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="Enter movie title"
            className="search-input"
          />
          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {movieData && (
          <div className="movie-details">
            <h2 className="movie-title">{movieData.Title}</h2>
            <p><strong>Year:</strong> {movieData.Year}</p>
            <p><strong>Director:</strong> {movieData.Director}</p>
            <p><strong>Genre:</strong> {movieData.Genre}</p>
            <p><strong>Plot:</strong> {movieData.Plot}</p>
            {movieData.Poster && (
              <img src={movieData.Poster} alt={movieData.Title} className="movie-poster" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Thirdpage;
