const errHandler = {
  generalError: (err, req, res, next) => {
    console.log('進入錯誤 middleware!!')
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }

    res.redirect('back')

    next(err)
  }
}

module.exports = errHandler
