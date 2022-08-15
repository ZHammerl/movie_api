const express = require('express'),
  app = express(),
  morgan = require('morgan');

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(top10Movies);
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix App!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
