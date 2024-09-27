const { User } = require('../db/models') // 載入 User
const bcrypt = require('bcryptjs')

const userServices = {

  signUp: (req, cb) => {
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
      .then(newUser => cb(null, newUser))
      .catch(err => cb(err)) // 錯誤處理
  }

}

module.exports = userServices
