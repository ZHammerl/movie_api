const bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  morgan = require('morgan'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  path = require('path'),
  Models = require(path.resolve(__dirname, './models'));

const Movies = Models.Movie,
  Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix App!');
});

// READ - Gets a list of all the movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ -Gets data about single movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res
          .status(404)
          .send(`The movie titled "${req.params.title}" was not found in the database.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ - Get data about a genre by name
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  Movies.findOne({ 'Genre.Name': genreName })
    .then((movie) => {
      if (movie) {
        console.log(movie.Genre);
        res.status(200).json(movie.Genre);
      } else {
        res.status(404).send(`The genre "${genreName}" is not part of this database.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ - Get data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  Movies.findOne({ 'Director.Name': directorName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res
          .status(404)
          .send(`A director with the name of "${directorName}" was not found in this database.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// CREATE - Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birth_date: req.body.Birth_date,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ - Get all users
app.get('/users/', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ - Get user by username
app.get('/users/:userName', (req, res) => {
  const { userName } = req.params;
  console.log(userName);
  Users.findOne({ Username: userName })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401).send(`A user with the username "${userName}" does not exist.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// UPDATE - Allow users to update their user info
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birth_date: req.body.Birth_date,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// CREATE - Allow user to add a movie to their list of favorites
app.post('/users/:Username/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// DELETE - Allow users to remove a momvie from their list of favorites
app.delete('/users/:id/:movieID', (req, res) => {
  const { id, movieID } = req.params;

  Users.findOneAndUpdate({ _id: id }, { $pull: { FavoriteMovies: movieID } }, { new: true })
    .then((user) => {
      res
        .status(200)
        .send(
          `The movie with ID ${movieID} has been successfully removed from ${user.Username}'s favorites list`
        );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});
// DELETE user by ID- Allow users to deregister
app.delete('/users/:id', (req, res) => {
  Users.findOneAndRemove({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.id + ' was not found.');
      } else {
        res.status(200).send(req.params.id + ' was deleted.');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error ' + err);
    });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
