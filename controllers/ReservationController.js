'use strict';

const firebase = require('../db');

const firestore = firebase.firestore();
const { validationResult } = require("express-validator")

const Create = async (req, res, next) => {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json(errors.array())
    }
    else {
        var user = firebase.auth().currentUser
        if (user) {
            try {
                var jsonUser = {
                    "customer_id": user.uid,
                    "start_date": req.body.start_date,
                    "end_date": req.body.end_date,
                    "type": req.body.type,
                    "housekeeper_id": req.params.housekeeper_id,
                    "state": "pending",
                };
                await firestore.collection('reservations').doc().set(jsonUser);
                res.send("reservations added ! ");
            } catch (error) {
                res.status(400).send(error.message);
            }
        }
        else {
            res.send("Acces Denied !")
        }
    }
}

const getAllReservations = async (req, res, next) => {
    const user = firebase.auth().currentUser
    if (user) {
        try {
            const reservations = await firestore.collection('reservations');
            const data = await reservations.get();
            const reservationsArray = [];
            if (data.empty) {
                res.status(404).send('No Reservations record found');
            } else {
                data.forEach(doc => {
                    if (doc.data().state == "pending" && (user.uid == doc.data().housekeeper_id || user.uid == doc.data().customer_id)) {
                        reservationsArray.push(doc.data());
                    }
                });
                res.send(reservationsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.send("Acces Denied !")
    }
}

const ApproveState = async (req, res, next) => {
    var user = firebase.auth().currentUser
    if (user) {
        try {
            const id = req.params.id
            const jsonUser = {
                "state": "approved",
            };
            var reservation = await firestore.collection('reservations').doc(id);
            var Ourreservation = await reservation.get()
            console.log(user.uid, Ourreservation.data().housekeeper_id)
            if (Ourreservation.data().housekeeper_id == user.uid) {
                await reservation.update(jsonUser);
                res.send("reservations Approved!");
            }
            else {
                res.send("Acces Denied !");
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.send("Acces Denied!")
    }
}

const StateDone = async (req, res, next) => {
    var user = firebase.auth().currentUser
    if (user) {
        try {
            const id = req.params.id
            const jsonUser = {
                "state": "done",
            };
            var reservation = await firestore.collection('reservations').doc(id);
            var Ourreservation = await reservation.get()
            console.log(user.uid, Ourreservation.data().housekeeper_id)
            if (Ourreservation.data().housekeeper_id == user.uid) {
                await reservation.update(jsonUser);
                res.send("reservations is done!");
            }
            else {
                res.send("Acces Denied !");
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.send("Acces Denied!")
    }
}
const RejectState = async (req, res, next) => {
    var user = firebase.auth().currentUser
    if (user) {
        try {
            const id = req.params.id
            const jsonUser = {
                "state": "rejected",
            };
            var reservation = await firestore.collection('reservations').doc(id);
            var Ourreservation = await reservation.get()
            console.log(user.uid, Ourreservation.data().housekeeper_id)
            if (Ourreservation.data().housekeeper_id == user.uid) {
                await reservation.update(jsonUser);
                res.send("reservations rejected!");
            }
            else {
                res.send("Acces Denied !");
                console.log(Ourreservation.housekeeper_id == user.uid);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.send("Acces Denied!")
    }

}
const giverate = async (req, res, next) => {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json(errors.array())
    }
    else {
        var user = firebase.auth().currentUser
        try {
            var reservation = await firestore.collection('reservations').doc(req.params.reservation_id);
            var Ourreservation = await reservation.get()
        }
        catch {
            res.status(403).json("reservation dosent exist !")
        }
        if (user && Ourreservation.data().status == "done" && Ourreservation.data().customer_id == user.uid) {
            try {
                var jsonRate = {
                    "rate": req.body.rate,
                };
                await reservation.update(jsonRate);
                res.status(200).json("Thanks for rating this reservations")

            } catch (error) {
                res.status(400).send(error.message);
            }
        }
        else {
            res.send("Acces Denied !")
        }
    }
}
module.exports = {
    Create, ApproveState, RejectState, getAllReservations, giverate, StateDone
}