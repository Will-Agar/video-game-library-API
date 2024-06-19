import express from "express";
import {authenticate, sanitiseGameList} from "../services/authenticationServices";
import {updateUserPreferences, getLikedGames} from "../services/favoriteServices";

const router = express.Router();

router.post("/like-game", async (req, res) => {
    const { authorization } = req.headers;
    const user = await authenticate(authorization);
    if(user.error !== undefined){
        res.status(500).send(JSON.stringify({"error" : user.error}));
        return;
    }

    try{
        await updateUserPreferences(req.body.gameId, user.uid, "like");
        res.status(200).send(JSON.stringify({"data" : "success"}));
    }

    catch(error){
        res.status(500).send(JSON.stringify({"error" : error}));
    }

});

router.post("/unlike-game", async (req, res) => {
    const { authorization } = req.headers;
    const user = await authenticate(authorization);
    if(user.error !== undefined){
        res.status(500).send(JSON.stringify({"error" : user.error}));
        return;
    }

    try{
        await updateUserPreferences(req.body.gameId, user.uid, "unlike");
        res.status(200).send(JSON.stringify({"data" : "success"}));
    }

    catch(error){
        res.status(500).send(JSON.stringify({"error" : error}));
    }

});

router.post("/get-liked-games", async (req, res) => {
    const { authorization } = req.headers;
    const user = await authenticate(authorization);
    if(user.error !== undefined){
        res.status(500).send(JSON.stringify({"error" : user.error}));
        return;
    }

    try{
        let likedGames = await getLikedGames(user.uid);
        likedGames = await sanitiseGameList(user.uid, likedGames);
        res.status(200).send(JSON.stringify({"data" : likedGames}));
    }

    catch(error){
        res.status(500).send(JSON.stringify({"error" : error}));
    }
});

export default router;