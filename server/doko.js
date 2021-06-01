const CARDS = [
    "Herz_Zehn",
    "Kreuz_Dame",
    "Pik_Dame",
    "Herz_Dame",
    "Karo_Dame",
    "Kreuz_Bube",
    "Pik_Bube",
    "Herz_Bube",
    "Karo_Bube",
    "Karo_Ass",
    "Karo_Zehn",
    "Karo_Koenig",
    "Kreuz_Ass",
    "Kreuz_Zehn",
    "Kreuz_Koenig",
    "Pik_Ass",
    "Pik_Zehn",
    "Pik_Koenig",
    "Herz_Ass",
    "Herz_Koenig"
  ];

const INITTRICK = ['back', 'back', 'back', 'back'];
const INITGAME = {started: false, trick: INITTRICK, deck: [], currentPlayerIndex:0, players:[], room:''};
const NUMBEROFPLAYERS = 4;

let games =[];

// let deck = [];
// let players = [];
// let currentPlayerIndex =0;
// let trick = INITTRICK;

// game = {deck: []}

const getGameByRoom = (room) => {
    room = room.trim().toLowerCase();
    return games.find(game => game.room ===room);
}

const createGame = (room)=>{
    room = room.trim().toLowerCase();
    const existingRoom = getGameByRoom(room);
    if (existingRoom){
        return {error: 'Room already exists!'}
    }
    let game = JSON.parse(JSON.stringify(INITGAME));
    //let game =INITGAME;
    console.log('createGame - INITGAME: ');
    console.log(INITGAME);
    game.room = room;
    games.push(game);
    console.log('createGame: ');
    console.log(game);
    return game;
};


const startGame = (game)=>{
    const gameIndex = games.findIndex(g => g.room === game.room);
    games[gameIndex].started = true;
    return games[gameIndex];
};

const getPlayerByIdInGame = (({id, game})=>{
    return game.players.find(p => p.id ===id);
});

const getGameOfPlayerById = (id) =>{
    console.log('getGameOfPlayerById: '+ id);
    console.log('getGameOfPlayerById: '+ games);
    console.log(games);
    console.log(games[0]);
    let game;
    games.forEach(g => {
        if (g.players.find(p => p.id === id)) {
            console.log('gameOfPlayerById found');
            console.log(g);
            game = g;
        }
    });
    return game;
}

const addPlayerToRoom = ({playerName, playerId, room}) => {
    playerName = playerName.trim().toLowerCase();
    room = room.trim().toLowerCase();
    game = getGameInRoom(room);
    console.log('addPlayerToRoom: ' + playerName)
    console.log('addPlayerToRoom: ' + playerId)
    console.log('addPlayerToRoom: ' + room)
    console.log('addPlayerToRoom: ' + game)
    if (game && game.players && game.players.length >= NUMBEROFPLAYERS ){
        return {error: 'Game is already full!'};
    };
    if (game && game.players){
        const playerWithName = game.players.find((p)=> p.name === playerName);
        if (playerWithName && playerWithName.id === playerId){
            return game; // player already part of that game
        };
        if (playerWithName) {
            return {error: 'Playername already taken for this game!'};
        };
    };
    const player = {id: playerId, name:playerName, tricks:[]};
    console.log(game);
    console.log(game.players);
    game.players.push(player);
    updateGames(game);
    return game;
}

const removePlayerByIdFromRoom = ({room, id})=>{
    console.log('remoPlayerByIdFromRoom: ' + room)
    console.log('remoPlayerByIdFromRoom: ' + id)
    const game = games.find(g=> g.room ===room);
    console.log('remPlay: ' + game);
    console.log(game);
    if (game && game.players) {
        const playerIndex = game.players.findIndex(player => player.id === id);
        if (playerIndex !==-1){
            const players = game.players.splice(playerIndex,1);
            updateGames(game);
        }
    }
    return game;
}

// const addPlayer = ({id, name, room}) => {
//     name = name.trim().toLowerCase();
//     room = room.trim().toLowerCase();

//     const existingPlayer = players.find((player) => player.room === room && player.name ===name);

//     if (existingPlayer) {
//         return {error: 'Playername already taken!'};
//     };

//     const player = {id, name, room};
//     players.push(player);
//     return player;
// };

// const getPlayersInRoom = (room) => {
//     return players.filter((player) => player.room === room.trim().toLowerCase());

// };

