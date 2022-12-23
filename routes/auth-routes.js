const express = require('express');

const { signup, signin, forgetPassword, signout } = require('../controllers/AuthController');

const router = express.Router();
const { check } = require("express-validator")

router.post('/signup', [check('name').exists().withMessage("name is required !"), check('email').exists().withMessage("email is required !").isEmail().withMessage("Invalid Email"), check('password').exists().withMessage("password is required !"), check('age').exists().withMessage(" age is required !"), check('state').exists().withMessage(" state is required !"), check('phoneNumber').exists().withMessage(" phoneNumber is required !")], signup);
router.post('/signin', [check('email').exists().withMessage("email is required !").isEmail().withMessage("Invalid Email"), check('password').exists().withMessage("password is required !")], signin);
router.post('/forgetPassword', forgetPassword);
router.post('/signout', signout);


module.exports = {
    routes: router
}