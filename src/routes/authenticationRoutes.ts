import express from "express";
import firebaseAdmin from "../firebaseAdmin";
import firebase from "../firebase";
import { createInitialUserData } from "../services/authenticationServices";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    let newUser;
    let authToken;

    try{
        newUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await createInitialUserData(newUser.user.uid, age);
        authToken = await firebaseAdmin.auth().createCustomToken(newUser.user.uid);
        res.status(200).send(JSON.stringify({"data" : {"authToken" : authToken}}));
    }

    catch(error) {
        res.status(500).send(JSON.stringify({"error" : error}));
    }
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let user;
    let authToken;

    try{
        user = await firebase.auth().signInWithEmailAndPassword(email, password);
        authToken = await firebaseAdmin.auth().createCustomToken(user.user.uid);
        res.status(200).send(JSON.stringify({"data" : {"authToken" : authToken}}));
    }

    catch(error) {
        res.status(500).send(JSON.stringify({"error" : error}));
    }
});

export default router;