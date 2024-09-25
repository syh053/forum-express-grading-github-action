const passport = require('../config/passport')

const helpers = require('../helpers/auth-helpers')

const localAuthenticated = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      req.flash('error_messages', 'email or passport input error!!')
      return res.redirect('/signin')
    }

    req.login(user, err => {
      if (err) return next(err)
      next()
    })
  })(req, res, next)
}

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = { localAuthenticated, authenticated, authenticatedAdmin }
