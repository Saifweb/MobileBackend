const express = require('express');

const { Create, ApproveState, RejectState, getAllReservations, giverate, StateDone, getDoneReservations, giveGlobalRate } = require('../controllers/ReservationController');

const router = express.Router();

const { check } = require("express-validator")
//Auth Route
router.post('/reservation/:housekeeper_id', [check('type').exists().withMessage("type is required!"), check('start_date').exists().withMessage("start_date is required!"), check('end_date').exists().withMessage("end_date is required!")], Create);
router.put('/reservation/approve/:id', ApproveState);
router.put('/reservation/reject/:id', RejectState);
router.put('/reservation/done/:id', StateDone);
router.get('/reservations', getAllReservations);
router.get('/reservations_done', getDoneReservations);
router.put('/giverate/:id', [check('rate').exists().withMessage("rate is required!")], giverate);
router.get('/globalrate', getAllReservations);


module.exports = {
    routes: router
}