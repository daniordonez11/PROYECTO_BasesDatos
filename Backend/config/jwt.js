module.exports = {
  secret: process.env.JWT_SECRET || 'clave_temporal_dev',
  expiresIn: '8h'
};