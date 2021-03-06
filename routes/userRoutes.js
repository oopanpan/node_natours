const express = require('express');
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
} = require('../controllers/userController');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword').post(resetPassword);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
