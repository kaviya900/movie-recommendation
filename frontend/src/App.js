import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Set LoginPage as the default route */}
        <Route path="/signup" element={<SignUpPage />} /> {/* SignUpPage is accessible via /signup */}
        <Route path="/second-page" element={<SecondPage />} />
        <Route path="/third-page" element={<ThirdPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;
