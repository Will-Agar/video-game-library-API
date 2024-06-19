import express from "express";
import firebaseAdmin from "../firebaseAdmin";
import {authenticate, sanitiseGameList} from "../services/authenticationServices";

const router = express.Router();
const firestore = firebaseAdmin.firestore();

router.get("/best-rated", async (req, res) => {

    try{
        const gamesRef = firestore.collection('games');
        const snapshot = await gamesRef.orderBy('review_score', 'desc').limit(50).get();
        let gameList : any = [];

        snapshot.forEach(doc => {
            gameList.push(doc.data());
        });

        const { authorization } = req.headers;

        if(authorization!==undefined){
            const user = await authenticate(authorization);
            if(user?.error){
                gameList = await sanitiseGameList(undefined, gameList);
            }

            else{
                gameList = await sanitiseGameList(user.uid, gameList);
            }
        }

        else{
            gameList = await sanitiseGameList(undefined, gameList);
        }

        res.status(200).send(JSON.stringify({"data" : gameList}));
    }

    catch(error){
        res.status(500).send(error);
    }

});

router.get("/popular", async (req, res) => {

    try{
        const gamesRef = firestore.collection('games');
        const snapshot = await gamesRef
            .orderBy('likes', 'desc')
            .limit(50)
            .get();

        let gameList : any = [];

        snapshot.forEach(doc => {
            gameList.push(doc.data());
        });

        const { authorization } = req.headers;

        if(authorization!==undefined){
            const user = await authenticate(authorization);
            if(user?.error){
                gameList = await sanitiseGameList(undefined, gameList);
            }

            else{
                gameList = await sanitiseGameList(user.uid, gameList);
            }
        }

        else{
            gameList = await sanitiseGameList(undefined, gameList);
        }

        res.status(200).send(JSON.stringify({"data" : gameList}));
    }

    catch(error){
        res.status(500).send(error);
    }

});

router.get("/new-releases", async (req, res) => {

    let lowerDate : any = new Date();
    lowerDate.setMonth(lowerDate.getMonth()-8);
    lowerDate = Date.parse(lowerDate);

    let currentDate : any = new Date();
    currentDate = Date.parse(currentDate);

    try{
        const gamesRef = firestore.collection('games');
        const snapshot = await gamesRef
            .where('release_date', '<', currentDate)
            .where('release_date', '>', lowerDate)
            .orderBy('release_date', 'desc')
            .limit(50)
            .get();

        let gameList : any = [];

        snapshot.forEach(doc => {
            gameList.push(doc.data());
        });

        const { authorization } = req.headers;

        if(authorization!==undefined){
            const user = await authenticate(authorization);
            if(user?.error){
                gameList = await sanitiseGameList(undefined, gameList);
            }

            else{
                gameList = await sanitiseGameList(user.uid, gameList);
            }
        }

        else{
            gameList = await sanitiseGameList(undefined, gameList);
        }

        res.status(200).send(JSON.stringify({"data" : gameList}));
    }

    catch(error){
        res.status(500).send(error);
    }

});

router.get("/upcoming", async (req, res) => {

    try{
        const gamesRef = firestore.collection('games');
        const snapshot = await gamesRef
            .where('release_date', '>', Date.parse((new Date().toDateString())))
            .orderBy('release_date', 'asc')
            .limit(50)
            .get();

        let gameList : any = [];

        snapshot.forEach(doc => {
            gameList.push(doc.data());
        });

        const { authorization } = req.headers;

        if(authorization!==undefined){
            const user = await authenticate(authorization);
            if(user?.error){
                gameList = await sanitiseGameList(undefined, gameList);
            }

            else{
                gameList = await sanitiseGameList(user.uid, gameList);
            }
        }

        else{
            gameList = await sanitiseGameList(undefined, gameList);
        }

        res.status(200).send(JSON.stringify({"data" : gameList}));
    }

    catch(error){
        res.status(500).send(error);
    }

});

export default router;

