const errHandler = {
  generalError: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_msg', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_msg', `${err}`)
    }

    // 依據權限回到各自的 restaurants 頁面
    if (req.user.isAdmin) {
      res.redirect('/admin/restaurants')
      next(err)
    } else {
      res.redirect('/restaurants')
      next(err)
    }
  }
}

module.exports = errHandler
