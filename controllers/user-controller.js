const bcrypt = require('bcryptjs')

const db = require('../db/models')
const User = db.User

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 建立正規表達式
    const regex = /@/g

    if (password !== passwordCheck) throw new Error('"Password Check" do not match "Password" !!')

    if (!regex.test(email)) throw new Error('"email must contain "@" !!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('This email is already exists!!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_msg', 'create success!!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 錯誤處理
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', 'login successfully!')
    res.redirect('restaurants')
  },

  signOut: (req, res) => {
    req.flash('success_msg', 'logout successfully!')
    req.logout()
    res.redirect('/signin')
  }

}

module.exports = userController
