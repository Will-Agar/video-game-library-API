import express from "express";
import {search, filter, sort} from "../services/discoverServices";
import {authenticate, sanitiseGameList} from "../services/authenticationServices";

const router = express.Router();

router.post("" , async (req, res) => {
    let gameList1 : any = [];
    let  gameList2 : any = [];
    let gameListIntersection;

    if(req.body.searchTerm !== "none"){
        gameList1 = await search(req.body.searchTerm);
    }

    if(req.body.searchTerm !== "none"){
        gameList2 = await filter(req.body.filterOptions, -1);
    }

    else{
        gameList2 = await filter(req.body.filterOptions, 100);
    }

    if(req.body.searchTerm !== "none"){
        gameListIntersection = gameList1.filter((game1 : any) => gameList2.some((game2 : any) => game1.id === game2.id));
    }

    else{
        gameListIntersection = gameList2;
    }

    if(req.body.sortBy !== "none"){
        gameListIntersection = await sort(req.body.sortBy, gameListIntersection);
    }

    try{
        const { authorization } = req.headers;

        if(authorization!==undefined){
            const user = await authenticate(authorization);
            if(user?.error){
                gameListIntersection = await sanitiseGameList(undefined, gameListIntersection);
            }

            else{
                gameListIntersection = await sanitiseGameList(user.uid, gameListIntersection);
            }
        }

        else{
            gameListIntersection = await sanitiseGameList(undefined, gameListIntersection);
        }

        res.status(200).send(JSON.stringify({"data" : gameListIntersection}));
    }

    catch(error){
        res.status(500).send(error);
    }

});



export default router;