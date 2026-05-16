// Block guests — require the user to be logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) return next();
  req.flash("error", "Please log in to continue.");
  return res.redirect("/login");
}

// Block non-admins — require role === "admin"
function isAdmin(req, res, next) {
  if (res.locals.currentUser && res.locals.currentUser.role === "admin") {
    return next();
  }
  req.flash("error", "Access Denied — Admins only.");
  return res.redirect("/");
}

module.exports = { isLoggedIn, isAdmin };
