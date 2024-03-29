//Requiring Passport
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

//Takes care of basic HTTP auth for login requests
passport.use(
  new LocalStrategy(
    // Takes username and password from req body
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      // Checks database for user with same username
      Users.findOne(
        { Username: username },
        (error, user) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
          // If no user matches username
          if (!user) {
            return callback(null, false, {
              message: "Incorrect username.",
            });
          }
          // If password incorrect (uses validatePassword to compare hashed passwords stored in DB)
          if (!user.validatePassword(password)) {
            return callback(null, false, {
              message: "Incorrect password.",
            });
          }
          // Executes callback, if username and password match
          return callback(null, user);
        }
      );
    }
  )
);

//Takes care of JWT auth
passport.use(
  new JWTStrategy(
    {
      // Extracts JWT from header of HTTP req
      jwtFromRequest:
        ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      // Returns user by user ID
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
