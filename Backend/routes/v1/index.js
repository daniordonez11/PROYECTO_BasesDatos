const { Router } = require('express');
const usersRoutes = require('./users.routes');
const authRoutes = require('./auth.routes');
const postsRoutes = require('./posts.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);

module.exports = router;
