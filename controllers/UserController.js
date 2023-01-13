'use strict';

const firebase = require('../db');


const firestore = firebase.firestore();
//User
const getAllUsers = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
        const me = await firestore.collection('users').doc(user.uid);
        const data = await me.get();
        if (data.data().state == "customer") {
            try {
                const users = await firestore.collection('users');
                const data = await users.where("state", "==", "housekeeper").get();
                const usersArray = [];
                if (data.empty) {
                    res.status(404).send('No User record found');
                } else {
                    // we return !
                    data.forEach(doc => {
                        var UserObject = new Object;
                        UserObject["id"] = doc.id
                        UserObject["state"] = doc.data().state
                        UserObject["age"] = doc.data().age
                        UserObject["location"] = doc.data().location
                        UserObject["name"] = doc.data().name
                        UserObject["phoneNumber"] = doc.data().phoneNumber
                        UserObject["rate"] = doc.data().rate || 0
                        usersArray.push(UserObject);
                    });
                    res.send(usersArray);
                }
            } catch (error) {
                res.status(400).send(error.message);
            }
        }
        else {
            res.status(403).json("Acces Denied!");
        }

    }
    else {
        res.status(403).json("Acces Denied!");
    }

}
const updateUser = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const data = req.body;
            const user = await firestore.collection('users').doc(user.uid);
            await user.update(data);
            res.send('User record updated successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.status(403).json("Acces Denied!")
    }

}
const updateEmail = async (req, res) => {
    const user = firebase.auth().currentUser;
    if (user) {
        user.updateEmail(req.body.email).then(() => {
            console.log('updated email');
            res.status(200).json("updated email");

        }).catch((error) => {
            res.status(403).json(error)
        })
    }
    else {
        res.status(403).json("Acced Denied!");
    }
}
const updatePass = async (req, res) => {
    const user = firebase.auth().currentUser;
    if (user) {
        user.updatePassword(req.body.password).then(() => {
            console.log('updated password');
            res.status(200).json("updated Password");

        }).catch((error) => {
            res.status(403).json(error)
        })
    }
    else {
        res.status(403).json("Acced Denied!");
    }
}
const getMyProfil = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const me = await firestore.collection('users').doc(user.uid);
            const data = await me.get();
            if (!data.exists) {
                res.status(404).send('User with the given ID not found');
            } else {
                res.send(data.data());
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.status(403).json("Acces Denied !")
    }

}
const getUser = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const id = req.params.id
            const me = await firestore.collection('users').doc(id);
            const data = await me.get();
            if (!data.exists) {
                res.status(404).send('User with the given ID not found');
            } else {
                res.send(data.data());
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    else {
        res.status(403).json("Acces Denied !")
    }

}
module.exports = {
    getAllUsers, updateUser, getUser, getMyProfil, updateEmail, updatePass
}