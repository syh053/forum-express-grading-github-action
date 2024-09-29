const { User } = require('../../db/models')

const userServices = require('../../services/user-services') // 載入 userServices

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, result) => {
      if (err) return next(err)
      req.flash('success_messages', 'Sign up successfully!')
      res.redirect('/signin')
    })
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
    userServices.getUser(req, (err, result) => err ? next(err) : res.render('users/profile', result))
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
    userServices.putUser(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '使用者資料編輯成功!')
      res.redirect(`/users/${req.params.id}`)
    })
  },

  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', 'success_messages', `成功收藏"${result.name}"`)
      res.redirect('back')
    })
  },

  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', `成功移除"${result.name}"`)
      res.redirect('back')
    })
  },

  addLike: (req, res, next) => {
    userServices.addLike(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', `like successful "${result.name}" !!`)
      res.redirect('back')
    })
  },

  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', `unlike successful "${result.name}"!!`)
      res.redirect('back')
    })
  },

  getTopUsers: (req, res, next) => {
    return User.findAll({ // 撈出所有 User 與 followers 資料
      // raw: true,
      // nest: true,
      include: [{
        model: User,
        as: 'Followers'
      }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 result 裡
        const result = users
          .map(user => ({
            ...user.toJSON(), // 解構 user 物件
            followerCount: user.Followers.length, // 在每個 user 新增 followerCount 屬性
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount) // 利用 sort() 方法針對 followerCount 整理排序

        res.render('users/top-users', { users: result })
      })
  },

  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '追蹤成功!')
      res.redirect('back')
    })
  },

  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '取消追蹤成功!')
      res.redirect('back')
    })
  }

}

module.exports = userController
