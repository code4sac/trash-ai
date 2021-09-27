const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Config = require('../../../_config');
const AuthDao = Config.getAuthDao();

passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      async (username, password, done) => {
        try {
          const user = await AuthDao.getUserByUserName(username);
  
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await AuthDao.checkUserPassword( user, password );
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );


passport.use(
  new JWTstrategy(
    {
      secretOrKey: Config.JWTSecretKey,
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("Bearer") //fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

const authMiddleWare = passport.authenticate('jwt', { session: false });

module.exports.authMiddleWare = authMiddleWare; 