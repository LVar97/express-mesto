const router = require('express').Router();
const {
  createUser, getUser, getUserId, patchUser, patchAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUser);
router.get('/users/:userId', getUserId);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
