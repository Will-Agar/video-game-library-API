import firebaseAdmin from "../firebaseAdmin";
const firestore = firebaseAdmin.firestore();

export async function search(searchTerm : string){   // retrieves array of games that match search term
    const gameList : any = [];
    const gamesRef = firestore.collection('games');
    const  snapshot : any = await gamesRef.where('name', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff').limit(80).get();

    snapshot.forEach((doc : any) => {
        gameList.push(doc.data());
    });

    return gameList;
}

export async function filter(filterOptions : any, limit : number){   // retrieves games based on filter parameters
    const gameList : any = [];
    const gamesRef = firestore.collection('games');
    let snapshot : any = await gamesRef;

    snapshot = await filterHelper(filterOptions, snapshot, limit);
    snapshot = await snapshot.get();

    snapshot.forEach((doc : any) => {
        gameList.push(doc.data());
    });

    return gameList;
}

async function filterHelper(filterOptions : any, snapshot : any, limit : number = 100){    // performs filter operations
    if(filterOptions.platform !== 'none'){
        snapshot = snapshot.where(`platforms.${filterOptions.platform}`, '==', true);
    }

    if(filterOptions.genres.length !== 0){
        filterOptions.genres.forEach((genre : any) => {
            snapshot = snapshot.where(`genres.${genre}`, '==', true);
        });
    }

    if(filterOptions.multiplayer === true){
        snapshot = snapshot.where(`multiplayer`, '==', true);
    }

    if(limit !== -1){
        snapshot = snapshot.limit(limit);
    }

    return snapshot;
}

export async function sort(sortBy : any, gameList : any){      // perfoms sort operations
    if(sortBy === 'oldest_first'){
        gameList.sort((a : any, b : any) => (a.release_date > b.release_date) ? 1 : -1);
    }

    else if(sortBy === 'newest_first'){
        gameList.sort((a : any, b : any) => (a.release_date < b.release_date) ? 1 : -1);
    }

    else if(sortBy === 'best_rated'){
        gameList.sort((a : any, b : any) => (a.review_score < b.review_score) ? 1 : -1);
    }

    else if(sortBy === 'most_popular'){
        gameList.sort((a : any, b : any) => (a.likes < b.likes) ? 1 : -1);
    }

    return gameList;
}