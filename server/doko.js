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
const INITGAME = {trick: INITTRICK, deck: [], currentPlayerIndex:0, players:[], room:''};
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
    let game =INITGAME;
    game.room = room;
    games.push(game);
    return {game};
};

const getPlayerByIdInGame = (({id, game})=>{
    return game.players.find(p => p.id ===id);
});

const getGameOfPlayerById = (id) =>{
    games.forEach(game => {
        if (game.players.find(p => p.id === id)){
            return game;
        };
    });
}

const addPlayerToGame = ({playerName, playerId, game}) => {
    playerName = playerName.trim().toLowerCase();
    const existingPlayer = game.players.find((player)=> player.name === playerName);
    
    if (existingPlayer) {
        return {error: 'Playername already taken for this game!'};
    };
    const player = {id:id, name:playerName};
    game.players.push(player);
    return {game};
}

const removePlayerByIdFromGame = ({game, id})=>{
    const playerIndex = game.players.findIndex(player => player.id === id);
    if (playerIndex !==-1){
        const players = game.players.splice(playerIndex,1);
    }
    return {game};
}

const addPlayer = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingPlayer = players.find((player) => player.room === room && player.name ===name);

    if (existingPlayer) {
        return {error: 'Playername already taken!'};
    };

    const player = {id, name, room};
    players.push(player);
    return {player};
};

const getPlayersInRoom = (room) => {
    return players.filter((player) => player.room === room.trim().toLowerCase());

};

const getPlayer = (id) => {
    return players.find((player)=> player.id === id);
};

const removePlayer = (id) => {
    const index = players.findIndex((player)=> player.id === id);
    if (index !==-1){
        return players.splice(index, 1)[0];
    }
};

const createDeck = () => {
    deck = [];
    CARDS.forEach(card => {
        deck.push(card);
        deck.push(card);
    })
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

const playCard = (player, card) => {
    console.log(currentPlayerIndex);
    console.log('getCurrentPlayer');
    console.log(getCurrentPlayer().id)
    console.log(player);
    if (player.id != getCurrentPlayer().id){
        return {error:'Not your turn!'};
    };
    trick[getIndexOfPlayer(player)]=card;
    currentPlayerIndex = getNextPlayerIndex();
    return {trick: trick};
};

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

const getNextPlayerIndex = ()=>{
    const nextPlayerIndex = (currentPlayerIndex >= NUMBEROFPLAYERS -1) ? 0 : currentPlayerIndex +1;
    return nextPlayerIndex;
}

const getCurrentPlayer = ()=>{
    return players[currentPlayerIndex];
}

const getIndexOfPlayer = (player)=>{
    return players.findIndex(p => p.id === player.id);
}

module.exports = {getGameByRoom, createGame, getGameOfPlayerbyId, getPlayerByIdInGame, removePlayerByIdFromGame, addPlayerToGame, createDeck, dealToHand, playCard};
//addPlayer, getPlayersInRoom, getPlayer, removePlayer, 