import firebaseAdmin from "../firebaseAdmin";
import {filter} from "./discoverServices";

const firestore = firebaseAdmin.firestore();

export async function generateSuggestions(uid : string){
    const userRef = await firestore.collection('user_info').doc(uid).get();
    const userInfo = await userRef.data();
    let suggestedGames : any = [];

    while(suggestedGames.length < 120){ // retrieves multiple sets of games based on suggested search terms using the filter function
        const filterOptions = {
            platform : suggestPlatform(userInfo.suggestion_info.platforms),
            genres : suggestGenres(userInfo.suggestion_info.genres),
            multiplayer: suggestMultiplayer(userInfo.suggestion_info.multiplayer, userInfo.liked_games.length)
        }

        const newSuggestions = await filter(filterOptions, 40);
        suggestedGames = suggestedGames.concat(newSuggestions);
    }

    suggestedGames = [...new Map(suggestedGames.map((item : any) => [item.id, item])).values()];  // removes duplicate games
    suggestedGames = suggestedGames.sort(() => Math.random() - 0.5); // randomises games

    return suggestedGames;
}

function suggestPlatform(platforms : any){
    const platformKeys : any = Object.keys(platforms);

    let total = 0;
    platformKeys.forEach((key : any) => {
        total += platforms[key];
    });

    if(total === 0){
        return "none";
    }

    const randomVal = Math.floor(Math.random()*total);

    let currentTotal = 0;
    for(const key of platformKeys) {
        if(platforms[key] !== 0){
            const beginRange = currentTotal;
            const endRange = currentTotal + platforms[key];
            currentTotal += platforms[key];

            if(randomVal >= beginRange && randomVal < endRange){
                return key
            }
        }
    };
}

function suggestGenres(genres : any){
    const numberOfSuggestions = Math.floor(Math.random()*3)+1;
    const genreKeys = Object.keys(genres);
    const suggestedGenres : any = [];

    let total = 0;
    genreKeys.forEach(key => {
        if(genres[key] === 0){
            genres[key] = 1;
        }

        total += genres[key];
    });

    let count = 0;
    while(count<numberOfSuggestions){

        const randomVal = Math.round(Math.random()*total);
        let currentTotal = 0;

        for(const key of genreKeys) {
            const beginRange = currentTotal;
            const endRange = currentTotal + genres[key];
            currentTotal += genres[key];

            if(randomVal >= beginRange && randomVal < endRange && !suggestedGenres.includes(key)){
                suggestedGenres.push(key);
                break;
            }
        };

        count++;
    }

    return suggestedGenres;
}

function suggestMultiplayer(multiplayer : any, numberOfLikedGames : any){
    return Math.random() < (multiplayer/numberOfLikedGames)
}
