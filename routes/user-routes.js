const express = require('express');

const { getAllUsers, updateUser, getUser } = require('../controllers/UserController');
const { check } = require("express-validator")

const router = express.Router();

router.get('/users', getAllUsers);
router.put('/user', [check('name').exists().withMessage("name is required !"), check('age').exists().withMessage(" age is required !"), check('state').exists().withMessage(" state is required !"), check('phoneNumber').exists().withMessage(" phoneNumber is required !")], updateUser);
router.get('/user', getUser);



module.exports = {
    routes: router
}