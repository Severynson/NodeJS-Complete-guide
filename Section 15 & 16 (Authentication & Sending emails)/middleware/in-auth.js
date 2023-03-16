module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash("error", "Email exists alrerady! Please pass some other email.");
    return res.redirect("/login");
  } else next();
};
