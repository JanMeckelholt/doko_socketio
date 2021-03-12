const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

const PORT = process.env.PORT || 5000
const router = require('./router')

//const {getUser, removeUser, addUser, getUsersInRoom} = require('./users');
//const {addPlayer, getPlayersInRoom, getPlayer, removePlayer, createDeck, dealToHand, playCard} = require('./doko');
const {getGameByRoom, createGame, getPlayerById, getPlayerByIdInGame, removePlayerByIdFromGame, addPlayerToGame, createDeck, dealToHand, playCard, getGameOfPlayerbyId} = require('./doko');

io.on('connection', (socket)=>{
    console.log("There is a new connection!!");

    socket.on('join', ({name, room}, callback)=>{
        console.log('Name: ' + name + ' ,room: ' + room);
        console.log('soekt.id: ' +socket.id);
        let game = getGameByRoom(room);
        if (!game) {
            game = createGame(room);
        };
        const {error, game} = addPlayerToGame({ playerId: socket.id, playerName: name, game:game})
        if(error) return callback(error);
        socket.join(game.room);
        io.to(game.room).emit('gameUpdate', {game});
        callback(game); 
    });

    socket.on('dealCards', ({game}, callback)=>{
        let deck = createDeck();
        game.players.forEach(player =>{
            let hand;
            [hand, deck] = dealToHand(deck, 10, (error)=>{
                console.log(erorr)
            });
            if (player.id===socket.id){
                socket.emit('newCards', hand);
            } else{
                socket.broadcast.to(player.id).emit('newCards', hand);
            }
        });

    });
            
    socket.on('nextPlayer', ({nextPlayer}, callback)=>{
        const player = getPlayer(socket.id);
        io.to(player.room).emit('nextPlayer', {nextPlayer});

     });        
     socket.on('playerPlaysCard', ({playerId, card, game}, callback)=>{
         console.log('playerPlaysCard: ' + card);
        const player = getPlayerByIdInGame(playerId, game);
         const {trick, error} = playCard(player, card);
        console.log(player);
        console.log(card);
        console.log(trick);
        if (error) return callback(error);
        const players = game.players;
        io.to(game.room).emit('cardPlayed', {player, card, players, trick});
     });

    socket.on('disconnect', ()=> {
        console.log('Connection ended!');
        const game = getGameOfPlayerbyId(socket.id);
        const game = removePlayerByIdFromGame({id: socket.id, game: game});
        if (game){
            io.to(game.room).emit('gameUpdate', {game});
        }
    });
});

app.use(router);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));
