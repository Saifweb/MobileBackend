const express = require('express');

const { Create, ApproveState, RejectState, getAllReservations, giverate, StateDone, getDoneReservations } = require('../controllers/ReservationController');

const router = express.Router();

const { check } = require("express-validator")
//Reservations Route
router.post('/reservation/:housekeeper_id', [check('type').exists().withMessage("type is required!"), check('start_date').exists().withMessage("start_date is required!"), check('end_date').exists().withMessage("end_date is required!"), check('location').exists().withMessage(" location is required!"), check('price').exists().withMessage("price is required!")], Create);
router.put('/reservation/approve/:id', ApproveState);
router.put('/reservation/reject/:id', RejectState);
router.put('/reservation/done/:id', StateDone);
router.get('/reservations', getAllReservations);
router.get('/reservations_done', getDoneReservations);
router.put('/giverate/:id', [check('rate').exists().withMessage("rate is required!")], giverate);


module.exports = {
    routes: router
}