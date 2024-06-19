import firebaseAdmin from "../firebaseAdmin";

const firestore = firebaseAdmin.firestore()

export async function updateUserPreferences(gameId : any, uid : string, mode : string){
    // if mode is "like" the preferences are incremented and game is added to liked_games array for user
    // if mode is "unlike" the preferences are decremented and game is removed from liked_games array for user

    const incrementVal : number = (mode === "like" ? 1 : -1);
    const gamesRef = firestore.collection('games').where('id', '==', parseInt(gameId, 10));
    const snapshot = await gamesRef.get();
    const gameList : any = [];

    snapshot.forEach(doc => {
        gameList.push(doc.data());

        doc.ref.update({
            "likes": firebaseAdmin.firestore.FieldValue.increment(incrementVal)
        })
    })

    const game = gameList[0];

    const platformKeys = Object.keys(game.platforms);
    const genreKeys = Object.keys(game.genres);

    const userRef = firestore.collection('user_info').doc(uid);

    if(mode === "like"){
        await userRef.update({
            liked_games: firebaseAdmin.firestore.FieldValue.arrayUnion(game.id)
        });
    }

    else{
        await userRef.update({
            liked_games: firebaseAdmin.firestore.FieldValue.arrayRemove(game.id)
        });
    }

    platformKeys.forEach(async key => {
        const keyString = `suggestion_info.platforms.${key}`;
        await userRef.update({
            [keyString] : firebaseAdmin.firestore.FieldValue.increment(incrementVal)
        })
    });

    genreKeys.forEach(async key => {
        const keyString = `suggestion_info.genres.${key}`;
        await userRef.update({
            [keyString] : firebaseAdmin.firestore.FieldValue.increment(incrementVal)
        })
    });

    if(game.multiplayer){
        await userRef.update({
            'suggestion_info.multiplayer' : firebaseAdmin.firestore.FieldValue.increment(incrementVal)
        })
    }
}

export async function getLikedGames(uid : string) {
    const userInfo = await firestore.collection('user_info').doc(uid).get();
    const gamesRef = await firestore.collection('games');
    const likedGamesIds = await userInfo.data().liked_games;
    const likedGames : any = [];

    for (const id of likedGamesIds) {
        likedGames.push(await getLikedGame(id, gamesRef))
    }

    return likedGames;
}

async function getLikedGame(gameId : any, gamesRef : any){
    const gameList : any = [];
    const snapshot = await gamesRef.where("id", "==", gameId).get();

    snapshot.forEach((doc : any) => {
        gameList.push(doc.data())
    });

    return gameList[0];
}