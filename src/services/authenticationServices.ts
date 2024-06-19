import firebase from "../firebase";
import firebaseAdmin from "../firebaseAdmin";

const firestore = firebaseAdmin.firestore();

export async function authenticate(userToken : string){
    try{
        return {"uid" : (await firebase.auth().signInWithCustomToken(userToken)).user.uid} ;
    }

    catch(error){
        return {"error" : error}
    }
}

export async function createInitialUserData(uid : string, age : any){
    age = new Date(age.year, age.month-1, age.day)
    const userAge = Date.parse(age);

    const initialData : any = {
        age : userAge,
        liked_games : [],
        suggestion_info : {
            platforms : {
                "PC" : 0,
                "Xbox" : 0,
                "Playstation" : 0
            },
            genres : {
                "Action" : 0,
                "Adventure" : 0,
                "Role-playing" : 0,
                "Simulation" : 0,
                "Puzzle" : 0,
                "Strategy" : 0,
                "Sports" : 0,
                "MMO" : 0,
                "Driving" : 0,
                "Horror" : 0,
                "Survival" : 0,
                "Open World" : 0
            },
            multiplayer : 0
        }
    };

    await firestore.collection('user_info').doc(uid).set(initialData);
}

export async function sanitiseGameList(uid : string, games : any){
    let allowR = false;

    if(uid !== undefined) {
        const userRef = await firestore.collection('user_info').doc(uid).get();
        const userInfo = await userRef.data();

        const age = userInfo.age
        const now = new Date();
        let allowDate = now.setFullYear(now.getFullYear()-18);
        allowDate = allowDate.valueOf();
        if(age < allowDate){
            allowR = true;
        }
    }

    if(!allowR){
        const sanitisedList: any = [];

        games.forEach((game: any) => {
            if(!game.r_rated){
                sanitisedList.push(game);
            }
        });

        games = sanitisedList;
    }

    return games;
}