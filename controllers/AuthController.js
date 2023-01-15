const firebase = require('../db');
const firestore = firebase.firestore();
const { validationResult } = require("express-validator")
const signup = async (req, res) => {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array())
    }
    else {
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(async (data) => {
            user_uid = data.user.uid;
            const userProfil = {
                "name": req.body.name,
                "phoneNumber": req.body.phoneNumber,
                "state": req.body.state,
                "age": req.body.age,
                "location": req.body.location,
            }
            await firestore.collection('users').doc(data.user.uid).set(userProfil);
            res.send("user added Succesfully!");
        })
            .catch(function (error) {
                let errormessage = error.message;
                return res.status(500).json({ error: errormessage });
            })
    }

}
const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({
            email: "email is required!",
            password: "password is required !",
        })
    }
    await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then((user) => {
        return res.status(200).json(user);
    })
        .catch(function (error) {
            let errorcode = error.code;
            let errormessage = error.message;
            return res.status(500).json({ error: errormessage });

        })
}
const forgetPassword = (req, res) => {
    console.log(req.body.email);
    if (!req.body.email) {
        return res.status(422).json({ email: "email is required" });
    }
    firebase
        .auth()
        .sendPasswordResetEmail(req.body.email)
        .then(function () {
            return res.status(200).json({ status: "Password Reset Email Sent" });
        })
        .catch(function (error) {
            console.log(error);
            let errorCode = error.code;
            let errorMessage = error.message;
            return res.status(500).json({ error: errorMessage });

        });
};

const signout = (req, res) => {
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.auth().signOut().then(() => {
            res.send("user Successufully logged out!")
        })
            .catch(function (error) {
                res.send(error);
            })
    }
    else {
        res.status(403).json({
            status: "failure",
            message: "user already logget out",
        })
    }
}
module.exports = {
    signup, signin, forgetPassword, signout
}