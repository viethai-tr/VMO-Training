const usersControllers = require('../controllers/users-controllers');

const router = require('express').Router();

router.get('/users', usersControllers.getUsers);
router.get('/users/:id', usersControllers.getAUser);
router.post('/users', usersControllers.addUser);
router.put('/users/:id', usersControllers.updateUser);
router.delete('/users/:id', usersControllers.deleteUser);

module.exports = router;