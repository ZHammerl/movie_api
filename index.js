const bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  morgan = require('morgan'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('/models.js');

const Movies = Models.Movie,
  Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

let users = [
  {
    id: 1,
    name: 'Kim',
    favoriteMovies: [],
  },
  {
    id: 2,
    name: 'Joe',
    favoriteMovies: ['The Express'],
  },
];

let movies = [
  {
    Title: 'The Express',
    Description: 'this is a dummy descritption',
    Genre: {
      Name: 'Drama',
      Description: 'Drama so much drama',
    },
    Director: {
      Name: 'John Doe',
      Bio: "what was John Doe's life like",
    },
    Featured: false,
  },
  {
    Title: 'The Morgan',
    Description: 'this is a dummy description without mistakes',
    Genre: {
      Name: 'Comedy',
      Description: 'we all love to laugh',
    },
    Director: {
      Name: 'Jane Doe',
      Bio: "What was Jane Doe's life like",
    },
    Featured: false,
  },
  {
    Title: 'The UUID',
    Description: 'this is a dummy description for UUID',
    Genre: {
      Name: 'Thriller',
      Description: 'Lots of thrilling moments hopefully',
    },
    Director: {
      Name: 'Anthony Man',
      Bio: "What was Anthony Man's life like",
    },
    Featured: true,
  },
  {
    Title: 'The Body-Parser',
    Description: 'this is a dummy descritption of the Body-Parser',
    Genre: {
      Name: 'Horror',
      Description: 'Horrorful moments will be lived',
    },
    Director: {
      Name: 'Luisa Happy',
      Bio: "What was Luisa Happy's life like",
    },
    Featured: true,
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to myFlix App!');
});

// READ - Gets a list of all the movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ -Gets data about single movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('no such movie');
  }
});

// READ - Get data about a genre by name
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('no such genre');
  }
});

// READ - Get data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find((movie) => movie.Director.Name === directorName).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('no such director');
  }
});

// CREATE - Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Missing user name in request body');
  }
});

// UPDATE - Allow users to update their user info
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('User doesn"exist');
  }
});

// CREATE - Allow user to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites list`);
  } else {
    res.status(400).send('User doesn"exist');
  }
});

// DELETE - Allow users to remove a momvie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter((title) => title !== movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been successfully removed from user ${id}'s favorites list`);
  } else {
    res.status(400).send('User doesn"exist');
  }
});
// Allow users to deregister
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('User doesn"exist');
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
