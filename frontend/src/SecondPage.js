import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const SecondPage = () => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [company, setCompany] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [showCrackers, setShowCrackers] = useState(false); // New state for crackers
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 4 && movies.length > 0) {
      triggerPaperEffect();
    }
  }, [step, movies]);

  const triggerPaperEffect = () => {
    const numPapers = 50;
    const paperContainer = document.createElement('div');
    paperContainer.classList.add('paper-container');

    for (let i = 0; i < numPapers; i++) {
      const paper = document.createElement('div');
      paper.classList.add('paper', `paper-${(i % 3) + 1}`);
      paper.style.left = `${Math.random() * 100}vw`;
      paper.style.animationDelay = `${Math.random() * 2}s`;
      paperContainer.appendChild(paper);
    }

    document.body.appendChild(paperContainer);

    // Remove the paper effect after 5 seconds
    setTimeout(() => {
      document.body.removeChild(paperContainer);
    }, 5000);
  };

  const handleNavigation = () => {
    // Cleanup paper effect when navigating away
    const paperContainer = document.querySelector('.paper-container');
    if (paperContainer) {
      document.body.removeChild(paperContainer);
    }
    navigate('/other-page');
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleCompanySelect = (selectedCompany) => {
    setCompany(selectedCompany);
  };

  const handleArrowClick = async () => {
    if (step === 1 && mood) {
      setStep(2);
    } else if (step === 2 && genre) {
      setStep(3);
    } else if (step === 3 && company) {
      await handleSubmit();
      setStep(4);
    }
  };

  const handleReverseArrowClick = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    console.log(`Fetching movies for Mood: ${mood}, Genre: ${genre}, and Company: ${company}`);
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/${mood}/${genre}/${company}`);
      console.log('Response data:', response.data);
      setMovies(response.data);
      setError('');
      setShowCrackers(true); // Trigger the crackers animation
    } catch (err) {
      console.error('Error fetching movies:', err);
      setMovies([]);
      setError('No movie found for the selected mood, genre, and company');
    }
  };

  const handleGoToThirdPage = () => {
    navigate('/third-page');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="second-page-body">
      <div className="second-page-background-blur"></div>
      <div className="second-page-content">
        {step === 1 && (
          <>
            <h1 className="glowing-text movie-title">Movie Recommendation</h1>
            <h2 className="glowing-text subtitle">Pick a Movie for You...</h2>
            <div>
              <h2 align='center'>1. How are you today?</h2>
              <div className="mood-selection">
                <div
                  className={`mood-option ${mood === 'happy' ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect('happy')}>
                  😊
                </div>
                <div
                  className={`mood-option ${mood === 'neutral' ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect('neutral')}>
                  😐
                </div>
                <div
                  className={`mood-option ${mood === 'sad' ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect('sad')}>
                  😢
                </div>
              </div>
              {mood && <div className="arrow" onClick={handleArrowClick}>Next</div>}
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <h2 align='center'>2. Choose genre:</h2>
            <div className="genre-selection">
              <div
                className={`genre-option ${genre === 'horror' ? 'selected' : ''}`}
                onClick={() => handleGenreSelect('horror')}>
                Horror
              </div>
              <div
                className={`genre-option ${genre === 'comedy' ? 'selected' : ''}`}
                onClick={() => handleGenreSelect('comedy')}>
                Comedy
              </div>
              <div
                className={`genre-option ${genre === 'crime' ? 'selected' : ''}`}
                onClick={() => handleGenreSelect('crime')}>
                Crime
              </div>
              <div
                className={`genre-option ${genre === 'animation' ? 'selected' : ''}`}
                onClick={() => handleGenreSelect('animation')}>
                Animation
              </div>
            </div>
            {genre && <div className="arrow" onClick={handleArrowClick}>Next</div>}
            <div className="reverse-arrow" onClick={handleReverseArrowClick}>Back</div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 align='center'>3. Watching with?</h2>
            <div className="company-selection">
              <div
                className={`company-option ${company === 'solo' ? 'selected' : ''}`}
                onClick={() => handleCompanySelect('solo')}>
                Solo
              </div>
              <div
                className={`company-option ${company === 'dual' ? 'selected' : ''}`}
                onClick={() => handleCompanySelect('dual')}>
                Dual
              </div>
              <div
                className={`company-option ${company === 'family' ? 'selected' : ''}`}
                onClick={() => handleCompanySelect('family')}>
                Family
              </div>
              <div
                className={`company-option ${company === 'friends' ? 'selected' : ''}`}
                onClick={() => handleCompanySelect('friends')}>
                Friends
              </div>
            </div>
            {company && <div className="arrow" onClick={handleArrowClick}>Next</div>}
            <div className="reverse-arrow" onClick={handleReverseArrowClick}>Back</div>
          </div>
        )}

        {step === 4 && (
          <div className="movie-display">
            {movies.length > 0 ? (
              <div>
                <h2>Recommended Movies:</h2>
                {movies.map((movie, index) => (
                  <div key={index} className="movie-item">
                    <p>Title: {movie.title}</p>
                    <p>Director: {movie.director}</p>
                    <p>Release Year: {movie.releaseYear}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="error-message">{error}</p>
            )}
            <div className="reverse-arrow" onClick={handleReverseArrowClick}>Back</div>
          </div>
        )}

        {showCrackers && <div className="crackers"></div>} {/* Add crackers animation */}
       
        <button className="back-button" onClick={handleGoBack}>Back</button>
        <button className="go-to-third-page-button" onClick={handleGoToThirdPage}>Go to Third Page</button>
      </div>
    </div>
  );
};

export default SecondPage;
