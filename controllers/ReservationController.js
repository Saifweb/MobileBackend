'use strict';

const firebase = require('../db');

const firestore = firebase.firestore();
const { validationResult } = require("express-validator")
//Create Reservations!
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
//Get all Reservations not done yet ! 
const getAllReservations = async (req, res, next) => {
    const user = firebase.auth().currentUser
    console.log(typeof (user.uid));
    if (user) {
        try {
            const reservations = await firestore.collection('reservations');
            const data = await reservations.get();
            const reservationsArray = [];
            if (data.empty) {
                res.status(404).send('No Reservations record found');
            } else {
                data.forEach(doc => {
                    if (doc.data().state != "done" && (user.uid == doc.data().housekeeper_id || user.uid == doc.data().customer_id)) {
                        var reservationsObject = new Object;
                        reservationsObject["id"] = doc.id
                        reservationsObject["state"] = doc.data().state
                        reservationsObject["customer_id"] = doc.data().customer_id
                        reservationsObject["housekeeper_id"] = doc.data().housekeeper_id
                        reservationsObject["type"] = doc.data().type
                        reservationsObject["start_date"] = doc.data().start_date
                        reservationsObject["end_date"] = doc.data().end_date
                        reservationsArray.push(reservationsObject);
                    }
                });
                res.send(reservationsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        //because you dont have acces !
        res.status(400).send("Acces Denied !")
    }
}
// get all done Reservations
const getDoneReservations = async (req, res, next) => {
    const user = firebase.auth().currentUser
    console.log(typeof (user.uid));
    if (user) {
        try {
            const reservations = await firestore.collection('reservations');
            const data = await reservations.where("state", "==", "done").get();
            const reservationsArray = [];
            if (data.empty) {
                res.status(404).send('No Reservations Done record found');
            } else {
                data.forEach(doc => {
                    if ((user.uid == doc.data().housekeeper_id || user.uid == doc.data().customer_id)) {
                        var reservationsObject = new Object;
                        reservationsObject["id"] = doc.id
                        reservationsObject["state"] = doc.data().state
                        reservationsObject["customer_id"] = doc.data().customer_id
                        reservationsObject["housekeeper_id"] = doc.data().housekeeper_id
                        reservationsObject["type"] = doc.data().type
                        reservationsObject["start_date"] = doc.data().start_date
                        reservationsObject["end_date"] = doc.data().end_date
                        reservationsArray.push(reservationsObject);
                    }
                });
                res.send(reservationsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        //because you dont have acces !
        res.status(400).send("Acces Denied !")
    }
}
//Approve state reservations
const ApproveState = async (req, res, next) => {
    var user = firebase.auth().currentUser
    if (user) {
        try {
            const id = req.params.id
            console.log(typeof (id))
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
// Make State Done 
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
//Reject Reservations
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
//Rate
//Give Rate for housekeeper ! 
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
    Create, ApproveState, RejectState, getAllReservations, giverate, StateDone, getDoneReservations
}