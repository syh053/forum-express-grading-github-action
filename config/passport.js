const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../db/models')
const User = db.User

const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true // 在下面的 callback function 中加入 req 屬性
},
(req, email, password, done) => {
  User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email }
  })
    .then(user => {
      if (!user) return done(null, false, req.flash('error_messages', 'email or passport input error!!'))

      bcrypt.compare(password, user.password)
        .then(ans => {
          if (!ans) return done(null, false, req.flash('error_messages', 'email or passport input error!!'))
          return done(null, user)
        })
    })
}))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      // console.log(user) // 觀察用，可 remark
      return done(null, user)
    })
})

module.exports = passport
