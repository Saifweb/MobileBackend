const express = require('express');

const { Create, ApproveState, RejectState, getAllReservations, giverate, StateDone } = require('../controllers/ReservationController');

const router = express.Router();

const { check } = require("express-validator")

router.post('/reservation/:housekeeper_id', [check('type').exists().withMessage("type is required!"), check('start_date').exists().withMessage("start_date is required!"), check('end_date').exists().withMessage("end_date is required!")], Create);
router.put('/reservation/approve/:id', ApproveState);
router.put('/reservation/reject/:id', RejectState);
router.put('/reservation/done/:id', StateDone);
router.get('/reservations', getAllReservations);
router.post('/giverate/:reservation_id', [check('rate').exists().withMessage("rate is required!")], giverate);

module.exports = {
    routes: router
}