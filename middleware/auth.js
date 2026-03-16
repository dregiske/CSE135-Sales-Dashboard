exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

exports.requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    if (allowed.includes(req.session.user.role)) return next();
    res.status(403).render("403", { user: req.session.user });
  };
};

exports.requireSection = (section) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    const { role, sections } = req.session.user;
    if (role === "superadmin") return next();
    if (role === "analyst" && sections.includes(section)) return next();
    res.status(403).render("403", { user: req.session.user });
  };
};
