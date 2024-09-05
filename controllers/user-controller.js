const bcrypt = require('bcryptjs')

const { User, Restaurant, Comment } = require('../db/models')

const localFileHandler = require('../helpers/file-helpers')

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
        req.flash('success_messages', 'create success!!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 錯誤處理
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', 'login successfully!')
    res.redirect('/restaurants')
  },

  signOut: (req, res) => {
    req.flash('success_messages', 'logout successfully!')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res, next) => {
    const { id } = req.params

    return User.findByPk(id, {
      // raw: true,
      include: [
        {
          model: Comment,
          include: Restaurant,
          separate: true,
          order: [['createdAt', 'DESC']]
        }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't found!")

        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't found!")
        // if (Number(req.params.id) !== req.user.id) throw new Error('無法修改他人帳號!')

        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    if (!name) throw new Error('name field is required!')

    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    return Promise.all([ // 非同步處理
      User.findByPk(id), // 去資料庫查有沒有這間餐廳
      localFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
    ])
      .then(([user, file]) => {
        if (!user) throw Error("User didn't exist!")
        if (Number(id) !== req.user.id) throw new Error('不能修改別人的資料!')

        return user.update({
          name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin,
          image: file || user.image // // 如果 file 是 Truthy (使用者有上傳新照片) 就用 file，如果是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功') // 在畫面顯示成功提示
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }

}

module.exports = userController