// const getPlayer = (id) => {
//     return players.find((player)=> player.id === id);
// };

// const removePlayer = (id) => {
//     const index = players.findIndex((player)=> player.id === id);
//     if (index !==-1){
//         return players.splice(index, 1)[0];
//     }
// };

const createDeck = (game) => {
    deck = [];
    CARDS.forEach(card => {
        deck.push(card);
        deck.push(card);
    })
    game.deck = deck;
    game.trick = INITTRICK;
    updateGames(game);
    return deck;
};

const dealToHand = (deck, numberOfCards, callback) => {
    let hand = [];
    while (deck.length >0 && hand.length<numberOfCards){
        const cardIndex = Math.floor(Math.random() * deck.length);
        const card = deck.splice(cardIndex, 1);
        hand.push(card[0]);
    }
    if (hand.length<numberOfCards){
        callback({error: 'not enough cards in deck'})
    }
   hand = sortHand(hand);
    return [hand, deck];
};

const playCard = (playerId, card, game, hand) => {
    console.log('playCard: ' + playerId);
    // console.log(card);
    // console.log(game);
    const currentPlayer = getCurrentPlayer(game);
    if (!currentPlayer){
        return {error:'Please restart Game!'}
    }
    console.log(currentPlayer);
    console.log(games);
    console.log(games[0]);
    if (currentPlayer && currentPlayer.id != playerId){
        return {error:'Not your turn!'};
    } else{
        game.trick[game.currentPlayerIndex]=card;
        game.currentPlayerIndex = getNextPlayerIndex(game);
        updateGames(game);
        hand = removeCardFromHand(card, hand);
        return {game, hand};
    }

};

const claimTrick = (game, trick, player) =>{
    console.log('player')
    console.log(player)
    player.tricks.push(trick);
    game.players = updatePlayers(game.players, player);
    game.currentPlayerIndex = getIndexOfPlayer({game: game, player: player});
    game.trick = INITTRICK
    updateGames(game);
    return game;
}

const sortHand = (hand) =>{
    // console.log('hand: '+hand);
    var len = hand.length;
    let sortedHand = hand;
    //  console.log(sortedHand[0]);
    for (var i = 0; i < len ; i++) {
        for(var j = 0 ; j < len - i - 1; j++){ 
            if (CARDS.indexOf(sortedHand[j]) > CARDS.indexOf(sortedHand[j + 1])) {
                var temp = sortedHand[j];
                sortedHand[j] = sortedHand[j+1];
                sortedHand[j + 1] = temp;
                //console.log('temp' + temp)
            }
        }
    }
    // console.log('sortedHand after for: ' + sortedHand);
    // console.log(CARDS.indexOf(sortedHand[0][9]))
    // console.log(sortedHand[0])

    return sortedHand;
}

const getNextPlayerIndex = (game)=>{
    const nextPlayerIndex = (game.currentPlayerIndex >= NUMBEROFPLAYERS -1) ? 0 : game.currentPlayerIndex +1;
    return nextPlayerIndex;
}

const getCurrentPlayer = (game)=>{
    console.log('getCurrentPlayer');
    console.log(game);
    

    return game.players[game.currentPlayerIndex];
}

const getIndexOfPlayer = ({game, player})=>{
    return game.players.findIndex(p => p.id === player.id);
}

const getGameInRoom = (room) => {
    return games.find(g => g.room === room.trim().toLowerCase());
}

const updatePlayers = (players, player) => {
    if (player && players){
        const playerIndex = players.findIndex(p => p.id === player.id);
        players[playerIndex]=player;
    }
    return players;
}

const updateGames = (game) => {
    if (game){
        const gameIndex = games.findIndex(g => g.room = game.room);
        if (game.players.length == 0) {
            games.splice(gameIndex, 1);
        } else{
            games[gameIndex]=game;
        }

    }

}

const removeCardFromHand = (card, hand) =>{
   if (card && hand){
    const cardIndex = hand.findIndex(c => c===card);
    hand.splice(cardIndex, 1);
   }
   return hand;
}

module.exports = {getGameByRoom, createGame, startGame, getGameOfPlayerById, getPlayerByIdInGame, removePlayerByIdFromRoom, addPlayerToRoom, createDeck, dealToHand, playCard, claimTrick, getIndexOfPlayer};
//addPlayer, getPlayersInRoom, getPlayer, removePlayer, 