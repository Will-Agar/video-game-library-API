import express from "express";
import firebaseAdmin from "../firebaseAdmin";
import {authenticate} from "../services/authenticationServices";

const router = express.Router();
const firestore = firebaseAdmin.firestore();

router.get("/getGameById/:gameId", async (req, res) => {
    const gameId = req.params.gameId;

    try{
        const gamesRef = firestore.collection('games').where('id', '==', parseInt(gameId, 10));
        const snapshot = await gamesRef.get();
        const gameList : any = [];

        snapshot.forEach(doc => {
            gameList.push(doc.data());
        })

        const game = gameList[0];

        const { authorization } = req.headers;
        if(authorization !== undefined){
            const user = await authenticate(authorization);
            if(user.error === undefined){
                const userRef = await firestore.collection('user_info').doc(user.uid).get();
                const userInfo = await userRef.data();
                game.liked = userInfo.liked_games.includes(parseInt(gameId, 10));
            }
        }

        res.status(200).send(JSON.stringify({"data" : game}));
    }

    catch(error){
        res.status(500).send(error);
    }

});

export default router;

