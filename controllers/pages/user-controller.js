const { User, Restaurant, Comment, Like, Followship } = require('../../db/models')

const userServices = require('../../services/user-services') // 載入 userServices

const localFileHandler = require('../../helpers/file-helpers')

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
    const { id } = req.params

    return User.findByPk(id, {
      // raw: true,
      include: [
        {
          model: Comment,
          include: Restaurant,
          separate: true,
          order: [['createdAt', 'DESC']]
          // group: ['Restaurant.id'] // 用 sequelize 方法剔除重複評論的餐廳
        },
        {
          model: User,
          as: 'Followers'
        },
        {
          model: User,
          as: 'Followings'
        },
        {
          model: Restaurant,
          as: 'FavoritedRestaurants'
        }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't found!")

        /*
        去除重複的餐廳 :
        用 filter 遍歷每個 comments 內的餐廳 id，再用 if 判斷 temp 是否有重複的 key 值，
        若沒有則新增 key 到 temp 中，並把 comment 加到 newComments。
        */
        const comments = user.toJSON().Comments

        const temp = {}

        const newComments = comments.filter(comment => {
          const restaurantId = comment.Restaurant?.id
          if (!(restaurantId in temp)) {
            temp[restaurantId] = ''
            return true
          }
          return false
        })

        res.render('users/profile', { user: user.toJSON(), comments: newComments })
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
    const { restaurantId } = req.params
    const userId = req.user.id

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')

        return [Like.create({ restaurantId, userId }), restaurant]
      })
      .then(([create, restaurant]) => {
        req.flash('success_messages', `like successful "${restaurant.name}" !!`)
        res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Like.findOne({ where: { userId, restaurantId } })
      .then(async like => {
        if (!like) throw new Error("You haven't liked this restaurant!")

        const restaurant = await Restaurant.findByPk(restaurantId, { raw: true })

        return [like.destroy(), restaurant]
      })
      .then(([destroy, restaurant]) => {
        req.flash('success_messages', `unlike successful "${restaurant.name}"!!`)
        res.redirect('back')
      })
      .catch(err => next(err))
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
    const { userId } = req.params

    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')

        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => {
        req.flash('success_messages', '追蹤成功!')
        res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    const { userId } = req.params

    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")

        return followship.destroy({
          where: { followingId: userId }
        })
      })
      .then(() => {
        req.flash('success_messages', '取消追蹤成功!')
        res.redirect('back')
      })
      .catch(err => next(err))
  }

}

module.exports = userController
