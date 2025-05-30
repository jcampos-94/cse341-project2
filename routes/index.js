const passport = require('passport');

const router = require('express').Router();

router.get('/login', passport.authenticate('github'));

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
