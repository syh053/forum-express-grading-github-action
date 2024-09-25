const passport = require('passport')
const LocalStrategy = require('passport-local')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { User, Restaurant } = require('../db/models')

const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true // 在下面的 callback function 中加入 req 屬性
},
(req, email, password, done) => {
  User.findOne({
    attributes: ['id', 'name', 'email', 'password', 'isAdmin', 'image'],
    where: { email }
  })
    .then(user => {
      if (!user) return done(null, false)
      bcrypt.compare(password, user.password)
        .then(ans => {
          if (!ans) return done(null, false)
          return done(null, user)
        })
    })
}))

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikeRestaurants' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  })
    .then(user => {
      if (!user) return done(null, false)
      return done(null, user)
    })
    .catch(err => done(err))
}))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    // nest: true,
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikeRestaurants' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  })
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err))
})

module.exports = passport
