// JWT secret key, identical with JWTStrategy key
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
passport = require('passport');

//Local passport file
require('./passport');

/**
 * creates JWT (expires after 7 days, using HS256 algorithm to encode)
 * @param {object} user
 * @returns user object, jwt, and additional information on token
 */
let generateJWTToken = (user) =>{
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * POST: Handles user login, generating a jwt upon login
 * @function generateJWTToken
 * @param {*} router
 * @returns user object incl. jwt
 * @requires passport
 */
module.exports = (router)=>{
    router.post('/login', (req, res)=>{
        passport.authenticate('local',{session: false}, (error, user, info) =>{
            if(error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error)=>{
                if(error){
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());               // Generates JWT if user exists
                return res.json({user, token});                            // Return generated JWT
            });
        })(req,res);
    })
}
