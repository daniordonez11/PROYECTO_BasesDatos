function requireAuth(req, res, next) {
  if (req.session?.userId) return next();
  return res.status(401).json({ ok: false, error: "No autorizado" });
}

module.exports = {
  requireAuth
};