const express = require('express');

const { getAllUsers, updateUser, getUser, getMyProfil, updateEmail, updatePass } = require('../controllers/UserController');
const { check } = require("express-validator")

const router = express.Router();

router.get('/users', getAllUsers);
router.put('/user', [check('name').exists().withMessage("name is required !"), check('age').exists().withMessage(" age is required !"), check('state').exists().withMessage(" state is required !"), check('phoneNumber').exists().withMessage(" phoneNumber is required !")], updateUser);
router.get('/user/:id', getUser);
router.put('/updateemail', [check('email').exists().withMessage("email is required !").isEmail().withMessage("Invalid Email")], updateEmail);
router.put('/userpass', [check('password').exists().withMessage("Password is required !")], updatePass);

router.get('/myprofil', getMyProfil);




module.exports = {
    routes: router
}