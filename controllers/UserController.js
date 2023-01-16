'use strict';

const firebase = require('../db');
const fs = require('fs');


const firestore = firebase.firestore();

//User Controller

//User can See all housekeepers !
const getAllUsers = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
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

//User can Update his data !
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

//User Update his email !
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
//User Update his Password
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
//return data of connected User
const getMyProfil = async (req, res, next) => {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const me = await firestore.collection('users').doc(user.uid);
            const data = await me.get();
            var usersArray = [];
            if (!data.exists) {
                res.status(404).send('User with the given ID not found');
            } else {
                var UserObject = new Object;
                UserObject["id"] = data.id
                UserObject["state"] = data.data().state
                UserObject["age"] = data.data().age
                UserObject["location"] = data.data().location
                UserObject["name"] = data.data().name
                UserObject["phoneNumber"] = data.data().phoneNumber
                UserObject["rate"] = data.data().rate || 0
                UserObject["fav"] = data.data().fav || []
                console.log(UserObject);
                usersArray.push(UserObject);
                res.send(usersArray);
            }
        } catch (error) {
            //
            res.status(400).send(error.message);
        }
    }
    else {
        //
        res.status(403).json("Acces Denied !")
    }

}
//get user data ( any user )
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
//add User to favorie
const addFav = async (req, res) => {
    const user = await firebase.auth().currentUser;
    if (user) {

        const me = await firestore.collection('users').doc(user.uid);
        const data = await me.get();
        var tab = await data.data().fav;
        if (tab) {
            await tab.push(req.body.fav);
        }
        else {
            tab = [];
            await tab.push(req.body.fav);
        }
        await me.update({ "fav": tab });
        res.status(200).send("this user is added to Favorite");
    } else {
        //send
        res.status(403).send("Acces Denied !")
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
//Get List of favorite of User !
const getFav = async (req, res) => {
    const user = await firebase.auth().currentUser;

    if (user) {
        const me = await firestore.collection('users').doc(user.uid);
        const data = await me.get();
        const tab = await data.data().fav;
        console.log(tab);
        const usersArray = [];

        await tab.forEach(async (favUser) => {
            const favusers = await firestore.collection('users').doc(favUser).get();
            console.log(favusers.data());
            usersArray.push(favusers.data());
            console.log("hi", usersArray);
        })
        await delay(4000);
        res.status(200).json(usersArray);

    } else {
        res.status(403).json("Acced Denied !")
    }
}

module.exports = {
    getAllUsers, updateUser, getUser, getMyProfil, updateEmail, updatePass, getFav, addFav,
}