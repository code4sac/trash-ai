const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var AuthRouter = express.Router();

const Config = require('../../_config');
const AuthDao = Config.getAuthDao();

AuthRouter.post('/signup', async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password; 
        const newUser = await AuthDao.addNewUser(username, password);
        res.status(200).json({
            message: 'New User Created',
            user: newUser
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message,
            user: null
        });
    }
});

AuthRouter.post(
    '/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const returnObject = info;
              res.status(401).json(returnObject);
            }

            const body = { _id: user._id, username: user.username };
            const token = jwt.sign({ user: body }, Config.JWTSecretKey);
            res.json({ token });

          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
);

module.exports = AuthRouter;