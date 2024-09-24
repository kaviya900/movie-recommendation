const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios'); // Import axios for making HTTP requests

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/listofmovies', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema, 'users');

const MovieSchema = new mongoose.Schema({
  title: String,
  mood: String,
  genre: String,
  company: String,
  director: String,
  releaseYear: Number,
});

const Movie = mongoose.model('Movie', MovieSchema, 'moviesdata');

// User registration route
app.post('/api/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to register user' });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Username does not exist' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Movie recommendation route including company
app.get('/api/movies/:mood/:genre/:company', async (req, res) => {
  const { mood, genre, company } = req.params;
  console.log(`Fetching movies with mood: ${mood}, genre: ${genre}, and company: ${company}`);
  try {
    const movies = await Movie.find({ mood, genre, company });
    console.log('Movies found:', movies);
    if (movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).json({ message: 'No movie found for the selected mood, genre, and company' });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// OMDb API route to get movie details
app.get('/api/omdb/:title', async (req, res) => {
  const { title } = req.params;
  const API_KEY = 'aeba120c'; // Replace with your OMDb API key
  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.Response === 'True') {
      res.json(response.data);
    } else {
      res.status(404).json({ message: response.data.Error });
    }
  } catch (error) {
    console.error('Error fetching data from OMDb:', error);
    res.status(500).json({ message: 'Error fetching movie details from OMDb' });
  }
});

app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
