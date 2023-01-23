# Web-Flix-Movies (API)

This is the backend app using Node/Express.js to create a REST API.
MongoDB serves as database.


## Installation

Install dependencies for web-flix-app with npm

```bash
  git clone https://github.com/t-schill-dev/web-flix-app.git
  cd web-flix-app
  npm install
  
```
    
## Documentation

### Dependencies
**For Development**
- Express library
- Passport library (for authentication)
- JSON Web Token and Bcrypt
- CORS
- Mongoose (business logic)

**For Non-Relational Database**
MongoDB / MongoDB Atlas


## Developement
### Local developement
In order to locally work on this app, you have to connect it to the localhost.
To do so, uncomment the respective code block in `index.js` and comment out the connection to the remote db.

### Nodemon
Once working locally, you can use Nodemon as a tool to automatically save and generate a new node file.

Start the server
```bash
npx nodemon index.js
```
After every save it restarts the server

For more information see the [documentation](https://www.npmjs.com/package/nodemon)

### Hosting
- Heroku