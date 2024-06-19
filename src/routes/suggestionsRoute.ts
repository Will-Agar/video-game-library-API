import express from "express";
import {authenticate, sanitiseGameList} from "../services/authenticationServices";
import {generateSuggestions} from "../services/suggestionsServices";

const router = express.Router();

router.post("", async (req, res) => {
    const { authorization } = req.headers;
    const user = await authenticate(authorization);
    if(user?.error){
        res.status(500).send(JSON.stringify({"error" : user.error}));
        return;
    }

    try{
        let suggestedGames = await generateSuggestions(user.uid);
        suggestedGames = await sanitiseGameList(user.uid, suggestedGames);
        res.status(200).send(JSON.stringify({"data" : suggestedGames}));
    }

    catch(error){
        res.status(500).send(JSON.stringify({"error" : error}));
    }

});

export default router;